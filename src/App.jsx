import { useEffect, lazy, Suspense } from 'react'
import { YolSaglayici, useYol } from './yol.jsx'
import { IcerikSaglayici } from './icerik.jsx'
import { Ust, Alt, AltCubuk, Duyuru } from './ortak.jsx'
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

function Site() {
  const { yol } = useYol()
  if (yol === '/panel') return <Suspense fallback={null}><Panel /></Suspense>
  return (
    <>
      <Acilis />
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
        <Site />
      </IcerikSaglayici>
    </YolSaglayici>
  )
}

