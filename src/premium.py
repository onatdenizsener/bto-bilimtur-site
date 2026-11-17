import json
from parts import *
from parts import _I
from data import TOURS, CATS, FLEET, SERVICES, CITIES
from kurumsal import phead, cta

NAV = [("Turlar", "#/turlar"), ("Araç kiralama", "#/arac-kiralama"), ("Transfer", "#/transfer"),
       ("Uçak ve otel", "#/ucak-otel"), ("Vize", "#/vize-sigorta"), ("Kurumsal", "#/kurumsal"), ("İletişim", "#/iletisim")]
LINKS = dict(ucak="#/ucak-otel", otel="#/ucak-otel", vize="#/vize-sigorta", transfer="#/transfer",
             arac="#/arac-kiralama", balon="#/kapadokya", mavi="#/mavi-yolculuk", tur="#/turlar", kurum="#/kurumsal")

DEFAULT = {
    "announce": {"on": True, "text": "Kapadokya balon turlarında bahar dönemi tarihleri açıklandı."},
    "tours": [dict(t, on=True, badge=("Bahar tarihleri açık" if t["id"] == "balon" else "")) for t in TOURS],
    "leads": [],
}
ICONS = {k: ico(k, "") for k in _I}

# Genel örnek listeler: konsolosluğa göre değişir, BTO teyit etmeli
VISA = {
    "schengen": {"t": "Schengen vizesi için genellikle istenenler", "items": [
        "Geçerlilik süresi yeterli pasaport ve eski pasaportlar", "Biyometrik fotoğraf", "Seyahat sağlık sigortası",
        "Son aylara ait banka hesap dökümü", "Çalıştığınız yerden yazı ya da öğrenci belgesi", "Uçak ve otel rezervasyonu"]},
    "ingiltere": {"t": "İngiltere vizesi için genellikle istenenler", "items": [
        "Pasaport ve eski pasaportlar", "Çevrimiçi başvuru formu", "Gelir ve banka belgeleri",
        "Çalışma ya da öğrenim belgesi", "Konaklama ve seyahat planı"]},
    "abd": {"t": "ABD vizesi için genellikle istenenler", "items": [
        "Pasaport", "Çevrimiçi başvuru formu ve fotoğraf", "Mülakat randevusu",
        "Gelir, iş ve aile bağlarını gösteren belgeler", "Seyahat amacını anlatan belgeler"]},
}


def balloons():
    def b(cls, x, y, s, c):
        return (f'<svg class="{cls}" style="left:{x}%;top:{y}px;width:{s}px" viewBox="-28 -2 56 72" aria-hidden="true">'
                f'<path d="M0,0 C-22,0 -26,26 -14,40 L-6,50 L6,50 L14,40 C26,26 22,0 0,0Z" fill="{c}" stroke="#fff" stroke-width="1.5"/>'
                '<path d="M0,0 C-8,0 -10,26 -5,40 M0,0 C8,0 10,26 5,40" fill="none" stroke="#fff" stroke-width="1.2" opacity=".7"/>'
                '<path d="M-6,50 L-5,58 M6,50 L5,58" stroke="#fff" stroke-width="1.2"/><rect x="-6" y="58" width="12" height="9" rx="2" fill="#c98b52"/></svg>')
    chimneys = ('<svg style="left:0;right:0;bottom:0;width:100%" viewBox="0 0 400 80" preserveAspectRatio="none" aria-hidden="true">'
                '<path d="M0 80 L0 55 Q20 50 30 30 Q36 18 42 30 Q50 48 70 50 L90 52 Q100 28 106 20 Q112 28 118 52 L160 56 '
                'Q175 40 182 34 Q190 40 198 58 L240 60 Q255 36 262 26 Q270 36 276 60 L320 58 Q335 44 340 38 Q348 44 354 58 L400 56 L400 80Z" fill="#24365f"/></svg>')
    return ('<div class="sky-art">' + b("b1", 12, 30, 90, "#F2A900") + b("b2", 55, 0, 64, "#0F7C80")
            + b("b3", 78, 70, 48, "#E35D3A") + chimneys + '</div>')


def boat():
    return ('<div class="sky-art"><svg style="left:10%;top:30px;width:80%" viewBox="0 0 300 220" aria-hidden="true">'
            '<path d="M150 20 V150 M150 28 L230 140 H150 M150 40 L90 140 H150" fill="none" stroke="#fff" stroke-width="3" stroke-linejoin="round"/>'
            '<path d="M150 28 L230 140 H150Z" fill="#F2A900" opacity=".9"/><path d="M150 40 L90 140 H150Z" fill="#fff" opacity=".9"/>'
            '<path d="M60 152 H250 L228 182 H82Z" fill="#fff"/>'
            '<g class="waves" fill="none" stroke="#0F7C80" stroke-width="4" stroke-linecap="round">'
            '<path d="M10 196 q20 -12 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0"/>'
            '<path d="M-10 212 q20 -12 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" opacity=".6"/></g></svg></div>')


def chips(for_id, items):
    return (f'<div class="chips" data-for="{for_id}" role="group" aria-label="Filtre">'
            + "".join(f'<button type="button" data-cat="{k}" aria-pressed="{str(i == 0).lower()}">{v}</button>' for i, (k, v) in enumerate(items))
            + "</div>")


def page(key, title, body):
    return f'<div data-page="{key}" data-title="{title}">{body}</div>'


def sec(inner, sky=False, id_=""):
    return f'<section class="sec{" sec-sky" if sky else ""}"{f" id={id_!r}" if id_ else ""}><div class="wrap">{inner}</div></section>'


def head2(h, p):
    return f'<div class="sec-head"><h2 class="reveal">{h}</h2><p class="lead">{p}</p></div>'


def detail_hero(crumb, h1, lead, art):
    return (f'<section class="detail-hero"><div class="wrap"><div><div class="crumb"><a href="#/">Anasayfa</a> / <a href="#/turlar">Turlar</a> / {crumb}</div>'
            f'<h1>{h1}</h1><p class="lead">{lead}</p>{call_buttons(sun=True)}</div>{art}</div></section>')


def field(label, name, type_="text", ph="", req=False):
    return (f'<label class="field"><span>{label}</span><input name="{name}" type="{type_}"'
            f'{f" placeholder={ph!r}" if ph else ""}{" required" if req else ""}></label>')


def build():
    home = page("home", "", f"""
<section class="hero hero-p"><div class="wrap">
<div><span class="since">1995'ten beri Ankara'da</span>
<h1>Ankara'dan yola çıkan her yolculuk, tek telefonla.</h1>
<p class="lead">Uçak bileti, otel, havalimanı transferi, kiralık araç ve turlar. Nereye gitmek istediğinizi söyleyin, gerisini biz ayarlayalım.</p>
{call_buttons()}
<div class="stats"><div><b>1995</b><span>kuruluş</span></div><div><b>7 araç</b><span>kendi filomuz</span></div><div><b>27 kişi</b><span>tek araçta grup</span></div></div>
</div>
<div class="hero-map">{route_svg()}</div>
</div></section>
{sec(head2("Yolculuğun her adımında yanınızdayız", "Gitmeden önceki hazırlıktan döndüğünüz ana kadar, ihtiyacınız olan her şey tek yerde.") + journey(LINKS))}
{sec(head2("Bu sezon öne çıkanlar", 'Tüm turları görmek için <a href="#/turlar">Turlar</a> sayfasına bakın.') + '<div class="tours" id="featured"></div>', sky=True)}
{sec(head2("Üç adımda yoldasınız", "Formlarla, bekleme müziğiyle uğraşmazsınız.") + steps())}
{why()}
{cta()}""")

    turlar = page("turlar", "Turlar", phead("Turlar", "Grup turuna katılın ya da tarihi ve rotayı siz seçin. Ankara'dan ulaşım her pakette ayarlanır.", "Turlar")
                  + sec(chips("tourgrid", CATS) + '<div class="tours" id="tourgrid"></div>')
                  + sec('<div class="split"><div><h2 class="reveal">Yurt dışında otel arıyorsanız</h2><p class="lead">Avrupa\'dan Amerika\'ya anlaşmalı otellerimizde indirimli fiyat alırız.</p>'
                        f'<a class="btn btn-call" href="#/ucak-otel">Uçak ve otel isteyin</a></div><ul class="cities">{"".join(f"<li>{c}</li>" for c in CITIES)}</ul></div>', sky=True))

    kapadokya = page("kapadokya", "Kapadokya balon turu", detail_hero(
        "Kapadokya", "Kapadokya balon turu", "Gün doğarken peri bacalarının üzerinde. Ankara'dan çıkış, otel ve balon uçuşu tek pakette.", balloons())
        + sec('<div class="split"><div>' + head2("Örnek program", "Tarihe ve pakete göre değişir, size uygun olanı birlikte seçeriz.").replace('class="sec-head"', 'class="sec-head" style="grid-template-columns:1fr"')
              + '<ol class="timeline"><li><b>Ankara\'dan hareket</b><span>Belirlenen noktadan kendi aracımızla yola çıkış.</span></li>'
              '<li><b>Otele yerleşme</b><span>Mağara otel ya da standart otel, tercihinize göre.</span></li>'
              '<li><b>Gün doğumunda balon uçuşu</b><span>Otelden kalkış alanına transfer, yaklaşık bir saatlik uçuş.</span></li>'
              '<li><b>Vadiler ve yer altı şehri</b><span>Kahvaltının ardından rehberli gezi.</span></li>'
              '<li><b>Ankara\'ya dönüş</b><span>Akşam saatlerinde Ankara\'dasınız.</span></li></ol>'
              '<p class="note">Balon uçuşları hava koşullarına bağlıdır. Uçuş iptal olursa seçenekleri önceden konuşuruz.</p></div>'
              + form_box("Tarih ve fiyat sorun", "Kaç kişi ve hangi tarihler, yazmanız yeterli.", ["Kapadokya balon turu"],
                         extra='<div class="row2">' + field("Tarih", "tarih", "date") + field("Kişi sayısı", "kisi", "number", "2") + '</div>',
                         cta="Fiyat isteyin", ph="Örneğin: mağara otel olsun, cumartesi dönüş") + '</div>'))

    mavi = page("mavi-yolculuk", "Mavi yolculuk", detail_hero(
        "Mavi yolculuk", "Mavi yolculuk", "Bodrum, Marmaris ve Fethiye koylarında gulet ya da yatla bir hafta. Kabin kiralayın ya da tekneyi tümüyle tutun.", boat())
        + sec(head2("Gulet mi, yat mı?", "İkisi de güzel, kime uygun olduğu farklı.")
              + '<table class="compare"><thead><tr><th></th><th>Gulet</th><th>Yat</th></tr></thead><tbody>'
              '<tr><th>Kime uygun</th><td>Kalabalık aileler, arkadaş grupları</td><td>Çiftler ve küçük aileler</td></tr>'
              '<tr><th>Kiralama</th><td>Kabin ya da tüm tekne</td><td>Genellikle tüm tekne</td></tr>'
              '<tr><th>Mürettebat</th><td>Kaptan, aşçı ve yardımcı</td><td>Kaptanlı ya da kaptansız</td></tr>'
              '<tr><th>Tempo</th><td>Sakin, uzun koy molaları</td><td>Daha hızlı, daha çok koy</td></tr></tbody></table>')
        + sec(head2("Rotalar", "En çok tercih edilen üç rota.")
              + '<div class="routes"><div class="route-c"><h3>Bodrum ve Gökova</h3><p>Sessiz koylar, çam ormanları, Sedir Adası.</p></div>'
              '<div class="route-c"><h3>Marmaris ve Hisarönü</h3><p>Selimiye, Bozburun ve berrak koylar.</p></div>'
              '<div class="route-c"><h3>Fethiye ve Göcek</h3><p>On iki adalar ve kumsallar.</p></div></div>', sky=True)
        + sec('<div class="contact">' + form_box("Mavi yolculuk planlayalım", "Tarih, kişi sayısı ve tekne tercihi yeterli.", ["Gulet, kabin", "Gulet, tüm tekne", "Yat", "Henüz karar vermedim"],
              extra='<div class="row2">' + field("Tarih", "tarih", "date") + field("Kişi sayısı", "kisi", "number", "6") + '</div>', cta="Teklif isteyin", ph="Örneğin: Temmuz ikinci hafta, Göcek'ten çıkış")
              + '<div><h2 class="reveal">Tekneyi biz seçelim</h2><p class="lead">Kişi sayınıza ve bütçenize uygun tekneleri karşılaştırıp size iki üç seçenek gönderelim. Ankara\'dan uçak ve havalimanı transferi de bizden.</p></div></div>'))

    fcat = lambda s: "kucuk" if s <= 4 else ("grup" if s <= 16 else "buyuk")
    vehs = "".join(f'<div class="veh-c" data-cat="{fcat(s)}">{ico(i, "")}<h3>{n}</h3><div class="meta">{t} &nbsp;|&nbsp; {u}</div>'
                   f'<div class="cap">{s} yolcu</div><a class="btn btn-wa" href="#/iletisim">Fiyat sor</a></div>' for n, t, s, i, u in FLEET)
    arac = page("arac-kiralama", "Araç kiralama", phead("Araç kiralama", "Şoförlü ya da şoförsüz. Tek kişilik iş seyahatinden 27 kişilik gruba kadar kendi filomuz.", "Araç kiralama")
                + sec(chips("fleetgrid", [("hepsi", "Hepsi"), ("kucuk", "1–4 kişi"), ("grup", "5–16 kişi"), ("buyuk", "17 kişi ve üstü")]) + f'<div class="fleet-grid" id="fleetgrid">{vehs}</div>')
                + sec('<div class="contact">' + form_box("Araç kiralayın", "Tarih aralığı ve şoför isteyip istemediğiniz yeterli.", ["Şoförlü kiralama", "Şoförsüz kiralama", "Uzun dönem kiralama"],
                      extra='<div class="row2">' + field("Alış tarihi", "alis", "date") + field("Dönüş tarihi", "donus", "date") + '</div>', cta="Fiyat isteyin", ph="Örneğin: Caravelle, şoförlü, 3 gün")
                      + '<div><h2 class="reveal">Kiralarken bilmeniz gerekenler</h2><ul class="checks"><li>Şoförsüz kiralamada ehliyet ve kimlik</li><li>Aracı adresinize getirebiliriz</li><li>Şehirlerarası yolculuklara uygun</li><li>Kurumlara aylık kiralama</li></ul></div></div>', sky=True))

    transfer = page("transfer", "Havalimanı transferi", phead("Havalimanı transferi", "Esenboğa'dan ya da Esenboğa'ya. Uçuşunuzu takip ederiz, rötar olursa şoförümüz bekler.", "Transfer")
                    + sec('<div class="contact">' + form_box("Transfer fiyatı alın", "Uçuş saatiniz ve adresiniz yeterli.", ["Esenboğa'dan adrese", "Adresten Esenboğa'ya", "Gidiş ve dönüş", "Grup transferi"],
                          extra='<div class="row2">' + field("Uçuş tarihi", "tarih", "date") + field("Uçuş saati", "saat", "time") + '</div><div class="row2">'
                          + field("Uçuş numarası", "ucus", "text", "TK 2140") + field("Kişi sayısı", "kisi", "number", "2") + '</div>',
                          cta="Fiyat isteyin", ph="Adres: Çankaya, Ankara. 2 büyük valiz.")
                          + '<div><h2 class="reveal">Sizi nasıl karşılıyoruz?</h2><ol class="timeline"><li><b>Uçuşunuzu takip ederiz</b><span>İniş saati değişirse şoförümüz haberdar olur.</span></li>'
                          '<li><b>Çıkışta karşılarız</b><span>Şoförümüz sizi adınızla karşılar, valizlerinize yardım eder.</span></li>'
                          '<li><b>Kapınıza bırakırız</b><span>Ankara içi her adrese, şehirlerarası da olur.</span></li></ol></div></div>'))

    ucak = page("ucak-otel", "Uçak ve otel", phead("Uçak bileti ve otel", "Fiyat karşılaştırmayla uğraşmayın. Tarih ve bütçenizi söyleyin, en uygun seçenekleri gönderelim.", "Uçak ve otel")
                + sec('<div class="contact">' + form_box("Bilet ve otel isteyin", "Nereden nereye ve hangi tarihler.", ["Uçak bileti", "Otel", "Uçak ve otel birlikte"],
                      extra='<div class="row2">' + field("Nereden", "nereden", "text", "Ankara") + field("Nereye", "nereye", "text", "Paris") + '</div><div class="row2">'
                      + field("Gidiş", "gidis", "date") + field("Dönüş", "donus", "date") + '</div>', cta="Seçenekleri gönderin", ph="Örneğin: 2 yetişkin 1 çocuk, merkezi otel")
                      + '<div><h2 class="reveal">Yurt dışında anlaşmalı otellerimiz</h2><p class="lead">Bu şehirlerde indirimli fiyat alıyoruz. Listede olmayan bir yer için de sorun.</p>'
                      f'<ul class="cities">{"".join(f"<li>{c}</li>" for c in CITIES)}</ul></div></div>'))

    vbtn = "".join(f'<button type="button" data-visa="{k}" aria-pressed="false">{v}</button>' for k, v in [("schengen", "Avrupa (Schengen)"), ("ingiltere", "İngiltere"), ("abd", "Amerika")])
    vize = page("vize-sigorta", "Vize ve sigorta", phead("Pasaport, vize ve sigorta", "Evrak listesini çıkarır, randevuyu alır, dosyanızı eksiksiz hazırlarız.", "Vize ve sigorta")
                + sec(head2("Nereye gidiyorsunuz?", "Ülkeyi seçin, genellikle istenen belgeleri görün.")
                      + f'<div class="visa"><div class="chips" role="group" aria-label="Ülke">{vbtn}</div><div class="visa-list"><h3 id="visa-title"></h3><ul class="checks" id="visa-items"></ul>'
                      '<p class="note">Bu liste genel bilgi içindir. Konsolosluklar listeyi değiştirebilir, başvurudan önce güncel listeyi birlikte kontrol ederiz.</p></div></div>')
                + sec('<div class="contact">' + form_box("Vize başvurunuzu birlikte hazırlayalım", "Ülke ve seyahat tarihinizi yazın.", ["Schengen vizesi", "İngiltere vizesi", "Amerika vizesi", "Başka bir ülke", "Pasaport işlemi", "Seyahat sağlık sigortası"],
                      cta="Beni arayın", ph="Örneğin: Mayıs'ta İtalya, ilk başvuru")
                      + '<div><h2 class="reveal">Seyahat sağlık sigortası</h2><p class="lead">Vize başvurusunda istenen poliçeyi aynı gün düzenleriz. Vize ile birlikte alırsanız ayrıca uğraşmazsınız.</p></div></div>', sky=True))

    svc = "".join(f'<article>{ico(i, "")}<div><h3>{t}</h3><p>{d}</p></div></article>' for i, t, d in SERVICES if i in ("people", "book", "van", "bed"))
    kurumsal = page("kurumsal", "Kurumsal", phead("Kurumlar için", "Kongre, toplantı, eğitim ve personel ulaşımı. Tek muhatap, tek fatura.", "Kurumsal")
                    + sec(f'<div class="svc">{svc}</div>')
                    + sec('<div class="contact">' + form_box("Kurumsal teklif isteyin", "Etkinliğinizi kısaca anlatın, size özel teklif hazırlayalım.", ["Kongre", "Toplantı ya da seminer", "Personel gezisi", "Personel servisi", "Misafir karşılama"],
                          extra='<div class="row2">' + field("Kurum adı", "kurum", "text") + field("Katılımcı sayısı", "kisi", "number", "120") + '</div>', cta="Teklif isteyin", ph="Örneğin: Nisan'da 2 günlük kongre, 3 ilden katılımcı")
                          + '<div><h2 class="reveal">Neden kurumlar bizi seçiyor?</h2><ul class="checks"><li>Ulaşım, konaklama ve salon tek elden</li><li>Kendi araçlarımızla katılımcı transferi</li><li>Kayıt ve karşılama masası</li><li>30 yılı aşkın organizasyon deneyimi</li></ul></div></div>', sky=True))

    iletisim = page("iletisim", "İletişim", phead("Hakkımızda ve iletişim", "1995'ten beri Ankara'dan yola çıkan yolcuların yanındayız.", "İletişim")
                    + sec('<div class="split"><div><h2 class="reveal">BTO Bilimtur kimdir?</h2>'
                          '<p>BTO Bilimtur Turizm Organizasyon Transfer, 1995 yılında Ankara\'da kuruldu. Uçak bileti ve otelle başlayan işimiz bugün turları, havalimanı transferini, araç kiralamayı, vize işlemlerini ve kongre organizasyonlarını kapsıyor.</p>'
                          '<p>Değişmeyen tek şey çalışma şeklimiz: yolcuyu bir kez dinlemek, işi baştan sona üstlenmek ve yolculuk bitene kadar ulaşılabilir olmak.</p></div>'
                          '<div><div class="why" style="grid-template-columns:1fr"><div><div class="big" style="color:var(--teal)">30+</div><p class="lead">yıldır Ankara\'da</p></div></div></div></div>')
                    + sec(head2("Bize ulaşın", "Arayın, yazın ya da formu doldurun. Size aynı gün dönüyoruz.") + contact(), sky=True))

    panel = page("panel", "Yönetim paneli", f"""<div class="panel-wrap"><div class="panel">
<aside><h2>Yönetim paneli</h2>
<button type="button" data-tab="duyuru">{ico("edit", "")}Duyuru şeridi</button>
<button type="button" data-tab="turlar">{ico("balloon", "")}Turlar</button>
<button type="button" data-tab="talepler">{ico("inbox", "")}Gelen talepler <span class="count" id="lead-count" hidden>0</span></button>
<button type="button" onclick="location.hash='#/'">{ico("globe", "")}Siteye dön</button>
</aside>
<main>
<p class="note" style="margin:0 0 20px">Bu bir önizlemedir. Gerçek panelde şifreyle giriş yapılır ve değişiklikler herkese yansır. Burada sadece sizin tarayıcınızda saklanır.</p>
<section class="panel-tab" id="pt-duyuru"><h3>Duyuru şeridi</h3><p class="lead" style="font-size:1rem">Sitenin en üstündeki kısa duyuru. Kampanya ya da tatil dönemi çalışma saatleri için kullanın.</p>
<div class="pcard"><label class="switch"><input type="checkbox" id="an-on"> Şeridi göster</label>
<label class="field" style="margin-top:16px"><span>Duyuru metni</span><input id="an-text" maxlength="120"></label>
<button class="btn btn-call" id="an-save" type="button">Kaydet</button></div></section>
<section class="panel-tab" id="pt-turlar" hidden><h3>Turlar</h3><p class="lead" style="font-size:1rem">Adı değiştirin, kampanya etiketi ekleyin ya da turu yayından kaldırın.</p>
<table class="ptable"><thead><tr><th>Tur adı</th><th>Tür</th><th>Kampanya etiketi</th><th>Durum</th><th></th></tr></thead><tbody id="pt-rows"></tbody></table>
<div class="psave"><button class="btn btn-call" id="p-save" type="button">Değişiklikleri kaydet</button><button class="btn btn-wa" id="p-reset" type="button">Örnek içeriğe dön</button></div>
<div class="pcard" style="margin-top:28px"><h3 style="font-size:1.15rem">Yeni tur ekle</h3>
<form id="add-tour"><div class="row2"><label class="field"><span>Tur adı</span><input name="title" required placeholder="Örn: Pamukkale ve Salda"></label>
<label class="field"><span>Tür</span><select name="cat"><option value="yurtici">Yurt içi</option><option value="deniz">Deniz</option><option value="yurtdisi">Yurt dışı</option></select></label></div>
<label class="field"><span>Kısa açıklama</span><input name="text" required maxlength="160" placeholder="Bir iki cümle yeterli"></label>
<label class="field"><span>Simge</span><select name="icon"><option value="mountain">Dağ</option><option value="sun">Güneş</option><option value="boat">Tekne</option><option value="plane">Uçak</option><option value="globe">Dünya</option><option value="balloon">Balon</option><option value="bridge">Köprü</option></select></label>
<button class="btn btn-call" type="submit">Turu ekle</button></form></div></section>
<section class="panel-tab" id="pt-talepler" hidden><h3>Gelen talepler</h3><p class="lead" style="font-size:1rem">Sitedeki formlardan gelen istekler. Aradığınız kişiyi işaretleyin.</p>
<div class="pcard" id="leads"></div></section>
</main></div></div>""")

    data_js = (f"window.BTO_DEFAULT={json.dumps(DEFAULT, ensure_ascii=False)};"
               f"window.BTO_ICONS={json.dumps(ICONS, ensure_ascii=False)};"
               f"window.BTO_VISA={json.dumps(VISA, ensure_ascii=False)};")
    return (head("BTO Bilimtur", (SRC / "multi.css").read_text() + (SRC / "premium.css").read_text())
            + '<div class="announce" id="announce" hidden></div>'
            + header([("Anasayfa", "#/")] + NAV, multipage=True).replace('<a href="#/">Anasayfa</a>', '')
            + "<main>" + home + turlar + kapadokya + mavi + arac + transfer + ucak + vize + kurumsal + iletisim + panel + "</main>"
            + footer('<p><a href="#/panel">Yönetim paneli (önizleme)</a></p>')
            + '<div class="toast" id="toast" role="status" aria-live="polite"></div>'
            + script(data_js + (SRC / "router.js").read_text() + (SRC / "premium.js").read_text()))
