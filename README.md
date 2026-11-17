# BTO Bilimtur web sitesi

Üç paket: `dist/baslangic`, `dist/kurumsal`, `dist/premium`. Her biri ayrı bir Vercel projesi olarak yayınlanır (Root Directory = ilgili klasör).

- İçerik ve firma bilgileri: `src/config.py` (TEST yazanlar teyit edilecek)
- Üretmek: `python3 build2.py`
- Yerelde denemek: `BTO_MEMORY_STORE=1 ADMIN_PASSWORD=test node devserver.mjs dist/premium 5173`
- Test: `python3 e2e.py`

Yayın adımları: `YAYIN_REHBERI.md`.

Not: `src/config.py` içinde `preview: True` iken her sayfada "Tasarım önizlemesidir" şeridi ve noindex vardır. Firma onayından sonra `False` yapıp yeniden üretin.
