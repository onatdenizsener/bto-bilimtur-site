// Havalimanı / şehir arama: /api/yer?q=ant
// Amadeus anahtarı varsa Amadeus'tan, yoksa ya da hata verirse yerel listeden cevap verir.
import { amadeus, amadeusVar } from './_amadeus.js'
import { yerelAra, sade, HAVALIMANLARI } from './_havalimanlari.js'

// Amadeus adları İngilizce ve büyük harf (ASCII) gelir; Türkçe kurallarla küçültülmez (I -> ı olmasın)
const baslik = (s) => String(s || '').toLowerCase().replace(/(^|[\s/(-])(\S)/g, (_, a, b) => a + b.toUpperCase())
const TURKCE = Object.fromEntries(HAVALIMANLARI.map(([iata, tip, ad, sehir, ulke]) => [(tip === 'CITY' ? 'C' : 'A') + iata, { ad, sehir, ulke }]))

// Yolcu uçuşu olmayan (askerî) meydanlar listede çıkmasın
const GIZLI = new Set(['AANK'])
const ULKE = { TURKIYE: 'Türkiye', TURKEY: 'Türkiye' }

export default async function handler(req, res) {
  const url = new URL(req.url, 'http://x')
  const q = String(url.searchParams.get('q') || '').split(',')[0].slice(0, 30)
  // Amadeus yalnız ASCII ve belirli işaretleri kabul eder
  const anahtar = sade(q).replace(/[^a-z0-9 '"()/:.-]/g, ' ').trim()
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800')
  if (anahtar.length < 2) return res.status(200).json({ ok: true, kaynak: 'yerel', yerler: yerelAra(q) })

  if (amadeusVar()) {
    try {
      const j = await amadeus(`/v1/reference-data/locations?subType=AIRPORT,CITY&view=LIGHT&page%5Blimit%5D=8&keyword=${encodeURIComponent(anahtar)}`, 86400000)
      const yerler = (j?.data || []).filter((d) => !GIZLI.has(d.id)).map((d) => ({
        id: d.id, iata: d.iataCode, tip: d.subType,
        ad: d.subType === 'CITY' ? `${baslik(d.name)} (tüm havalimanları)` : baslik(d.name),
        sehir: baslik(d.address?.cityName), ulke: ULKE[d.address?.countryName] || baslik(d.address?.countryName),
        ...(TURKCE[d.id] || {}),
      }))
      if (yerler.length) return res.status(200).json({ ok: true, kaynak: 'amadeus', yerler })
    } catch {}
  }
  return res.status(200).json({ ok: true, kaynak: 'yerel', yerler: yerelAra(q) })
}
