// Canlı uçuş fiyatları (Amadeus). Müşteri havayoluna yönlendirilmez: "BTO'dan iste" ile talep bırakır.
// Sunucuda Amadeus anahtarı yoksa bölüm hiç görünmez.
import { useEffect, useState } from 'react'
import YerSecici from './YerSecici.jsx'
import { Halka } from './Logo.jsx'
import { useCekmece } from './ortak.jsx'

const ESB = { id: 'AESB', iata: 'ESB', tip: 'AIRPORT', ad: 'Ankara Esenboğa', ulke: 'Türkiye' }
const yarin = () => new Date(Date.now() + 27 * 3600e3).toISOString().slice(0, 10)
const tl = (n, para) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: para || 'TRY', maximumFractionDigits: 0 }).format(n)
const sure = (dk) => `${Math.floor(dk / 60)} sa ${String(dk % 60).padStart(2, '0')} dk`
const tarihYaz = (t) => new Date(t + 'T12:00:00').toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'short' })

function Bacak({ b, adlar, yon }) {
  return (
    <div className="ucus-bacak">
      <p className="ucus-yon">{yon}, {tarihYaz(b.kalkisTarih)}</p>
      <div className="ucus-rota">
        <span className="ucus-nokta"><strong>{b.kalkisSaat}</strong><span>{b.kalkis}</span></span>
        <span className="ucus-cizgi">
          <small>{sure(b.sure)}</small>
          <i aria-hidden="true" />
          <small>{b.aktarma.length ? `${b.aktarma.length} aktarma (${b.aktarma.join(', ')})` : 'Aktarmasız'}</small>
        </span>
        <span className="ucus-nokta"><strong>{b.varisSaat}{b.varisTarih !== b.kalkisTarih && <sup>+1</sup>}</strong><span>{b.varis}</span></span>
      </div>
      <p className="ucus-alt">{b.havayollari.map((k) => adlar[k] || k).join(', ')}, {b.ucuslar.join(' / ')}{b.bagaj ? `, ${b.bagaj}` : ''}</p>
    </div>
  )
}

export function UcusOzet({ t, adlar }) {
  return (
    <div className="ucus-ozet">
      {t.bacaklar.map((b, i) => <Bacak key={i} b={b} adlar={adlar} yon={i ? 'Dönüş' : 'Gidiş'} />)}
      <p className="ucus-ozet-fiyat">{tl(t.fiyat, t.para)} <small>toplam, vergiler dahil</small></p>
    </div>
  )
}

export default function UcusArama() {
  const cekmece = useCekmece()
  const [acik, setAcik] = useState(null)
  const [nereden, setNereden] = useState(ESB)
  const [nereye, setNereye] = useState(null)
  const [gidis, setGidis] = useState(yarin())
  const [donus, setDonus] = useState('')
  const [gidisDonus, setGidisDonus] = useState(true)
  const [yetiskin, setYetiskin] = useState(1)
  const [cocuk, setCocuk] = useState(0)
  const [durum, setDurum] = useState('bos') // bos | araniyor | tamam | hata
  const [sonuc, setSonuc] = useState({ teklifler: [], havayollari: {} })
  const [hata, setHata] = useState([])

  useEffect(() => {
    fetch('/api/ucus?durum=1').then((r) => (r.ok ? r.json() : { acik: false })).then((j) => setAcik(!!j.acik)).catch(() => setAcik(false))
  }, [])
  if (!acik) return null

  async function ara(e) {
    e.preventDefault()
    const eksik = []
    if (!nereden?.iata) eksik.push('Nereden listeden seçin')
    if (!nereye?.iata) eksik.push('Nereye listeden seçin')
    if (gidisDonus && !donus) eksik.push('Dönüş tarihini seçin')
    if (eksik.length) { setHata(eksik); setDurum('hata'); return }
    setDurum('araniyor'); setHata([])
    const q = new URLSearchParams({ nereden: nereden.iata, neredenTip: nereden.tip, nereye: nereye.iata, nereyeTip: nereye.tip, gidis, donus: gidisDonus ? donus : '', yetiskin, cocuk })
    try {
      const r = await fetch(`/api/ucus?${q}`)
      const j = await r.json()
      if (!r.ok) { setHata(j.hata || ['Canlı fiyatlar şu an alınamadı']); setDurum('hata'); return }
      setSonuc(j); setDurum('tamam')
    } catch { setHata(['Canlı fiyatlar şu an alınamadı']); setDurum('hata') }
  }

  const iste = (t) => {
    const ucus = t.bacaklar.map((b, i) => `${i ? 'Dönüş' : 'Gidiş'} ${b.kalkisTarih} ${b.ucuslar.join('/')} ${b.kalkis} ${b.kalkisSaat} - ${b.varis} ${b.varisSaat}`).join('; ')
    cekmece.ac({
      tur: 'ucak',
      ucus: <UcusOzet t={t} adlar={sonuc.havayollari} />,
      form: {
        tur: 'ucak', neredenYer: nereden, nereyeYer: nereye,
        nereden: `${nereden.ad} (${nereden.iata})`, nereye: `${nereye.ad} (${nereye.iata})`,
        tarih: gidis, kisi: yetiskin + cocuk,
        mesaj: `Sitede seçilen uçuş: ${ucus}. Görülen fiyat ${tl(t.fiyat, t.para)} (${yetiskin} yetişkin${cocuk ? `, ${cocuk} çocuk` : ''}).`,
      },
    })
  }

  return (
    <section className="bolum ucus-bolum" id="canli-fiyatlar">
      <div className="kap">
        <div className="ucus-bas">
          <h2>Canlı uçuş fiyatları</h2>
          <p className="bolum-giris">Havayollarının şu anki fiyatlarını görün, beğendiğiniz uçuşu seçin. Biletinizi BTO keser, değişiklik ve iadede de yanınızda oluruz.</p>
        </div>

        <form className="ucus-form" onSubmit={ara}>
          <div className="ucus-yon-sec" role="group" aria-label="Yolculuk türü">
            <button type="button" aria-pressed={gidisDonus} className={gidisDonus ? 'sekme on' : 'sekme'} onClick={() => setGidisDonus(true)}>Gidiş-dönüş</button>
            <button type="button" aria-pressed={!gidisDonus} className={!gidisDonus ? 'sekme on' : 'sekme'} onClick={() => setGidisDonus(false)}>Tek yön</button>
          </div>
          <div className="ucus-alanlar">
            <YerSecici etiket="Nereden" deger={nereden} onSec={(y) => setNereden(y.iata ? y : null)} yerTutucu="Ankara" />
            <YerSecici etiket="Nereye" deger={nereye} onSec={(y) => setNereye(y.iata ? y : null)} yerTutucu="Şehir ya da havalimanı" />
            <label className="alan"><span>Gidiş</span><input type="date" required min={yarin()} value={gidis} onChange={(e) => { setGidis(e.target.value); if (donus && donus < e.target.value) setDonus('') }} /></label>
            {gidisDonus && <label className="alan"><span>Dönüş</span><input type="date" min={gidis} value={donus} onChange={(e) => setDonus(e.target.value)} /></label>}
            <label className="alan alan-dar"><span>Yetişkin</span><select value={yetiskin} onChange={(e) => setYetiskin(+e.target.value)}>{[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => <option key={n}>{n}</option>)}</select></label>
            <label className="alan alan-dar"><span>Çocuk (2–11)</span><select value={cocuk} onChange={(e) => setCocuk(+e.target.value)}>{[0, 1, 2, 3, 4, 5, 6].filter((n) => n + yetiskin <= 9).map((n) => <option key={n}>{n}</option>)}</select></label>
          </div>
          <button className="dugme dugme-ana dugme-buyuk" disabled={durum === 'araniyor'}>{durum === 'araniyor' ? 'Aranıyor…' : 'Uçuşları göster'}</button>
        </form>

        <div className="ucus-sonuc" aria-live="polite">
          {durum === 'araniyor' && <div className="ucus-bekle"><Halka boyut={56} kare={false} className="halka-don" /><span>Havayolları soruluyor…</span></div>}
          {durum === 'hata' && <ul className="ucus-hata">{hata.map((h) => <li key={h}>{h}</li>)}</ul>}
          {durum === 'tamam' && !sonuc.teklifler.length && (
            <p className="ucus-bos">Bu tarihlerde uçuş bulunamadı. Bizi arayın, size başka tarih ya da aktarmalı bir seçenek bulalım.</p>
          )}
          {durum === 'tamam' && sonuc.teklifler.length > 0 && (
            <>
              <p className="ucus-sayi">{sonuc.teklifler.length} seçenek, en ucuzdan pahalıya</p>
              <ol className="ucus-liste">
                {sonuc.teklifler.map((t, i) => (
                  <li key={i} className="ucus-kart" style={{ '--i': i }}>
                    <div className="ucus-bacaklar">
                      {t.bacaklar.map((b, k) => <Bacak key={k} b={b} adlar={sonuc.havayollari} yon={k ? 'Dönüş' : 'Gidiş'} />)}
                    </div>
                    <div className="ucus-fiyat">
                      <strong>{tl(t.fiyat, t.para)}</strong>
                      <small>{yetiskin + cocuk > 1 ? `${yetiskin + cocuk} kişi toplam` : 'kişi başı'}, vergiler dahil</small>
                      <button type="button" className="dugme dugme-ana" onClick={() => iste(t)}>BTO’dan iste</button>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="kucuk-not">Fiyatlar havayollarının anlık fiyatlarıdır ve değişebilir. Biletinizi BTO keser; son fiyatı ve hizmet bedelini telefonda söyleriz.</p>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
