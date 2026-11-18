// Yerelde site + api denemesi (Vercel olmadan).
// npm run build && BTO_MEMORY_STORE=1 ADMIN_PASSWORD=test node kaynak/devserver.mjs 4180
import http from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'

const kok = join(import.meta.dirname, '..')
const dist = join(kok, 'dist')
const port = Number(process.argv[2] || 4180)
const TIP = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp' }

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x')
  if (url.pathname.startsWith('/api/')) {
    const ad = url.pathname.slice(5).replace(/[^a-z]/g, '')
    let govde = ''
    for await (const p of req) govde += p
    req.body = govde ? JSON.parse(govde) : {}
    res.status = (c) => { res.statusCode = c; return res }
    res.json = (j) => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(j)) }
    try { const m = await import(join(kok, 'api', `${ad}.js`)); return await m.default(req, res) }
    catch (e) { console.error(e); res.statusCode = 500; return res.end('hata') }
  }
  let dosya = normalize(join(dist, url.pathname))
  if (!dosya.startsWith(dist)) { res.statusCode = 403; return res.end() }
  try { const v = await readFile(dosya); res.setHeader('Content-Type', TIP[extname(dosya)] || 'application/octet-stream'); return res.end(v) }
  catch { res.setHeader('Content-Type', TIP['.html']); return res.end(await readFile(join(dist, 'index.html'))) }
}).listen(port, () => console.log(`http://localhost:${port}`))
