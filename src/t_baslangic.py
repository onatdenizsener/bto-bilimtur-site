"""Başlangıç: tek sayfa. Görsel kimlik: açık zemin, turkuaz + sarı, Ankara merkezli rota haritası."""
import pathlib
from parts import hero, journey, steps, why, faq, header, brand, ico, MAPBG, MAPS
from common import head, tail, lead_form, write_site, SRC, S, TEL, TEL_SHOW, MAIL, WA_URL

FONTS = "family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,550;12..96,650;12..96,750;12..96,800"
NAV = [("Hizmetler", "/#hizmetler"), ("Nasıl çalışır", "/#nasil"), ("Sorular", "/#sorular"), ("İletişim", "/#iletisim")]
TOPICS = ["Tur", "Uçak bileti", "Otel", "Havalimanı transferi", "Araç kiralama", "Vize / pasaport", "Kurumsal organizasyon"]


def contact():
    return f"""<div class="contact">
{lead_form("Sizi arayalım", "Bilgilerinizi bırakın, çalışma saatleri içinde aynı gün sizi arayalım.", TOPICS)}
<div>
<div class="mapcard">{MAPBG}{ico("pin","pin")}
<div class="card"><div><b>{S['name']}</b><span>{S['address']}</span></div><a class="btn btn-primary" href="{MAPS}" target="_blank" rel="noopener">Yol tarifi al</a></div></div>
<ul class="lines">
<li><b>Telefon</b><a href="tel:{TEL}">{TEL_SHOW}</a></li>
<li><b>WhatsApp</b><a href="{WA_URL}">Mesaj gönderin</a></li>
<li><b>E-posta</b><a href="mailto:{MAIL}">{MAIL}</a></li>
<li><b>Saatler</b><span>{S['hours']}</span></li>
</ul></div></div>"""


def footer():
    return f"""<footer class="foot"><div class="wrap">
<div>{brand("/")}<p style="margin-top:14px">{S['legal']}<br>TÜRSAB belge no: {S['tursab']}</p></div>
<div><p><a href="tel:{TEL}">{TEL_SHOW}</a><br><a href="mailto:{MAIL}">{MAIL}</a></p>
<p><a href="/kvkk/">Aydınlatma metni</a> &nbsp; <a href="/gizlilik/">Gizlilik</a></p></div>
</div></footer>
<div class="dock"><a class="btn btn-call" href="tel:{TEL}">{ico("phone")}Ara</a><a class="btn btn-sun" href="{WA_URL}">{ico("wa")}Fiyat sor</a></div>"""


def home():
    return (hero() + f"""<section class="sec" id="hizmetler"><div class="wrap">
<div class="sec-head"><h2 class="reveal">Yolculuğun her adımında yanınızdayız</h2>
<p class="lead">Gitmeden önceki hazırlıktan döndüğünüz ana kadar, ihtiyacınız olan her şey tek yerde.</p></div>
{journey()}</div></section>
<section class="sec sec-sky" id="nasil"><div class="wrap">
<div class="sec-head"><h2 class="reveal">Üç adımda yoldasınız</h2><p class="lead">Formlarla, bekleme müziğiyle uğraşmazsınız.</p></div>
{steps()}</div></section>
{why()}
<section class="sec" id="sorular"><div class="wrap">
<div class="sec-head"><h2 class="reveal">Sık sorulanlar</h2><p class="lead">Aklınıza takılan başka bir şey varsa bir telefon uzağınızdayız.</p></div>
{faq()}</div></section>
<section class="sec sec-sky" id="iletisim"><div class="wrap">
<div class="sec-head"><h2 class="reveal">Nereye gitmek istersiniz?</h2><p class="lead">Arayın, yazın ya da formu doldurun. Size aynı gün dönüyoruz.</p></div>
{contact()}</div></section>""")


def wrap(slug, title, desc, body, opts):
    path = "/" if slug in ("", "404") else f"/{slug}/"
    return (head("baslangic", title, desc, path, FONTS, noindex=opts.get("noindex", False))
            + header(NAV) + f'<main id="icerik">{body}</main>' + footer() + tail())


def build(out):
    css = (SRC / "base.css").read_text() + (SRC / "common-ui.css").read_text()
    pages = [("", "", "BTO Bilimtur: 1995'ten beri Ankara'dan tur, uçak bileti, otel, havalimanı transferi, araç kiralama ve vize işlemleri. Tek telefonla.", home(), {})]
    return write_site("baslangic", out, pages, wrap, css)
