"""Üç versiyonun ortak HTML parçaları."""
import pathlib
from map import svg as route_svg

SRC = pathlib.Path(__file__).parent
from config import SITE as _S
TEL = _S["tel"]
TEL_SHOW = _S["tel_show"]
WA = f"https://wa.me/{_S['wa']}"
MAIL = _S["mail"]
MAPS = "https://www.google.com/maps/search/?api=1&query=BTO+Bilimtur+Ankara"

_I = {
 "phone": '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
 "wa": '<path d="M3 21l1.6-4.7A8.5 8.5 0 1 1 7.8 19.4z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.6-2-1-1 .9a4 4 0 0 1-1.8-1.8l.9-1-1-2z"/>',
 "plane": '<path d="M10.5 13.5 3 11l1.5-1.5 8 1L17 6a2 2 0 0 1 3 3l-4.5 4.5 1 8L15 23l-2.5-7.5"/><path d="m6 18 2 2"/>',
 "bed": '<path d="M3 18V6M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5"/><circle cx="7" cy="11" r="2"/>',
 "passport": '<rect x="5" y="3" width="14" height="18" rx="2"/><circle cx="12" cy="10" r="3"/><path d="M9 17h6"/>',
 "shield": '<path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z"/><path d="m9 12 2 2 4-4"/>',
 "car": '<path d="M5 16h14M3 16v-3l2-5h14l2 5v3h-2M5 16H3"/><circle cx="7.5" cy="16.5" r="1.8"/><circle cx="16.5" cy="16.5" r="1.8"/>',
 "van": '<path d="M2 17V7h12l4 4h4v6h-2M2 17h3M9 17h7"/><circle cx="7" cy="17" r="2"/><circle cx="18" cy="17" r="2"/><path d="M14 7v4h4"/>',
 "balloon": '<path d="M12 2a7 7 0 0 0-5 12l3 4h4l3-4a7 7 0 0 0-5-12z"/><path d="M12 2c-2 2-2.5 9-1 16M12 2c2 2 2.5 9 1 16"/><rect x="10" y="19.5" width="4" height="2.5" rx=".5"/>',
 "boat": '<path d="M3 17h18l-2.5 4h-13zM12 3v13M12 4l6 10h-6M12 6l-5 8h5"/>',
 "mountain": '<path d="m2 20 7-11 4 6 3-4 6 9z"/><path d="m7.5 11.5 1.5 1.5 1.5-1.5"/>',
 "people": '<circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/><circle cx="17" cy="9" r="2.5"/><path d="M15.5 14.2A5 5 0 0 1 21 19"/>',
 "book": '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19V5M8 7h7"/>',
 "pin": '<path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.6"/>',
 "sun": '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6 19 19M5 19l1.4-1.4M17.6 6.4 19 5"/>',
 "bridge": '<path d="M2 17h20M4 17V9M20 17V9M4 9c4 0 6 3 8 3s4-3 8-3M8 17v-5M12 17v-5M16 17v-5"/>',
 "globe": '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
 "edit": '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
 "inbox": '<path d="M3 13h5l1.5 3h5l1.5-3h5M5 5h14l2 8v6H3v-6z"/>',
}


def ico(name, cls="ico"):
    return (f'<svg class="{cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" '
            f'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{_I[name]}</svg>')


LOGO = ('<svg viewBox="0 0 30 38" aria-hidden="true"><path d="M15 1C6 1 2 9 4 16c1 4 4 7 7 11h8c3-4 6-7 7-11 2-7-2-15-11-15z" fill="#F2A900" stroke="#14213D" stroke-width="2"/>'
        '<path d="M15 1c-4 4-5 16-3 26M15 1c4 4 5 16 3 26" fill="none" stroke="#14213D" stroke-width="1.6"/>'
        '<rect x="11" y="31" width="8" height="6" rx="1.5" fill="#0F7C80" stroke="#14213D" stroke-width="1.6"/></svg>')


def brand(href="#"):
    return (f'<a class="brand" href="{href}" aria-label="BTO Bilimtur ana sayfa">{LOGO}'
            '<span><b>BTO Bilimtur</b><small>1995\'ten beri Ankara\'dan</small></span></a>')


def head(title, extra_css=""):
    css = (SRC / "base.css").read_text() + extra_css
    return f"""<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="BTO Bilimtur: Ankara'dan tur, uçak bileti, otel, havalimanı transferi, araç kiralama ve vize işlemleri. 1995'ten beri.">
<meta name="robots" content="noindex">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,550;12..96,650;12..96,750;12..96,800&display=swap" rel="stylesheet">
<style>{css}</style>
</head>
<body>
<div class="preview" role="note">Tasarım önizlemesidir. BTO Bilimtur için hazırlanmış örnek sayfadır.</div>
"""


def header(nav, current=None, multipage=False):
    cur = ' aria-current="page"'
    links = "".join(
        f'<a href="{h}"{cur if (multipage and h == current) else ""}>{t}</a>' for t, h in nav)
    home = nav[0][1] if multipage else "/"
    return f"""<header class="top" id="ust"><div class="wrap">
{brand(home)}
<button class="menu-btn" aria-expanded="false" aria-controls="menu">Menü</button>
<nav class="nav" id="menu" aria-label="Ana menü">{links}</nav>
<a class="btn btn-call" href="tel:{TEL}">{ico("phone")}{TEL_SHOW}</a>
</div></header>"""


def call_buttons(sun=False):
    first = "btn-sun" if sun else "btn-call"
    return (f'<div class="actions"><a class="btn {first}" href="tel:{TEL}">{ico("phone")}Hemen arayın</a>'
            f'<a class="btn btn-wa" href="{WA}">{ico("wa")}WhatsApp\'tan yazın</a></div>')


def hero(h1="Ankara'dan yola çıkan her yolculuk, tek telefonla.",
         lead="Uçak bileti, otel, havalimanı transferi, kiralık araç ve turlar. Siz nereye gitmek istediğinizi söyleyin, gerisini 30 yılı aşkın deneyimle biz ayarlayalım."):
    return f"""<section class="hero"><div class="wrap">
<div>
<span class="since">1995'ten beri Ankara'da</span>
<h1>{h1}</h1>
<p class="lead">{lead}</p>
{call_buttons()}
</div>
<div class="hero-map">{route_svg()}</div>
</div></section>"""


def journey(links=None):
    L = links or {}
    def li(text, key=None):
        h = L.get(key)
        return f'<li><a href="{h}">{text}</a></li>' if h else f"<li>{text}</li>"
    return f"""<div class="journey">
<div class="stage">{ico("plane")}<h3>Yola çıkmadan</h3><p>Biletiniz, oteliniz ve evraklarınız tek yerden hazırlanır.</p>
<ul>{li("Uçak bileti","ucak")}{li("Yurt içi ve yurt dışı otel","otel")}{li("Pasaport ve vize işlemleri","vize")}{li("Seyahat sağlık sigortası","vize")}</ul></div>
<div class="stage">{ico("van")}<h3>Yolda</h3><p>Havalimanında sizi bekleyen şoför, ihtiyacınıza göre araç.</p>
<ul>{li("Havalimanı transferi","transfer")}{li("Şoförlü ya da şoförsüz araç kiralama","arac")}{li("Grup taşımacılığı","transfer")}</ul></div>
<div class="stage">{ico("balloon")}<h3>Gezerken</h3><p>Günübirlik kaçamaktan haftalık deniz tatiline kadar.</p>
<ul>{li("Kapadokya balon turları","balon")}{li("Mavi yolculuk","mavi")}{li("Yurt içi ve yurt dışı turlar","tur")}{li("Size özel tur","tur")}</ul></div>
<div class="stage">{ico("people")}<h3>Kurumlar için</h3><p>Toplantıdan kongreye, ekibinizin yolculuğu tek elden.</p>
<ul>{li("Kongre organizasyonu","kurum")}{li("Eğitim ve danışmanlık","kurum")}{li("Personel ve misafir transferi","kurum")}</ul></div>
</div>"""


def steps():
    return """<ol class="steps">
<li><h3>Bizi arayın ya da yazın</h3><p>Nereye, ne zaman, kaç kişi gideceğinizi söyleyin. Bu kadar.</p></li>
<li><h3>Size uygun planı gönderelim</h3><p>Seçenekleri ve fiyatı aynı gün telefonunuza iletelim.</p></li>
<li><h3>Siz sadece yola çıkın</h3><p>Bilet, otel, araç ve şoför hazır. Yolculuk boyunca bize ulaşabilirsiniz.</p></li>
</ol>"""


def why():
    return f"""<section class="sec sec-ink"><div class="wrap why">
<div><div class="big reveal">1995</div><p>Ankara'da 30 yılı aşkın süredir aynı işi yapıyoruz: insanları gitmek istedikleri yere sorunsuz götürmek.</p></div>
<div><h3>Tek telefon, tüm yolculuk</h3><p>Bileti bir yerden, oteli başka yerden, aracı bir başkasından ayarlamakla uğraşmazsınız. Hepsi bizde.</p>
<h3>Kendi araçlarımızla</h3><p>Binek otomobilden 27 kişilik midibüse kadar kendi filomuzla transfer yapıyoruz.</p></div>
<div><h3>Gruplara ve kurumlara alışkınız</h3><p>Okul gezisi, şirket toplantısı ya da kongre. Kalabalık organizasyonları planlıyoruz.</p>
<h3>Ulaşabileceğiniz bir ofis</h3><p>Ankara'dayız. Sorunuz olduğunda karşınızda bir çağrı merkezi değil, bizi bulursunuz.</p></div>
</div></section>"""


FAQ = [
 ("Fiyatları nereden öğrenebilirim?", "Tarih ve kişi sayısına göre değiştiği için telefonla ya da WhatsApp'tan sorduğunuzda size özel fiyatı hemen iletiyoruz."),
 ("Esenboğa'ya gece uçuşum var, transfer olur mu?", "Olur. Uçuş saatinizi söylemeniz yeterli. Şoförümüz uçağınız rötar yapsa bile sizi bekler."),
 ("Vize başvurusunda neye yardımcı oluyorsunuz?", "Gerekli evrak listesini çıkarıyor, randevuyu alıyor ve dosyanızı eksiksiz hazırlamanıza yardım ediyoruz."),
 ("Kapadokya balon turu için ne kadar önce aramalıyım?", "Özellikle hafta sonları ve bayramlarda yerler erken doluyor. Birkaç hafta önceden aramanızı öneririz."),
 ("Şirketimiz için toplu organizasyon yapıyor musunuz?", "Evet. Toplantı, kongre ve personel gezileri için ulaşım, konaklama ve programı birlikte planlıyoruz."),
]


def faq(items=FAQ):
    return '<div class="faq">' + "".join(f"<details><summary>{q}</summary><p>{a}</p></details>" for q, a in items) + "</div>"


MAPBG = ('<svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">'
         '<rect width="600" height="400" fill="#E7ECEE"/>'
         '<g fill="none" stroke="#fff" stroke-linecap="round"><path d="M-20 260 L640 150" stroke-width="22"/>'
         '<path d="M180 -20 L300 420" stroke-width="16"/><path d="M-20 90 L640 120" stroke-width="10"/>'
         '<path d="M420 -20 L470 420" stroke-width="10"/><path d="M-20 340 L640 300" stroke-width="8"/>'
         '<path d="M60 -20 L120 420" stroke-width="6"/><path d="M540 -20 L560 420" stroke-width="6"/></g>'
         '<g fill="#DCE3E6"><rect x="200" y="140" width="80" height="60" rx="6"/><rect x="320" y="60" width="80" height="50" rx="6"/>'
         '<rect x="320" y="200" width="70" height="70" rx="6"/><rect x="70" y="150" width="90" height="70" rx="6"/></g>'
         '<path d="M480 200 q40 -20 90 10 v80 h-90z" fill="#D3E3DA"/></svg>')


def contact(title="Sizi arayalım", note="Bilgilerinizi bırakın, aynı gün sizi arayalım.", topics=None):
    topics = topics or ["Tur", "Uçak bileti", "Otel", "Havalimanı transferi", "Araç kiralama", "Vize / pasaport", "Kurumsal organizasyon"]
    return f"""<div class="contact">
{form_box(title, note, topics)}
<div>
<div class="mapcard">{MAPBG}{ico("pin","pin")}
<div class="card"><div><b>BTO Bilimtur</b><span>Ankara</span></div><a class="btn btn-call" href="{MAPS}" target="_blank" rel="noopener">Yol tarifi al</a></div></div>
<ul class="lines">
<li><b>Telefon</b><a href="tel:{TEL}">{TEL_SHOW}</a></li>
<li><b>WhatsApp</b><a href="{WA}">Mesaj gönderin</a></li>
<li><b>E-posta</b><a href="mailto:{MAIL}">{MAIL}</a></li>
</ul>
</div>
</div>"""


def form_box(title, note, topics, extra="", cta="Beni arayın", ph="Örneğin: 2 kişi, Mayıs sonu, Kapadokya"):
    opts = "".join(f"<option>{t}</option>" for t in topics)
    return f"""<div class="form" data-form>
<h3>{title}</h3><p class="lead" style="font-size:1rem">{note}</p>
<form>
<div class="row2"><label class="field"><span>Adınız</span><input name="ad" required autocomplete="name"></label>
<label class="field"><span>Telefonunuz</span><input name="tel" type="tel" required autocomplete="tel" placeholder="05xx xxx xx xx"></label></div>
{extra}<label class="field"><span>Ne için arıyorsunuz?</span><select name="konu">{opts}</select></label>
<label class="field"><span>Kısaca anlatın (isteğe bağlı)</span><textarea name="not" rows="3" placeholder="{ph}"></textarea></label>
<button class="btn btn-call" type="submit">{cta}</button>
</form>
<div class="form-ok" role="status">Teşekkürler. Talebiniz bize ulaştı, en kısa sürede sizi arayacağız.</div>
</div>
"""


def footer(extra=""):
    return f"""<footer class="foot"><div class="wrap">
<div>{brand()}<p style="margin-top:14px">BTO Bilimtur Turizm Organizasyon Transfer</p></div>
<div>{extra}<p><a href="tel:{TEL}">{TEL_SHOW}</a><br><a href="mailto:{MAIL}">{MAIL}</a></p></div>
</div></footer>
<div class="dock"><a class="btn btn-call" href="tel:{TEL}">{ico("phone")}Ara</a><a class="btn btn-sun" href="{WA}">{ico("wa")}Fiyat sor</a></div>"""


def script(extra=""):
    js = (SRC / "base.js").read_text()
    return f"<script>{js}\n{extra}</script>\n</body></html>"
