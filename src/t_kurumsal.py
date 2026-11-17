"""Kurumsal: 5 sayfa. Görsel kimlik: bordo + pirinç, serif başlıklar, Ankara silüeti, katalog düzeni."""
import html
from parts import ico
from data import TOURS, FLEET, SERVICES, CITIES
from common import head, tail, lead_form, field, write_site, SRC, S, TEL, TEL_SHOW, MAIL, WA_URL
from parts import FAQ, MAPS

FONTS = "family=Newsreader:opsz,wght@6..72,400;6..72,450;6..72,500&family=Public+Sans:wght@400;550;650;700"
NAV = [("Ana sayfa", "/"), ("Turlar", "/turlar/"), ("Araç ve transfer", "/arac-transfer/"), ("Hizmetler", "/hizmetler/"), ("İletişim", "/iletisim/")]
TOPICS = ["Tur", "Uçak bileti", "Otel", "Havalimanı transferi", "Araç kiralama", "Vize / pasaport", "Kongre / toplantı", "Personel taşımacılığı"]
TAGS = {"yurtici": "Yurt içi", "deniz": "Deniz", "yurtdisi": "Yurt dışı"}


def skyline():
    P = []
    P.append("M0 140 H1200")
    P.append("M20 140 Q90 92 170 100 Q220 105 262 140")                       # kale tepesi
    P.append("M70 100 V82 h8 v6 h8 v-6 h8 v6 h8 v-6 h8 V100 M120 100 V72 h18 V100 M120 78 h18")
    P.append("M300 140 V128 H540 V140 M322 128 V118 H518 V128 M356 118 V88 H484 V118 M348 88 H492 V79 H348 Z")  # Anıtkabir
    P.append(" ".join(f"M{x} 118 V92" for x in range(370, 478, 14)))
    P.append("M612 140 V110 H752 V140 M642 110 Q682 54 722 110 M614 110 Q628 92 642 110 M722 110 Q736 92 750 110 M682 72 V60")  # Kocatepe
    P.append("M596 140 V60 L600 44 L604 60 V140 M618 140 V66 L622 52 L626 66 V140 M738 140 V66 L742 52 L746 66 V140 M760 140 V60 L764 44 L768 60 V140")
    P.append("M872 140 V64 M888 140 V64 M856 64 H904 M856 64 Q880 36 904 64 M880 44 V18")  # Atakule
    P.append("M930 140 V84 H972 V140 M982 140 V62 H1012 V140 M1022 140 V96 H1066 V140 M1076 140 V74 H1104 V140 M1114 140 V104 H1160 V140")
    P.append("M940 96 H962 M940 110 H962 M990 76 H1004 M990 92 H1004 M990 108 H1004 M1084 88 H1096 M1084 104 H1096")
    P.append("M190 140 V118 H230 V140 M244 140 V124 H286 V140 M548 140 V120 H590 V140 M786 140 V112 H836 V140 M1168 140 V116 H1200")
    return ('<div class="skyline" aria-hidden="true"><svg viewBox="0 0 1200 150" preserveAspectRatio="xMidYMax slice" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round">'
            + "".join(f'<path pathLength="1" d="{d}"/>' for d in P) + "</svg></div>")


def mark(href="/"):
    return (f'<a class="mark" href="{href}" aria-label="{S["name"]} ana sayfa"><i>BTO</i>'
            '<span><b>Bilimtur</b><small>Turizm, organizasyon, transfer</small></span></a>')


def header(current):
    links = "".join(f'<a href="{h}"' + (' aria-current="page"' if h == current else "") + f">{t}</a>" for t, h in NAV)
    return f"""<div class="util"><div class="wrap"><span class="hide-s">{S['hours']}</span><a class="hide-s" href="mailto:{MAIL}">{MAIL}</a><a href="tel:{TEL}">{TEL_SHOW}</a></div></div>
<header class="top"><div class="wrap">{mark()}
<button class="menu-btn" aria-expanded="false" aria-controls="menu">Menü</button>
<nav class="nav" id="menu" aria-label="Ana menü">{links}</nav>
<a class="btn btn-primary" href="/iletisim/#teklif">Teklif isteyin</a></div></header>"""


def footer():
    return f"""<footer class="foot"><div class="wrap">
<div>{mark()}<p style="margin-top:18px">{S['legal']}<br>1995'ten beri Ankara'da.<br>TÜRSAB belge no: {S['tursab']}</p></div>
<div><h4>Sayfalar</h4><ul>{"".join(f'<li><a href="{h}">{t}</a></li>' for t, h in NAV)}</ul></div>
<div><h4>İletişim</h4><ul><li><a href="tel:{TEL}">{TEL_SHOW}</a></li><li><a href="mailto:{MAIL}">{MAIL}</a></li><li><a href="{WA_URL}">WhatsApp</a></li>
<li style="margin-top:12px"><a href="/kvkk/">Aydınlatma metni</a></li><li><a href="/gizlilik/">Gizlilik</a></li></ul></div>
</div></footer>
<div class="dock"><a class="btn btn-primary" href="tel:{TEL}">{ico("phone")}Ara</a><a class="btn btn-brass" href="{WA_URL}">{ico("wa")}WhatsApp</a></div>"""


def phead(title, lead, crumb):
    return (f'<section class="phead"><div class="wrap"><div><div class="crumb"><a href="/">Ana sayfa</a> / {crumb}</div>'
            f'<h1>{title}</h1></div><p class="lead">{lead}</p></div></section>')


def cta(t="Ne gerektiğini anlatın, aynı gün teklifinizi gönderelim."):
    return (f'<section class="cta"><div class="wrap"><h2>{t}</h2><div class="actions">'
            f'<a class="btn btn-brass" href="/iletisim/#teklif">Teklif isteyin</a><a class="btn btn-line" href="tel:{TEL}">{ico("phone")}{TEL_SHOW}</a></div></div></section>')


def catalog(items, filt=False):
    rows = "".join(f'<li data-cat="{t["cat"]}">{ico(t["icon"], "")}<div><h3>{t["title"]}</h3><span class="tag">{TAGS[t["cat"]]}</span></div>'
                   f'<p>{t["text"]}</p><a class="btn btn-line" href="/iletisim/?konu=Tur&not={html.escape(t["title"])}#teklif">Bilgi alın</a></li>' for t in items)
    f = ""
    if filt:
        f = ('<div class="filters" data-filter="katalog-tum" role="group" aria-label="Tur türü">'
             + "".join(f'<button type="button" data-cat="{k}" aria-pressed="{str(k == "hepsi").lower()}">{v}</button>'
                       for k, v in [("hepsi", "Hepsi")] + list(TAGS.items())) + "</div>")
    return f + f'<ul class="cat" id="katalog{"-tum" if filt else ""}">{rows}</ul>'


def spec():
    rows = "".join(f'<tr><td><span class="veh">{ico(i, "")}{n}</span></td><td class="hide-s">{t}</td><td><span class="seats">{s}</span> yolcu</td>'
                   f'<td class="hide-s">{u}</td><td><a class="btn btn-line" href="/iletisim/?konu=Araç kiralama&not={n}#teklif">Fiyat sorun</a></td></tr>'
                   for n, t, s, i, u in FLEET)
    return ('<table class="spec"><thead><tr><th>Araç</th><th>Sınıf</th><th>Kapasite</th><th>En uygun olduğu iş</th><th></th></tr></thead>'
            f"<tbody>{rows}</tbody></table>")


def home():
    idx = [("plane", "Uçak bileti ve otel", "Yurt içi ve yurt dışı", "/hizmetler/"),
           ("van", "Havalimanı transferi", "Esenboğa ve şehirlerarası", "/arac-transfer/"),
           ("car", "Araç kiralama", "Şoförlü ya da şoförsüz", "/arac-transfer/"),
           ("balloon", "Turlar", "Kapadokya, mavi yolculuk, yurt dışı", "/turlar/"),
           ("people", "Kongre ve toplantı", "Kurumlara özel", "/hizmetler/"),
           ("passport", "Vize ve pasaport", "Evrak ve randevu", "/hizmetler/")]
    index = "".join(f'<a href="{h}">{ico(i, "")}<span><b>{t}</b><span>{s}</span></span><em>›</em></a>' for i, t, s, h in idx)
    return f"""<section class="hero"><div class="wrap">
<div><span class="where">Ankara, 1995'ten beri</span>
<h1>Kurumların ve ailelerin Ankara'daki seyahat ofisi.</h1>
<p class="lead">Bilet, otel, transfer, araç ve organizasyon tek ofisten. Bir kez anlatırsınız, işin geri kalanını biz yürütürüz.</p>
<div class="actions"><a class="btn btn-brass" href="/iletisim/#teklif">Teklif isteyin</a><a class="btn btn-ghost" href="tel:{TEL}">{ico("phone")}{TEL_SHOW}</a></div></div>
<nav class="index" aria-label="Hizmetler"><h2>Ne için arıyorsunuz?</h2>{index}</nav>
</div>{skyline()}</section>
<section class="facts"><div class="wrap">
<div><b>1995</b><span>Ankara'da kuruluş</span></div><div><b>7</b><span>araçlık kendi filomuz</span></div>
<div><b>27</b><span>kişiye kadar tek araçta grup</span></div><div><b>8</b><span>hizmet tek ofiste</span></div></div></section>
<section class="sec sec-stone"><div class="wrap">
<div class="head"><h2 class="reveal">İki tür yolcumuz var.</h2><p class="lead">İkisine de aynı özeni gösteriyoruz: bir kişi dinler, bir kişi takip eder, siz kimseyi kovalamazsınız.</p></div>
<div class="aud">
<article><h3>Kurumlar</h3><p>Personelinizin, misafirlerinizin ve etkinliklerinizin ulaşımı ve konaklaması.</p>
<ul><li>{ico("people", "")}Kongre, toplantı ve seminer organizasyonu</li><li>{ico("van", "")}Personel ve misafir transferi</li><li>{ico("plane", "")}İş seyahati bilet ve otel</li><li>{ico("book", "")}Seyahat planlama danışmanlığı</li></ul>
<a class="more" href="/hizmetler/">Kurumsal hizmetler</a></article>
<article><h3>Aileler ve bireyler</h3><p>Tatil, gezi ya da zorunlu bir yolculuk. Hepsini sizin yerinize ayarlarız.</p>
<ul><li>{ico("balloon", "")}Kapadokya, Karadeniz ve yurt dışı turlar</li><li>{ico("boat", "")}Mavi yolculuk ve deniz tatili</li><li>{ico("passport", "")}Vize, pasaport ve seyahat sigortası</li><li>{ico("car", "")}Araç kiralama ve havalimanı transferi</li></ul>
<a class="more" href="/turlar/">Turlara bakın</a></article>
</div></div></section>
<section class="sec"><div class="wrap">
<div class="head"><h2 class="reveal">Bu sezonun turları</h2><p class="lead">Grup turuna katılın ya da tarihi ve rotayı siz belirleyin.</p></div>
{catalog(TOURS[:4])}
<p style="margin-top:28px"><a class="btn btn-line" href="/turlar/">Tüm turlar</a></p>
</div></section>
<section class="sec sec-ink"><div class="wrap">
<div class="head"><h2 class="reveal">Nasıl çalışıyoruz?</h2><p class="lead">Üç adım. Hiçbirinde form doldurup beklemezsiniz.</p></div>
<ol class="steps"><li><h3>Anlatırsınız</h3><p>Telefonda ya da ofiste. Nereye, ne zaman, kaç kişi.</p></li>
<li><h3>Teklif göndeririz</h3><p>Aynı gün seçenekler ve fiyatla size döneriz.</p></li>
<li><h3>Biz yürütürüz</h3><p>Bilet, otel, araç ve şoför hazır. Yolculuk boyunca ulaşabilirsiniz.</p></li></ol>
</div></section>
{cta()}"""


def turlar():
    return (phead("Turlar", "Grup turuna katılın ya da tarihi ve rotayı siz seçin. Ankara'dan ulaşım her pakette ayarlanır.", "Turlar")
            + f'<section class="sec"><div class="wrap">{catalog(TOURS, True)}</div></section>'
            + f'<section class="sec sec-stone"><div class="wrap split"><div><h2 class="reveal">Yurt dışında otel</h2><p class="lead">Avrupa\'dan Amerika\'ya anlaşmalı otellerimizde indirimli fiyat alırız. Uçak ve vizeyle birlikte planlayalım.</p>'
              f'<a class="btn btn-primary" href="/iletisim/?konu=Otel#teklif">Otel isteyin</a></div>'
              f'<ul class="checks">{"".join(f"<li>{c}</li>" for c in CITIES)}</ul></div></section>' + cta())


def arac():
    return (phead("Araç kiralama ve havalimanı transferi", "Kendi filomuzla, şoförlü ya da şoförsüz. Esenboğa'da adınızla karşılanırsınız.", "Araç ve transfer")
            + f"""<section class="sec"><div class="wrap split">
<div><h2 class="reveal">Havalimanı transferi</h2><p class="lead">Uçuş numaranızı verin, gerisini takip edelim.</p>
<ul class="checks"><li>Esenboğa ve Ankara içi her adres</li><li>Gece ve sabah erken uçuşlar</li><li>Uçak rötar yaparsa şoför bekler</li><li>Grup ve kongre katılımcıları için toplu transfer</li></ul></div>
{lead_form("Transfer fiyatı alın", "Nereden nereye ve ne zaman, yazmanız yeterli.", ["Havalimanı transferi", "Şehir içi transfer", "Şehirlerarası transfer", "Grup transferi"],
           extra='<div class="row2">' + field("Tarih", "tarih", "date") + field("Saat", "saat", "time") + "</div>", cta="Fiyat isteyin", ph="Örneğin: Esenboğa'dan Çankaya'ya, 3 kişi, 2 valiz")}
</div></section>
<section class="sec sec-stone"><div class="wrap"><div class="head"><h2 class="reveal">Filomuz</h2><p class="lead">Tek kişilik iş seyahatinden 27 kişilik gruba kadar.</p></div>{spec()}</div></section>""" + cta("Hangi aracın uygun olduğundan emin değilseniz arayın, birlikte seçelim."))


def hizmetler():
    svc = "".join(f'<article>{ico(i, "")}<div><h3>{t}</h3><p>{d}</p></div></article>' for i, t, d in SERVICES)
    faq = "".join(f'<li><h3 style="font-size:1.2rem">{q}</h3><p>{a}</p></li>' for q, a in FAQ)
    return (phead("Hizmetlerimiz", "Bileti, oteli, evrakı ve aracı ayrı ayrı yerlerden ayarlamakla uğraşmayın.", "Hizmetler")
            + f'<section class="sec"><div class="wrap"><div class="svc">{svc}</div></div></section>'
            + f'<section class="sec sec-stone"><div class="wrap split"><div><h2 class="reveal">Sık sorulanlar</h2><p class="lead">Başka bir sorunuz varsa bir telefon uzağınızdayız.</p></div><ul class="checks" style="margin:0">{faq}</ul></div></section>' + cta())


def iletisim():
    return (phead("Hakkımızda ve iletişim", "1995'ten beri Ankara'dan yola çıkan yolcuların yanındayız.", "İletişim")
            + f"""<section class="sec"><div class="wrap split">
<div><div class="big">1995</div><h2 class="reveal" style="margin-top:20px">Ankara'da otuz yılı aşkın süredir.</h2>
<p>{S['legal']}, 1995 yılında Ankara'da kuruldu. Uçak bileti ve otelle başlayan işimiz bugün turları, havalimanı transferini, araç kiralamayı, vize işlemlerini ve kongre organizasyonlarını kapsıyor.</p>
<p>Değişmeyen tek şey çalışma şeklimiz: yolcuyu bir kez dinlemek, işi baştan sona üstlenmek ve yolculuk bitene kadar ulaşılabilir olmak.</p></div>
<div><ul class="addr"><li><b>Telefon</b><a href="tel:{TEL}">{TEL_SHOW}</a></li><li><b>WhatsApp</b><a href="{WA_URL}">Mesaj gönderin</a></li>
<li><b>E-posta</b><a href="mailto:{MAIL}">{MAIL}</a></li><li><b>Adres</b><span>{S['address']} <a href="{MAPS}" target="_blank" rel="noopener">Yol tarifi</a></span></li><li><b>Saatler</b><span>{S['hours']}</span></li></ul></div>
</div></section>
<section class="sec sec-stone" id="teklif"><div class="wrap split">
<div><h2 class="reveal">Teklif isteyin</h2><p class="lead">Formu doldurun, çalışma saatleri içinde aynı gün sizi arayalım. Kurumsal talepler için kurum adınızı da yazın.</p></div>
{lead_form("Size nasıl yardımcı olalım?", "Kısa bilgi yeterli, ayrıntıları telefonda konuşuruz.", TOPICS, extra=field("Kurum adı (isteğe bağlı)", "kurum"), cta="Teklif isteyin")}
</div></section>""")


PAGES = [("", "", "BTO Bilimtur: kurumların ve ailelerin Ankara'daki seyahat ofisi. Bilet, otel, transfer, araç kiralama, tur ve kongre organizasyonu.", home),
         ("turlar", "Turlar", "Kapadokya balon turu, mavi yolculuk, Karadeniz, Kıbrıs ve yurt dışı turlar. Ankara çıkışlı.", turlar),
         ("arac-transfer", "Araç kiralama ve havalimanı transferi", "Esenboğa havalimanı transferi ve şoförlü, şoförsüz araç kiralama. 4 ile 27 kişilik araçlar.", arac),
         ("hizmetler", "Hizmetler", "Uçak bileti, otel, vize, seyahat sigortası, kongre organizasyonu ve taşımacılık.", hizmetler),
         ("iletisim", "Hakkımızda ve iletişim", "BTO Bilimtur iletişim bilgileri ve teklif formu.", iletisim)]


def wrap(slug, title, desc, body, opts):
    path = "/" if slug in ("", "404") else f"/{slug}/"
    return (head("kurumsal", title, desc, path, FONTS, noindex=opts.get("noindex", False))
            + header(path) + f'<main id="icerik">{body}</main>' + footer() + tail())


def build(out):
    css = (SRC / "kurumsal.css").read_text() + (SRC / "common-ui.css").read_text()
    return write_site("kurumsal", out, [(s, t, d, f(), {}) for s, t, d, f in PAGES], wrap, css)
