// Panel: gelen talepleri listeler (şifre gerekli)
import { redis, depoVar, yetkili } from './_lib.js'

export default async function handler(req, res) {
  if (!process.env.ADMIN_PASSWORD || !depoVar()) return res.status(503).json({ ok: false, hata: 'Panel ayarlı değil' })
  if (!yetkili(req)) return res.status(401).json({ ok: false })
  const liste = await redis('LRANGE', 'bto:talepler', 0, 199)
  const talepler = (liste || []).map((s) => { try { return typeof s === 'string' ? JSON.parse(s) : s } catch { return null } }).filter(Boolean)
  res.setHeader('Cache-Control', 'no-store')
  return res.status(200).json({ ok: true, talepler })
}
