import { useRef, useState } from 'react'
import Ikon from './Ikon.jsx'
import {
  FIRMA, TALEP_TURLERI, HIZMETLER, TURLAR, KATEGORILER, FILO,
  TRANSFER_ADIMLARI, VIZE_SEHIRLERI, SSS,
} from './data.js'

const buyuk = (s) => (s || '').toLocaleUpperCase('tr-TR')
const waLink = (metin) => `https://wa.me/${FIRMA.whatsapp}?text=${encodeURIComponent(metin)}`

async function gonder(veri) {
  const r = await fetch('/api/lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(veri),
  })
  if (!r.ok) throw new Error('gonderilemedi')
}

function Ust() {
  const [acik, setAcik] = useState(false)
  const menu = [['#hizmetler', 'Hizmetler'], ['#turlar', 'Turlar'], ['#araclar', 'Araçlar'], ['#transfer', 'Transfer'], ['#iletisim', 'İletişim']]
  return (
    <header className="ust">
      <div className="kap ust-ic">
        <a href="#" className="logo" aria-label="BTO Bilimtur ana sayfa">
          <span className="logo-bto">BTO</span> <span className="logo-ad">Bilimtur</span>
        </a>
        <nav className={acik ? 'menu acik' : 'menu'} aria-label="Ana menü">
          {menu.map(([h, a]) => <a key={h} href={h} onClick={() => setAcik(false)}>{a}</a>)}
        </nav>
        <a className="ust-tel" href={`tel:${FIRMA.tel}`}><Ikon ad="tel" boyut={18} /> {FIRMA.telGoster}</a>
        <button className="menu-dugme" aria-expanded={acik} aria-label="Menüyü aç" onClick={() => setAcik(!acik)}>
          <span /><span /><span />
        </button>
      </div>
    </header>
  )
}

// Ana sayfadaki biniş kartı: talep formu
function Bilet({ biletRef, tur, setTur, form, setForm }) {
  const [durum, setDurum] = useState('bos') // bos | gidiyor | tamam | hata
  const secili = TALEP_TURLERI.find((t) => t.id === tur)
  const var_ = (a) => secili.alanlar.includes(a)
  const degis = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const ozet = `${secili.ad}: ${form.nereden || ''} → ${form.nereye || ''}, ${form.tarih || 'tarih yok'}, ${form.kisi} kişi. ${form.ad}, ${form.telefon}`

  async function yolla(e) {
    e.preventDefault()
    setDurum('gidiyor')
    try {
      await gonder({ tip: secili.ad, ...form })
      setDurum('tamam')
    } catch {
      setDurum('hata')
    }
  }

  const kod = (s, varsayilan) => buyuk(s || varsayilan).slice(0, 3)

  return (
    <form className="bilet" ref={biletRef} onSubmit={yolla} id="fiyat">
      <div className="bilet-ana">
        <div className="sekmeler" role="tablist" aria-label="Ne istiyorsunuz?">
          {TALEP_TURLERI.map((t) => (
            <button type="button" role="tab" key={t.id} aria-selected={tur === t.id}
              className={tur === t.id ? 'sekme on' : 'sekme'} onClick={() => { setTur(t.id); setDurum('bos') }}>
              {t.ad}
            </button>
          ))}
        </div>

        <div className="alanlar">
          {var_('nereden') && (
            <label className="alan"><span>Nereden</span>
              <input value={form.nereden} onChange={degis('nereden')} placeholder="Ankara" autoComplete="off" />
            </label>
          )}
          {var_('nereye') && (
            <label className="alan"><span>Nereye</span>
              <input value={form.nereye} onChange={degis('nereye')} placeholder={tur === 'transfer' ? 'Esenboğa Havalimanı' : 'Antalya'} autoComplete="off" />
            </label>
          )}
          {var_('tarih') && (
            <label className="alan"><span>Tarih</span>
              <input type="date" value={form.tarih} onChange={degis('tarih')} />
            </label>
          )}
          {var_('kisi') && (
            <label className="alan alan-kisa"><span>Kişi</span>
              <input type="number" min="1" max="200" value={form.kisi} onChange={degis('kisi')} />
            </label>
          )}
          <label className="alan"><span>Adınız</span>
            <input required value={form.ad} onChange={degis('ad')} autoComplete="name" />
          </label>
          <label className="alan"><span>Telefonunuz</span>
            <input required type="tel" value={form.telefon} onChange={degis('telefon')} placeholder="05xx xxx xx xx" autoComplete="tel" />
          </label>
        </div>
        <label className="onay">
          <input type="checkbox" required /> <span>Bilgilerimin bana dönüş yapmak için kullanılmasını kabul ediyorum. <a href="#kvkk">Aydınlatma metni</a></span>
        </label>
      </div>

      <div className="bilet-kocan" aria-live="polite">
        <div className="kocan-rota" aria-hidden="true">
          <span>{kod(form.nereden, tur === 'tur' ? 'ANK' : 'ANK')}</span>
          <Ikon ad={tur === 'transfer' || tur === 'arac' ? 'minibus' : tur === 'tur' ? 'balon' : 'ucak'} boyut={28} />
          <span>{kod(form.nereye, '???')}</span>
        </div>
        <dl className="kocan-bilgi">
          <div><dt>Tarih</dt><dd>{form.tarih ? new Date(form.tarih).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }) : '—'}</dd></div>
          <div><dt>Kişi</dt><dd>{form.kisi || '—'}</dd></div>
        </dl>
        {durum === 'tamam' ? (
          <p className="sonuc">Talebiniz geldi. Bugün içinde sizi arayıp fiyatı söyleyeceğiz.</p>
        ) : (
          <button className="dugme dugme-sari" disabled={durum === 'gidiyor'}>
            {durum === 'gidiyor' ? 'Gönderiliyor…' : 'Fiyat iste'}
          </button>
        )}
        {durum === 'hata' && (
          <p className="sonuc hata">Talep gönderilemedi. <a href={waLink(ozet)}>WhatsApp’tan gönderin</a> ya da <a href={`tel:${FIRMA.tel}`}>{FIRMA.telGoster}</a> numarasını arayın.</p>
        )}
      </div>
    </form>
  )
}

function Giris(props) {
  return (
    <section className="giris">
      <div className="kap giris-ic">
        <div className="giris-metin">
          <h1>Ankara’dan nereye?</h1>
          <p>Uçak bileti, otel, havalimanı transferi ve tur. Nereye gideceğinizi yazın, gerisini biz ayarlayalım. {FIRMA.kurulus}’ten beri Ankara’dayız.</p>
          <p className="giris-ara">Yazmakla uğraşmayın: <a href={`tel:${FIRMA.tel}`}>{FIRMA.telGoster}</a></p>
        </div>
        <Bilet {...props} />
      </div>
    </section>
  )
}

function Hizmetler() {
  return (
    <section className="bolum" id="hizmetler">
      <div className="kap">
        <h2>Seyahatin her parçası tek yerden</h2>
        <ul className="hizmet-liste">
          {HIZMETLER.map((h) => (
            <li key={h.ad}>
              <Ikon ad={h.ikon} boyut={28} />
              <div><h3>{h.ad}</h3><p>{h.metin}</p></div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Turlar({ turSec }) {
  const [kat, setKat] = useState('hepsi')
  const [secili, setSecili] = useState(null)
  const dlg = useRef(null)
  const liste = TURLAR.filter((t) => kat === 'hepsi' || t.kat === kat)
  const ac = (t) => { setSecili(t); dlg.current.showModal() }
  return (
    <section className="bolum bolum-koyu" id="turlar">
      <div className="kap">
        <h2>Turlar ve tatiller</h2>
        <div className="filtre" role="group" aria-label="Tur türü">
          {KATEGORILER.map(([id, ad]) => (
            <button key={id} aria-pressed={kat === id} className={kat === id ? 'cip on' : 'cip'} onClick={() => setKat(id)}>{ad}</button>
          ))}
        </div>
        <div className="tablo" role="table" aria-label="Turlar">
          <div className="tablo-bas" role="row">
            <span role="columnheader">Tur</span><span role="columnheader">Kalkış</span><span role="columnheader">Süre</span><span role="columnheader"><span className="gizli">Detay</span></span>
          </div>
          {liste.map((t) => (
            <div className="tablo-satir" role="row" key={t.id}>
              <span role="cell" className="t-ad"><strong>{t.ad}</strong><small>{t.ozet}</small></span>
              <span role="cell" className="t-kalkis">{t.kalkis}</span>
              <span role="cell" className="t-sure">{t.sure}</span>
              <span role="cell"><button className="dugme dugme-cizgi" onClick={() => ac(t)}>Programı gör</button></span>
            </div>
          ))}
        </div>
      </div>
      <dialog ref={dlg} className="pencere" onClick={(e) => e.target === dlg.current && dlg.current.close()}>
        {secili && (
          <div className="pencere-ic">
            <h3>{secili.ad}</h3>
            <p className="pencere-alt">{secili.kalkis} çıkışlı, {secili.sure}</p>
            <p>{secili.ozet}</p>
            <ul className="tikli">{secili.detay.map((d) => <li key={d}>{d}</li>)}</ul>
            <div className="pencere-dugmeler">
              <button className="dugme dugme-sari" onClick={() => { dlg.current.close(); turSec(secili.ad) }}>Bu tur için fiyat iste</button>
              <button className="dugme dugme-cizgi" onClick={() => dlg.current.close()}>Kapat</button>
            </div>
          </div>
        )}
      </dialog>
    </section>
  )
}

function Filo() {
  return (
    <section className="bolum" id="araclar">
      <div className="kap">
        <h2>Şoförlü araçlarımız</h2>
        <p className="bolum-giris">Tek kişilik iş yolculuğundan 27 kişilik kongre grubuna kadar. Araçlar şoförüyle birlikte gelir.</p>
        <ul className="filo">
          {FILO.map((a) => (
            <li key={a.ad}>
              <div className="filo-ad"><strong>{a.ad}</strong><span>{a.tip}</span></div>
              <div className="koltuklar" aria-label={`${a.kisi} kişilik`}>
                {Array.from({ length: Math.min(a.kisi, 27) }).map((_, i) => <i key={i} />)}
              </div>
              <div className="filo-not"><b>{a.kisi} kişi</b> · {a.not}</div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Transfer({ transferSec }) {
  return (
    <section className="bolum bolum-gok" id="transfer">
      <div className="kap transfer">
        <div>
          <h2>Esenboğa transferi</h2>
          <p className="bolum-giris">Uçaktan indiğinizde şoförünüz kapıda bekliyor olsun.</p>
          <button className="dugme dugme-koyu" onClick={transferSec}>Transfer fiyatı iste</button>
        </div>
        <ol className="adimlar">
          {TRANSFER_ADIMLARI.map(([b, m]) => <li key={b}><h3>{b}</h3><p>{m}</p></li>)}
        </ol>
      </div>
    </section>
  )
}

function Vize() {
  return (
    <section className="bolum" id="vize">
      <div className="kap vize">
        <div>
          <h2>Vize dosyanızı biz hazırlayalım</h2>
          <p className="bolum-giris">Evrak listesi, randevu, sigorta ve dosya kontrolü. En çok başvuru yaptığımız yerler:</p>
        </div>
        <ul className="sehirler">{VIZE_SEHIRLERI.map((s) => <li key={s}>{s}</li>)}</ul>
      </div>
    </section>
  )
}

function NedenBiz() {
  const yil = new Date().getFullYear() - FIRMA.kurulus
  return (
    <section className="bolum bolum-koyu neden">
      <div className="kap neden-ic">
        <p className="neden-yil" aria-hidden="true">{FIRMA.kurulus}</p>
        <div>
          <h2>{yil} yıldır aynı numarada</h2>
          <p>Bizi aradığınızda karşınıza bir çağrı merkezi değil, biletinizi kesen kişi çıkar. Uçuşunuz değişirse siz fark etmeden biz arıyoruz. Ankara’daki kurumların uçak, otel ve kongre işlerini yıllardır aynı ekip yürütüyor.</p>
        </div>
      </div>
    </section>
  )
}

function Sorular() {
  return (
    <section className="bolum" id="sss">
      <div className="kap dar">
        <h2>Sık sorulanlar</h2>
        {SSS.map(([s, c]) => (
          <details key={s} className="soru"><summary>{s}</summary><p>{c}</p></details>
        ))}
      </div>
    </section>
  )
}

function Iletisim() {
  const [durum, setDurum] = useState('bos')
  const [f, setF] = useState({ ad: '', telefon: '', mesaj: '' })
  async function yolla(e) {
    e.preventDefault()
    setDurum('gidiyor')
    try { await gonder({ tip: 'İletişim formu', ...f }); setDurum('tamam') } catch { setDurum('hata') }
  }
  return (
    <section className="bolum bolum-gok" id="iletisim">
      <div className="kap iletisim">
        <div>
          <h2>Bize ulaşın</h2>
          <ul className="iletisim-liste">
            <li><Ikon ad="tel" /> <a href={`tel:${FIRMA.tel}`}>{FIRMA.telGoster}</a></li>
            <li><Ikon ad="wa" /> <a href={waLink('Merhaba, bilgi almak istiyorum.')}>WhatsApp’tan yazın</a></li>
            <li><Ikon ad="pin" /> <span>{FIRMA.adres}</span></li>
          </ul>
          <p className="saatler">{FIRMA.saatler}</p>
          <a className="harita" href={FIRMA.harita} target="_blank" rel="noopener">
            <svg viewBox="0 0 400 200" aria-hidden="true">
              <path d="M0 140 Q100 120 180 150 T400 120" /><path d="M60 0 L120 200" /><path d="M250 0 Q240 100 300 200" /><path d="M0 60 L400 80" />
              <circle cx="205" cy="92" r="10" />
            </svg>
            <span className="dugme dugme-koyu">Yol tarifi al</span>
          </a>
        </div>
        <form className="kart-form" onSubmit={yolla}>
          <h3>Sizi arayalım</h3>
          <label className="alan"><span>Adınız</span><input required value={f.ad} onChange={(e) => setF({ ...f, ad: e.target.value })} autoComplete="name" /></label>
          <label className="alan"><span>Telefonunuz</span><input required type="tel" value={f.telefon} onChange={(e) => setF({ ...f, telefon: e.target.value })} autoComplete="tel" /></label>
          <label className="alan"><span>Ne istiyorsunuz?</span><textarea rows="4" value={f.mesaj} onChange={(e) => setF({ ...f, mesaj: e.target.value })} /></label>
          <label className="onay"><input type="checkbox" required /> <span>Bilgilerimin bana dönüş yapmak için kullanılmasını kabul ediyorum. <a href="#kvkk">Aydınlatma metni</a></span></label>
          {durum === 'tamam'
            ? <p className="sonuc">Mesajınız geldi. En geç bir iş günü içinde sizi arayacağız.</p>
            : <button className="dugme dugme-sari" disabled={durum === 'gidiyor'}>{durum === 'gidiyor' ? 'Gönderiliyor…' : 'Beni arayın'}</button>}
          {durum === 'hata' && <p className="sonuc hata">Mesaj gönderilemedi. <a href={`tel:${FIRMA.tel}`}>{FIRMA.telGoster}</a> numarasını arayın.</p>}
        </form>
      </div>
    </section>
  )
}

function Kvkk() {
  return (
    <section className="bolum kvkk" id="kvkk">
      <div className="kap dar">
        <h2>Kişisel verilerin korunması</h2>
        <p>{FIRMA.unvan} ({FIRMA.adres}) olarak, formlarda yazdığınız ad ve telefon bilgisini yalnızca talebinize dönüş yapmak ve istediğiniz rezervasyonu hazırlamak için kullanırız. Bu bilgiler bilet ve otel işlemleri için ilgili havayolu ve otelle paylaşılabilir; başka bir amaçla kullanılmaz ve satılmaz.</p>
        <p>Bilgilerinizin silinmesini ya da size ne kaydettiğimizi öğrenmek için <a href={`mailto:${FIRMA.mail}`}>{FIRMA.mail}</a> adresine yazabilirsiniz.</p>
      </div>
    </section>
  )
}

function Alt() {
  return (
    <footer className="alt">
      <div className="kap alt-ic">
        <div><span className="logo"><span className="logo-bto">BTO</span> <span className="logo-ad">Bilimtur</span></span><p>{FIRMA.unvan}</p></div>
        <div><p>TÜRSAB belge no: {FIRMA.tursab}</p><p><a href={`mailto:${FIRMA.mail}`}>{FIRMA.mail}</a></p></div>
        <p>© {new Date().getFullYear()} {FIRMA.ad}</p>
      </div>
    </footer>
  )
}

export default function App() {
  const biletRef = useRef(null)
  const [tur, setTur] = useState('ucak')
  const [form, setForm] = useState({ nereden: '', nereye: '', tarih: '', kisi: 1, ad: '', telefon: '' })

  const biletAc = (yeniTur, ekle) => {
    setTur(yeniTur)
    setForm((f) => ({ ...f, ...ekle }))
    biletRef.current.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' })
    setTimeout(() => biletRef.current.querySelector('input[autocomplete="name"]')?.focus({ preventScroll: true }), 500)
  }

  return (
    <>
      {FIRMA.onizleme && <div className="onizleme">Tasarım önizlemesidir. Bilgiler henüz firma tarafından onaylanmadı.</div>}
      <Ust />
      <main>
        <Giris biletRef={biletRef} tur={tur} setTur={setTur} form={form} setForm={setForm} />
        <Hizmetler />
        <Turlar turSec={(ad) => biletAc('tur', { nereye: ad })} />
        <Filo />
        <Transfer transferSec={() => biletAc('transfer', { nereden: 'Esenboğa Havalimanı', nereye: '' })} />
        <Vize />
        <NedenBiz />
        <Sorular />
        <Iletisim />
        <Kvkk />
      </main>
      <Alt />
      <div className="alt-cubuk">
        <a href={`tel:${FIRMA.tel}`}><Ikon ad="tel" boyut={20} /> Ara</a>
        <a href={waLink('Merhaba, fiyat almak istiyorum.')}><Ikon ad="wa" boyut={20} /> WhatsApp</a>
        <a href="#fiyat">Fiyat iste</a>
      </div>
    </>
  )
}
