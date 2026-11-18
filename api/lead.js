// Formlardan gelen talebi e-postayla iletir (Resend).
// Vercel > Settings > Environment Variables:
//   RESEND_API_KEY  Resend anahtarı
//   LEAD_TO         taleplerin gideceği adres(ler), virgülle
//   MAIL_FROM       örn. "BTO Web Sitesi <form@btotravel.com>" (alan adı Resend'de doğrulandıktan sonra)

const temiz = (v, n = 300) => String(v ?? '').replace(/[<>]/g, '').trim().slice(0, n)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false })

  const b = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {})
  const ad = temiz(b.ad, 80)
  const telefon = temiz(b.telefon, 30)
  if (!ad || telefon.replace(/\D/g, '').length < 10) {
    return res.status(400).json({ ok: false, hata: 'Ad ve telefon gerekli' })
  }

  const satirlar = [
    ['Talep', temiz(b.tip, 60)], ['Ad', ad], ['Telefon', telefon],
    ['Nereden', temiz(b.nereden)], ['Nereye', temiz(b.nereye)],
    ['Tarih', temiz(b.tarih, 20)], ['Kişi', temiz(b.kisi, 5)], ['Mesaj', temiz(b.mesaj, 2000)],
  ].filter(([, v]) => v)

  const key = process.env.RESEND_API_KEY
  const to = (process.env.LEAD_TO || '').split(',').map((s) => s.trim()).filter(Boolean)
  if (!key || !to.length) return res.status(503).json({ ok: false, hata: 'E-posta ayarı yok' })

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.MAIL_FROM || 'BTO Web Sitesi <onboarding@resend.dev>',
      to,
      subject: `Yeni talep: ${temiz(b.tip, 60)} – ${ad}`,
      text: satirlar.map(([k, v]) => `${k}: ${v}`).join('\n'),
    }),
  })
  if (!r.ok) return res.status(502).json({ ok: false })
  return res.status(200).json({ ok: true })
}
