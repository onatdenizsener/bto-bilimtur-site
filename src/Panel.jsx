// Yönetim paneli: /panel. Duyuru, tur etiketi/fiyatı/görünürlüğü ve gelen talepler.
import { useEffect, useState } from 'react'
import { TURLAR } from './data.js'
import { birlestir } from './icerik.jsx'

const api = (yol, sifre, ayar = {}) =>
  fetch(yol, { ...ayar, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sifre}`, ...(ayar.headers || {}) } })

function Giris({ onGiris }) {
  const [s, setS] = useState('')
  const [hata, setHata] = useState('')
  async function gir(e) {
    e.preventDefault(); setHata('')
    const r = await api('/api/leads', s).catch(() => null)
    if (r?.ok) { sessionStorage.setItem('bto-panel', s); onGiris(s) }
    else if (r?.status === 401) setHata('Şifre yanlış.')
    else setHata('Panel şu an çalışmıyor. Kayıt deposu ve şifre Vercel’de tanımlı olmalı (README’ye bakın).')
  }
  return (
    <form className="panel-giris" onSubmit={gir}>
      <h1>BTO panel</h1>
      <label className="alan"><span>Şifre</span><input type="password" value={s} onChange={(e) => setS(e.target.value)} autoFocus required /></label>
      <button className="dugme dugme-ana">Giriş yap</button>
      {hata && <p className="panel-hata" role="alert">{hata}</p>}
      <a href="/">Siteye dön</a>
    </form>
  )
}

export default function Panel() {
  const [sifre, setSifre] = useState(sessionStorage.getItem('bto-panel') || '')
  const [sekme, setSekme] = useState('talepler')
  const [kayit, setKayit] = useState({ duyuru: {}, turlar: {} })
  const [talepler, setTalepler] = useState([])
  const [durum, setDurum] = useState('')

  useEffect(() => {
    document.title = 'Panel | BTO Bilimtur'
    if (!sifre) return
    api('/api/leads', sifre).then((r) => {
      if (r.status === 401) { sessionStorage.removeItem('bto-panel'); setSifre(''); return null }
      return r.json()
    }).then((j) => j && setTalepler(j.talepler || []))
    fetch('/api/content').then((r) => r.json()).then((j) => setKayit({ duyuru: {}, turlar: {}, ...(j.icerik || {}) })).catch(() => {})
  }, [sifre])

  if (!sifre) return <Giris onGiris={setSifre} />
  const hal = birlestir(kayit)

  const duyuruDegis = (k, v) => setKayit({ ...kayit, duyuru: { ...hal.duyuru, ...kayit.duyuru, [k]: v } })
  const turDegis = (id, k, v) => setKayit({ ...kayit, turlar: { ...kayit.turlar, [id]: { ...(kayit.turlar[id] || {}), [k]: v } } })

  async function kaydet() {
    setDurum('Kaydediliyor…')
    const r = await api('/api/content', sifre, { method: 'POST', body: JSON.stringify(kayit) }).catch(() => null)
    setDurum(r?.ok ? 'Kaydedildi. Sitede en geç bir dakika içinde görünür.' : 'Kaydedilemedi. Bağlantıyı kontrol edip tekrar deneyin.')
  }

  return (
    <div className="panel">
      <header className="panel-ust">
        <strong>BTO panel</strong>
        <nav role="tablist" aria-label="Panel bölümleri">
          {[['talepler', `Gelen talepler (${talepler.length})`], ['turlar', 'Turlar'], ['duyuru', 'Duyuru']].map(([id, ad]) => (
            <button key={id} role="tab" aria-selected={sekme === id} className={sekme === id ? 'sekme on' : 'sekme'} onClick={() => setSekme(id)}>{ad}</button>
          ))}
        </nav>
        <a href="/" target="_blank" rel="noopener">Siteyi aç</a>
        <button className="panel-cikis" onClick={() => { sessionStorage.removeItem('bto-panel'); setSifre('') }}>Çıkış</button>
      </header>

      <main className="panel-ic">
        {sekme === 'talepler' && (
          talepler.length === 0
            ? <p className="panel-bos">Henüz talep yok. Sitedeki formlardan gelen her talep burada ve e-postanızda görünür.</p>
            : <table className="panel-tablo">
                <thead><tr><th>Tarih</th><th>Talep</th><th>Ad</th><th>Telefon</th><th>Ayrıntı</th></tr></thead>
                <tbody>{talepler.map((t, i) => (
                  <tr key={i}>
                    <td>{new Date(t.zaman).toLocaleString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                    <td>{t.tip}</td><td>{t.ad}</td><td><a href={`tel:${t.telefon}`}>{t.telefon}</a></td>
                    <td>{[t.nereden && `${t.nereden} → ${t.nereye || ''}`, !t.nereden && t.nereye, t.tarih, t.kisi && `${t.kisi} kişi`, t.mesaj].filter(Boolean).join(', ')}</td>
                  </tr>
                ))}</tbody>
              </table>
        )}

        {sekme === 'turlar' && (
          <>
            <p className="panel-not">Fiyat ve etiket boş bırakılırsa sitede görünmez. Gizlenen tur listeden ve ana sayfadan kalkar.</p>
            <table className="panel-tablo">
              <thead><tr><th>Tur</th><th>Sitede</th><th>Etiket</th><th>Fiyat</th></tr></thead>
              <tbody>{TURLAR.map((t) => {
                const h = hal.turlar.find((x) => x.id === t.id)
                return (
                  <tr key={t.id}>
                    <td>{t.ad}</td>
                    <td><label className="panel-onay"><input type="checkbox" checked={h.gorunur} onChange={(e) => turDegis(t.id, 'gorunur', e.target.checked)} /> Göster</label></td>
                    <td><input aria-label={`${t.ad} etiketi`} value={h.etiket} placeholder="Örn. Erken rezervasyon" onChange={(e) => turDegis(t.id, 'etiket', e.target.value)} /></td>
                    <td><input aria-label={`${t.ad} fiyatı`} value={h.fiyat} placeholder="Örn. 4.500 TL’den başlayan" onChange={(e) => turDegis(t.id, 'fiyat', e.target.value)} /></td>
                  </tr>
                )
              })}</tbody>
            </table>
            <button className="dugme dugme-ana" onClick={kaydet}>Değişiklikleri kaydet</button>
          </>
        )}

        {sekme === 'duyuru' && (
          <div className="panel-form">
            <label className="panel-onay"><input type="checkbox" checked={hal.duyuru.acik} onChange={(e) => duyuruDegis('acik', e.target.checked)} /> Duyuru şeridini göster</label>
            <label className="alan"><span>Duyuru metni</span><input value={hal.duyuru.metin} onChange={(e) => duyuruDegis('metin', e.target.value)} /></label>
            <label className="alan"><span>Tıklayınca gideceği sayfa (boş bırakılabilir)</span><input value={hal.duyuru.link} placeholder="/turlar/kapadokya" onChange={(e) => duyuruDegis('link', e.target.value)} /></label>
            <button className="dugme dugme-ana" onClick={kaydet}>Değişiklikleri kaydet</button>
          </div>
        )}
        {durum && <p className="panel-durum" role="status">{durum}</p>}
      </main>
    </div>
  )
}
