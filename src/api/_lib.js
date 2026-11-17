// Ortak sunucu yardımcıları. Bağımlılık yok: Upstash Redis ve Resend'e doğrudan fetch ile gidilir.
// Ortam değişkenleri (Vercel > Settings > Environment Variables):
//   KV_REST_API_URL / KV_REST_API_TOKEN   (veya UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN)
//   RESEND_API_KEY, LEAD_TO (talep e-postasının gideceği adres), MAIL_FROM (isteğe bağlı)
//   ADMIN_PASSWORD (sadece Premium paneli)
//   BTO_MEMORY_STORE=1 sadece yerel test içindir: veriler bellekte tutulur.
import crypto from 'node:crypto';

const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const MEMORY = process.env.BTO_MEMORY_STORE === '1';
const mem = globalThis.__btoMem || (globalThis.__btoMem = new Map());

export const hasStore = () => Boolean((URL_ && TOKEN) || MEMORY);
export const hasMail = () => Boolean(process.env.RESEND_API_KEY && process.env.LEAD_TO);

export async function redis(cmd) {
  if (URL_ && TOKEN) {
    const r = await fetch(URL_, { method: 'POST', headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' }, body: JSON.stringify(cmd) });
    if (!r.ok) throw new Error('store ' + r.status);
    return (await r.json()).result;
  }
  if (!MEMORY) throw new Error('store not configured');
  const [op, key, ...a] = cmd.map(String);
  const O = op.toUpperCase();
  if (O === 'GET') return mem.has(key) ? mem.get(key) : null;
  if (O === 'SET') { mem.set(key, a[0]); return 'OK'; }
  if (O === 'INCR') { const v = Number(mem.get(key) || 0) + 1; mem.set(key, String(v)); return v; }
  if (O === 'EXPIRE') return 1;
  if (O === 'LPUSH') { const l = mem.get(key) || []; l.unshift(...a.reverse()); mem.set(key, l); return l.length; }
  if (O === 'LTRIM') { const l = mem.get(key) || []; mem.set(key, l.slice(+a[0], +a[1] + 1)); return 'OK'; }
  if (O === 'LRANGE') { const l = mem.get(key) || []; return l.slice(+a[0], +a[1] + 1); }
  if (O === 'SADD') { const s = new Set(mem.get(key) || []); a.forEach(x => s.add(x)); mem.set(key, [...s]); return 1; }
  if (O === 'SREM') { const s = new Set(mem.get(key) || []); a.forEach(x => s.delete(x)); mem.set(key, [...s]); return 1; }
  if (O === 'SMEMBERS') return mem.get(key) || [];
  throw new Error('unsupported ' + O);
}

export function send(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(data));
}

export async function readJson(req, limit = 64 * 1024) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}');
  let size = 0; const chunks = [];
  for await (const c of req) { size += c.length; if (size > limit) throw new Error('too large'); chunks.push(c); }
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}

export function ip(req) {
  return String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'x').split(',')[0].trim();
}

export function isAdmin(req) {
  const pw = process.env.ADMIN_PASSWORD || '';
  const h = String(req.headers.authorization || '');
  const given = h.startsWith('Bearer ') ? h.slice(7) : '';
  if (!pw || !given) return false;
  const a = crypto.createHash('sha256').update(pw).digest();
  const b = crypto.createHash('sha256').update(given).digest();
  return crypto.timingSafeEqual(a, b);
}

export async function limit(key, max, seconds) {
  if (!hasStore()) return true;
  const n = await redis(['INCR', key]);
  if (n === 1) await redis(['EXPIRE', key, seconds]);
  return n <= max;
}

export async function mail(subject, text, replyTo) {
  if (!hasMail()) return false;
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.MAIL_FROM || 'BTO Web Sitesi <onboarding@resend.dev>',
      to: process.env.LEAD_TO.split(',').map(s => s.trim()),
      subject, text, ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });
  return r.ok;
}

export const clean = (v, n = 500) => String(v ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, n);
