// Varsayılan içerik + panelden kaydedilen değişiklikler
import { createContext, useContext, useEffect, useState } from 'react'
import { DUYURU, TURLAR } from './data.js'

const Ctx = createContext(null)

export function birlestir(kayit) {
  const k = kayit || {}
  const turAyar = k.turlar || {}
  return {
    duyuru: { ...DUYURU, ...(k.duyuru || {}) },
    turlar: TURLAR.map((t) => ({ etiket: '', fiyat: '', gorunur: true, ...t, ...(turAyar[t.id] || {}) })),
  }
}

export function IcerikSaglayici({ children }) {
  const [icerik, setIcerik] = useState(birlestir(null))
  useEffect(() => {
    fetch('/api/content').then((r) => (r.ok ? r.json() : null)).then((j) => j?.icerik && setIcerik(birlestir(j.icerik))).catch(() => {})
  }, [])
  return <Ctx.Provider value={icerik}>{children}</Ctx.Provider>
}

export const useIcerik = () => useContext(Ctx)
