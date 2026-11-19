// Görsel yeri: /foto/<ad>.webp varsa fotoğraf (Adobe Stock lisanslı), yoksa aynı yerin BTO renklerindeki çizimi.
import { useState } from 'react'
import Sahne from './Sahne.jsx'

// fotoğraf adı -> çizim sahnesi
const CIZIM = { kapadokya: 'kapadokya', gulet: 'gulet', kaleici: 'akdeniz', uzungol: 'karadeniz', istanbul: 'istanbul', girne: 'kibris', londra: 'avrupa', ucak: 'ucak', terminal: 'yol', bodrum: 'akdeniz', yol: 'yol' }

export const FOTOLAR = {
  kapadokya: 'Kapadokya’da gün doğarken balonlar',
  gulet: 'Koyda yol alan bir gulet',
  kaleici: 'Antalya Kaleiçi limanı',
  uzungol: 'Uzungöl, Trabzon',
  istanbul: 'Ortaköy Camii ve Boğaz Köprüsü',
  girne: 'Girne limanı ve kalesi',
  londra: 'Londra, Tower Bridge',
  ucak: 'Kalkan bir yolcu uçağı',
  terminal: 'Havalimanı terminali',
  bodrum: 'Bodrum kalesi ve marina',
}

export default function Foto({ ad, className = '', yukle = 'lazy', style }) {
  const [yok, setYok] = useState(!FOTOLAR[ad])
  return (
    <div className={`foto ${yok ? 'foto-cizim' : ''} ${className}`} style={style}>
      {yok && <Sahne ad={CIZIM[ad] || 'yol'} />}
      {!yok && (
        <img src={`/foto/${ad}.webp`} alt={FOTOLAR[ad]} loading={yukle} decoding="async" onError={() => setYok(true)} />
      )}
    </div>
  )
}
