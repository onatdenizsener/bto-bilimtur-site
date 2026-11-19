// Fotoğraf yeri: /foto/<ad>.webp (Adobe Stock lisanslı). Dosya yoksa lacivert zemin + BTO halkası dokusu gösterilir.
import { useState } from 'react'

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
    <div className={`foto ${yok ? 'foto-yok' : ''} ${className}`} style={style}>
      {!yok && (
        <img src={`/foto/${ad}.webp`} alt={FOTOLAR[ad]} loading={yukle} decoding="async" onError={() => setYok(true)} />
      )}
    </div>
  )
}
