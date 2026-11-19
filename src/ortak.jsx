import { useEffect, useRef, useState } from 'react'
import Ikon from './Ikon.jsx'
import Sahne from './Sahne.jsx'
import Logo from './Logo.jsx'
import { L, useYol } from './yol.jsx'
import { useIcerik } from './icerik.jsx'
import { FIRMA, MENU, TALEP_TURLERI, SSS } from './data.js'

export const buyuk = (s) => (s || '').toLocaleUpperCase('tr-TR')
export const waLink = (metin) => `https://wa.me/${FIRMA.whatsapp}?text=${encodeURIComponent(metin)}`
export const azHareket = () => matchMedia('(prefers-reduced-motion: reduce)').matches

export async function gonder(veri) {
  // Önizleme sayfasında sunucu yok: talep gönderilmiş gibi gösterilir (VITE_DEMO=1)
  if (import.meta.env.VITE_DEMO) return new Promise((r) => setTimeout(r, 700))
  const r = await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(veri) })
  if (!r.ok) throw new Error('gonderilemedi')
}

// Flix sitesindeki yöntem: bölüm ekrana girince "in" sınıfı eklenir, CSS gerisini yapar.
export function useGorun() {
  const ref = useRef(null)
  const [ic, setIc] = useState(false)
  useEffect(() => {
    if (azHareket() || !('IntersectionObserver' in window)) { setIc(true); return }
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setIc(true); o.disconnect() } }, { threshold: 0.18 })
    o.observe(ref.current)
    return () => o.disconnect()
  }, [])
  return [ref, ic]
}

export function Gorun({ as: Tag = 'div', className = '', children, ...p }) {
  const [ref, ic] = useGorun()
  return <Tag ref={ref} className={`rv ${ic ? 'in' : ''} ${className}`} {...p}>{children}</Tag>
}

export function Duyuru() {
  const { duyuru } = useIcerik()
  if (!duyuru?.acik || !duyuru.metin) return null
  return (
    <div className="duyuru">
      {duyuru.link ? <L to={duyuru.link}>{duyuru.metin}</L> : <span>{duyuru.metin}</span>}
    </div>
  )
}

export function Ust() {
  const [acik, setAcik] = useState(false)
  const { yol } = useYol()
  useEffect(() => setAcik(false), [yol])
  return (
    <header className="ust">
      <div className="kap ust-ic">
        <L to="/" className="logo" aria-label="BTO Bilimtur ana sayfa"><Logo key={yol} className="logo-ust" /></L>
        <nav className={acik ? 'menu acik' : 'menu'} aria-label="Ana menü">
          {MENU.map(([h, a]) => <L key={h} to={h} aria-current={yol.startsWith(h) ? 'page' : undefined}>{a}</L>)}
          <L to="/iletisim" className="menu-iletisim" aria-current={yol === '/iletisim' ? 'page' : undefined}>İletişim</L>
        </nav>
        <a className="ust-tel" href={`tel:${FIRMA.tel}`}><Ikon ad="tel" boyut={18} /> {FIRMA.telGoster}</a>
        <button className="menu-dugme" aria-expanded={acik} aria-label={acik ? 'Menüyü kapat' : 'Menüyü aç'} onClick={() => setAcik(!acik)}>
          <span /><span /><span />
        </button>
      </div>
    </header>
  )
}

// Biniş kartı şeklindeki fiyat isteme formu
export function Bilet({ baslangic = {}, varsayilanTur = 'ucak' }) {
  const [tur, setTur] = useState(baslangic.tur || varsayilanTur)
  const [form, setForm] = useState({ nereden: '', nereye: '', tarih: '', kisi: 1, ad: '', telefon: '', ...baslangic })
  const [durum, setDurum] = useState('bos')
  const secili = TALEP_TURLERI.find((t) => t.id === tur)
  const var_ = (a) => secili.alanlar.includes(a)
  const degis = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const ozet = `${secili.ad}: ${form.nereden || ''} → ${form.nereye || ''}, ${form.tarih || 'tarih yok'}, ${form.kisi} kişi. ${form.ad}, ${form.telefon}`
  const kod = (s, v) => buyuk(s || v).replace(/[^A-ZÇĞİÖŞÜ]/g, '').slice(0, 3) || v

  useEffect(() => { if (baslangic.nereye !== undefined) { setForm((f) => ({ ...f, ...baslangic })); if (baslangic.tur) setTur(baslangic.tur) } }, [baslangic.nereye, baslangic.tur])

  async function yolla(e) {
    e.preventDefault(); setDurum('gidiyor')
    try { await gonder({ tip: secili.ad, ...form }); setDurum('tamam') } catch { setDurum('hata') }
  }
  const ikon = tur === 'transfer' || tur === 'arac' ? 'minibus' : tur === 'tur' ? 'balon' : tur === 'otel' ? 'yatak' : 'ucak'

  return (
    <form className="bilet" onSubmit={yolla} id="fiyat">
      <div className="bilet-ana">
        <div className="sekmeler" role="tablist" aria-label="Ne istiyorsunuz?">
          {TALEP_TURLERI.map((t) => (
            <button type="button" role="tab" key={t.id} aria-selected={tur === t.id} className={tur === t.id ? 'sekme on' : 'sekme'}
              onClick={() => { setTur(t.id); setDurum('bos') }}>{t.ad}</button>
          ))}
        </div>
        <div className="alanlar">
          {var_('nereden') && <label className="alan"><span>Nereden</span><input value={form.nereden} onChange={degis('nereden')} placeholder="Ankara" autoComplete="off" /></label>}
          {var_('nereye') && <label className="alan"><span>Nereye</span><input value={form.nereye} onChange={degis('nereye')} placeholder={tur === 'transfer' ? 'Esenboğa Havalimanı' : 'Antalya'} autoComplete="off" /></label>}
          {var_('tarih') && <label className="alan"><span>Tarih</span><input type="date" value={form.tarih} onChange={degis('tarih')} /></label>}
          {var_('kisi') && <label className="alan"><span>Kişi</span><input type="number" min="1" max="200" value={form.kisi} onChange={degis('kisi')} /></label>}
          <label className="alan"><span>Adınız</span><input required value={form.ad} onChange={degis('ad')} autoComplete="name" /></label>
          <label className="alan"><span>Telefonunuz</span><input required type="tel" value={form.telefon} onChange={degis('telefon')} placeholder="05xx xxx xx xx" autoComplete="tel" /></label>
        </div>
        <label className="onay"><input type="checkbox" required /> <span>Bilgilerimin bana dönüş yapmak için kullanılmasını kabul ediyorum. <L to="/kvkk">Aydınlatma metni</L></span></label>
      </div>
      <div className="bilet-kocan" aria-live="polite">
        <div className="kocan-rota" aria-hidden="true">
          <span key={'a' + kod(form.nereden, 'ANK')} className="kod">{kod(form.nereden, 'ANK')}</span>
          <span className="kocan-cizgi"><Ikon ad={ikon} boyut={24} /></span>
          <span key={'b' + kod(form.nereye, '???')} className="kod">{kod(form.nereye, '???')}</span>
        </div>
        <dl className="kocan-bilgi">
          <div><dt>Tarih</dt><dd>{form.tarih ? new Date(form.tarih).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }) : '—'}</dd></div>
          <div><dt>Kişi</dt><dd>{form.kisi || '—'}</dd></div>
        </dl>
        {durum === 'tamam'
          ? <p className="sonuc">Talebiniz geldi. Bugün içinde sizi arayıp fiyatı söyleyeceğiz.</p>
          : <button className="dugme dugme-ana" disabled={durum === 'gidiyor'}>{durum === 'gidiyor' ? 'Gönderiliyor…' : 'Fiyat iste'}</button>}
        {durum === 'hata' && <p className="sonuc hata">Talep gönderilemedi. <a href={waLink(ozet)}>WhatsApp’tan gönderin</a> ya da <a href={`tel:${FIRMA.tel}`}>{FIRMA.telGoster}</a> numarasını arayın.</p>}
      </div>
    </form>
  )
}

// İç sayfaların başı: başlık + sahne
export function SayfaBasi({ baslik, metin, sahne, children }) {
  return (
    <section className="sayfa-basi">
      <div className="kap sayfa-basi-ic">
        <div className="sayfa-basi-metin">
          <h1>{baslik}</h1>
          {metin && <p>{metin}</p>}
          {children}
        </div>
        {sahne && <Sahne ad={sahne} className="sayfa-basi-sahne giris-sahne" />}
      </div>
    </section>
  )
}

export function Sorular({ liste = SSS, baslik = 'Sık sorulanlar' }) {
  return (
    <section className="bolum" id="sss">
      <div className="kap dar">
        <h2>{baslik}</h2>
        {liste.map(([s, c]) => <details key={s} className="soru"><summary>{s}</summary><p>{c}</p></details>)}
      </div>
    </section>
  )
}

export function Adimlar({ liste }) {
  const [ref, ic] = useGorun()
  return (
    <ol ref={ref} className={`adimlar ${ic ? 'in' : ''}`}>
      {liste.map(([b, m], i) => <li key={b} style={{ '--i': i }}><h3>{b}</h3><p>{m}</p></li>)}
    </ol>
  )
}

export function FiyatBandi({ baslik = 'Nereye gideceğinizi söyleyin, fiyatı biz söyleyelim', tur = 'ucak', nereye }) {
  return (
    <section className="bolum bolum-gok" id="talep">
      <div className="kap bant">
        <Gorun><h2>{baslik}</h2><p className="bolum-giris">Formu doldurun ya da <a href={`tel:${FIRMA.tel}`}>{FIRMA.telGoster}</a> numarasını arayın. Aynı gün dönüyoruz.</p></Gorun>
        <Bilet varsayilanTur={tur} baslangic={nereye ? { nereye, tur } : {}} />
      </div>
    </section>
  )
}

function HareketDugmesi() {
  const [durdu, setDurdu] = useState(() => { try { return localStorage.getItem('bto-hareket') === 'durdu' } catch { return false } })
  useEffect(() => {
    document.documentElement.classList.toggle('durdu', durdu)
    try { localStorage.setItem('bto-hareket', durdu ? 'durdu' : 'acik') } catch {}
  }, [durdu])
  return <button type="button" className="hareket-dugme" aria-pressed={durdu} onClick={() => setDurdu(!durdu)}>{durdu ? 'Animasyonları başlat' : 'Animasyonları durdur'}</button>
}

export function Alt() {
  return (
    <footer className="alt">
      <div className="kap alt-ic">
        <div>
          <L to="/" className="logo" aria-label="BTO Bilimtur ana sayfa"><Logo koyuZemin /></L>
          <p>{FIRMA.unvan}</p><p>{FIRMA.adres}</p><p>TÜRSAB belge no: {FIRMA.tursab}</p>
        </div>
        <nav className="alt-menu" aria-label="Alt menü">
          {MENU.map(([h, a]) => <L key={h} to={h}>{a}</L>)}
          <L to="/hakkimizda">Hakkımızda</L><L to="/iletisim">İletişim</L><L to="/kvkk">Kişisel veriler</L>
        </nav>
        <div>
          <p><a href={`tel:${FIRMA.tel}`}>{FIRMA.telGoster}</a></p>
          <p><a href={`mailto:${FIRMA.mail}`}>{FIRMA.mail}</a></p>
          <p>{FIRMA.saatler}</p>
          <p className="alt-telif">© {new Date().getFullYear()} {FIRMA.ad}</p>
          <HareketDugmesi />
        </div>
      </div>
    </footer>
  )
}

export function AltCubuk() {
  const { git } = useYol()
  return (
    <div className="alt-cubuk">
      <a href={`tel:${FIRMA.tel}`}><Ikon ad="tel" boyut={20} /> Ara</a>
      <a href={waLink('Merhaba, fiyat almak istiyorum.')}><Ikon ad="wa" boyut={20} /> WhatsApp</a>
      <a href="#fiyat" onClick={(e) => { const b = document.getElementById('fiyat'); if (b) { e.preventDefault(); b.scrollIntoView({ block: 'center' }) } else { e.preventDefault(); git('/iletisim') } }}>Fiyat iste</a>
    </div>
  )
}
