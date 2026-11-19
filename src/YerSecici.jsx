// Havalimanı / şehir seçici. Yazdıkça Amadeus'tan (yoksa yerel listeden) öneri getirir.
// Seçilen kaydın IATA kodu ve türü saklanır; yalnız yazılan metin değil.
import { useEffect, useId, useRef, useState } from 'react'
import { yerelAra } from '../api/_havalimanlari.js'

export default function YerSecici({ etiket, deger, onSec, yerTutucu }) {
  const [metin, setMetin] = useState(deger?.ad ? `${deger.ad} (${deger.iata})` : deger?.metin || '')
  const [liste, setListe] = useState([])
  const [acik, setAcik] = useState(false)
  const [etkin, setEtkin] = useState(-1)
  const kimlik = useId()
  const sira = useRef(0)

  useEffect(() => { if (deger?.iata) setMetin(`${deger.ad} (${deger.iata})`) }, [deger?.iata])

  useEffect(() => {
    if (!acik) return
    const q = metin.replace(/\s*\([A-Z]{3}\)$/, '')
    const n = ++sira.current
    const t = setTimeout(async () => {
      let sonuc = yerelAra(q)
      try {
        const r = await fetch(`/api/yer?q=${encodeURIComponent(q)}`)
        if (r.ok) { const j = await r.json(); if (j.yerler?.length) sonuc = j.yerler }
      } catch {}
      if (n === sira.current) { setListe(sonuc); setEtkin(sonuc.length ? 0 : -1) }
    }, 180)
    return () => clearTimeout(t)
  }, [metin, acik])

  const sec = (y) => { setMetin(`${y.ad} (${y.iata})`); setAcik(false); onSec(y) }

  const tus = (e) => {
    if (!acik && e.key === 'ArrowDown') { setAcik(true); return }
    if (!acik) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setEtkin((i) => Math.min(liste.length - 1, i + 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setEtkin((i) => Math.max(0, i - 1)) }
    else if (e.key === 'Enter' && etkin >= 0 && liste[etkin]) { e.preventDefault(); sec(liste[etkin]) }
    else if (e.key === 'Escape') setAcik(false)
  }

  return (
    <div className="alan yer-secici">
      <label htmlFor={kimlik + 'g'}>{etiket}</label>
      <input
        id={kimlik + 'g'} value={metin} placeholder={yerTutucu} autoComplete="off" spellCheck="false"
        role="combobox" aria-expanded={acik && liste.length > 0} aria-controls={kimlik + 'l'} aria-autocomplete="list"
        aria-activedescendant={acik && etkin >= 0 ? `${kimlik}o${etkin}` : undefined}
        onChange={(e) => { setMetin(e.target.value); setAcik(true); onSec({ metin: e.target.value }) }}
        onFocus={(e) => { e.target.select(); setAcik(true) }}
        onBlur={() => setTimeout(() => setAcik(false), 150)}
        onKeyDown={tus}
      />
      {acik && liste.length > 0 && (
        <ul id={kimlik + 'l'} role="listbox" className="yer-liste">
          {liste.map((y, i) => (
            <li key={y.id} id={`${kimlik}o${i}`} role="option" aria-selected={i === etkin}
              className={i === etkin ? 'on' : ''} onMouseDown={(e) => { e.preventDefault(); sec(y) }} onMouseEnter={() => setEtkin(i)}>
              <span className="yer-kod">{y.iata}</span>
              <span className="yer-ad"><strong>{y.ad}</strong><small>{y.tip === 'CITY' ? 'Şehir' : 'Havalimanı'}, {y.ulke}</small></span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
