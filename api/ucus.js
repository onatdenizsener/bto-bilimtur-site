// Canlı uçuş fiyatları: /api/ucus?nereden=ESB&neredenTip=AIRPORT&nereye=AYT&nereyeTip=AIRPORT&gidis=2026-12-01&donus=&yetiskin=1&cocuk=0
// /api/ucus?durum=1 -> { acik: true|false } (anahtar tanımlı mı)
// Havayoluna yönlendiren bağlantılar kapalıdır (disable_deep_links=TRUE): satışı BTO yapar.
import { amadeus, amadeusVar } from './_amadeus.js'
import { HAVAYOLLARI } from './_havalimanlari.js'

const IATA = /^[A-Z]{3}$/
const TARIH = /^\d{4}-\d{2}-\d{2}$/
const bugun = () => new Date(Date.now() + 3 * 3600e3).toISOString().slice(0, 10) // Türkiye saati

// Saatleri havalimanının yerel saatiyle, dönüştürmeden gösteriyoruz
const saat = (s) => String(s).slice(11, 16)
const gun = (s) => String(s).slice(0, 10)
const dakika = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 60000)

function bagaj(bound) {
  const b = bound.included_checked_bags?.[0]
  if (!b) return null
  if (b.type === 'piece') return b.quantity ? `${b.quantity} parça bagaj` : null
  return b.weight_amount ? `${b.weight_amount} ${b.weight_unit === 'LB' ? 'lb' : 'kg'} bagaj` : null
}

function bacak(bound) {
  const u = bound.flights || []
  const ilk = u[0], son = u[u.length - 1]
  return {
    kalkis: ilk.origin.airport, varis: son.destination.airport,
    kalkisSaat: saat(ilk.departs_at), kalkisTarih: gun(ilk.departs_at),
    varisSaat: saat(son.arrives_at), varisTarih: gun(son.arrives_at),
    sure: dakika(ilk.departs_at, son.arrives_at),
    aktarma: u.slice(0, -1).map((f) => f.destination.airport),
    ucuslar: u.map((f) => `${f.marketing_airline} ${f.flight_number}`),
    havayollari: [...new Set(u.map((f) => f.marketing_airline))],
    kabin: u[0]?.booking_infos?.[0]?.travel_class || 'ECONOMY',
    koltuk: Math.min(...u.map((f) => f.booking_infos?.[0]?.seats_remaining ?? 9)),
    bagaj: bagaj(bound),
  }
}

export default async function handler(req, res) {
  const url = new URL(req.url, 'http://x')
  const p = (k) => String(url.searchParams.get(k) || '').trim()
  if (p('durum')) return res.status(200).json({ acik: amadeusVar() })
  if (!amadeusVar()) return res.status(503).json({ ok: false, kapali: true })

  const nereden = p('nereden').toUpperCase(), nereye = p('nereye').toUpperCase()
  const gidis = p('gidis'), donus = p('donus')
  const yetiskin = Math.min(9, Math.max(1, parseInt(p('yetiskin') || '1', 10) || 1))
  const cocuk = Math.min(9 - yetiskin, Math.max(0, parseInt(p('cocuk') || '0', 10) || 0))
  const hata = []
  if (!IATA.test(nereden)) hata.push('Nereden seçilmedi')
  if (!IATA.test(nereye)) hata.push('Nereye seçilmedi')
  if (nereden && nereden === nereye) hata.push('Nereden ve nereye aynı olamaz')
  if (!TARIH.test(gidis) || gidis < bugun()) hata.push('Gidiş tarihi bugün ya da sonrası olmalı')
  if (donus && (!TARIH.test(donus) || donus < gidis)) hata.push('Dönüş tarihi gidişten önce olamaz')
  if (hata.length) return res.status(400).json({ ok: false, hata })

  // Havalimanı seçildiyse yalnız o havalimanı ("+"), şehir seçildiyse şehrin bütün havalimanları
  const kod = (k, tip) => (tip === 'AIRPORT' ? encodeURIComponent(k + '+') : k)
  const a = kod(nereden, p('neredenTip')), b = kod(nereye, p('nereyeTip'))
  const sorgu = [
    `origins=${donus ? `${a},${b}` : a}`,
    `destinations=${donus ? `${b},${a}` : b}`,
    `dates=${donus ? `${gidis},${donus}` : gidis}`,
    'locale=tr-TR', 'flow=NETWORK', 'currency=TRY', 'disable_deep_links=TRUE', 'number_of_results=20',
    `adults=${yetiskin}`, `children=${cocuk}`, 'travel_class=ECONOMY',
  ].join('&')

  try {
    const j = await amadeus(`/api/v3/search/?${sorgu}`, 10 * 60000)
    const saticilar = j?.meta?.carriers || {}
    const gorulen = new Map()
    for (const r of j?.results || []) {
      const toplam = r.fare?.itinerary_price?.total_fare
      if (typeof toplam !== 'number') continue
      const bacaklar = (r.bounds || []).map(bacak)
      const anahtar = bacaklar.map((x) => x.ucuslar.join('-')).join('|')
      const teklif = {
        fiyat: toplam, para: r.fare.currency,
        kisiBasi: r.fare.price_per_adult?.total_fare ?? null,
        satici: r.merchant, saticiAdi: HAVAYOLLARI[r.merchant] || saticilar[r.merchant]?.name || r.merchant,
        bacaklar,
      }
      const eski = gorulen.get(anahtar)
      if (!eski || eski.fiyat > teklif.fiyat) gorulen.set(anahtar, teklif)
    }
    const teklifler = [...gorulen.values()].sort((x, y) => x.fiyat - y.fiyat).slice(0, 15)
    const adlar = {}
    for (const t of teklifler) for (const bk of t.bacaklar) for (const k of bk.havayollari) adlar[k] = HAVAYOLLARI[k] || saticilar[k]?.name || k
    res.setHeader('Cache-Control', 'private, max-age=300')
    return res.status(200).json({ ok: true, teklifler, havayollari: adlar })
  } catch (e) {
    if (e.durum === 400) return res.status(400).json({ ok: false, hata: ['Arama bilgileri geçersiz'] })
    if (e.durum === 429) return res.status(429).json({ ok: false, hata: ['Çok fazla arama yapıldı, biraz sonra tekrar deneyin'] })
    return res.status(502).json({ ok: false, hata: ['Canlı fiyatlar şu an alınamadı'] })
  }
}
