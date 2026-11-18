// Küçük yönlendirici: gerçek adresler (/turlar, /vize...). Vercel tüm yolları index.html'e yönlendirir.
import { createContext, useContext, useEffect, useState } from 'react'

const YolCtx = createContext({ yol: '/', git: () => {} })

// Önizleme (claude.ai sayfası) için adresler #turlar, #tur-kapadokya gibi tutulur: VITE_HASH=1
const HASH = Boolean(import.meta.env.VITE_HASH)
const SAYFA_ADLARI = ['turlar', 'ucak-bileti', 'otel', 'transfer', 'arac-kiralama', 'vize', 'kurumsal', 'hakkimizda', 'iletisim', 'kvkk', 'panel']
const hashtenYol = () => {
  const h = location.hash.slice(1)
  if (h.startsWith('tur-')) return '/turlar/' + h.slice(4)
  return SAYFA_ADLARI.includes(h) ? '/' + h : null
}
const yoldanHash = (y) => (y === '/' ? 'ana' : y.startsWith('/turlar/') ? 'tur-' + y.slice(8) : y.slice(1))
const simdiki = () => (HASH ? hashtenYol() || '/' : location.pathname.replace(/\/+$/, '') || '/')

export function YolSaglayici({ children }) {
  const [yol, setYol] = useState(simdiki)
  useEffect(() => {
    const geri = () => { const y = HASH ? hashtenYol() : simdiki(); if (y || location.hash === '#ana') { setYol(y || '/'); scrollTo(0, 0) } }
    addEventListener(HASH ? 'hashchange' : 'popstate', geri)
    return () => removeEventListener(HASH ? 'hashchange' : 'popstate', geri)
  }, [])
  const git = (hedef) => {
    const [p, hash] = hedef.split('#')
    const temiz = p.replace(/\/+$/, '') || '/'
    if (temiz !== yol) {
      if (HASH) location.hash = yoldanHash(temiz)
      else history.pushState(null, '', hedef)
      setYol(temiz)
      if (!hash) scrollTo(0, 0)
    }
    if (hash) setTimeout(() => document.getElementById(hash)?.scrollIntoView(), 50)
  }
  return <YolCtx.Provider value={{ yol, git }}>{children}</YolCtx.Provider>
}

export const useYol = () => useContext(YolCtx)

// Site içi bağlantı: sayfa yenilenmeden geçer
export function L({ to, children, ...p }) {
  const { git } = useYol()
  return (
    <a href={to} {...p} onClick={(e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button) return
      e.preventDefault(); p.onClick?.(e); git(to)
    }}>{children}</a>
  )
}
