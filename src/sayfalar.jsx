import { useEffect, useRef, useState } from 'react'
import Ikon from './Ikon.jsx'
import Sahne, { GirisSahne } from './Sahne.jsx'
import { Halka } from './Logo.jsx'
import { L } from './yol.jsx'
import { useIcerik } from './icerik.jsx'
import {
  Bilet, Gorun, SayfaBasi, Sorular, Adimlar, FiyatBandi, useGorun, waLink, gonder, azHareket,
} from './ortak.jsx'
import {
  FIRMA, HIZMETLER, KATEGORILER, FILO, TRANSFER_ADIMLARI, VIZE, VIZE_NOT, VIZE_ADIMLARI, KURUMSAL, SAYILAR, SSS,
} from './data.js'

/* ---------- Ana sayfa ---------- */

function OneCikan({ tur, i }) {
  const [ref, ic] = useGorun()
  return (
    <section ref={ref} className={`one-cikan ${i % 2 ? 'ters' : ''} ${ic ? 'in' : ''}`}>
      <div className="kap one-cikan-ic">
        <Sahne ad={tur.sahne} className={`kayan ${i % 2 ? 'sagdan' : 'soldan'}`} />
        <div className="one-cikan-metin">
          <p className="tur-yer">{tur.yer}, {tur.sure}</p>
          <h2>{tur.ad}</h2>
          {tur.uzun.slice(0, 2).map((p, k) => <p key={k} className="paragraf" style={{ '--i': k }}>{p}</p>)}
          {tur.etiket && <p className="etiket">{tur.etiket}</p>}
          <L to={`/turlar/${tur.id}`} className="dugme dugme-koyu paragraf" style={{ '--i': 2 }}>Programı gör</L>
        </div>
      </div>
    </section>
  )
}

export function AnaSayfa() {
  const { turlar } = useIcerik()
  const one = ['kapadokya', 'mavi-yolculuk', 'karadeniz'].map((id) => turlar.find((t) => t.id === id)).filter((t) => t?.gorunur)
  return (
    <>
      <section className="giris">
        <Sahne ad="kapadokya" className="giris-arka" />
        <GirisSahne />
        <div className="kap giris-ic">
          <div className="giris-metin">
            <h1 className="satirlar"><span className="satir"><span>Ankara’dan</span></span> <span className="satir"><span style={{ '--i': 1 }}>nereye?</span></span></h1>
            <p>Uçak bileti, otel, transfer ve tur. Nereye gideceğinizi yazın, gerisini biz ayarlayalım. {FIRMA.kurulus}’ten beri Ankara’dayız.</p>
            <p className="giris-ara">Yazmakla uğraşmayın: <a href={`tel:${FIRMA.tel}`}>{FIRMA.telGoster}</a></p>
          </div>
          <Bilet />
        </div>
      </section>

      <section className="bolum" id="hizmetler">
        <div className="kap">
          <Gorun><h2>Seyahatin her parçası tek yerden</h2></Gorun>
          <ul className="hizmet-liste">
            {HIZMETLER.map((h) => (
              <li key={h.ad}><L to={h.yol}><Ikon ad={h.ikon} boyut={28} /><div><h3>{h.ad}</h3><p>{h.metin}</p></div></L></li>
            ))}
          </ul>
        </div>
      </section>

      {one.map((t, i) => <OneCikan key={t.id} tur={t} i={i} />)}
      <div className="kap tum-turlar"><L to="/turlar" className="dugme dugme-cizgi">Bütün turları gör</L></div>

      <section className="bolum bolum-gok">
        <div className="kap transfer">
          <Gorun>
            <h2>Esenboğa transferi</h2>
            <p className="bolum-giris">Uçaktan indiğinizde şoförünüz kapıda bekliyor olsun.</p>
            <L to="/transfer" className="dugme dugme-koyu">Transfer sayfası</L>
          </Gorun>
          <Adimlar liste={TRANSFER_ADIMLARI} />
        </div>
      </section>

      <Neden />
      <Sorular />
      <IletisimKisa />
    </>
  )
}

// Logodaki "O" halkası sayfa kaydıkça döner; sayılar görünce sayar
function DonenHalka() {
  const ref = useRef(null)
  useEffect(() => {
    if (azHareket()) return
    let kare = 0
    const cevir = () => {
      kare = 0
      const el = ref.current
      if (!el || document.documentElement.classList.contains('durdu')) return
      const r = el.getBoundingClientRect()
      el.style.transform = `rotate(${(innerHeight - r.top) * 0.25}deg)`
    }
    const kaydir = () => { if (!kare) kare = requestAnimationFrame(cevir) }
    cevir()
    addEventListener('scroll', kaydir, { passive: true })
    return () => { removeEventListener('scroll', kaydir); cancelAnimationFrame(kare) }
  }, [])
  return <div ref={ref} className="donen-halka"><Halka boyut={260} kare={false} ic={36} dis={49} sayi={96} /></div>
}

function Sayac({ hedef }) {
  const [ref, ic] = useGorun()
  const [n, setN] = useState(azHareket() ? hedef : 0)
  useEffect(() => {
    if (!ic || azHareket()) { if (ic) setN(hedef); return }
    let bas, k
    const adim = (t) => {
      bas ??= t
      const o = Math.min(1, (t - bas) / 1400)
      setN(Math.round(hedef * (1 - Math.pow(1 - o, 3))))
      if (o < 1) k = requestAnimationFrame(adim)
    }
    k = requestAnimationFrame(adim)
    return () => cancelAnimationFrame(k)
  }, [ic, hedef])
  return <span ref={ref}>{n}</span>
}

function Neden() {
  const yil = new Date().getFullYear() - FIRMA.kurulus
  return (
    <section className="bolum bolum-koyu neden">
      <div className="kap neden-ic">
        <div className="neden-isaret" aria-hidden="true">
          <DonenHalka />
          <p className="neden-yil">{FIRMA.kurulus}</p>
        </div>
        <Gorun>
          <h2>{yil} yıldır aynı numarada</h2>
          <p>Bizi aradığınızda karşınıza bir çağrı merkezi değil, biletinizi kesen kişi çıkar. Uçuşunuz değişirse siz fark etmeden biz arıyoruz.</p>
          <dl className="sayilar">{SAYILAR.map(([s, a]) => <div key={a}><dt>{a}</dt><dd><Sayac hedef={Number(s)} /></dd></div>)}</dl>
        </Gorun>
      </div>
    </section>
  )
}

function HaritaKart() {
  return (
    <a className="harita" href={FIRMA.harita} target="_blank" rel="noopener">
      <svg viewBox="0 0 400 200" aria-hidden="true">
        <path d="M0 140 Q100 120 180 150 T400 120" /><path d="M60 0 L120 200" /><path d="M250 0 Q240 100 300 200" /><path d="M0 60 L400 80" />
        <circle cx="205" cy="92" r="10" />
      </svg>
      <span className="dugme dugme-koyu">Yol tarifi al</span>
    </a>
  )
}

function IletisimKisa() {
  return (
    <section className="bolum bolum-gok">
      <div className="kap iletisim">
        <Gorun>
          <h2>Bize ulaşın</h2>
          <IletisimListe />
        </Gorun>
        <Gorun><HaritaKart /></Gorun>
      </div>
    </section>
  )
}

function IletisimListe() {
  return (
    <>
      <ul className="iletisim-liste">
        <li><Ikon ad="tel" /> <a href={`tel:${FIRMA.tel}`}>{FIRMA.telGoster}</a></li>
        <li><Ikon ad="wa" /> <a href={waLink('Merhaba, bilgi almak istiyorum.')}>WhatsApp’tan yazın</a></li>
        <li><Ikon ad="pin" /> <span>{FIRMA.adres}</span></li>
        <li><Ikon ad="saat" /> <span className="saatler">{FIRMA.saatler}</span></li>
      </ul>
    </>
  )
}

/* ---------- Turlar ---------- */

export function Turlar() {
  const { turlar } = useIcerik()
  const [kat, setKat] = useState('hepsi')
  const liste = turlar.filter((t) => t.gorunur && (kat === 'hepsi' || t.kat === kat))
  return (
    <>
      <SayfaBasi baslik="Turlar ve tatiller" metin="Ankara çıkışlı grup turları, deniz tatilleri ve yurt dışı şehir gezileri. Tarihi ve bütçeyi söyleyin, size uygun olanı birlikte seçelim." sahne="karadeniz" />
      <section className="bolum">
        <div className="kap">
          <div className="filtre" role="group" aria-label="Tur türü">
            {KATEGORILER.map(([id, ad]) => <button key={id} aria-pressed={kat === id} className={kat === id ? 'cip on' : 'cip'} onClick={() => setKat(id)}>{ad}</button>)}
          </div>
          <ul className="tur-kartlar">
            {liste.map((t) => (
              <li key={t.id} className="tur-kart">
                <L to={`/turlar/${t.id}`}>
                  <Sahne ad={t.sahne} className="tur-kart-sahne" />
                  {t.etiket && <span className="etiket">{t.etiket}</span>}
                  <div className="tur-kart-metin">
                    <h3>{t.ad}</h3>
                    <p>{t.ozet}</p>
                    <p className="tur-kart-alt"><span>{t.kalkis} çıkışlı, {t.sure}</span>{t.fiyat && <strong>{t.fiyat}</strong>}</p>
                  </div>
                </L>
              </li>
            ))}
          </ul>
          {!liste.length && <p>Bu türde şu an tur yok. <L to="/iletisim">Size özel program isteyin.</L></p>}
        </div>
      </section>
      <FiyatBandi baslik="Listede olmayan bir yer mi?" tur="tur" />
    </>
  )
}

export function TurDetay({ id }) {
  const { turlar } = useIcerik()
  const t = turlar.find((x) => x.id === id && x.gorunur)
  if (!t) return <Bulunamadi />
  return (
    <>
      <SayfaBasi baslik={t.ad} metin={t.ozet} sahne={t.sahne}>
        <p className="tur-yer">{t.yer}, {t.kalkis} çıkışlı, {t.sure}</p>
        {(t.etiket || t.fiyat) && <p className="tur-fiyat">{t.etiket && <span className="etiket">{t.etiket}</span>} {t.fiyat && <strong>{t.fiyat}</strong>}</p>}
      </SayfaBasi>
      <section className="bolum">
        <div className="kap detay">
          <div className="detay-metin">
            {t.uzun.map((p, i) => <Gorun as="p" key={i}>{p}</Gorun>)}
            <Gorun><h2>Fiyata dahil</h2><ul className="tikli">{t.dahil.map((d) => <li key={d}>{d}</li>)}</ul></Gorun>
            {t.program.length > 0 && (
              <Gorun>
                <h2>Program</h2>
                <ol className="program">{t.program.map(([g, a]) => <li key={g}><strong>{g}</strong><span>{a}</span></li>)}</ol>
              </Gorun>
            )}
            <p className="kucuk-not">Program ve süreler mevsime göre değişebilir. Güncel tarihleri telefonda söylüyoruz.</p>
          </div>
          <div className="detay-yan"><Bilet varsayilanTur="tur" baslangic={{ tur: 'tur', nereye: t.ad }} /></div>
        </div>
      </section>
      <section className="bolum bolum-gok">
        <div className="kap"><h2>Diğer turlar</h2>
          <ul className="diger">{turlar.filter((x) => x.gorunur && x.id !== t.id).slice(0, 4).map((x) => <li key={x.id}><L to={`/turlar/${x.id}`}>{x.ad}<span>{x.sure}</span></L></li>)}</ul>
        </div>
      </section>
    </>
  )
}

/* ---------- Hizmet sayfaları ---------- */

function Maddeler({ liste }) {
  return <ul className="hizmet-liste tekli">{liste.map(([b, m, ik]) => <Gorun as="li" key={b}><Ikon ad={ik} boyut={28} /><div><h3>{b}</h3><p>{m}</p></div></Gorun>)}</ul>
}

export function UcakBileti() {
  return (
    <>
      <SayfaBasi baslik="Uçak bileti" metin="Yurt içi ve yurt dışı bütün havayolları. En uygun uçuşu bulur, değişiklik ve iadeyi sizin yerinize yaparız." sahne="ucak" />
      <section className="bolum"><div className="kap iki">
        <Gorun><h2>Bilet aldıktan sonra da yanınızdayız</h2><p className="bolum-giris">İnternetten bilet almak kolay. Uçuş iptal olunca, saat değişince ya da bagaj sorunu çıkınca aranacak bir numaranız olması ise kolay değil.</p></Gorun>
        <Maddeler liste={[
          ['Aktarmalı uçuşlar', 'Aktarma sürelerini ve terminal değişikliklerini kontrol ederek bileti keseriz.', 'ucak'],
          ['Değişiklik ve iade', 'Havayolunun kurallarına göre işlemi biz yaparız.', 'saat'],
          ['Grup biletleri', 'Kurum ve okul gruplarına toplu rezervasyon.', 'insanlar'],
        ]} />
      </div></section>
      <FiyatBandi baslik="Uçuşunuzu yazın" tur="ucak" />
    </>
  )
}

export function Otel() {
  return (
    <>
      <SayfaBasi baslik="Otel rezervasyonu" metin="Türkiye’nin her yerinde ve yurt dışında anlaşmalı otellerde konaklama. Uçak ve transferle birlikte tek seferde." sahne="akdeniz" />
      <section className="bolum"><div className="kap iki">
        <Gorun><h2>Size uygun oteli birlikte seçelim</h2><p className="bolum-giris">Çocuklu aileler için havuzlu oteller, iş seyahati için merkeze yakın oteller, balayı için sakin butik oteller.</p></Gorun>
        <Maddeler liste={[
          ['Yurt içi oteller', 'Antalya’dan Kapadokya’ya, Karadeniz’den İstanbul’a.', 'yatak'],
          ['Yurt dışı oteller', 'Avrupa’dan Amerika’ya, şehir merkezinde.', 'ucak'],
          ['Kongre ve grup konaklaması', 'Katılımcılarınız için oda bloğu ve toplu faturalandırma.', 'insanlar'],
        ]} />
      </div></section>
      <FiyatBandi baslik="Nerede, kaç gece?" tur="otel" />
    </>
  )
}

export function Transfer() {
  return (
    <>
      <SayfaBasi baslik="Havalimanı transferi" metin="Esenboğa’da isminizle karşılanın, kapınıza bırakılın. Sabit fiyat, rötarda bekleme." sahne="yol" />
      <section className="bolum"><div className="kap transfer">
        <Gorun><h2>Nasıl işliyor?</h2><p className="bolum-giris">Ankara’nın her ilçesine ve şehirlerarası transfere araç ayarlıyoruz.</p></Gorun>
        <Adimlar liste={TRANSFER_ADIMLARI} />
      </div></section>
      <FiyatBandi baslik="Uçuş bilginizi yazın" tur="transfer" />
    </>
  )
}

function Koltuklar({ n }) {
  const [ref, ic] = useGorun()
  return <div ref={ref} className={`koltuklar ${ic ? 'in' : ''}`} aria-label={`${n} kişilik`}>{Array.from({ length: n }).map((_, i) => <i key={i} style={{ '--i': i }} />)}</div>
}

export function AracKiralama() {
  return (
    <>
      <SayfaBasi baslik="Şoförlü araç kiralama" metin="Tek kişilik iş yolculuğundan 27 kişilik kongre grubuna kadar. Araçlar şoförüyle birlikte gelir." sahne="yol" />
      <section className="bolum"><div className="kap">
        <h2>Filomuz</h2>
        <ul className="filo">
          {FILO.map((a) => (
            <li key={a.ad}>
              <div className="filo-ad"><strong>{a.ad}</strong><span>{a.tip}</span></div>
              <Koltuklar n={a.kisi} />
              <div className="filo-not"><b>{a.kisi} kişi</b>, {a.not}</div>
            </li>
          ))}
        </ul>
      </div></section>
      <FiyatBandi baslik="Kaç kişi, nereye?" tur="arac" />
    </>
  )
}

export function Vize() {
  const [sec, setSec] = useState(VIZE[0].id)
  const v = VIZE.find((x) => x.id === sec)
  return (
    <>
      <SayfaBasi baslik="Pasaport ve vize" metin="Evrak listesi, randevu, seyahat sağlık sigortası ve dosya kontrolü. Başvurunuz eksik evrak yüzünden geri dönmez." sahne="avrupa" />
      <section className="bolum"><div className="kap transfer">
        <Gorun><h2>Nasıl yardımcı oluyoruz?</h2><p className="bolum-giris">Görüşmeye siz gidersiniz, gerisini biz hazırlarız.</p></Gorun>
        <Adimlar liste={VIZE_ADIMLARI} />
      </div></section>
      <section className="bolum bolum-gok"><div className="kap">
        <h2>Genellikle istenen belgeler</h2>
        <div className="sekmeler vize-sekme" role="tablist" aria-label="Vize türü">
          {VIZE.map((x) => <button key={x.id} role="tab" aria-selected={sec === x.id} className={sec === x.id ? 'sekme on' : 'sekme'} onClick={() => setSec(x.id)}>{x.ad}</button>)}
        </div>
        <div className="vize-kart" role="tabpanel" key={v.id}>
          <p className="tur-yer">{v.ulkeler}</p>
          <ul className="tikli">{v.evrak.map((e) => <li key={e}>{e}</li>)}</ul>
          <p className="kucuk-not">{VIZE_NOT}</p>
        </div>
      </div></section>
      <FiyatBandi baslik="Vize randevunuzu birlikte alalım" tur="ucak" />
    </>
  )
}

export function Kurumsal() {
  return (
    <>
      <SayfaBasi baslik="Kurumlar için" metin="Kongre, toplantı, personel seyahati ve protokol transferi. 1995’ten beri Ankara’daki kurumların seyahat işlerini yürütüyoruz." sahne="istanbul" />
      <section className="bolum"><div className="kap">
        <ul className="kurumsal-liste">{KURUMSAL.map(([b, m], i) => <Gorun as="li" key={b} style={{ '--i': i }}><h3>{b}</h3><p>{m}</p></Gorun>)}</ul>
      </div></section>
      <Neden />
      <section className="bolum bolum-gok" id="talep"><div className="kap iletisim">
        <Gorun><h2>Kurumunuz için teklif alın</h2><p className="bolum-giris">Etkinliğin tarihini, kişi sayısını ve şehrini yazın. Bir iş günü içinde teklif gönderiyoruz.</p></Gorun>
        <GeriAramaFormu baslik="Teklif isteyin" tip="Kurumsal teklif" mesajEtiket="Etkinlik, tarih, kişi sayısı" />
      </div></section>
    </>
  )
}

export function Hakkimizda() {
  return (
    <>
      <SayfaBasi baslik={`${FIRMA.kurulus}’ten beri Ankara’dayız`} metin="BTO Bilimtur; uçak bileti, otel, transfer, tur ve kongre organizasyonunu tek çatı altında yürüten bir Ankara seyahat acentesidir." sahne="kapadokya" />
      <section className="bolum"><div className="kap dar">
        <Gorun as="p" className="buyuk-metin">Aileler tatillerini, öğrenciler vize dosyalarını, kurumlar kongrelerini yıllardır bize emanet ediyor. Bunu, aradığınızda telefonu açan kişinin işinizi baştan sona bilmesine borçluyuz.</Gorun>
        <Gorun as="p">Kendi araç filomuzla havalimanı transferi ve şoförlü araç hizmeti veriyor; Kapadokya’dan mavi yolculuğa, Avrupa şehirlerinden Kıbrıs’a kadar turlar düzenliyoruz.</Gorun>
      </div></section>
      <Neden />
      <IletisimKisa />
    </>
  )
}

/* ---------- İletişim ---------- */

function GeriAramaFormu({ baslik = 'Sizi arayalım', tip = 'İletişim formu', mesajEtiket = 'Ne istiyorsunuz?' }) {
  const [durum, setDurum] = useState('bos')
  const [f, setF] = useState({ ad: '', telefon: '', mesaj: '' })
  async function yolla(e) {
    e.preventDefault(); setDurum('gidiyor')
    try { await gonder({ tip, ...f }); setDurum('tamam') } catch { setDurum('hata') }
  }
  return (
    <form className="kart-form" onSubmit={yolla}>
      <h3>{baslik}</h3>
      <label className="alan"><span>Adınız</span><input required value={f.ad} onChange={(e) => setF({ ...f, ad: e.target.value })} autoComplete="name" /></label>
      <label className="alan"><span>Telefonunuz</span><input required type="tel" value={f.telefon} onChange={(e) => setF({ ...f, telefon: e.target.value })} autoComplete="tel" /></label>
      <label className="alan"><span>{mesajEtiket}</span><textarea rows="4" value={f.mesaj} onChange={(e) => setF({ ...f, mesaj: e.target.value })} /></label>
      <label className="onay"><input type="checkbox" required /> <span>Bilgilerimin bana dönüş yapmak için kullanılmasını kabul ediyorum. <L to="/kvkk">Aydınlatma metni</L></span></label>
      {durum === 'tamam'
        ? <p className="sonuc">Mesajınız geldi. En geç bir iş günü içinde sizi arayacağız.</p>
        : <button className="dugme dugme-ana" disabled={durum === 'gidiyor'}>{durum === 'gidiyor' ? 'Gönderiliyor…' : 'Gönder'}</button>}
      {durum === 'hata' && <p className="sonuc hata">Mesaj gönderilemedi. <a href={`tel:${FIRMA.tel}`}>{FIRMA.telGoster}</a> numarasını arayın.</p>}
    </form>
  )
}

export function Iletisim() {
  return (
    <>
      <SayfaBasi baslik="İletişim" metin="Arayın, WhatsApp’tan yazın ya da ofisimize uğrayın." />
      <section className="bolum sifir-ust"><div className="kap iletisim">
        <div><IletisimListe /><HaritaKart /></div>
        <GeriAramaFormu />
      </div></section>
      <Sorular liste={SSS} />
    </>
  )
}

export function Kvkk() {
  return (
    <>
      <SayfaBasi baslik="Kişisel verilerin korunması" />
      <section className="bolum sifir-ust"><div className="kap dar metin-sayfa">
        <p>{FIRMA.unvan} ({FIRMA.adres}) olarak, formlarda yazdığınız ad, telefon ve seyahat bilgisini yalnızca talebinize dönüş yapmak ve istediğiniz rezervasyonu hazırlamak için kullanırız.</p>
        <p>Bu bilgiler bilet, otel ve vize işlemleri için ilgili havayolu, otel, sigorta şirketi ve konsoloslukla paylaşılabilir; başka bir amaçla kullanılmaz ve satılmaz.</p>
        <p>Bilgilerinizin silinmesini ya da size ne kaydettiğimizi öğrenmek için <a href={`mailto:${FIRMA.mail}`}>{FIRMA.mail}</a> adresine yazabilirsiniz.</p>
        <p className="kucuk-not">Bu metin örnektir; yayından önce bir hukukçuya kontrol ettirilmelidir.</p>
      </div></section>
    </>
  )
}

export function Bulunamadi() {
  return (
    <SayfaBasi baslik="Bu sayfa yok" metin="Adres değişmiş ya da yanlış yazılmış olabilir." sahne="ucak">
      <L to="/" className="dugme dugme-koyu">Ana sayfaya dön</L>
    </SayfaBasi>
  )
}
