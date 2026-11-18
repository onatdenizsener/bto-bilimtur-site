# BTO Bilimtur web sitesi: Premium (Geniş paket)

flixgamestudios.com ile aynı yöntem: **React 18 + Vite 5**, içerik tek dosyada, yayın **Vercel**. Üstüne 12 sayfa, yönetim paneli ve sahne animasyonları eklendi.

| Parça | Yer |
|---|---|
| Firma bilgileri, turlar, araçlar, vize, SSS (tüm metinler) | `src/data.js` |
| Sayfalar | `src/sayfalar.jsx` (ana sayfa, turlar, tur detayı, uçak, otel, transfer, araç, vize, kurumsal, hakkımızda, iletişim, KVKK) |
| Ortak parçalar (menü, biniş kartı formu, alt bilgi) | `src/ortak.jsx` |
| Sahne çizimleri ve hareketleri | `src/Sahne.jsx`, hareketler `src/styles.css` içinde `.an-*` |
| Yönetim paneli | `src/Panel.jsx` → adres: `/panel` |
| Sunucu | `api/lead.js` (formlar), `api/leads.js` (panel talepleri), `api/content.js` (panel içeriği) |

Eski sürümler: `eski-surum` dalı (Python, 3 paket). Sade v2: commit `9ec216b`.

## Animasyon ilkesi
Her sahnede tek ve sade bir hareket var: balonlar yükselir, tekne sallanır, uçak süzülür, sis kayar. Bölümler kaydırınca bir kez gelir (Flix sitesindeki `IntersectionObserver` yöntemi). Telefonda "hareketi azalt" açıksa hiçbir şey oynamaz. Yeni efekt eklerken bu sadeliği koruyun.

## Panel ne yapar?
- **Gelen talepler:** sitedeki bütün formlardan gelenler (son 200).
- **Turlar:** her tur için sitede göster/gizle, etiket (örn. "Erken rezervasyon") ve fiyat yazısı.
- **Duyuru:** en üstteki sarı şerit; aç/kapat, metin, tıklayınca gideceği sayfa.

## Yerelde çalıştırmak
```
npm install
npm run dev                                   # sadece görünüm, http://localhost:5173
npm run build && BTO_MEMORY_STORE=1 ADMIN_PASSWORD=test node kaynak/devserver.mjs 4180   # formlar ve panel dahil
```

## Şu anki yayın
Canlı önizleme: https://bto-bilimtur-site-premium.vercel.app (Vercel projesi `bto-bilimtur-site-premium`, Root Directory = `dist/premium`).
Her değişiklikten sonra `./kaynak/yayin-klasoru.sh` çalıştır, `dist/premium` ile birlikte push'la; Vercel kendisi yayınlar.
`bto-bilimtur-site-baslangic` ve `bto-bilimtur-site-kurumsal` projeleri eski sürüme aitti; `dist/baslangic` ve `dist/kurumsal` klasörleri onları premium adrese yönlendirir. İstenirse Vercel'den silinebilirler.

## Yayın (yeni bir Vercel projesiyle, isteğe bağlı)
1. vercel.com/new → GitHub ile giriş → `bto-bilimtur-site` reposunu seç. Ayarlar `vercel.json`'da hazır. Eski projede "Root Directory" `dist/...` ise boşaltın.
2. **Kayıt deposu (panel için şart):** Vercel → Project → Storage → Upstash for Redis → Create → projeye bağla. `KV_REST_API_URL` ve `KV_REST_API_TOKEN` kendiliğinden eklenir.
3. Settings → Environment Variables:
   - `ADMIN_PASSWORD`: güçlü bir panel şifresi
   - `RESEND_API_KEY`: resend.com anahtarı (talepler e-postayla da gelsin diye)
   - `LEAD_TO`: `bto@btobilimtur.com.tr`
   - `MAIL_FROM`: `BTO Web Sitesi <form@btotravel.com>` (alan adı Resend'de doğrulandıktan sonra)
4. Deployments → son yayın → **Redeploy**.
5. Not: Vercel Hobby planı ticari kullanım için değil; müşteri sitesi Pro planda olmalı.

Depo ve e-posta ayarı yokken form "gönderilemedi" der ve ziyaretçiye WhatsApp / telefon seçeneği gösterir.

## Yayından önce (firma onayı)
- `src/data.js` içinde `TEYİT` yazan her şeyi doğrula: açık adres, WhatsApp hattı, çalışma saatleri, TÜRSAB no, ticaret unvanı, araç kişi sayıları, tur süreleri ve programları, transfer sözleri, sayılar.
- KVKK metnini bir hukukçuya kontrol ettir.
- Görseller çizimdir. Firmanın gerçek fotoğrafları gelince `Sahne` yerine fotoğraf konabilir.
- `onizleme: false` yap; `index.html` içindeki `noindex` satırını ve `vercel.json` içindeki `X-Robots-Tag` başlığını sil.
- Alan adı: Vercel → Settings → Domains → `btotravel.com`, `www.btotravel.com`. Mevcut site o anda kapanır, geçişi firmayla planla.
