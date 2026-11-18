// Panelden değiştirilen içerik. GET herkese açık, POST şifre ister.
import { redis, depoVar, yetkili, govde, temiz } from './_lib.js'

const TUR_ID = /^[a-z0-9-]{1,40}$/

export default async function handler(req, res) {
  if (!depoVar()) return res.status(200).json({ ok: true, icerik: null })

  if (req.method === 'GET') {
    const s = await redis('GET', 'bto:icerik').catch(() => null)
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=30, stale-while-revalidate=300')
    return res.status(200).json({ ok: true, icerik: s ? (typeof s === 'string' ? JSON.parse(s) : s) : null })
  }

  if (req.method === 'POST') {
    if (!yetkili(req)) return res.status(401).json({ ok: false })
    const b = govde(req)
    const d = b.duyuru || {}
    const icerik = {
      duyuru: { acik: Boolean(d.acik), metin: temiz(d.metin, 160), link: /^\/[\w\-/]*$/.test(d.link || '') ? d.link : '' },
      turlar: {},
    }
    for (const [id, t] of Object.entries(b.turlar || {})) {
      if (!TUR_ID.test(id) || typeof t !== 'object') continue
      icerik.turlar[id] = {}
      if ('gorunur' in t) icerik.turlar[id].gorunur = Boolean(t.gorunur)
      if ('etiket' in t) icerik.turlar[id].etiket = temiz(t.etiket, 40)
      if ('fiyat' in t) icerik.turlar[id].fiyat = temiz(t.fiyat, 40)
    }
    await redis('SET', 'bto:icerik', JSON.stringify(icerik))
    return res.status(200).json({ ok: true })
  }
  return res.status(405).json({ ok: false })
}
