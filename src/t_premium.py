"""Premium: 10 sayfa + yönetim paneli. Görsel kimlik: Etstur tarzı tatil portalı, beyaz + canlı mavi, görsel ağırlıklı."""
import json, html
from urllib.parse import quote
from parts import ico, _I, MAPS
from data import FLEET, SERVICES, CITIES
from common import head, tail, lead_form, field, write_site, SRC, S, TEL, TEL_SHOW, MAIL, WA_URL
from scenes import all_svgs
from t_premium_data import TOURS, CATN, VISA, TEST_NOTE

FONTS = "family=Plus+Jakarta+Sans:wght@400;500;600;650;700;750;800"
NAV = [("Turlar", "/turlar/"), ("Kapadokya", "/kapadokya-balon-turu/"), ("Mavi yolculuk", "/mavi-yolculuk/"), ("Otel ve uçak", "/otel-ucak/"),
       ("Transfer", "/havalimani-transfer/"), ("Araç kiralama", "/arac-kiralama/"), ("Vize", "/vize/"), ("Kurumsal", "/kurumsal/")]
TOPICS = ["Tur", "Otel", "Uçak bileti", "Havalimanı transferi", "Araç kiralama", "Vize / pasaport", "Kurumsal organizasyon"]
LOGO_SVG = ('<svg viewBox="0 0 22 26" aria-hidden="true"><path d="M11 1C4.5 1 1.5 6.5 3 11.5c.8 2.8 3 5 5 7.5h6c2-2.5 4.2-4.7 5-7.5C20.5 6.5 17.5 1 11 1z" fill="#FFC21A"/>'
            '<path d="M11 1c-3 3-3.5 11-2 18M11 1c3 3 3.5 11 2 18" fill="none" stroke="#0D1B33" stroke-width="1.2"/><rect x="8" y="21" width="6" height="4" rx="1" fill="#fff"/></svg>')


def logo():
    return f'<a class="logo" href="/" aria-label="{S["name"]} ana sayfa"><i>{LOGO_SVG}</i><b>bto<span>bilimtur</span></b></a>'


def tour_href(t):
    return t.get("href") or f"/iletisim/?konu=Tur&not={quote(t['title'])}#talep"


def card(t):
    """JS tarafındaki aynı şablonla eşleşir (premium.js > card)."""
    price = (f'<small>kişi başı, başlayan</small><b>{t["price"]}</b>' if t.get("price") else '<small>Fiyat</small><b class="ask">Size özel teklif</b>')
    inc = "".join(f"<span>{i}</span>" for i in t.get("inc", []))
    return (f'<a class="card" data-cat="{t["cat"]}" href="{tour_href(t)}"><div class="ph"><img src="/img/{t["img"]}" alt="" loading="lazy" width="600" height="450">'
            + (f'<span class="badge">{html.escape(t["badge"])}</span>' if t.get("badge") else "")
            + f'<span class="cat">{CATN[t["cat"]]}</span></div><div class="bd"><span class="loc">{ico("pin", "")}{t["loc"]}</span>'
            f'<h3>{html.escape(t["title"])}</h3><div class="inc">{inc}</div>'
            f'<div class="ft"><div class="pr">{price}</div><span class="btn btn-primary btn-sm">İncele</span></div></div></a>')


def header(current):
    links = "".join(f'<a href="{h}"' + (' aria-current="page"' if h == current else "") + f">{t}</a>" for t, h in NAV)
    return f"""<div class="announce" id="announce" hidden></div>
<div class="util"><div class="wrap"><span class="hide-s">1995'ten beri Ankara'da</span><span class="hide-s">TÜRSAB belge no: {S['tursab']}</span>
<div class="r"><a href="{WA_URL}">WhatsApp</a><a href="tel:{TEL}">{TEL_SHOW}</a></div></div></div>
<header class="top"><div class="wrap">{logo()}
<nav class="nav" id="menu" aria-label="Ana menü">{links}<a href="/iletisim/">İletişim</a></nav>
<a class="btn btn-primary cta-s" href="/iletisim/#talep">Fiyat alın</a>
<button class="menu-btn" aria-expanded="false" aria-controls="menu">Menü</button></div></header>"""


def footer():
    col = lambda t, items: f'<div><h4>{t}</h4><ul>' + "".join(f'<li><a href="{h}">{x}</a></li>' for x, h in items) + "</ul></div>"
    return f"""<footer class="foot"><div class="wrap"><div class="cols">
<div>{logo()}<p style="margin-top:14px">{S['legal']}<br>1995'ten beri Ankara'dan yola çıkan yolcuların yanında.</p>
<p><a href="tel:{TEL}">{TEL_SHOW}</a><br><a href="mailto:{MAIL}">{MAIL}</a><br>{S['hours']}</p></div>
{col("Turlar", [("Kapadokya balon turu", "/kapadokya-balon-turu/"), ("Mavi yolculuk", "/mavi-yolculuk/"), ("Tüm turlar", "/turlar/"), ("Yurt dışı oteller", "/otel-ucak/")])}
{col("Hizmetler", [("Havalimanı transferi", "/havalimani-transfer/"), ("Araç kiralama", "/arac-kiralama/"), ("Uçak bileti", "/otel-ucak/"), ("Vize ve sigorta", "/vize/"), ("Kurumsal", "/kurumsal/")])}
{col("Kurumsal", [("Hakkımızda ve iletişim", "/iletisim/"), ("Aydınlatma metni", "/kvkk/"), ("Gizlilik ve çerezler", "/gizlilik/")])}
</div><div class="legal-row"><span>© 2026 {S['legal']}. TÜRSAB belge no: {S['tursab']}</span><span>Fiyatlar tarih ve müsaitliğe göre değişir.</span></div></div></footer>
<a class="wa-float" href="{WA_URL}" aria-label="WhatsApp'tan yazın">{ico("wa", "")}</a>
<div class="dock"><a class="btn btn-primary" href="tel:{TEL}">{ico("phone")}Ara</a><a class="btn btn-wa" href="{WA_URL}">{ico("wa")}WhatsApp</a></div>
<div class="toast" id="toast" role="status" aria-live="polite"></div>"""


def phead(title, lead, crumb):
    return (f'<section class="phead"><div class="wrap"><div class="crumb"><a href="/">Ana sayfa</a> / {crumb}</div>'
            f'<h1>{title}</h1><p>{lead}</p></div></section>')


def sf(label, name, type_="text", ph="", cls=""):
    return (f'<label class="sf {cls}"><span>{label}</span><input name="{name}" type="{type_}"'
            + (f' placeholder="{ph}"' if ph else "") + "></label>")


def sselect(label, name, opts, cls=""):
    return f'<label class="sf {cls}"><span>{label}</span><select name="{name}">' + "".join(f"<option>{o}</option>" for o in opts) + "</select></label>"


def search():
    tabs = [("tur", "Tur", "balloon", sselect("Nereye?", "nereye", ["Kapadokya", "Mavi yolculuk", "Karadeniz", "Akdeniz ve Ege", "İstanbul", "Kıbrıs", "Yurt dışı"], "wide")
             + sf("Tarih", "tarih", "date") + sselect("Kişi", "kisi", ["2 yetişkin", "1 yetişkin", "2 yetişkin, 1 çocuk", "2 yetişkin, 2 çocuk", "Grup (10+)"]) + sselect("Süre", "sure", ["Fark etmez", "Günübirlik", "2-3 gece", "1 hafta"])),
            ("otel", "Otel", "bed", sf("Şehir ya da otel", "nereye", ph="Örn: Bodrum, Paris", cls="wide") + sf("Giriş", "tarih", "date") + sf("Çıkış", "donus", "date") + sselect("Kişi", "kisi", ["2 yetişkin", "1 yetişkin", "2 yetişkin, 1 çocuk", "Aile (4+)"])),
            ("ucak", "Uçak", "plane", sf("Nereden", "nereden", ph="Ankara") + sf("Nereye", "nereye", ph="Örn: Londra") + sf("Gidiş", "tarih", "date") + sf("Dönüş", "donus", "date")),
            ("transfer", "Transfer", "van", sselect("Yön", "yon", ["Esenboğa'dan adrese", "Adresten Esenboğa'ya", "Şehirlerarası"], "wide") + sf("Tarih", "tarih", "date") + sf("Saat", "saat", "time") + sselect("Kişi", "kisi", ["1-3", "4-8", "9-16", "17-27"])),
            ("arac", "Araç", "car", sselect("Araç", "arac", ["Fark etmez", "Sedan (4 kişi)", "Minibüs (8 kişi)", "Midibüs (16-27 kişi)"], "wide") + sf("Alış", "tarih", "date") + sf("Dönüş", "donus", "date") + sselect("Şoför", "sofor", ["Şoförlü", "Şoförsüz"]))]
    konu = {"tur": "Tur", "otel": "Otel", "ucak": "Uçak bileti", "transfer": "Havalimanı transferi", "arac": "Araç kiralama"}
    t = "".join(f'<button type="button" role="tab" id="t-{k}" aria-controls="p-{k}" aria-selected="{str(i == 0).lower()}" tabindex="{0 if i == 0 else -1}">{ico(ic, "")}{n}</button>' for i, (k, n, ic, _) in enumerate(tabs))
    p = "".join(f'<div class="panel-s" role="tabpanel" id="p-{k}" aria-labelledby="t-{k}"{"" if i == 0 else " hidden"}>'
                f'<form class="sform" action="/iletisim/" method="get" data-konu="{konu[k]}"><input type="hidden" name="konu" value="{konu[k]}">{f}'
                f'<button class="btn btn-sun" type="submit">Fiyat alın</button></form></div>' for i, (k, n, ic, f) in enumerate(tabs))
    pop = [("Kapadokya balon", "/kapadokya-balon-turu/"), ("Mavi yolculuk", "/mavi-yolculuk/"), ("Esenboğa transfer", "/havalimani-transfer/"), ("Schengen vizesi", "/vize/"), ("Kıbrıs", "/turlar/")]
    return (f'<section class="search"><div class="wrap"><div class="box"><div class="tabs" role="tablist" aria-label="Ne arıyorsunuz?">{t}</div>{p}</div>'
            '<div class="popular"><b>Popüler:</b>' + "".join(f'<a href="{h}">{x}</a>' for x, h in pop) + "</div></div></section>")


def hero():
    slides = [("kapadokya.svg", "Kapadokya'nın gökyüzünde güne başlayın."), ("mavi-yolculuk.svg", "Bir hafta boyunca koydan koya."), ("kibris.svg", "Kıbrıs: uçak, otel ve transfer hazır.")]
    s = "".join(f'<div class="slide{" on" if i == 0 else ""}" data-title="{h}"><img src="/img/{img}" alt="" {"fetchpriority=high" if i == 0 else "loading=lazy"} width="1200" height="800"></div>' for i, (img, h) in enumerate(slides))
    d = "".join(f'<button type="button" aria-label="{i + 1}. görsel"{" aria-current=true" if i == 0 else ""}></button>' for i in range(len(slides)))
    return (f'<section class="hero" aria-label="Öne çıkanlar">{s}<div class="wrap hero-copy"><h1 id="hero-h">Ankara\'dan tatile, tek telefonla.</h1>'
            f'<p>Tur, otel, uçak, transfer ve vize. 1995\'ten beri her yolculukta yanınızdayız.</p></div><div class="dots">{d}</div></section>')


def themes():
    T = [("balloon", "Balon turları", "/kapadokya-balon-turu/"), ("boat", "Mavi yolculuk", "/mavi-yolculuk/"), ("sun", "Deniz tatili", "/turlar/"), ("mountain", "Doğa ve yayla", "/turlar/"),
         ("globe", "Yurt dışı", "/otel-ucak/"), ("van", "Günübirlik", "/turlar/"), ("people", "Kurumsal", "/kurumsal/"), ("passport", "Vize", "/vize/")]
    return '<div class="themes">' + "".join(f'<a class="theme" href="{h}">{ico(i, "")}{t}</a>' for i, t, h in T) + "</div>"


def regions():
    R = [("Kapadokya", "kapadokya.svg", "Balon, vadiler, mağara oteller", "/kapadokya-balon-turu/", True), ("Bodrum ve Fethiye", "mavi-yolculuk.svg", "Mavi yolculuk", "/mavi-yolculuk/", False),
         ("Antalya", "akdeniz.svg", "Deniz tatili", "/turlar/", False), ("Karadeniz", "karadeniz.svg", "Yayla turları", "/turlar/", False), ("İstanbul", "istanbul.svg", "Boğaz turu", "/turlar/", False),
         ("Kıbrıs", "kibris.svg", "Uçak ve otel", "/turlar/", False), ("Avrupa", "sehir.svg", "Şehir gezileri", "/otel-ucak/", "wide"), ("Ankara çevresi", "ankara.svg", "Günübirlik turlar", "/turlar/", False)]
    return '<div class="regions">' + "".join(f'<a class="reg{" big" if b is True else (" wide" if b else "")}" href="{h}"><img src="/img/{im}" alt="" loading="lazy"><b>{n}<small>{s}</small></b></a>' for n, im, s, h, b in R) + "</div>"


def home():
    camps = [("kapadokya.svg", "Bahar dönemi", "Kapadokya balon turu", "Ankara çıkışlı, otel ve uçuş dahil", "/kapadokya-balon-turu/"),
             ("mavi-yolculuk.svg", "Erken rezervasyon", "Mavi yolculuk 2027", "Gulet ve yat seçenekleri", "/mavi-yolculuk/"),
             ("ankara.svg", "Kurumlara", "Kongre ve toplantı", "Ulaşım, otel ve salon tek elden", "/kurumsal/")]
    c = "".join(f'<a class="camp" href="{h}"><img src="/img/{im}" alt="" loading="lazy"><span class="lbl">{l}</span><h3>{t}</h3><span>{s}</span></a>' for im, l, t, s, h in camps)
    feat = "".join(card(t) for t in TOURS if t["on"])[:]
    return (hero() + search()
            + f'<section class="sec"><div class="wrap"><div class="shead"><div><h2>Kampanyalar</h2><p>Bu dönem öne çıkan fırsatlar.</p></div></div><div class="camps">{c}</div></div></section>'
            + f'<section class="sec sec-mist"><div class="wrap"><div class="shead"><div><h2>Öne çıkan turlar</h2><p>Ankara\'dan ulaşım her pakette ayarlanır.</p></div><a href="/turlar/">Tüm turlar</a></div><div class="grid" id="featured">{feat}</div></div></section>'
            + f'<section class="sec"><div class="wrap"><div class="shead"><div><h2>Tatil temaları</h2><p>Nasıl bir tatil istediğinizi seçin.</p></div></div>{themes()}</div></section>'
            + f'<section class="sec" style="padding-top:0"><div class="wrap"><div class="shead"><div><h2>Popüler bölgeler</h2><p>En çok sorulan yerler.</p></div><a href="/turlar/">Tümünü gör</a></div>{regions()}</div></section>'
            + f"""<section class="sec" style="padding-top:0"><div class="wrap"><div class="band"><div class="ph"><img src="/img/yol.svg" alt="" loading="lazy"></div><div class="tx">
<h2>Esenboğa'da sizi bekleyen bir şoför.</h2><p>Kendi filomuzla havalimanı transferi ve şoförlü araç kiralama. Binek otomobilden 27 kişilik midibüse kadar.</p>
<ul class="ticks"><li>Uçuşunuz takip edilir, rötarda şoför bekler</li><li>Ankara içi her adres, şehirlerarası da olur</li><li>Kurumlara aylık ve toplu transfer</li></ul>
<a class="btn btn-sun" href="/havalimani-transfer/">Transfer fiyatı alın</a> <a class="btn btn-line" style="background:transparent;color:#fff;border-color:#fff" href="/arac-kiralama/">Filoyu görün</a></div></div></div></section>
<section class="sec sec-mist"><div class="wrap"><div class="trust">
<div>{ico("shield", "")}<span><b>1995'ten beri</b><span>Ankara'da 30 yılı aşkın</span></span></div>
<div>{ico("passport", "")}<span><b>TÜRSAB üyesi</b><span>Belge no: {S['tursab']}</span></span></div>
<div>{ico("van", "")}<span><b>Kendi filomuz</b><span>7 araç, 27 kişiye kadar</span></span></div>
<div>{ico("phone", "")}<span><b>Ulaşabileceğiniz ofis</b><span>{TEL_SHOW}</span></span></div></div></div></section>
<section class="sec"><div class="wrap"><h2>BTO Bilimtur hakkında</h2><div class="about">
<p>{S['legal']}, 1995 yılında Ankara'da kuruldu. Uçak bileti ve otel rezervasyonuyla başlayan işimiz bugün Kapadokya balon turlarından mavi yolculuğa, Esenboğa havalimanı transferinden şoförlü araç kiralamaya, vize işlemlerinden kongre organizasyonuna kadar uzanıyor.</p>
<p>Ankara çıkışlı yurt içi turlarda ulaşımı kendi araçlarımızla sağlıyoruz. Yurt dışında Avrupa'dan Amerika'ya anlaşmalı otellerde indirimli konaklama sunuyor, vize başvurunuzu ve seyahat sağlık sigortanızı aynı ofisten hazırlıyoruz. Tek yapmanız gereken bizi aramak.</p></div></div></section>""")


def turlar():
    filt = '<div data-filter="tourgrid" role="group" aria-label="Tur türü">' + "".join(
        f'<button type="button" data-cat="{k}" aria-pressed="{str(k == "hepsi").lower()}">{v}</button>' for k, v in [("hepsi", "Tüm turlar")] + list(CATN.items())) + "</div>"
    cards = "".join(card(t) for t in TOURS if t["on"])
    return (phead("Turlar", "Ankara çıkışlı yurt içi turlar, deniz tatilleri ve yurt dışı gezileri.", "Turlar")
            + f'<section class="sec"><div class="wrap listing"><aside class="side"><h3>Tur türü</h3>{filt}<div class="help"><b>Aradığınızı bulamadınız mı?</b><p class="muted" style="margin:6px 0 12px">Rotayı ve tarihi siz belirleyin, size özel program hazırlayalım.</p><a class="btn btn-primary btn-sm" href="/iletisim/?konu=Tur#talep">Özel tur isteyin</a></div></aside>'
              f'<div class="grid3" id="tourgrid">{cards}</div></div></section>')


def detail(crumb, title, loc, imgs, facts, tabs, form, px="d"):
    g = "".join(f'<img src="/img/{i}" alt="" {"fetchpriority=high" if n == 0 else "loading=lazy"}>' for n, i in enumerate(imgs))
    f = "".join(f'<span>{ico(i, "")}{t}</span>' for i, t in facts)
    tb = "".join(f'<button type="button" role="tab" id="{px}t-{k}" aria-controls="{px}p-{k}" aria-selected="{str(n == 0).lower()}" tabindex="{0 if n == 0 else -1}">{t}</button>' for n, (k, t, _) in enumerate(tabs))
    tp = "".join(f'<div role="tabpanel" id="{px}p-{k}" aria-labelledby="{px}t-{k}"{"" if n == 0 else " hidden"}>{c}</div>' for n, (k, t, c) in enumerate(tabs))
    return (f'<div class="wrap"><div class="crumb" style="margin-top:22px"><a href="/">Ana sayfa</a> / <a href="/turlar/">Turlar</a> / {crumb}</div>'
            f'<div class="gallery">{g}</div><div class="detail"><div><span class="loc muted" style="display:flex;gap:6px;align-items:center;font-weight:650">{ico("pin", "")}{loc}</span>'
            f'<h1 style="font-size:clamp(1.9rem,3.6vw,2.7rem);margin-top:6px">{title}</h1><div class="facts">{f}</div>'
            f'<div class="dtabs" role="tablist" aria-label="Tur bilgileri">{tb}</div>{tp}</div><aside class="book">{form}</aside></div></div>')


def kapadokya():
    prog = ('<ol class="timeline"><li><b>Ankara\'dan hareket</b><span>Belirlenen noktadan kendi aracımızla yola çıkış.</span></li>'
            '<li><b>Otele yerleşme</b><span>Mağara otel ya da standart otel, tercihinize göre.</span></li>'
            '<li><b>Gün doğumunda balon uçuşu</b><span>Otelden kalkış alanına transfer, yaklaşık bir saatlik uçuş.</span></li>'
            '<li><b>Vadiler ve yer altı şehri</b><span>Kahvaltının ardından rehberli gezi.</span></li><li><b>Ankara\'ya dönüş</b><span>Akşam saatlerinde Ankara\'dasınız.</span></li></ol>'
            '<p class="note">Örnek programdır, tarihe ve pakete göre değişir. Balon uçuşları hava koşullarına bağlıdır; uçuş iptal olursa seçenekleri önceden konuşuruz.</p>')
    inc = '<div class="light"><ul class="ticks"><li>Ankara\'dan gidiş dönüş ulaşım</li><li>Otelde konaklama ve kahvaltı</li><li>Balon uçuşu ve kalkış alanı transferi</li><li>Rehberli vadi gezisi</li></ul><p class="muted">Pakete göre değişir. Teklifte neyin dahil olduğu açıkça yazılır.</p></div>'
    sss = "".join(f"<h3>{q}</h3><p class='muted'>{a}</p>" for q, a in [("Ne kadar önce aramalıyım?", "Hafta sonları ve bayramlarda yerler erken doluyor. Birkaç hafta önceden aramanızı öneririz."), ("Çocuklar uçabilir mi?", "Balon şirketlerinin yaş ve boy sınırları var. Tarihinizi ve çocuğunuzun yaşını söyleyin, uygun seçeneği bulalım."), ("Uçuş iptal olursa ne olur?", "Ertesi sabaha kaydırma ya da iade seçeneklerini önceden birlikte netleştiriyoruz.")])
    form = lead_form("Tarih ve fiyat sorun", "Kaç kişi ve hangi tarihler, yazmanız yeterli.", ["Kapadokya balon turu"], extra='<div class="row2">' + field("Tarih", "tarih", "date") + field("Kişi sayısı", "kisi", "number", "2") + "</div>", cta="Fiyat alın", ph="Örneğin: mağara otel olsun")
    return detail("Kapadokya balon turu", "Kapadokya balon turu", "Göreme, Nevşehir", ["kapadokya.svg", "karadeniz.svg", "yol.svg"],
                  [("balloon", "Balon uçuşu"), ("van", "Ankara çıkışlı"), ("bed", "1-2 gece (TEST)"), ("people", "Grup ya da özel")],
                  [("program", "Program", prog), ("dahil", "Neler dahil", inc), ("sss", "Sık sorulanlar", sss)], form, "kb")


def mavi():
    cmp = ('<table class="compare"><thead><tr><th></th><th>Gulet</th><th>Yat</th></tr></thead><tbody>'
           '<tr><th>Kime uygun</th><td>Kalabalık aileler, arkadaş grupları</td><td>Çiftler ve küçük aileler</td></tr>'
           '<tr><th>Kiralama</th><td>Kabin ya da tüm tekne</td><td>Genellikle tüm tekne</td></tr>'
           '<tr><th>Mürettebat</th><td>Kaptan, aşçı ve yardımcı</td><td>Kaptanlı ya da kaptansız</td></tr>'
           '<tr><th>Tempo</th><td>Sakin, uzun koy molaları</td><td>Daha hızlı, daha çok koy</td></tr></tbody></table>')
    rt = ('<div class="routes"><div><h3>Bodrum ve Gökova</h3><p>Sessiz koylar, çam ormanları, Sedir Adası.</p></div>'
          '<div><h3>Marmaris ve Hisarönü</h3><p>Selimiye, Bozburun ve berrak koylar.</p></div><div><h3>Fethiye ve Göcek</h3><p>On iki adalar ve kumsallar.</p></div></div>'
          '<p class="note">Rotalar örnektir, tekneye ve kaptana göre değişir.</p>')
    inc = '<div class="light"><ul class="ticks"><li>Tekne ve mürettebat</li><li>Kahvaltı, öğle ve akşam yemekleri (pakete göre)</li><li>Ankara\'dan uçak bileti ve havalimanı transferi (isteğe bağlı)</li></ul></div>'
    form = lead_form("Mavi yolculuk planlayalım", "Tarih, kişi sayısı ve tekne tercihi yeterli.", ["Gulet, kabin", "Gulet, tüm tekne", "Yat", "Henüz karar vermedim"],
                     extra='<div class="row2">' + field("Tarih", "tarih", "date") + field("Kişi sayısı", "kisi", "number", "6") + "</div>", cta="Teklif alın", ph="Örneğin: Temmuz ikinci hafta, Göcek'ten çıkış")
    return detail("Mavi yolculuk", "Mavi yolculuk", "Bodrum, Marmaris, Fethiye", ["mavi-yolculuk.svg", "akdeniz.svg", "kibris.svg"],
                  [("boat", "Gulet ya da yat"), ("bed", "7 gece (TEST)"), ("sun", "Mayıs–Ekim"), ("people", "Kabin ya da tüm tekne")],
                  [("tekne", "Gulet mi, yat mı?", cmp), ("rota", "Rotalar", rt), ("dahil", "Neler dahil", inc)], form, "my")


def otel_ucak():
    cities = "".join(f'<a class="popular" style="margin:0" href="/iletisim/?konu=Otel&nereye={quote(c)}#talep"><span class="btn btn-line btn-sm">{c}</span></a>' for c in CITIES)
    return (phead("Otel ve uçak bileti", "Fiyat karşılaştırmayla uğraşmayın. Tarih ve bütçenizi söyleyin, en uygun seçenekleri gönderelim.", "Otel ve uçak")
            + f'<section class="sec"><div class="wrap split"><div><img src="/img/ucak.svg" alt="" style="border-radius:20px;aspect-ratio:3/2;object-fit:cover;width:100%"><h2 style="margin-top:28px">Yurt dışında anlaşmalı otellerimiz</h2><p class="muted">Bu şehirlerde indirimli fiyat alıyoruz. Listede olmayan bir yer için de sorun.</p><div style="display:flex;flex-wrap:wrap;gap:8px">{cities}</div></div>'
              + lead_form("Bilet ve otel isteyin", "Nereden nereye ve hangi tarihler.", ["Uçak bileti", "Otel", "Uçak ve otel birlikte"],
                          extra='<div class="row2">' + field("Nereden", "nereden", ph="Ankara") + field("Nereye", "nereye", ph="Paris") + '</div><div class="row2">' + field("Gidiş", "tarih", "date") + field("Dönüş", "donus", "date") + "</div>",
                          cta="Seçenekleri gönderin", ph="Örneğin: 2 yetişkin 1 çocuk, merkezi otel") + "</div></section>")


def transfer():
    return (phead("Havalimanı transferi", "Esenboğa'dan ya da Esenboğa'ya. Uçuşunuzu takip ederiz, rötar olursa şoförümüz bekler.", "Transfer")
            + f'<section class="sec"><div class="wrap split"><div><img src="/img/yol.svg" alt="" style="border-radius:20px;aspect-ratio:3/2;object-fit:cover;width:100%"><h2 style="margin-top:28px">Sizi nasıl karşılıyoruz?</h2>'
              '<ol class="timeline"><li><b>Uçuşunuzu takip ederiz</b><span>İniş saati değişirse şoförümüz haberdar olur.</span></li><li><b>Çıkışta karşılarız</b><span>Şoförümüz sizi adınızla karşılar, valizlerinize yardım eder.</span></li><li><b>Kapınıza bırakırız</b><span>Ankara içi her adrese, şehirlerarası da olur.</span></li></ol></div>'
              + lead_form("Transfer fiyatı alın", "Uçuş saatiniz ve adresiniz yeterli.", ["Esenboğa'dan adrese", "Adresten Esenboğa'ya", "Gidiş ve dönüş", "Grup transferi"],
                          extra='<div class="row2">' + field("Tarih", "tarih", "date") + field("Saat", "saat", "time") + '</div><div class="row2">' + field("Uçuş numarası", "ucus", ph="TK 2140") + field("Kişi sayısı", "kisi", "number", "2") + "</div>",
                          cta="Fiyat alın", ph="Adres: Çankaya, Ankara. 2 büyük valiz.") + "</div></section>")


def arac():
    fc = lambda s: "kucuk" if s <= 4 else ("grup" if s <= 16 else "buyuk")
    v = "".join(f'<div class="veh" data-cat="{fc(s)}">{ico(i, "")}<h3>{n}</h3><span class="muted">{t}, {u.lower()}</span><span class="cap">{s} yolcu</span>'
                f'<a class="btn btn-line btn-sm" href="/iletisim/?konu=Araç kiralama&not={quote(n)}#talep">Fiyat alın</a></div>' for n, t, s, i, u in FLEET)
    pills = '<div class="pills" data-filter="fleet" role="group" aria-label="Kişi sayısı">' + "".join(
        f'<button type="button" data-cat="{k}" aria-pressed="{str(k == "hepsi").lower()}">{x}</button>' for k, x in [("hepsi", "Hepsi"), ("kucuk", "1–4 kişi"), ("grup", "5–16 kişi"), ("buyuk", "17 kişi ve üstü")]) + "</div>"
    return (phead("Araç kiralama", "Şoförlü ya da şoförsüz. Tek kişilik iş seyahatinden 27 kişilik gruba kadar kendi filomuz.", "Araç kiralama")
            + f'<section class="sec"><div class="wrap">{pills}<div class="fleet" id="fleet">{v}</div><p class="note">Kapasiteler araç modeline göre yazılmıştır (TEST).</p></div></section>')


def vize():
    btn = "".join(f'<button type="button" data-visa="{k}" aria-pressed="false">{v}</button>' for k, v in [("schengen", "Avrupa (Schengen)"), ("ingiltere", "İngiltere"), ("abd", "Amerika")])
    return (phead("Vize, pasaport ve seyahat sigortası", "Evrak listesini çıkarır, randevuyu alır, dosyanızı eksiksiz hazırlarız.", "Vize")
            + f'<section class="sec"><div class="wrap"><div class="visa"><div class="pills" role="group" aria-label="Ülke">{btn}</div><div class="vbox light"><h2 id="visa-title" style="font-size:1.4rem"></h2><ul class="ticks" id="visa-items"></ul>'
              '<p class="note">Bu liste genel bilgi içindir. Konsolosluklar listeyi değiştirebilir, başvurudan önce güncel listeyi birlikte kontrol ederiz.</p></div></div></div></section>'
            + f'<section class="sec sec-mist"><div class="wrap split"><div><h2>Seyahat sağlık sigortası</h2><p class="muted">Vize başvurusunda istenen poliçeyi aynı gün düzenleriz. Vize ile birlikte alırsanız ayrıca uğraşmazsınız.</p></div>'
              + lead_form("Başvurunuzu birlikte hazırlayalım", "Ülke ve seyahat tarihinizi yazın.", ["Schengen vizesi", "İngiltere vizesi", "Amerika vizesi", "Başka bir ülke", "Pasaport", "Seyahat sağlık sigortası"], cta="Beni arayın", ph="Örneğin: Mayıs'ta İtalya, ilk başvuru")
              + f"</div></section><script>window.BTO_VISA={json.dumps(VISA, ensure_ascii=False)}</script>")


def kurumsal():
    svc = "".join(f'<div class="veh">{ico(i, "")}<h3>{t}</h3><span class="muted">{d}</span></div>' for i, t, d in SERVICES if i in ("people", "book", "van", "bed", "plane", "passport"))
    return (phead("Kurumlar için", "Kongre, toplantı, eğitim ve personel ulaşımı. Tek muhatap, tek fatura.", "Kurumsal")
            + f'<section class="sec"><div class="wrap"><div class="fleet">{svc}</div></div></section>'
            + '<section class="sec sec-mist"><div class="wrap split"><div class="light"><img src="/img/ankara.svg" alt="" style="border-radius:20px;aspect-ratio:3/2;object-fit:cover;width:100%"><h2 style="margin-top:28px">Neden kurumlar bizi seçiyor?</h2><ul class="ticks"><li>Ulaşım, konaklama ve salon tek elden</li><li>Kendi araçlarımızla katılımcı transferi</li><li>Kayıt ve karşılama masası</li><li>30 yılı aşkın organizasyon deneyimi</li></ul></div>'
            + lead_form("Kurumsal teklif isteyin", "Etkinliğinizi kısaca anlatın, size özel teklif hazırlayalım.", ["Kongre", "Toplantı ya da seminer", "Personel gezisi", "Personel servisi", "Misafir karşılama"],
                        extra='<div class="row2">' + field("Kurum adı", "kurum") + field("Katılımcı sayısı", "kisi", "number", "120") + "</div>", cta="Teklif alın", ph="Örneğin: Nisan'da 2 günlük kongre")
            + "</div></section>")


def iletisim():
    return (phead("Hakkımızda ve iletişim", "1995'ten beri Ankara'dan yola çıkan yolcuların yanındayız.", "İletişim")
            + f"""<section class="sec"><div class="wrap split"><div>
<h2>BTO Bilimtur</h2><p class="muted">{S['legal']}, 1995 yılında Ankara'da kuruldu. Uçak bileti ve otelle başlayan işimiz bugün turları, havalimanı transferini, araç kiralamayı, vize işlemlerini ve kongre organizasyonlarını kapsıyor.</p>
<div class="trust" style="grid-template-columns:1fr 1fr;margin:24px 0">
<div>{ico("phone", "")}<span><b>Telefon</b><a href="tel:{TEL}">{TEL_SHOW}</a></span></div><div>{ico("wa", "")}<span><b>WhatsApp</b><a href="{WA_URL}">Mesaj gönderin</a></span></div>
<div>{ico("inbox", "")}<span><b>E-posta</b><a href="mailto:{MAIL}">{MAIL}</a></span></div><div>{ico("pin", "")}<span><b>Adres</b><a href="{MAPS}" target="_blank" rel="noopener">{S['address']}, yol tarifi</a></span></div></div>
<p class="muted">Çalışma saatleri: {S['hours']}</p></div>
<div id="talep">{lead_form("Fiyat alın", "Formu doldurun, çalışma saatleri içinde aynı gün sizi arayalım.", TOPICS, extra='<div class="row2">' + field("Nereye", "nereye", ph="Örn: Kapadokya") + field("Tarih", "tarih", "date") + "</div>", cta="Fiyat alın")}</div>
</div></section>""")


def panel():
    return f"""<section class="login" id="login"><h1 style="font-size:1.6rem">Yönetim paneli</h1><p class="muted">Duyuruları, turları ve gelen talepleri buradan yönetin.</p>
<form id="login-f"><label class="field"><span>Şifre</span><input type="password" name="pw" required autocomplete="current-password"></label>
<p class="form-err" role="alert" hidden></p><button class="btn btn-primary btn-block" type="submit">Giriş yap</button></form></section>
<div class="dash" id="dash" hidden><aside role="tablist" aria-label="Panel bölümleri">
<button type="button" role="tab" aria-selected="true" aria-controls="pt-talep" id="pb-talep">{ico("inbox", "")}Gelen talepler <span class="count" id="lead-count" hidden></span></button>
<button type="button" role="tab" aria-selected="false" aria-controls="pt-tur" id="pb-tur" tabindex="-1">{ico("balloon", "")}Turlar</button>
<button type="button" role="tab" aria-selected="false" aria-controls="pt-duyuru" id="pb-duyuru" tabindex="-1">{ico("edit", "")}Duyuru şeridi</button>
<button type="button" id="logout">{ico("globe", "")}Çıkış</button></aside>
<main><div class="warn" id="store-warn" hidden>Kayıt deposu bağlı değil. Talepler sadece e-postayla gelir, içerik değişiklikleri kaydedilemez. Kurulum için YAYIN_REHBERI.md dosyasına bakın.</div>
<section role="tabpanel" id="pt-talep" aria-labelledby="pb-talep"><h2>Gelen talepler</h2><p class="muted">Sitedeki formlardan gelen istekler. Aradığınız kişiyi işaretleyin.</p><div class="pcard" id="leads"><p class="muted">Yükleniyor…</p></div></section>
<section role="tabpanel" id="pt-tur" aria-labelledby="pb-tur" hidden><h2>Turlar</h2><p class="muted">Adı, fiyatı ve kampanya etiketini değiştirin ya da turu yayından kaldırın. Değişiklik sitede yaklaşık 30 saniye içinde görünür.</p>
<table class="ptable"><thead><tr><th>Tur adı</th><th>Tür</th><th>Fiyat (isteğe bağlı)</th><th>Kampanya etiketi</th><th>Durum</th><th></th></tr></thead><tbody id="rows"></tbody></table>
<p style="margin-top:14px;display:flex;gap:10px;flex-wrap:wrap"><button class="btn btn-primary" id="save" type="button">Değişiklikleri kaydet</button><button class="btn btn-line" id="add" type="button">Yeni tur ekle</button><button class="btn btn-line" id="reset" type="button">Varsayılan turlara dön</button></p></section>
<section role="tabpanel" id="pt-duyuru" aria-labelledby="pb-duyuru" hidden><h2>Duyuru şeridi</h2><p class="muted">Sitenin en üstündeki kısa duyuru. Kampanya ya da tatil dönemi çalışma saatleri için kullanın.</p>
<div class="pcard"><label class="switch"><input type="checkbox" id="an-on"> Şeridi göster</label><label class="field" style="margin-top:14px"><span>Duyuru metni</span><input id="an-text" maxlength="140"></label>
<button class="btn btn-primary" id="an-save" type="button">Kaydet</button></div></section></main></div>
<script>window.BTO_DEFAULT_TOURS={json.dumps(TOURS, ensure_ascii=False)}</script><script src="/assets/panel.js?v={{V}}" defer></script>"""


PAGES = [("", "", "Ankara çıkışlı Kapadokya balon turu, mavi yolculuk, yurt dışı otel, uçak bileti, Esenboğa transferi, araç kiralama ve vize. 1995'ten beri BTO Bilimtur.", home),
         ("turlar", "Turlar", "Ankara çıkışlı yurt içi turlar, deniz tatilleri ve yurt dışı gezileri.", turlar),
         ("kapadokya-balon-turu", "Kapadokya balon turu", "Ankara çıkışlı Kapadokya balon turu: ulaşım, otel ve gün doğumunda balon uçuşu tek pakette.", kapadokya),
         ("mavi-yolculuk", "Mavi yolculuk", "Bodrum, Marmaris ve Fethiye'den gulet ve yat ile mavi yolculuk.", mavi),
         ("otel-ucak", "Otel ve uçak bileti", "Yurt içi ve yurt dışı otel rezervasyonu ve uçak bileti.", otel_ucak),
         ("havalimani-transfer", "Esenboğa havalimanı transferi", "Esenboğa havalimanı transferi: uçuş takibi, karşılama, Ankara içi ve şehirlerarası.", transfer),
         ("arac-kiralama", "Araç kiralama", "Ankara'da şoförlü ve şoförsüz araç kiralama. 4 ile 27 kişilik araçlar.", arac),
         ("vize", "Vize ve seyahat sigortası", "Schengen, İngiltere ve Amerika vize başvurusu ve seyahat sağlık sigortası.", vize),
         ("kurumsal", "Kurumsal", "Kongre, toplantı, personel gezisi ve servis organizasyonu.", kurumsal),
         ("iletisim", "Hakkımızda ve iletişim", "BTO Bilimtur iletişim bilgileri ve fiyat alma formu.", iletisim)]


def wrap(slug, title, desc, body, opts):
    path = "/" if slug in ("", "404") else f"/{slug}/"
    return (head("premium", title, desc, path, FONTS, body_class="pbody" if slug == "panel" else "", noindex=opts.get("noindex", False))
            + header(path) + f'<main id="icerik">{body}</main>' + ("" if slug == "panel" else footer())
            + ('<div class="toast" id="toast" role="status" aria-live="polite"></div>' if slug == "panel" else "")
            + tail(f'<script src="/assets/premium.js?v={{V}}" defer></script>'))


def build(out):
    css = (SRC / "premium2.css").read_text() + (SRC / "common-ui.css").read_text()
    pages = [(s, t, d, f(), {}) for s, t, d, f in PAGES] + [("panel", "Yönetim paneli", "Yönetim paneli", panel(), {"noindex": True})]
    urls = write_site("premium", out, pages, wrap, css, api=("lead", "content", "leads", "login"), images=all_svgs())
    (out / "assets" / "premium.js").write_text((SRC / "premium2.js").read_text())
    (out / "assets" / "panel.js").write_text((SRC / "panel.js").read_text())
    return urls
