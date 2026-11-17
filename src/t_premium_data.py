"""Premium tur verisi. Panelden değiştirilebilir; bu dosya varsayılan içeriktir.
TEST: süreler ve 'dahil' etiketleri örnektir, fiyat alanları boştur (panelden girilir)."""

CATN = {"yurtici": "Yurt içi", "deniz": "Deniz", "yurtdisi": "Yurt dışı"}
TEST_NOTE = "Süre ve dahil bilgileri örnektir."

TOURS = [
 dict(id="balon", cat="yurtici", icon="balloon", img="kapadokya.svg", loc="Göreme, Nevşehir", title="Kapadokya balon turu",
      inc=["Ankara çıkışlı", "Balon uçuşu", "Otel"], badge="Bahar tarihleri açık", price="", on=True, href="/kapadokya-balon-turu/"),
 dict(id="mavi", cat="deniz", icon="boat", img="mavi-yolculuk.svg", loc="Bodrum, Marmaris, Fethiye", title="Mavi yolculuk",
      inc=["Gulet ya da yat", "Tam pansiyon"], badge="Erken rezervasyon", price="", on=True, href="/mavi-yolculuk/"),
 dict(id="akdeniz", cat="deniz", icon="sun", img="akdeniz.svg", loc="Antalya, Bodrum, Fethiye", title="Akdeniz ve Ege tatili",
      inc=["Uçak", "Otel", "Transfer"], badge="", price="", on=True),
 dict(id="karadeniz", cat="yurtici", icon="mountain", img="karadeniz.svg", loc="Trabzon, Rize, Artvin", title="Karadeniz yayla turu",
      inc=["Ankara çıkışlı", "Rehber"], badge="", price="", on=True),
 dict(id="istanbul", cat="yurtici", icon="bridge", img="istanbul.svg", loc="İstanbul", title="İstanbul ve Boğaz turu",
      inc=["Özel tekne", "Otel"], badge="", price="", on=True),
 dict(id="kibris", cat="yurtdisi", icon="plane", img="kibris.svg", loc="Girne, Kıbrıs", title="Kıbrıs tatili",
      inc=["Uçak", "Otel", "Transfer"], badge="", price="", on=True),
 dict(id="sehir", cat="yurtdisi", icon="globe", img="sehir.svg", loc="Londra, Paris, Prag", title="Avrupa şehir gezileri",
      inc=["Uçak", "Otel", "Vize desteği"], badge="", price="", on=True),
 dict(id="gunubirlik", cat="yurtici", icon="van", img="yol.svg", loc="Ankara çevresi", title="Ankara çıkışlı günübirlik turlar",
      inc=["Kendi aracımızla", "Okul ve kurum grupları"], badge="", price="", on=True),
]

VISA = {
    "schengen": {"t": "Schengen vizesi için genellikle istenenler", "items": [
        "Geçerlilik süresi yeterli pasaport ve eski pasaportlar", "Biyometrik fotoğraf", "Seyahat sağlık sigortası",
        "Son aylara ait banka hesap dökümü", "Çalıştığınız yerden yazı ya da öğrenci belgesi", "Uçak ve otel rezervasyonu"]},
    "ingiltere": {"t": "İngiltere vizesi için genellikle istenenler", "items": [
        "Pasaport ve eski pasaportlar", "Çevrimiçi başvuru formu", "Gelir ve banka belgeleri", "Çalışma ya da öğrenim belgesi", "Konaklama ve seyahat planı"]},
    "abd": {"t": "ABD vizesi için genellikle istenenler", "items": [
        "Pasaport", "Çevrimiçi başvuru formu ve fotoğraf", "Mülakat randevusu", "Gelir, iş ve aile bağlarını gösteren belgeler", "Seyahat amacını anlatan belgeler"]},
}
