// Amadeus Travel Builder bağlantısı. Anahtar yalnız sunucuda durur, ziyaretçinin tarayıcısına gitmez.
// Vercel değişkenleri: AMADEUS_API_KEY (zorunlu), AMADEUS_GATEWAY_URL (isteğe bağlı, varsayılan https://api.amadeus.com)

export const amadeusVar = () => Boolean(process.env.AMADEUS_API_KEY)

// Kısa süreli bellek önbelleği: aynı aramayı tekrar tekrar sormamak için
const onbellek = globalThis.__btoAmadeus || (globalThis.__btoAmadeus = new Map())

export async function amadeus(yolVeSorgu, sure = 0) {
  if (sure) {
    const k = onbellek.get(yolVeSorgu)
    if (k && k.bitis > Date.now()) return k.veri
  }
  const taban = (process.env.AMADEUS_GATEWAY_URL || 'https://api.amadeus.com').replace(/\/+$/, '')
  const kontrol = new AbortController()
  const zaman = setTimeout(() => kontrol.abort(), 25000)
  try {
    const r = await fetch(taban + yolVeSorgu, { headers: { 'X-API-Key': process.env.AMADEUS_API_KEY, Accept: 'application/json' }, signal: kontrol.signal })
    const veri = await r.json().catch(() => null)
    if (!r.ok) {
      const hata = new Error('amadeus ' + r.status)
      hata.durum = r.status; hata.veri = veri
      throw hata
    }
    if (sure) {
      onbellek.set(yolVeSorgu, { veri, bitis: Date.now() + sure })
      if (onbellek.size > 500) onbellek.delete(onbellek.keys().next().value)
    }
    return veri
  } finally {
    clearTimeout(zaman)
  }
}
