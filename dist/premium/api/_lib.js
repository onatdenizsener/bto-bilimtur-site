// Ortak yardımcılar. Kayıt deposu: Upstash Redis (Vercel Marketplace), REST üzerinden.
// Vercel değişkenleri: KV_REST_API_URL, KV_REST_API_TOKEN (Upstash bağlanınca kendiliğinden eklenir), ADMIN_PASSWORD.
// Yerelde denemek için BTO_MEMORY_STORE=1: veriler bellekte tutulur.
import { timingSafeEqual } from 'node:crypto'

const bellek = globalThis.__btoBellek || (globalThis.__btoBellek = new Map())

export const depoVar = () => Boolean((process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) || process.env.BTO_MEMORY_STORE)

export async function redis(...komut) {
  if (!process.env.KV_REST_API_URL && process.env.BTO_MEMORY_STORE) {
    const [k, anahtar, ...arg] = komut
    if (k === 'GET') return bellek.get(anahtar) ?? null
    if (k === 'SET') { bellek.set(anahtar, arg[0]); return 'OK' }
    if (k === 'LPUSH') { const l = bellek.get(anahtar) || []; l.unshift(arg[0]); bellek.set(anahtar, l); return l.length }
    if (k === 'LTRIM') { const l = bellek.get(anahtar) || []; bellek.set(anahtar, l.slice(Number(arg[0]), Number(arg[1]) + 1)); return 'OK' }
    if (k === 'LRANGE') { const l = bellek.get(anahtar) || []; return l.slice(Number(arg[0]), Number(arg[1]) + 1) }
    if (k === 'INCR') { const n = (Number(bellek.get(anahtar)) || 0) + 1; bellek.set(anahtar, n); return n }
    if (k === 'EXPIRE') return 1
  }
  const r = await fetch(process.env.KV_REST_API_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(komut),
  })
  if (!r.ok) throw new Error('redis')
  return (await r.json()).result
}

export function yetkili(req) {
  const sifre = process.env.ADMIN_PASSWORD || ''
  const gelen = String(req.headers.authorization || '').replace(/^Bearer /, '')
  if (!sifre || !gelen) return false
  const a = Buffer.from(sifre), b = Buffer.from(gelen)
  return a.length === b.length && timingSafeEqual(a, b)
}

export function govde(req) {
  if (typeof req.body === 'string') { try { return JSON.parse(req.body || '{}') } catch { return {} } }
  return req.body || {}
}

export const temiz = (v, n = 300) => String(v ?? '').replace(/[<>]/g, '').trim().slice(0, n)
