// Formlardan gelen talep: depoya yazılır (panelde görünür) ve e-postayla iletilir (Resend).
// Vercel değişkenleri: RESEND_API_KEY, LEAD_TO (virgülle), MAIL_FROM (alan adı Resend'de doğrulandıktan sonra)
import { redis, depoVar, govde, temiz } from './_lib.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false })
  const b = govde(req)
  const talep = {
    zaman: new Date().toISOString(),
    tip: temiz(b.tip, 60), ad: temiz(b.ad, 80), telefon: temiz(b.telefon, 30),
    nereden: temiz(b.nereden), nereye: temiz(b.nereye), tarih: temiz(b.tarih, 20), kisi: temiz(b.kisi, 5), mesaj: temiz(b.mesaj, 2000),
  }
  if (!talep.ad || talep.telefon.replace(/\D/g, '').length < 10) return res.status(400).json({ ok: false, hata: 'Ad ve telefon gerekli' })

  let kaydedildi = false, gitti = false
  if (depoVar()) {
    try {
      const ip = String(req.headers['x-forwarded-for'] || 'x').split(',')[0]
      const n = await redis('INCR', `bto:sinir:${ip}`)
      if (n === 1) await redis('EXPIRE', `bto:sinir:${ip}`, 3600)
      if (n > 8) return res.status(429).json({ ok: false, hata: 'Çok fazla deneme' })
      await redis('LPUSH', 'bto:talepler', JSON.stringify(talep))
      await redis('LTRIM', 'bto:talepler', 0, 499)
      kaydedildi = true
    } catch {}
  }

  const key = process.env.RESEND_API_KEY
  const to = (process.env.LEAD_TO || '').split(',').map((s) => s.trim()).filter(Boolean)
  if (key && to.length) {
    const satirlar = [['Talep', talep.tip], ['Ad', talep.ad], ['Telefon', talep.telefon], ['Nereden', talep.nereden], ['Nereye', talep.nereye], ['Tarih', talep.tarih], ['Kişi', talep.kisi], ['Mesaj', talep.mesaj]].filter(([, v]) => v)
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.MAIL_FROM || 'BTO Web Sitesi <onboarding@resend.dev>',
        to, subject: `Yeni talep: ${talep.tip} – ${talep.ad}`,
        text: satirlar.map(([k, v]) => `${k}: ${v}`).join('\n'),
      }),
    }).catch(() => null)
    gitti = Boolean(r?.ok)
  }

  if (!kaydedildi && !gitti) return res.status(503).json({ ok: false, hata: 'Talep iletilemedi' })
  return res.status(200).json({ ok: true })
}
