#!/bin/sh
# Vercel'deki "bto-bilimtur-site-premium" projesi Root Directory = dist/premium ile çalışıyor.
# Bu script siteyi derleyip o klasöre hazır (derleme gerektirmeyen) haliyle koyar. Push'tan önce çalıştır.
set -e
cd "$(dirname "$0")/.."
npm run build
rm -rf dist/premium && mkdir -p dist/premium
cp -r build/* dist/premium/
cp -r api dist/premium/api
cat > dist/premium/package.json <<'J'
{ "name": "bto-premium", "private": true, "type": "module", "engines": { "node": ">=20" } }
J
cat > dist/premium/vercel.json <<'J'
{
  "rewrites": [{ "source": "/((?!api/|assets/|favicon).*)", "destination": "/index.html" }],
  "headers": [
    { "source": "/(.*)", "headers": [{ "key": "X-Robots-Tag", "value": "noindex" }] },
    { "source": "/assets/(.*)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] }
  ]
}
J
echo "dist/premium hazır"
