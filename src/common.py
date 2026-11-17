"""Üç sürümün paylaştığı yayın altyapısı: sayfa yazıcı, head/SEO, formlar, yasal metinler."""
import json, pathlib, shutil, html
from config import SITE
from parts import ico, _I

SRC = pathlib.Path(__file__).parent
S = SITE
WA_URL = f"https://wa.me/{S['wa']}"
TEL = S["tel"]; TEL_SHOW = S["tel_show"]; MAIL = S["mail"]


def jsonld(path):
    d = {"@context": "https://schema.org", "@type": "TravelAgency", "name": S["name"], "legalName": S["legal"],
         "url": S["url"] + "/", "telephone": S["tel"], "email": S["mail"], "foundingDate": str(S["founded"]),
         "address": {"@type": "PostalAddress", "addressLocality": "Ankara", "addressCountry": "TR"},
         "areaServed": "TR"}
    return f'<script type="application/ld+json">{json.dumps(d, ensure_ascii=False)}</script>'


def head(tier, title, desc, path, fonts, body_class="", noindex=False):
    full = f"{title} | {S['name']}" if title else f"{S['name']} | Ankara tur, transfer, uçak bileti ve otel"
    url = S["url"] + path
    robots = '<meta name="robots" content="noindex">' if (noindex or S["preview"]) else ""
    banner = '<div class="preview-bar" role="note">Tasarım önizlemesidir.</div>' if S["preview"] else ""
    return f"""<!doctype html>
<html lang="tr" data-wa="{S['wa']}" data-tel="{S['tel']}">
<head>
<script>document.documentElement.classList.add('js')</script>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{html.escape(full)}</title>
<meta name="description" content="{html.escape(desc)}">
{robots}
<link rel="canonical" href="{url}">
<meta property="og:type" content="website"><meta property="og:locale" content="tr_TR">
<meta property="og:title" content="{html.escape(full)}"><meta property="og:description" content="{html.escape(desc)}">
<meta property="og:url" content="{url}"><meta property="og:image" content="{S['url']}/og.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#ffffff">
<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?{fonts}&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/site.css?v={{V}}">
{jsonld(path)}
</head>
<body class="{body_class}" data-tier="{tier}">
{banner}<a class="skip" href="#icerik">İçeriğe geç</a>
"""


def tail(extra_js=""):
    return f'<script src="/assets/site.js?v={{V}}" defer></script>{extra_js}\n</body></html>'


def field(label, name, type_="text", ph="", req=False, auto=""):
    return (f'<label class="field"><span>{label}</span><input name="{name}" type="{type_}"'
            + (f' placeholder="{html.escape(ph)}"' if ph else "") + (" required" if req else "")
            + (f' autocomplete="{auto}"' if auto else "") + "></label>")


def lead_form(title, note, topics, extra="", cta="Beni arayın", ph="Örneğin: 2 kişi, Mayıs sonu, Kapadokya", cls="form", id_=""):
    opts = "".join(f"<option>{html.escape(t)}</option>" for t in topics)
    return f"""<div class="{cls}" data-form{f' id="{id_}"' if id_ else ''}>
<h3 class="form-title">{title}</h3><p class="form-note">{note}</p>
<form novalidate>
<div class="row2">{field("Adınız", "ad", req=True, auto="name")}{field("Telefonunuz", "tel", "tel", "05xx xxx xx xx", True, "tel")}</div>
{extra}<label class="field"><span>Konu</span><select name="konu">{opts}</select></label>
<label class="field"><span>Kısaca anlatın (isteğe bağlı)</span><textarea name="not" rows="3" placeholder="{html.escape(ph)}"></textarea></label>
<label class="hp" aria-hidden="true">Web sitesi<input name="website" tabindex="-1" autocomplete="off"></label>
<label class="consent"><input type="checkbox" name="kvkk" required> <span><a href="/kvkk/" target="_blank">Aydınlatma metnini</a> okudum, bu talep için aranmayı kabul ediyorum.</span></label>
<p class="form-err" role="alert" hidden></p>
<button class="btn btn-primary btn-block" type="submit">{cta}</button>
</form>
<div class="form-ok" role="status" tabindex="-1" hidden><b>Talebiniz bize ulaştı.</b> Çalışma saatleri içinde en kısa sürede sizi arayacağız.</div>
</div>"""


def legal_pages():
    adr = S["address_full"]
    kvkk = f"""<h1>Kişisel verilerin korunması aydınlatma metni</h1>
<p>Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu'nun 10. maddesi uyarınca, veri sorumlusu sıfatıyla {S['legal']} ("Şirket") tarafından hazırlanmıştır.</p>
<h2>Veri sorumlusu</h2><p>{S['legal']}<br>Adres: {adr}<br>Telefon: {TEL_SHOW}<br>E-posta: {MAIL}<br>MERSİS: {S['mersis']}</p>
<h2>Hangi verileri işliyoruz?</h2><p>Web sitemizdeki formlar aracılığıyla bize ilettiğiniz ad, telefon numarası ve talebinizle ilgili yazdığınız bilgiler (tarih, kişi sayısı, gidilecek yer, not gibi).</p>
<h2>Hangi amaçla işliyoruz?</h2><p>Talebinize dönüş yapmak, size teklif hazırlamak ve istediğiniz hizmeti (tur, bilet, otel, transfer, araç kiralama, vize) planlamak.</p>
<h2>Hukuki sebep</h2><p>Kanun'un 5/2-c maddesi uyarınca bir sözleşmenin kurulması için gerekli olması ve 5/2-f maddesi uyarınca meşru menfaatimiz.</p>
<h2>Kimlere aktarılabilir?</h2><p>Talebinizin yerine getirilmesi için gerekli olduğu ölçüde havayolu şirketleri, oteller ve konsolosluklar gibi hizmet sağlayıcılara; ayrıca web sitemizin barındırma ve e-posta altyapısını sağlayan hizmet sağlayıcılara (yurt dışında bulunabilir).</p>
<h2>Saklama süresi</h2><p>Talep kayıtları en fazla 2 yıl saklanır, ardından silinir.</p>
<h2>Haklarınız</h2><p>Kanun'un 11. maddesi uyarınca verilerinizin işlenip işlenmediğini öğrenme, düzeltilmesini veya silinmesini isteme haklarına sahipsiniz. Başvurularınızı {MAIL} adresine iletebilirsiniz.</p>
<p class="muted">Son güncelleme: Kasım 2026. [TEST: metin bir hukukçu tarafından kontrol edilmeli.]</p>"""
    giz = f"""<h1>Gizlilik ve çerez politikası</h1>
<p>Bu sitede reklam veya takip çerezi kullanılmaz. Ziyaretinizle ilgili herhangi bir profil oluşturulmaz.</p>
<h2>Formlar</h2><p>Formlara yazdığınız bilgiler yalnızca talebinize dönüş yapmak için kullanılır. Ayrıntılar için <a href="/kvkk/">aydınlatma metnine</a> bakın.</p>
<h2>Teknik veriler</h2><p>Sitenin barındırıldığı altyapı, güvenlik ve hata takibi amacıyla IP adresi gibi teknik kayıtları kısa süreli tutabilir. Kötüye kullanımı önlemek için form gönderimlerinde IP adresi bir saatlik sayaçta kullanılır.</p>
<h2>Yazı tipleri</h2><p>Sitedeki yazı tipleri Google Fonts üzerinden yüklenir.</p>
<h2>İletişim</h2><p>{S['legal']}, {adr}, {MAIL}</p>
<p class="muted">Son güncelleme: Kasım 2026.</p>"""
    return [("kvkk", "Aydınlatma metni", "Kişisel verilerin korunması aydınlatma metni.", kvkk),
            ("gizlilik", "Gizlilik ve çerez politikası", "Gizlilik ve çerez politikası.", giz)]


def write_site(tier, out, pages, wrap, css, js_extra="", api=("lead",), images=None):
    """pages: [(slug, title, desc, body_html, opts)]; wrap(slug, body, legal=False) -> full page html."""
    import hashlib
    if out.exists():
        shutil.rmtree(out)
    (out / "assets").mkdir(parents=True)
    (out / "api").mkdir()
    js = (SRC / "site.js").read_text() + "\n" + js_extra
    v = hashlib.sha1((css + js).encode()).hexdigest()[:8]
    (out / "assets" / "site.css").write_text(css)
    (out / "assets" / "site.js").write_text(js)
    urls = []
    for slug, title, desc, body, opts in pages + [(s, t, d, f'<article class="legal">{b}</article>', {"legal": True}) for s, t, d, b in legal_pages()]:
        d = out if slug == "" else out / slug
        d.mkdir(parents=True, exist_ok=True)
        page = wrap(slug, title, desc, body, opts).replace("{V}", v)
        (d / "index.html").write_text(page)
        if not opts.get("noindex"):
            urls.append(S["url"] + ("/" + slug + "/" if slug else "/"))
    nf = wrap("404", "Sayfa bulunamadı", "Aradığınız sayfa bulunamadı.",
              '<section class="notfound"><h1>Bu sayfa yok.</h1><p>Adres değişmiş ya da yanlış yazılmış olabilir.</p>'
              f'<p><a class="btn btn-primary" href="/">Ana sayfaya dönün</a> <a class="btn btn-line" href="tel:{TEL}">{TEL_SHOW}</a></p></section>',
              {"noindex": True}).replace("{V}", v)
    (out / "404.html").write_text(nf)
    (out / "sitemap.xml").write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
                                     + "".join(f"<url><loc>{u}</loc></url>" for u in urls) + "</urlset>\n")
    (out / "robots.txt").write_text(f"User-agent: *\nDisallow: /api/\nDisallow: /panel/\nSitemap: {S['url']}/sitemap.xml\n")
    for f in ("_lib",) + tuple(api):
        shutil.copy(SRC / "api" / f"{f}.js", out / "api" / f"{f}.js")
    (out / "package.json").write_text(json.dumps({"name": f"bto-{tier}", "private": True, "type": "module",
                                                  "engines": {"node": ">=20"}}, indent=2) + "\n")
    (out / "vercel.json").write_text(json.dumps({
        "cleanUrls": True, "trailingSlash": True,
        "headers": [
            {"source": "/(.*)", "headers": [
                {"key": "X-Content-Type-Options", "value": "nosniff"},
                {"key": "Referrer-Policy", "value": "strict-origin-when-cross-origin"},
                {"key": "X-Frame-Options", "value": "DENY"},
                {"key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()"}]},
            {"source": "/assets/(.*)", "headers": [{"key": "Cache-Control", "value": "public, max-age=31536000, immutable"}]},
            {"source": "/img/(.*)", "headers": [{"key": "Cache-Control", "value": "public, max-age=604800"}]}]}, indent=2) + "\n")
    for name in ("favicon.svg", "apple-touch-icon.png", "og.png"):
        p = SRC / "static" / tier / name
        if not p.exists():
            p = SRC / "static" / name
        if p.exists():
            shutil.copy(p, out / name)
    if images:
        (out / "img").mkdir()
        for name, svg in images.items():
            (out / "img" / name).write_text(svg)
    return urls
