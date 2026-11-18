// TÜM VARSAYILAN İÇERİK BURADA. Panelden değiştirilenler (duyuru, tur fiyatı/etiketi/görünürlüğü) bunun üstüne yazılır.
// "TEYİT" yazan her şey yayından önce firmadan doğrulanmalı.

export const FIRMA = {
  ad: 'BTO Bilimtur',
  unvan: 'BTO Bilimtur Turizm Organizasyon Transfer', // TEYİT: resmi ticaret unvanı
  kurulus: 1995,
  tel: '+903124687580',
  telGoster: '0312 468 75 80',
  whatsapp: '903124687580', // TEYİT: WhatsApp hattı yok, sabit hat yazıldı
  mail: 'bto@btobilimtur.com.tr',
  adres: '[TEST ADRES] Çankaya, Ankara', // TEYİT: açık adres
  harita: 'https://www.google.com/maps/search/?api=1&query=BTO+Bilimtur+Ankara',
  saatler: 'Hafta içi 09.00–18.00, Cumartesi 10.00–14.00', // TEYİT
  tursab: '[TEST] 0000', // TEYİT: TÜRSAB belge no
  onizleme: true, // true iken üstte "Tasarım önizlemesidir" şeridi çıkar
}

// Panelden değiştirilebilir
export const DUYURU = { acik: true, metin: 'Kapadokya balon turunda bahar tarihleri açıldı.', link: '/turlar/kapadokya' }

export const MENU = [
  ['/turlar', 'Turlar'],
  ['/ucak-bileti', 'Uçak bileti'],
  ['/otel', 'Otel'],
  ['/transfer', 'Transfer'],
  ['/arac-kiralama', 'Araç kiralama'],
  ['/vize', 'Vize'],
  ['/kurumsal', 'Kurumsal'],
]

export const TALEP_TURLERI = [
  { id: 'ucak', ad: 'Uçak bileti', alanlar: ['nereden', 'nereye', 'tarih', 'kisi'] },
  { id: 'transfer', ad: 'Transfer', alanlar: ['nereden', 'nereye', 'tarih', 'kisi'] },
  { id: 'arac', ad: 'Şoförlü araç', alanlar: ['nereden', 'tarih', 'kisi'] },
  { id: 'otel', ad: 'Otel', alanlar: ['nereye', 'tarih', 'kisi'] },
  { id: 'tur', ad: 'Tur', alanlar: ['nereye', 'tarih', 'kisi'] },
]

export const HIZMETLER = [
  { ikon: 'ucak', ad: 'Uçak bileti', yol: '/ucak-bileti', metin: 'Yurt içi ve yurt dışı bütün havayolları. Aktarmayı, bagajı ve koltuğu sizin yerinize takip ederiz.' },
  { ikon: 'yatak', ad: 'Otel', yol: '/otel', metin: 'Türkiye’nin her yerinde ve yurt dışında anlaşmalı otellerde konaklama.' },
  { ikon: 'minibus', ad: 'Havalimanı transferi', yol: '/transfer', metin: 'Esenboğa’da isminizle karşılanın, kapınıza bırakılın.' },
  { ikon: 'araba', ad: 'Şoförlü araç', yol: '/arac-kiralama', metin: 'Sedandan 27 kişilik midibüse kadar, şoförüyle birlikte.' },
  { ikon: 'pasaport', ad: 'Pasaport ve vize', yol: '/vize', metin: 'Evrak listesi, randevu ve dosya hazırlığı. Başvurunuz eksik evrak yüzünden geri dönmez.' },
  { ikon: 'kalkan', ad: 'Seyahat sağlık sigortası', yol: '/vize', metin: 'Vize başvurusunda istenen poliçeyi aynı gün hazırlarız.' },
  { ikon: 'insanlar', ad: 'Kongre ve toplantı', yol: '/kurumsal', metin: 'Salon, konaklama, katılımcı transferi ve kayıt masası tek ekipten.' },
  { ikon: 'balon', ad: 'Size özel tur', yol: '/turlar', metin: 'Tarihi, bütçeyi ve rotayı siz söyleyin, programı biz hazırlayalım.' },
]

// TEYİT: tur programları, süreleri ve gün gün akış örnek olarak yazıldı. fiyat/etiket panelden girilir.
export const TURLAR = [
  { id: 'kapadokya', kat: 'yurtici', sahne: 'kapadokya', ad: 'Kapadokya balon turu', sure: '2 gün 1 gece', kalkis: 'Ankara', yer: 'Göreme, Nevşehir',
    ozet: 'Gün doğarken peri bacalarının üzerinde süzülün.',
    uzun: ['Ankara’dan sabah yola çıkıyoruz, öğleden sonra Göreme’deyiz. Akşamı vadilerde yürüyüşle ve mağara otelinizde geçiriyorsunuz.', 'Ertesi sabah gün doğmadan otelinizden alınıyorsunuz. Balon, güneş vadileri pembeye boyarken havalanıyor; bir saate yakın uçuşun sonunda kutlama ve sertifika sizi bekliyor.', 'Hava uçuşa uygun değilse uçuşu ertesi güne aktarıyor ya da ücretini iade ediyoruz.'],
    dahil: ['Ankara’dan gidiş dönüş ulaşım', 'Bir gece otel ve kahvaltı', 'Balon uçuşu ve otelden alış', 'Rehber'],
    program: [['1. gün', 'Ankara çıkış, Göreme, vadi yürüyüşü, otele yerleşme'], ['2. gün', 'Gün doğumunda balon uçuşu, kahvaltı, Avanos, Ankara’ya dönüş']] },
  { id: 'mavi-yolculuk', kat: 'deniz', sahne: 'gulet', ad: 'Mavi yolculuk', sure: '4–8 gün', kalkis: 'Bodrum, Marmaris, Fethiye', yer: 'Ege ve Akdeniz koyları',
    ozet: 'Gulet ya da yatla koy koy dolaşın.',
    uzun: ['Sabah bir koyda yüzerek uyanıyor, öğlen başka bir koyda demir atıyorsunuz. Yemekler teknede, kaptanın mutfağından.', 'Kabin kiralayabilir ya da tekneyi ailenizle, arkadaşlarınızla tamamen tutabilirsiniz. Rotayı sizinle birlikte seçiyoruz.'],
    dahil: ['Kabin ya da teknenin tamamı', 'Tam pansiyon yemek', 'Kaptan ve mürettebat', 'İsteğe bağlı Ankara’dan uçak ve transfer'],
    program: [['1. gün', 'Limanda karşılama, tekneye yerleşme'], ['2.–6. gün', 'Koylar arası yolculuk, yüzme molaları'], ['Son gün', 'Kahvaltı ve limana dönüş']] },
  { id: 'akdeniz', kat: 'deniz', sahne: 'akdeniz', ad: 'Akdeniz ve Ege tatili', sure: 'Siz seçin', kalkis: 'Ankara', yer: 'Antalya, Bodrum, Fethiye',
    ozet: 'Otel, uçak ve transfer birlikte ayarlanır.',
    uzun: ['Her bütçeye uygun otelleri biliyoruz: çocuklu aileler için havuzlu kulüp otellerinden sakin butik otellere kadar.', 'Uçak biletinizi, havalimanından otele transferinizi ve dönüşünüzü tek seferde ayarlıyoruz.'],
    dahil: ['Uçak bileti', 'Otel', 'Havalimanı transferi'], program: [] },
  { id: 'karadeniz', kat: 'yurtici', sahne: 'karadeniz', ad: 'Karadeniz yayla turu', sure: '5 gün', kalkis: 'Ankara', yer: 'Trabzon, Rize, Artvin',
    ozet: 'Yaylalar, göller ve yeşilin her tonu.',
    uzun: ['Uzungöl’ün sisli sabahları, Ayder’in yayla evleri ve Sümela’nın kayalara oyulmuş duvarları.', 'Grup turlarımıza katılabilir ya da size özel bir program isteyebilirsiniz.'],
    dahil: ['Ankara çıkışlı ulaşım', 'Otel ve kahvaltı', 'Rehber'],
    program: [['1. gün', 'Ankara’dan çıkış'], ['2. gün', 'Sümela ve Trabzon'], ['3. gün', 'Uzungöl'], ['4. gün', 'Ayder yaylası'], ['5. gün', 'Dönüş']] },
  { id: 'istanbul', kat: 'yurtici', sahne: 'istanbul', ad: 'İstanbul ve Boğaz', sure: '2–3 gün', kalkis: 'Ankara', yer: 'İstanbul',
    ozet: 'Size özel tekneyle Boğaz’da bir akşam.',
    uzun: ['Hızlı trenle sabah çıkıp öğlen İstanbul’dasınız. Akşam size ayrılmış bir teknede Boğaz’ın iki yakasını izliyorsunuz.'],
    dahil: ['Hızlı tren ya da uçak', 'Otel', 'Özel tekne turu'], program: [] },
  { id: 'kibris', kat: 'yurtdisi', sahne: 'kibris', ad: 'Kıbrıs tatili', sure: '3–7 gün', kalkis: 'Esenboğa', yer: 'Girne',
    ozet: 'Uçak, otel ve transfer hazır.',
    uzun: ['Esenboğa’dan bir saatlik uçuş, Ercan’da sizi bekleyen araç ve deniz kenarında oteliniz.'],
    dahil: ['Uçak bileti', 'Otel', 'Ercan havalimanı transferi'], program: [] },
  { id: 'avrupa', kat: 'yurtdisi', sahne: 'avrupa', ad: 'Avrupa şehir gezileri', sure: '3–6 gün', kalkis: 'Esenboğa', yer: 'Londra, Paris, Prag, Barcelona',
    ozet: 'Uçak, otel ve vize dosyası birlikte.',
    uzun: ['Şehri siz seçin; uçağı, merkezi bir oteli ve vize dosyanızı biz hazırlayalım. Müze ve şehir turu biletlerini de ekleyebiliriz.'],
    dahil: ['Uçak ve otel', 'Vize dosyası hazırlığı', 'İsteğe bağlı müze biletleri'], program: [] },
  { id: 'gunubirlik', kat: 'yurtici', sahne: 'yol', ad: 'Ankara çıkışlı günübirlik', sure: '1 gün', kalkis: 'Ankara', yer: 'Beypazarı, Safranbolu, Gordion',
    ozet: 'Sabah çıkın, akşam dönün. Okul ve kurum grupları için.',
    uzun: ['Kendi araçlarımız ve şoförlerimizle Ankara çevresinin en güzel günübirlik rotaları. Grup büyüklüğüne göre araç ayarlıyoruz.'],
    dahil: ['Şoförlü araç', 'Rehber', 'Grup büyüklüğüne göre araç'], program: [] },
]

export const KATEGORILER = [['hepsi', 'Hepsi'], ['yurtici', 'Yurt içi'], ['deniz', 'Deniz'], ['yurtdisi', 'Yurt dışı']]

// TEYİT: kişi sayıları model bilgisine göre tahmin
export const FILO = [
  { ad: 'Audi A6', tip: 'Lüks sedan', kisi: 4, not: 'Protokol ve iş seyahati' },
  { ad: 'Toyota Corolla', tip: 'Sedan', kisi: 4, not: 'Şehir içi ve şehirlerarası' },
  { ad: 'Renault Fluence', tip: 'Sedan', kisi: 4, not: 'Geniş bagaj' },
  { ad: 'Renault Clio', tip: 'Ekonomik', kisi: 4, not: 'Şehir içi için pratik' },
  { ad: 'VW Caravelle', tip: 'VIP minibüs', kisi: 8, not: 'Aileler ve küçük gruplar' },
  { ad: 'VW Crafter', tip: 'Minibüs', kisi: 16, not: 'Ekip ve okul transferi' },
  { ad: 'Isuzu Novo Lux', tip: 'Midibüs', kisi: 27, not: 'Kongre ve kalabalık gruplar' },
]

// TEYİT: rötar bekleme ve bebek koltuğu sözü
export const TRANSFER_ADIMLARI = [
  ['Uçuşunuzu yazın', 'Uçuş numarası ve kişi sayısı yeterli.'],
  ['Fiyatı hemen söyleriz', 'Telefonda ya da WhatsApp’tan, sabit fiyat.'],
  ['Şoför sizi karşılar', 'Esenboğa’da isminizin yazılı olduğu tabelayla. Uçak rötar yaparsa bekler.'],
  ['Kapınıza bırakır', 'Ankara’nın her ilçesine. İsterseniz bebek koltuğu hazır olur.'],
]

export const VIZE = [
  { id: 'schengen', ad: 'Schengen', ulkeler: 'Fransa, İtalya, İspanya, Almanya, Hollanda, Çekya, İskandinavya…',
    evrak: ['Geçerlilik süresi yeterli pasaport ve eski pasaportlar', 'Biyometrik fotoğraf', 'Seyahat sağlık sigortası', 'Son aylara ait banka hesap dökümü', 'Çalıştığınız yerden yazı ya da öğrenci belgesi', 'Uçak ve otel rezervasyonu'] },
  { id: 'ingiltere', ad: 'İngiltere', ulkeler: 'Londra, Edinburgh, Manchester',
    evrak: ['Pasaport ve eski pasaportlar', 'Çevrimiçi başvuru formu', 'Gelir ve banka belgeleri', 'Çalışma ya da öğrenim belgesi', 'Konaklama ve seyahat planı'] },
  { id: 'abd', ad: 'ABD', ulkeler: 'New York ve diğer şehirler',
    evrak: ['Pasaport', 'Çevrimiçi başvuru formu ve fotoğraf', 'Mülakat randevusu', 'Gelir, iş ve aile bağlarını gösteren belgeler', 'Seyahat amacını anlatan belgeler'] },
]
export const VIZE_NOT = 'Bu listeler genel bilgidir; konsolosluklar istenen belgeleri değiştirebilir. Başvurudan önce güncel listeyi birlikte kontrol ediyoruz.'

export const VIZE_ADIMLARI = [
  ['Ön görüşme', 'Nereye, ne zaman ve ne amaçla gideceğinizi konuşuyoruz.'],
  ['Evrak listesi', 'Size özel listeyi yazılı olarak veriyoruz.'],
  ['Randevu ve sigorta', 'Randevuyu alıyor, sağlık sigortanızı aynı gün düzenliyoruz.'],
  ['Dosya kontrolü', 'Başvurudan önce her belgeyi tek tek kontrol ediyoruz.'],
]

export const KURUMSAL = [
  ['Kongre ve toplantı', 'Salon seçimi, katılımcıların konaklaması, havalimanı karşılama, kayıt masası ve gala yemeği.'],
  ['Kurum seyahatleri', 'Personelinizin uçak ve otel işlerini tek elden yürütür, aylık toplu fatura keseriz.'],
  ['Protokol transferi', 'Lüks sedan ve VIP minibüslerle, takvimi bilen şoförlerle.'],
  ['Okul ve dernek gezileri', 'Günübirlik ya da konaklamalı, grubun büyüklüğüne göre araç ve rehber.'],
]

export const SAYILAR = [ // TEYİT: firmadan alınacak
  [String(new Date().getFullYear() - 1995), 'yıllık deneyim'],
  ['7', 'araçlık filo'],
  ['27', 'kişiye kadar tek araç'],
]

export const SSS = [
  ['Fiyatı nasıl öğrenirim?', 'Sayfanın başındaki bilete gideceğiniz yeri ve tarihi yazın ya da bizi arayın. Aynı gün içinde size fiyat söyleriz.'],
  ['Ödemeyi nasıl yaparım?', 'Ofisimizde kartla ya da havaleyle ödeyebilirsiniz. Kurumlara fatura kesilir.'],
  ['Biletimi değiştirmem gerekirse?', 'Bizi aramanız yeter. Havayolunun kurallarına göre değişikliği biz yaparız, size ayrıca uğraş çıkmaz.'],
  ['Vize başvurusunda neleri siz yapıyorsunuz?', 'Evrak listesini hazırlarız, randevuyu alırız, sigortayı düzenleriz ve dosyanızı kontrol ederiz. Görüşmeye siz gidersiniz.'],
  ['Şirketler için çalışıyor musunuz?', '1995’ten beri kurumların uçak, otel, transfer ve kongre işlerini yürütüyoruz. Aylık toplu fatura mümkün.'],
]
