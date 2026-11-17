// Sitedeki tüm formlar buraya gelir. Talep e-postayla firmaya gider; kayıt deposu varsa panelde de listelenir.
import crypto from 'node:crypto';
import { send, readJson, ip, limit, hasStore, hasMail, redis, mail, clean } from './_lib.js';

const LABELS = { ad: 'Ad', tel: 'Telefon', konu: 'Konu', not: 'Not', tarih: 'Tarih', saat: 'Saat', kisi: 'Kişi sayısı',
  ucus: 'Uçuş no', alis: 'Alış tarihi', donus: 'Dönüş tarihi', nereden: 'Nereden', nereye: 'Nereye', gidis: 'Gidiş', kurum: 'Kurum' };

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'method' });
  let b;
  try { b = await readJson(req, 16 * 1024); } catch { return send(res, 400, { error: 'bad_json' }); }

  if (b.website) return send(res, 200, { ok: true });            // bot tuzağı: sessizce yok say
  if (Date.now() - Number(b.t || 0) < 2500) return send(res, 200, { ok: true }); // 2.5 sn'den hızlı gönderim: bot

  const lead = { id: crypto.randomUUID(), at: new Date().toISOString(), page: clean(b.page, 80), fields: {} };
  for (const k of Object.keys(LABELS)) if (b[k]) lead.fields[k] = clean(b[k], k === 'not' ? 1000 : 120);
  const tel = (lead.fields.tel || '').replace(/[^\d+]/g, '');
  if (!lead.fields.ad || tel.length < 10) return send(res, 422, { error: 'missing', message: 'Adınızı ve telefon numaranızı yazın.' });
  if (b.kvkk !== true && b.kvkk !== 'on') return send(res, 422, { error: 'kvkk', message: 'Devam etmek için aydınlatma metnini onaylayın.' });

  if (!hasStore() && !hasMail()) return send(res, 503, { error: 'not_configured' });

  try {
    if (!(await limit('rl:lead:' + ip(req), 8, 3600))) return send(res, 429, { error: 'rate', message: 'Çok fazla deneme yapıldı. Lütfen bizi arayın.' });
    let stored = false, mailed = false;
    if (hasStore()) {
      await redis(['LPUSH', 'leads', JSON.stringify(lead)]);
      await redis(['LTRIM', 'leads', 0, 499]);
      stored = true;
    }
    const text = Object.entries(lead.fields).map(([k, v]) => `${LABELS[k]}: ${v}`).join('\n')
      + `\n\nSayfa: ${lead.page}\nZaman: ${new Date(lead.at).toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' })}`;
    try { mailed = await mail(`Yeni talep: ${lead.fields.konu || 'Web sitesi'} (${lead.fields.ad})`, text); } catch { mailed = false; }
    if (!stored && !mailed) return send(res, 502, { error: 'deliver' });
    return send(res, 200, { ok: true });
  } catch (e) {
    return send(res, 500, { error: 'server' });
  }
}
