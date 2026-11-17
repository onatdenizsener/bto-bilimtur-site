// Premium: panel şifresini doğrular. Kaba kuvvete karşı IP başına saatte 10 deneme.
import { send, isAdmin, ip, limit, hasStore } from './_lib.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'method' });
  if (!process.env.ADMIN_PASSWORD) return send(res, 503, { error: 'not_configured', message: 'Panel şifresi henüz tanımlanmadı.' });
  if (hasStore() && !(await limit('rl:login:' + ip(req), 10, 3600))) return send(res, 429, { error: 'rate', message: 'Çok fazla deneme. Bir saat sonra tekrar deneyin.' });
  if (!isAdmin(req)) return send(res, 401, { error: 'auth', message: 'Şifre hatalı.' });
  return send(res, 200, { ok: true, store: hasStore() });
}
