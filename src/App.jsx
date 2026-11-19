import { useEffect, lazy, Suspense } from 'react'
import { YolSaglayici, useYol } from './yol.jsx'
import { IcerikSaglayici } from './icerik.jsx'
import { Ust, Alt, AltCubuk, Duyuru, CekmeceSaglayici, azHareket } from './ortak.jsx'
import { Halka } from './Logo.jsx'
import Lenis from 'lenis'
import Acilis from './Acilis.jsx'
import * as S from './sayfalar.jsx'
import { FIRMA } from './data.js'

const Panel = lazy(() => import('./Panel.jsx'))

const SAYFALAR = {
  '/': [S.AnaSayfa, 'Ankara tur, uçak bileti ve transfer'],
  '/turlar': [S.Turlar, 'Turlar ve tatiller'],
  '/ucak-bileti': [S.UcakBileti, 'Uçak bileti'],
  '/otel': [S.Otel, 'Otel rezervasyonu'],
  '/transfer': [S.Transfer, 'Esenboğa havalimanı transferi'],
  '/arac-kiralama': [S.AracKiralama, 'Şoförlü araç kiralama'],
  '/vize': [S.Vize, 'Pasaport ve vize'],
  '/kurumsal': [S.Kurumsal, 'Kongre ve kurumsal seyahat'],
  '/hakkimizda': [S.Hakkimizda, 'Hakkımızda'],
  '/iletisim': [S.Iletisim, 'İletişim'],
  '/kvkk': [S.Kvkk, 'Kişisel verilerin korunması'],
}

function Sayfa() {
  const { yol } = useYol()
  const tur = yol.match(/^\/turlar\/([\w-]+)$/)
  const [Bilesen, baslik] = tur ? [() => <S.TurDetay id={tur[1]} />, 'Tur programı'] : SAYFALAR[yol] || [S.Bulunamadi, 'Sayfa bulunamadı']
  useEffect(() => { document.title = `${baslik} | ${FIRMA.ad}` }, [baslik])
  return <main key={yol} className="sayfa"><Bilesen /></main>
}

// Yumuşak kaydırma (Lenis). Hareketi azalt açıksa kapalı.
function useYumusakKaydirma() {
  useEffect(() => {
    if (azHareket()) return
    const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.95 })
    window.__lenis = lenis
    let k
    const dongu = (t) => { lenis.raf(t); k = requestAnimationFrame(dongu) }
    k = requestAnimationFrame(dongu)
    return () => { cancelAnimationFrame(k); lenis.destroy(); window.__lenis = null }
  }, [])
}

function Site() {
  const { yol } = useYol()
  useYumusakKaydirma()
  if (yol === '/panel') return <Suspense fallback={null}><Panel /></Suspense>
  return (
    <>
      <Acilis />
      <div className="gecis-perde" aria-hidden="true"><Halka boyut={120} kare={false} /></div>
      {FIRMA.onizleme && <div className="onizleme">Tasarım önizlemesidir. Bilgiler henüz firma tarafından onaylanmadı.</div>}
      <Duyuru />
      <Ust />
      <Sayfa />
      <Alt />
      <AltCubuk />
    </>
  )
}

export default function App() {
  return (
    <YolSaglayici>
      <IcerikSaglayici>
        <CekmeceSaglayici>
          <Site />
        </CekmeceSaglayici>
      </IcerikSaglayici>
    </YolSaglayici>
  )
}

