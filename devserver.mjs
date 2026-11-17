// Yerel test sunucusu: Vercel davranışını taklit eder (cleanUrls, /api fonksiyonları, 404.html).
// Kullanım: BTO_MEMORY_STORE=1 ADMIN_PASSWORD=test node devserver.mjs dist/premium 5173
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = path.resolve(process.argv[2] || '.');
const port = Number(process.argv[3] || 5173);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.webp': 'image/webp', '.xml': 'application/xml', '.txt': 'text/plain', '.json': 'application/json' };

http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://x');
  try {
    if (u.pathname.startsWith('/api/')) {
      const name = u.pathname.slice(5).replace(/\/$/, '');
      const file = path.join(root, 'api', name + '.js');
      if (name.startsWith('_') || !fs.existsSync(file)) { res.statusCode = 404; return res.end('{}'); }
      const mod = await import(pathToFileURL(file).href);
      return await mod.default(req, res);
    }
    let p = path.join(root, decodeURIComponent(u.pathname));
    if (!p.startsWith(root)) throw 0;
    if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, 'index.html');
    if (!fs.existsSync(p)) {
      res.statusCode = 404; res.setHeader('Content-Type', types['.html']);
      return res.end(fs.readFileSync(path.join(root, '404.html')));
    }
    res.setHeader('Content-Type', types[path.extname(p)] || 'application/octet-stream');
    res.end(fs.readFileSync(p));
  } catch (e) { res.statusCode = 500; res.end(String(e)); }
}).listen(port, () => console.log('http://localhost:' + port));
