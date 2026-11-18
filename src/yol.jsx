// Küçük yönlendirici: gerçek adresler (/turlar, /vize...). Vercel tüm yolları index.html'e yönlendirir.
import { createContext, useContext, useEffect, useState } from 'react'

const YolCtx = createContext({ yol: '/', git: () => {} })

export function YolSaglayici({ children }) {
  const [yol, setYol] = useState(location.pathname.replace(/\/+$/, '') || '/')
  useEffect(() => {
    const geri = () => setYol(location.pathname.replace(/\/+$/, '') || '/')
    addEventListener('popstate', geri)
    return () => removeEventListener('popstate', geri)
  }, [])
  const git = (hedef) => {
    const [p, hash] = hedef.split('#')
    const temiz = p.replace(/\/+$/, '') || '/'
    if (temiz !== yol) {
      history.pushState(null, '', hedef)
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
