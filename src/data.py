TOURS = [
 dict(id="balon", icon="balloon", cat="yurtici", title="Kapadokya balon turu",
      text="Gün doğarken Göreme vadilerinin üzerinde süzülün. Ankara'dan ulaşım, konaklama ve uçuş tek pakette."),
 dict(id="mavi", icon="boat", cat="deniz", title="Mavi yolculuk",
      text="Gulet ya da yatla Bodrum, Marmaris ve Fethiye koyları. Kabin kiralayın ya da tekneyi ailenizle tutun."),
 dict(id="akdeniz", icon="sun", cat="deniz", title="Akdeniz ve Ege tatili",
      text="Antalya, Bodrum, Marmaris ve Fethiye'de otel, uçak ve transfer birlikte ayarlanır."),
 dict(id="karadeniz", icon="mountain", cat="yurtici", title="Karadeniz turu",
      text="Yaylalar, göller ve yeşilin her tonu. Grup turlarına katılın ya da size özel program yapalım."),
 dict(id="istanbul", icon="bridge", cat="yurtici", title="İstanbul ve Boğaz turu",
      text="Size özel tekneyle Boğaz'da bir akşam. Otel ve Ankara'dan ulaşım dahil."),
 dict(id="kibris", icon="plane", cat="yurtdisi", title="Kıbrıs",
      text="Uçak, otel ve havalimanı transferi hazır. Siz sadece bavulunuzu hazırlayın."),
 dict(id="sehir", icon="globe", cat="yurtdisi", title="Yurt dışı şehir gezileri",
      text="Londra, Paris, Barcelona, Prag, Milano ve İskandinavya. Otel, bilet ve vize birlikte."),
 dict(id="gunubirlik", icon="van", cat="yurtici", title="Ankara çıkışlı günübirlik turlar",
      text="Sabah çıkıp akşam dönün. Okul, dernek ve şirket grupları için de düzenliyoruz."),
]

CATS = [("hepsi", "Hepsi"), ("yurtici", "Yurt içi"), ("deniz", "Deniz"), ("yurtdisi", "Yurt dışı")]

# Kapasiteler model özelliklerine göre yazıldı: TEYİT
FLEET = [
 ("Audi A6", "Lüks sedan", 4, "car", "Protokol ve iş seyahatleri"),
 ("Toyota Corolla", "Sedan", 4, "car", "Şehir içi ve şehirlerarası"),
 ("Renault Fluence", "Sedan", 4, "car", "Uygun fiyatlı, geniş bagaj"),
 ("Renault Clio", "Ekonomik", 4, "car", "Şehir içi için pratik"),
 ("Volkswagen Caravelle", "VIP minibüs", 8, "van", "Aileler ve küçük gruplar"),
 ("Volkswagen Crafter", "Minibüs", 16, "van", "Ekip ve okul transferleri"),
 ("Isuzu Novo Lux", "Midibüs", 27, "van", "Kongre ve kalabalık gruplar"),
]

SERVICES = [
 ("plane", "Uçak bileti", "Yurt içi ve yurt dışı tüm havayolları. Aktarmalı uçuşları, bagaj ve koltuk seçimini sizin yerinize takip ederiz."),
 ("bed", "Otel rezervasyonu", "Türkiye'nin her yerinde ve Avrupa'dan Amerika'ya kadar anlaşmalı otellerde indirimli konaklama."),
 ("passport", "Pasaport ve vize", "Evrak listesi, randevu ve dosya hazırlığı. Başvurunuz eksik evrak yüzünden geri dönmez."),
 ("shield", "Seyahat sağlık sigortası", "Vize başvurusu için gereken poliçeyi aynı gün düzenleriz."),
 ("people", "Kongre organizasyonu", "Salon, konaklama, katılımcı transferi ve kayıt masası. Hepsi tek ekipten."),
 ("book", "Eğitim ve danışmanlık", "Kurumlara seyahat politikası ve toplu seyahat planlamasında destek."),
 ("van", "Taşımacılık", "Personel servisi, okul gezisi ve etkinlik transferi için şoförlü araç."),
 ("balloon", "Size özel tur", "Tarihi, bütçeyi ve rotayı siz belirleyin, programı biz hazırlayalım."),
]

CITIES = ["Londra", "Paris", "Barcelona", "Prag", "Milano", "Brüksel", "Amsterdam", "Lüksemburg", "Stockholm", "Oslo", "Kopenhag", "New York"]
