// TÜM İÇERİK BURADA. Metni değiştir, push'la, 1 dakika sonra sitede.
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

// Bilet formundaki sekmeler
export const TALEP_TURLERI = [
  { id: 'ucak', ad: 'Uçak bileti', alanlar: ['nereden', 'nereye', 'tarih', 'kisi'] },
  { id: 'transfer', ad: 'Havalimanı transferi', alanlar: ['nereden', 'nereye', 'tarih', 'kisi'] },
  { id: 'arac', ad: 'Şoförlü araç', alanlar: ['nereden', 'tarih', 'kisi'] },
  { id: 'tur', ad: 'Tur ve tatil', alanlar: ['nereye', 'tarih', 'kisi'] },
]

export const HIZMETLER = [
  { ikon: 'ucak', ad: 'Uçak bileti', metin: 'Yurt içi ve yurt dışı bütün havayolları. Aktarmayı, bagajı ve koltuğu sizin yerinize takip ederiz.' },
  { ikon: 'yatak', ad: 'Otel', metin: 'Türkiye’nin her yerinde ve yurt dışında anlaşmalı otellerde konaklama.' },
  { ikon: 'pasaport', ad: 'Pasaport ve vize', metin: 'Evrak listesi, randevu ve dosya hazırlığı. Başvurunuz eksik evrak yüzünden geri dönmez.' },
  { ikon: 'kalkan', ad: 'Seyahat sağlık sigortası', metin: 'Vize başvurusunda istenen poliçeyi aynı gün hazırlarız.' },
  { ikon: 'insanlar', ad: 'Kongre ve toplantı', metin: 'Salon, konaklama, katılımcı transferi ve kayıt masası tek ekipten.' },
  { ikon: 'minibus', ad: 'Taşımacılık', metin: 'Personel servisi, okul gezisi ve etkinlikler için şoförlü araç.' },
  { ikon: 'kitap', ad: 'Eğitim ve danışmanlık', metin: 'Kurumlara toplu seyahat planı ve seyahat kuralları konusunda destek.' },
  { ikon: 'balon', ad: 'Size özel tur', metin: 'Tarihi, bütçeyi ve rotayı siz söyleyin, programı biz hazırlayalım.' },
]

// TEYİT: tur programları ve süreleri örnek olarak yazıldı
export const TURLAR = [
  { id: 'kapadokya', kat: 'yurtici', ad: 'Kapadokya balon turu', sure: '2 gün', kalkis: 'Ankara',
    ozet: 'Gün doğarken Göreme vadilerinin üzerinde uçuş.',
    detay: ['Ankara’dan gidiş dönüş ulaşım', 'Bir gece konaklama ve kahvaltı', 'Sabah balon uçuşu ve otelden alış', 'Hava uçuşa uygun değilse ertesi güne aktarma ya da iade'] },
  { id: 'mavi', kat: 'deniz', ad: 'Mavi yolculuk', sure: '4–8 gün', kalkis: 'Bodrum · Marmaris · Fethiye',
    ozet: 'Gulet ya da yatla koy koy dolaşın.',
    detay: ['Kabin kiralama ya da teknenin tamamı', 'Tam pansiyon yemek', 'Rota sizinle birlikte seçilir', 'Ankara’dan uçak ve transfer eklenebilir'] },
  { id: 'akdeniz', kat: 'deniz', ad: 'Akdeniz ve Ege tatili', sure: 'Siz seçin', kalkis: 'Ankara',
    ozet: 'Antalya, Bodrum, Marmaris ve Fethiye’de otel, uçak ve transfer birlikte.',
    detay: ['Her bütçeye otel seçenekleri', 'Uçak bileti ve havalimanı transferi', 'Çocuklu aileler için uygun oteller'] },
  { id: 'karadeniz', kat: 'yurtici', ad: 'Karadeniz turu', sure: '5 gün', kalkis: 'Ankara',
    ozet: 'Yaylalar, göller ve yeşilin her tonu.',
    detay: ['Uzungöl, Ayder ve Sümela', 'Rehber eşliğinde', 'Grup turu ya da size özel program'] },
  { id: 'istanbul', kat: 'yurtici', ad: 'İstanbul ve Boğaz', sure: '2–3 gün', kalkis: 'Ankara',
    ozet: 'Size özel tekneyle Boğaz’da bir akşam.',
    detay: ['Ankara’dan hızlı tren ya da uçak', 'Otel', 'Özel tekne turu'] },
  { id: 'kibris', kat: 'yurtdisi', ad: 'Kıbrıs', sure: '3–7 gün', kalkis: 'Esenboğa',
    ozet: 'Uçak, otel ve transfer hazır. Siz bavulunuzu hazırlayın.',
    detay: ['Uçak bileti', 'Otel', 'Ercan havalimanından transfer'] },
  { id: 'avrupa', kat: 'yurtdisi', ad: 'Avrupa şehir gezileri', sure: '3–6 gün', kalkis: 'Esenboğa',
    ozet: 'Londra, Paris, Barcelona, Prag, Milano ve İskandinavya.',
    detay: ['Uçak ve otel', 'Vize dosyası hazırlığı', 'Müze ve şehir turu biletleri'] },
  { id: 'gunubirlik', kat: 'yurtici', ad: 'Ankara çıkışlı günübirlik', sure: '1 gün', kalkis: 'Ankara',
    ozet: 'Sabah çıkın, akşam dönün. Okul, dernek ve şirket grupları için.',
    detay: ['Beypazarı, Safranbolu, Gordion ve daha fazlası', 'Şoförlü araç ve rehber', 'Grup büyüklüğüne göre araç'] },
]

export const KATEGORILER = [
  ['hepsi', 'Hepsi'], ['yurtici', 'Yurt içi'], ['deniz', 'Deniz'], ['yurtdisi', 'Yurt dışı'],
]

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

// Gerçek bir sıra: numaralı gösteriliyor. TEYİT: rötar bekleme ve bebek koltuğu sözü
export const TRANSFER_ADIMLARI = [
  ['Uçuşunuzu yazın', 'Uçuş numarası ve kişi sayısı yeterli.'],
  ['Fiyatı hemen söyleriz', 'Telefonda ya da WhatsApp’tan, sabit fiyat.'],
  ['Şoför sizi karşılar', 'Esenboğa’da isminizin yazılı olduğu tabelayla. Uçak rötar yaparsa bekler.'],
  ['Kapınıza bırakır', 'Ankara’nın her ilçesine. İsterseniz bebek koltuğu hazır olur.'],
]

export const VIZE_SEHIRLERI = ['Londra', 'Paris', 'Barcelona', 'Prag', 'Milano', 'Brüksel', 'Amsterdam', 'Lüksemburg', 'Stockholm', 'Oslo', 'Kopenhag', 'New York']

export const SSS = [
  ['Fiyatı nasıl öğrenirim?', 'Yukarıdaki bilete gideceğiniz yeri ve tarihi yazın ya da bizi arayın. Aynı gün içinde size fiyat söyleriz.'],
  ['Ödemeyi nasıl yaparım?', 'Ofisimizde kartla ya da havaleyle ödeyebilirsiniz. Kurumlara fatura kesilir.'],
  ['Biletimi değiştirmem gerekirse?', 'Bizi aramanız yeter. Havayolunun kurallarına göre değişikliği biz yaparız, size ayrıca uğraş çıkmaz.'],
  ['Vize başvurusunda neleri siz yapıyorsunuz?', 'Evrak listesini hazırlarız, randevuyu alırız, sigortayı düzenleriz ve dosyanızı kontrol ederiz. Görüşmeye siz gidersiniz.'],
  ['Şirketler için çalışıyor musunuz?', '1995’ten beri kurumların uçak, otel, transfer ve kongre işlerini yürütüyoruz. Aylık toplu fatura mümkün.'],
]
