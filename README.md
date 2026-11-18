# BTO Bilimtur web sitesi (v2)

flixgamestudios.com ile aynı yöntem: **React 18 + Vite 5**, bütün içerik tek dosyada, yayın **Vercel**.

| Parça | Yer |
|---|---|
| Tüm metinler, firma bilgileri, turlar, araçlar | `src/data.js` |
| Sayfa bölümleri | `src/App.jsx` |
| Renkler ve düzen | `src/styles.css` (başta renk değişkenleri) |
| Form gönderimi (e-posta) | `api/lead.js` (Vercel fonksiyonu) |

Eski Python sürümü (3 paket) `eski-surum` dalında duruyor.

## Yerelde çalıştırmak
```
npm install
npm run dev     # http://localhost:5173
```

## Yayın (bir kere)
1. vercel.com/new → GitHub ile giriş → `bto-bilimtur-site` reposunu seç. Ayarlar `vercel.json`'da hazır (Vite, `npm run build`, `dist`). Eski Vercel projesinde "Root Directory" `dist/...` ise boşaltın.
2. Formların e-posta göndermesi için Settings → Environment Variables:
   - `RESEND_API_KEY` (resend.com'dan)
   - `LEAD_TO` = `bto@btobilimtur.com.tr`
   - `MAIL_FROM` = `BTO Web Sitesi <form@btotravel.com>` (alan adı Resend'de doğrulandıktan sonra)
   Bu ayarlar yokken form "gönderilemedi" der ve ziyaretçiye WhatsApp / telefon seçeneği gösterir.
3. Sonrasında `main`'e her push otomatik yayınlanır.

## Yayından önce (firma onayı)
- `src/data.js` içinde `TEYİT` yazan her şeyi firmadan doğrula: adres, WhatsApp hattı, çalışma saatleri, TÜRSAB no, ticaret unvanı, araç kişi sayıları, tur süreleri ve programları, transfer sözleri (rötar bekleme, bebek koltuğu).
- `onizleme: false` yap (üstteki şerit kalkar).
- `index.html` içindeki `<meta name="robots" content="noindex">` satırını ve `vercel.json` içindeki `X-Robots-Tag` başlığını sil (Google'da görünsün).
- Alan adı: Vercel → Settings → Domains → `btotravel.com`, `www.btotravel.com`. Mevcut site o anda kapanır, geçişi firmayla planla.
