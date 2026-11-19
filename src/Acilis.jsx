// Açılış: BTO logosu kendini kurar, sonra "O" halkası bir göz bebeği gibi kapanıp sayfayı açar.
// Oturum başına bir kez, ~2 sn. Tıklayınca ya da bir tuşa basınca geçilir. "Hareketi azalt" açıksa hiç gösterilmez.
import { useEffect, useRef, useState } from 'react'
import Logo from './Logo.jsx'
import { azHareket } from './ortak.jsx'

const ANAHTAR = 'bto-acilis-goruldu'
const gorulduMu = () => { try { return sessionStorage.getItem(ANAHTAR) === '1' } catch { return false } }

export default function Acilis() {
  const [durum, setDurum] = useState(() => (azHareket() || gorulduMu() ? 'yok' : 'kuruluyor'))
  const ref = useRef(null)

  useEffect(() => {
    if (durum === 'yok') { document.documentElement.classList.remove('acilis'); return }
    document.documentElement.classList.add('acilis')
    if (durum === 'kuruluyor') {
      const t = setTimeout(() => setDurum('kapaniyor'), 1900)
      const gec = () => setDurum('kapaniyor')
      addEventListener('keydown', gec, { once: true })
      return () => { clearTimeout(t); removeEventListener('keydown', gec) }
    }
    if (durum === 'kapaniyor') {
      // irisin merkezi: logodaki "O"
      const o = ref.current?.querySelector('.logo-o')?.getBoundingClientRect()
      if (o) {
        ref.current.style.setProperty('--ox', `${o.left + o.width / 2}px`)
        ref.current.style.setProperty('--oy', `${o.top + o.height / 2}px`)
      }
      try { sessionStorage.setItem(ANAHTAR, '1') } catch {}
      const t = setTimeout(() => setDurum('yok'), 750)
      return () => clearTimeout(t)
    }
  }, [durum])

  if (durum === 'yok') return null
  return (
    <div ref={ref} className={`acilis-ekran ${durum}`} onClick={() => setDurum('kapaniyor')} aria-hidden="true">
      <Logo className="acilis-logo" />
    </div>
  )
}
