# BTO Bilimtur web sitesi: yayına alma rehberi

Bu klasörde üç ayrı site var. Her biri kendi başına yayınlanır, müşteri hangi paketi aldıysa o klasör kullanılır.

| Klasör | Paket | İçerik |
|---|---|---|
| `baslangic/` | Tek Sayfa | 1 sayfa, iletişim formu, KVKK ve gizlilik sayfaları |
| `kurumsal/` | Standart | 5 sayfa, iletişim ve transfer formları, KVKK ve gizlilik sayfaları |
| `premium/` | Geniş | 10 sayfa, yönetim paneli (`/panel/`), panelde duyuru, tur ve gelen talepler |

Hiçbirinde derleme adımı ya da paket kurulumu yok. HTML, CSS, JS ve `api/` klasöründeki sunucu fonksiyonları doğrudan çalışır.

## 1. Yayından önce: TEST yazan bilgileri düzelt

Kaynak kodda `src/config.py` dosyasını aç, firmadan gelen bilgileri yaz, sonra `python3 build2.py` çalıştır. Teyit edilecekler:

{TEST_LIST}

Sitede `[TEST]` yazan her yer bu dosyadan gelir. Yayından önce şunu çalıştırıp hiçbir sonuç çıkmadığını kontrol et:

```
grep -rl "TEST" dist/<paket>/ --include=*.html
```

## 2. GitHub ve Vercel

1. github.com/new adresinden private bir repo aç (örneğin `bto-bilimtur-site`).
2. Seçilen paketin klasörünün **içindekileri** reponun köküne koy ve push'la.
3. vercel.com/new adresinden repoyu içe aktar. Framework: **Other**. Build Command ve Output Directory boş kalsın. **Deploy**'a bas.

Not: Vercel'in ücretsiz Hobby planı ticari kullanım için değil. Müşteri sitesi için Pro plan gerekir.

## 3. Formların e-posta göndermesi (üç pakette de)

1. resend.com'da hesap aç. Domains bölümüne `btotravel.com` ekle ve verdiği DNS kayıtlarını alan adı firmasına gir.
2. API Keys bölümünden bir anahtar oluştur.
3. Vercel > Project > Settings > Environment Variables bölümüne şunları ekle:

| Ad | Değer |
|---|---|
| `RESEND_API_KEY` | Resend anahtarı |
| `LEAD_TO` | Taleplerin gideceği adres (örn. `bto@btobilimtur.com.tr`, virgülle birden fazla) |
| `MAIL_FROM` | `BTO Web Sitesi <form@btotravel.com>` (domain doğrulandıktan sonra) |

Domain doğrulanana kadar `MAIL_FROM` boş bırakılırsa Resend sadece hesap sahibinin kendi adresine gönderir.

## 4. Kayıt deposu (Premium için şart, diğerlerinde isteğe bağlı)

Panelin içerikleri kaydetmesi ve talepleri listelemesi için:

1. Vercel > Project > Storage > **Upstash for Redis** (Marketplace) > Create. Projeye bağla.
2. Vercel, `KV_REST_API_URL` ve `KV_REST_API_TOKEN` değişkenlerini kendisi ekler.
3. Premium için `ADMIN_PASSWORD` değişkenine güçlü bir panel şifresi yaz.
4. Değişkenleri ekledikten sonra Deployments > son yayın > **Redeploy**.

Başlangıç ve Kurumsal pakette depo bağlanırsa form gönderimlerine saatte 8 deneme sınırı da uygulanır.

## 5. Alan adı

Vercel > Settings > Domains bölümünden `btotravel.com` ve `www.btotravel.com` ekle. Vercel'in verdiği A ve CNAME kayıtlarını alan adı firmasına gir. Mevcut site o anda kapanır, geçişi firmayla birlikte planla.

## 6. Yayından sonra kontrol

- Her formdan bir deneme gönder, e-postanın geldiğini gör (Premium'da panelde de görünmeli).
- `/panel/` adresinden giriş yap, bir turun kampanya etiketini değiştir, sitede görün.
- Google Search Console'a `https://www.btotravel.com/sitemap.xml` adresini ekle.
- Firmanın gerçek fotoğrafları gelince `img/` klasöründeki çizimleri aynı adla değiştir (WebP önerilir; uzantı değişirse `src/t_premium_data.py` ve `src/t_premium.py` içindeki adları güncelle).

## Yerelde deneme

```
BTO_MEMORY_STORE=1 ADMIN_PASSWORD=test node devserver.mjs dist/premium 5173
```

`http://localhost:5173` adresini aç. Panel şifresi: `test`. Bu modda veriler bellekte tutulur, sunucu kapanınca silinir.
