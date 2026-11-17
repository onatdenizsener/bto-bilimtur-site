// Premium: panelden düzenlenen içerik (duyuru şeridi ve turlar). GET herkese açık, PUT şifreli.
import { send, readJson, isAdmin, hasStore, redis, clean } from './_lib.js';

const CATS = ['yurtici', 'deniz', 'yurtdisi'];
const ICONS = ['balloon', 'boat', 'sun', 'mountain', 'bridge', 'plane', 'globe', 'van'];

function sanitize(c) {
  const a = c && c.announce || {};
  const tours = Array.isArray(c && c.tours) ? c.tours.slice(0, 40) : [];
  return {
    announce: { on: Boolean(a.on), text: clean(a.text, 140) },
    tours: tours.map((t, i) => ({
      id: clean(t.id, 40).replace(/[^\w-]/g, '') || 't' + i,
      title: clean(t.title, 80), text: clean(t.text, 200), badge: clean(t.badge, 30),
      cat: CATS.includes(t.cat) ? t.cat : 'yurtici', icon: ICONS.includes(t.icon) ? t.icon : 'globe',
      loc: clean(t.loc, 80), price: clean(t.price, 30),
      img: /^[\w-]+\.(svg|webp|jpg|jpeg|png)$/.test(String(t.img || '')) ? t.img : 'yol.svg',
      inc: Array.isArray(t.inc) ? t.inc.slice(0, 4).map(x => clean(x, 30)).filter(Boolean) : [],
      href: /^\/[\w\-\/]*$/.test(String(t.href || '')) ? t.href : '',
      on: Boolean(t.on),
    })).filter(t => t.title),
    updated: new Date().toISOString(),
  };
}

export default async function handler(req, res) {
  if (!hasStore()) return send(res, req.method === 'GET' ? 200 : 503, req.method === 'GET' ? { content: null } : { error: 'not_configured' });
  if (req.method === 'GET') {
    const raw = await redis(['GET', 'content']);
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=30');
    return send(res, 200, { content: raw ? JSON.parse(raw) : null });
  }
  if (req.method === 'PUT') {
    if (!isAdmin(req)) return send(res, 401, { error: 'auth' });
    let b; try { b = await readJson(req); } catch { return send(res, 400, { error: 'bad_json' }); }
    const c = sanitize(b);
    await redis(['SET', 'content', JSON.stringify(c)]);
    return send(res, 200, { ok: true, content: c });
  }
  if (req.method === 'DELETE') {
    if (!isAdmin(req)) return send(res, 401, { error: 'auth' });
    await redis(['SET', 'content', '']);
    return send(res, 200, { ok: true });
  }
  return send(res, 405, { error: 'method' });
}
