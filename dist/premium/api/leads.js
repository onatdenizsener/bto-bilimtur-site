// Premium: gelen talepler. GET listeler, PATCH "arandı" işaretler. İkisi de şifreli.
import { send, readJson, isAdmin, hasStore, redis, clean } from './_lib.js';

export default async function handler(req, res) {
  if (!isAdmin(req)) return send(res, 401, { error: 'auth' });
  if (!hasStore()) return send(res, 503, { error: 'not_configured' });
  if (req.method === 'GET') {
    const [list, done] = await Promise.all([redis(['LRANGE', 'leads', 0, 199]), redis(['SMEMBERS', 'leads:done'])]);
    const d = new Set(done || []);
    const leads = (list || []).map(s => { try { const l = JSON.parse(s); l.done = d.has(l.id); return l; } catch { return null; } }).filter(Boolean);
    return send(res, 200, { leads });
  }
  if (req.method === 'PATCH') {
    let b; try { b = await readJson(req); } catch { return send(res, 400, { error: 'bad_json' }); }
    const id = clean(b.id, 60);
    if (!id) return send(res, 422, { error: 'id' });
    await redis([b.done ? 'SADD' : 'SREM', 'leads:done', id]);
    return send(res, 200, { ok: true });
  }
  return send(res, 405, { error: 'method' });
}
