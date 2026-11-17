"""dist/<paket> sitesini Claude önizlemesi için tek sayfaya çevirir: sayfalar #görünüm olur, CSS/JS gömülür,
görseller yanında img/ klasöründe durur. Formlar 'önizleme' notuyla başarılı görünür. Panel önizlemede yoktur.
Kullanım: python3 preview.py baslangic kurumsal premium"""
import re, sys, pathlib, shutil

ROOT = pathlib.Path(__file__).parent
ROUTER = """<script>(function(){
var views=[].slice.call(document.querySelectorAll('[data-view]'));
function go(){var h=decodeURIComponent(location.hash.slice(1))||'ana-sayfa';var v=null,t=null;
views.forEach(function(x){if(x.dataset.view===h)v=x});
if(!v){t=document.getElementById(h);v=t&&t.closest('[data-view]')}
if(!v)v=views[0];
views.forEach(function(x){x.hidden=x!==v});
document.querySelectorAll('.nav a').forEach(function(a){var k=(a.getAttribute('href')||'').slice(1);if(k===v.dataset.view)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
var m=document.getElementById('menu');if(m)m.classList.remove('open');
if(t){setTimeout(function(){t.scrollIntoView()},30)}else window.scrollTo(0,0);
document.querySelectorAll('.reveal').forEach(function(e){e.classList.add('in')});}
window.addEventListener('hashchange',go);go();})();</script>"""


def link(m):
    attr, url = m.group(1), m.group(2)
    if url.startswith("//") or not url.startswith("/"):
        return m.group(0)
    if attr == "src" or url.startswith(("/img/", "/favicon", "/og.", "/apple")):
        return f'{attr}="{url[1:]}"'
    path, _, frag = url.partition("#")
    path = path.split("?")[0].strip("/")
    target = frag or (path or "ana-sayfa")
    return f'{attr}="#{target}"'


def build(tier):
    d = ROOT / "dist" / tier
    pages = []
    for f in sorted(d.rglob("index.html")):
        slug = str(f.parent.relative_to(d)).replace(".", "") or "ana-sayfa"
        if slug in ("panel",):
            continue
        pages.append((slug, f.read_text()))
    pages.sort(key=lambda p: p[0] != "ana-sayfa")
    home = pages[0][1]
    head = home[:home.index("<body")]
    body_open = re.search(r"<body[^>]*>", home).group(0)
    before_main = home[home.index(body_open) + len(body_open):home.index('<main id="icerik">')]
    after_main = home[home.index("</main>") + 7:home.index('<script src="/assets/site.js')]
    css = (d / "assets" / "site.css").read_text()
    js = (d / "assets" / "site.js").read_text()
    if (d / "assets" / "premium.js").exists():
        js += "\n" + (d / "assets" / "premium.js").read_text()
    head = re.sub(r'<link rel="stylesheet" href="/assets/site.css[^"]*">', f"<style>{css}</style>", head)
    head = re.sub(r'<link rel="(icon|apple-touch-icon|canonical)"[^>]*>', "", head)
    head = head.replace("<head>", '<head>\n<meta name="robots" content="noindex">', 1)
    views = []
    for slug, html in pages:
        main = html[html.index('<main id="icerik">') + 18:html.index("</main>")]
        extra = "".join(re.findall(r"<script>window\.BTO_VISA=.*?</script>", main))
        main = re.sub(r"<script>window\.BTO_VISA=.*?</script>", "", main)
        views.append((f'<div data-view="{slug}"' + ("" if slug == "ana-sayfa" else " hidden") + f">{main}</div>", extra))
    extras = "".join(e for _, e in views)
    out = (head + body_open + '\n<div class="preview-bar" role="note">Tasarım önizlemesidir. Formlar ve panel yayındaki sitede çalışır.</div>'
           + before_main + '<main id="icerik">' + "".join(v for v, _ in views) + "</main>" + after_main
           + "<script>window.BTO_PREVIEW=true</script>" + extras + f"<script>{js}</script>" + ROUTER + "</body></html>")
    out = re.sub(r'(href|src)="([^"]*)"', link, out)
    o = ROOT / "preview" / tier
    if o.exists():
        shutil.rmtree(o)
    o.mkdir(parents=True)
    (o / "index.html").write_text(out)
    if (d / "img").exists():
        shutil.copytree(d / "img", o / "img")
    print(tier, len(pages), "görünüm", len(out) // 1024, "KB")


for t in sys.argv[1:] or ["baslangic", "kurumsal", "premium"]:
    build(t)
