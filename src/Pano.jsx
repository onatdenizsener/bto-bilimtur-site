// Kalkış panosu: havalimanı tabelası gibi harfleri mekanik olarak çevrilen pano.
// Her karede eski harfin üst yarısı düşer, yenisinin alt yarısı iner. Satırlar turlara bağlantılıdır.
import { useEffect, useMemo, useRef, useState } from 'react'
import { L } from './yol.jsx'
import { buyuk, azHareket } from './ortak.jsx'

const HARFLER = ' ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ0123456789:.-'

function Kare({ hedef, gecikme = 0 }) {
  const [hal, setHal] = useState({ once: hedef, simdi: hedef, n: 0 })
  const simdiRef = useRef(hedef)
  useEffect(() => {
    const zaman = []
    const bas = HARFLER.indexOf(simdiRef.current), son = HARFLER.indexOf(hedef)
    if (bas === son) return
    if (azHareket() || document.documentElement.classList.contains('durdu')) {
      simdiRef.current = hedef; setHal((x) => ({ once: hedef, simdi: hedef, n: x.n + 1 })); return
    }
    // gerçek panolardaki gibi aradaki birkaç harften geçerek gelir
    const mesafe = (son - bas + HARFLER.length) % HARFLER.length
    const adim = Math.min(5, mesafe)
    const yol = Array.from({ length: adim }, (_, i) => HARFLER[(bas + Math.round(((i + 1) * mesafe) / adim)) % HARFLER.length])
    yol.forEach((c, i) => zaman.push(setTimeout(() => {
      setHal((x) => ({ once: x.simdi, simdi: c, n: x.n + 1 }))
      simdiRef.current = c
    }, gecikme + i * 110)))
    return () => zaman.forEach(clearTimeout)
  }, [hedef])
  const { once, simdi, n } = hal
  return (
    <span className="kare" aria-hidden="true">
      <span className="yari yari-ust"><span>{simdi}</span></span>
      <span className="yari yari-alt"><span>{once}</span></span>
      {once !== simdi && <>
        <span key={'u' + n} className="yari yari-ust kapak"><span>{once}</span></span>
        <span key={'a' + n} className="yari yari-alt kapak"><span>{simdi}</span></span>
      </>}
    </span>
  )
}

function Hucre({ metin, uzunluk, gecikme }) {
  const h = buyuk(metin).padEnd(uzunluk, ' ').slice(0, uzunluk).split('').map((c) => (HARFLER.includes(c) ? c : ' '))
  return <span className="hucre">{h.map((c, i) => <Kare key={i} hedef={c} gecikme={gecikme + i * 28} />)}</span>
}

export default function Pano({ turlar }) {
  const satirlar = useMemo(() => turlar.filter((t) => t.gorunur).map((t) => ({ id: t.id, saat: t.saat, nereye: t.pano, not: t.panoNot })), [turlar])
  const [bas, setBas] = useState(0)
  const [genis, setGenis] = useState(() => innerWidth > 720)
  const [saat, setSaat] = useState('')
  useEffect(() => {
    const boyut = () => setGenis(innerWidth > 720)
    addEventListener('resize', boyut)
    const s = () => setSaat(new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' }))
    s(); const ts = setInterval(s, 10000)
    let tc
    if (!azHareket()) tc = setInterval(() => { if (!document.documentElement.classList.contains('durdu') && !document.hidden) setBas((b) => b + 1) }, 5200)
    return () => { removeEventListener('resize', boyut); clearInterval(ts); clearInterval(tc) }
  }, [])
  const gorunen = Array.from({ length: Math.min(5, satirlar.length) }, (_, i) => satirlar[(bas + i) % satirlar.length])
  const uz = genis ? 15 : 10

  return (
    <div className="pano">
      <div className="pano-bas">
        <span>Kalkışlar, Ankara</span>
        <span className="pano-saat" aria-label={`Ankara saati ${saat}`}>{saat}</span>
      </div>
      <div className="pano-kolonlar" aria-hidden="true"><span>Saat</span><span>Nereye</span>{genis && <span>Not</span>}</div>
      <ul className="pano-satirlar">
        {gorunen.map((r, i) => (
          <li key={i}>
            <L to={`/turlar/${r.id}`} className="pano-satir" aria-label={`${r.nereye}, ${r.not}`}>
              <Hucre metin={r.saat} uzunluk={5} gecikme={i * 90} />
              <Hucre metin={r.nereye} uzunluk={uz} gecikme={i * 90 + 60} />
              {genis && <Hucre metin={r.not} uzunluk={10} gecikme={i * 90 + 120} />}
            </L>
          </li>
        ))}
      </ul>
    </div>
  )
}
