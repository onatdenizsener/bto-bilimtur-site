"""Üç sitenin uçtan uca testi: tarama (kırık link), formlar, panel, içerik yansıması."""
import asyncio, subprocess, time, os, re, sys
from urllib.parse import urljoin, urlparse
from playwright.async_api import async_playwright

ENV = dict(os.environ, BTO_MEMORY_STORE="1", ADMIN_PASSWORD="test-sifre")
fails = []


def check(cond, msg):
    print(("  ok   " if cond else "  HATA ") + msg)
    if not cond:
        fails.append(msg)


async def crawl(pg, base, errs):
    seen, todo, pages = set(), ["/"], 0
    while todo:
        path = todo.pop()
        if path in seen: continue
        seen.add(path)
        r = await pg.goto(base + path)
        check(r.status == 200, f"{path} -> {r.status}")
        pages += 1
        for h in await pg.eval_on_selector_all("a[href]", "els=>els.map(e=>e.getAttribute('href'))"):
            u = urlparse(urljoin(base + path, h))
            if u.netloc == urlparse(base).netloc and u.path not in seen and not u.path.startswith("/api"):
                todo.append(u.path)
        for s in await pg.eval_on_selector_all("img[src]", "els=>els.map(e=>e.getAttribute('src'))"):
            rr = await pg.request.get(urljoin(base + path, s))
            check(rr.status == 200, f"görsel {s} ({path})")
    for f in ("/sitemap.xml", "/robots.txt", "/favicon.svg", "/og.png", "/apple-touch-icon.png"):
        rr = await pg.request.get(base + f); check(rr.status == 200, f"{f}")
    rr = await pg.request.get(base + "/olmayan-sayfa/"); check(rr.status == 404, "olmayan sayfa 404 veriyor")
    return pages


async def submit_first_form(pg, base, path):
    await pg.goto(base + path)
    f = pg.locator("[data-form] form").first
    await f.scroll_into_view_if_needed()
    await f.locator("button[type=submit]").click()
    err = pg.locator("[data-form] .form-err").first
    check(await err.is_visible(), f"{path}: boş formda hata mesajı görünüyor ({await err.inner_text()})")
    await f.locator("[name=ad]").fill("Deneme Kişi"); await f.locator("[name=tel]").fill("0555 111 22 33")
    await f.locator("button[type=submit]").click()
    check("aydınlatma" in (await err.inner_text()).lower(), f"{path}: KVKK onayı olmadan gönderilmiyor")
    await f.locator("[name=kvkk]").check()
    await pg.wait_for_timeout(2600)  # bot süresi eşiği
    await f.locator("button[type=submit]").click()
    ok = pg.locator("[data-form] .form-ok").first
    await ok.wait_for(state="visible", timeout=5000)
    check(await ok.is_visible(), f"{path}: form gönderildi, teşekkür mesajı görünüyor")


async def run(tier, port):
    print(f"\n== {tier}")
    srv = subprocess.Popen(["node", "devserver.mjs", f"dist/{tier}", str(port)], env=ENV, stdout=subprocess.DEVNULL)
    time.sleep(0.8)
    base = f"http://localhost:{port}"
    try:
        async with async_playwright() as p:
            b = await p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
            pg = await b.new_page(viewport={"width": 1400, "height": 900})
            errs = []
            pg.on("pageerror", lambda e: errs.append(str(e)))
            await pg.route(re.compile(r"fonts\.(googleapis|gstatic)"), lambda r: r.abort())
            n = await crawl(pg, base, errs)
            print(f"  {n} sayfa tarandı")
            forms = {"baslangic": ["/"], "kurumsal": ["/iletisim/", "/arac-transfer/"],
                     "premium": ["/iletisim/", "/kapadokya-balon-turu/", "/havalimani-transfer/", "/vize/"]}[tier]
            for path in forms:
                await submit_first_form(pg, base, path)
            # mobil menü
            m = await b.new_page(viewport={"width": 390, "height": 844})
            await m.route(re.compile(r"fonts\.(googleapis|gstatic)"), lambda r: r.abort())
            await m.goto(base + "/"); await m.click(".menu-btn")
            check(await m.locator("#menu").is_visible(), "mobil menü açılıyor")
            sw = await m.evaluate("document.documentElement.scrollWidth")
            check(sw <= 390, f"mobilde yatay taşma yok (genişlik {sw})")
            if tier == "kurumsal":
                await pg.goto(base + "/turlar/"); await pg.click('[data-filter] [data-cat="yurtdisi"]')
                check(await pg.locator("#katalog-tum li:visible").count() == 2, "tur filtresi çalışıyor")
            if tier == "premium":
                await premium(pg, base)
            check(not errs, f"JS hatası yok {errs}")
            await b.close()
    finally:
        srv.kill()


async def premium(pg, base):
    # arama kutusu -> fiyat formu dolu geliyor
    await pg.goto(base + "/")
    await pg.click("#t-transfer")
    await pg.locator("#p-transfer [name=tarih]").fill("2026-12-20")
    await pg.locator("#p-transfer button[type=submit]").click()
    await pg.wait_for_url("**/iletisim/**")
    check("Havalimanı transferi" == await pg.locator("#talep select[name=konu]").input_value(), "arama kutusu: konu forma taşındı")
    check("2026-12-20" in await pg.locator("#talep textarea[name=not]").input_value(), "arama kutusu: seçimler forma taşındı")
    # filtre
    await pg.goto(base + "/turlar/"); await pg.click('[data-filter="tourgrid"] [data-cat="deniz"]')
    check(await pg.locator("#tourgrid .card:visible").count() == 2, "tur filtresi çalışıyor")
    # panel
    await pg.goto(base + "/panel/")
    await pg.fill("[name=pw]", "yanlis"); await pg.click("#login-f button")
    await pg.wait_for_timeout(400)
    check(await pg.locator("#login .form-err").is_visible(), "yanlış şifre reddediliyor")
    await pg.fill("[name=pw]", "test-sifre"); await pg.click("#login-f button")
    await pg.locator("#dash").wait_for(state="visible")
    await pg.wait_for_timeout(600)
    txt = await pg.locator("#leads").inner_text()
    check("Deneme Kişi" in txt, "panel: formdan gelen talepler listeleniyor")
    check(await pg.locator("#lead-count").inner_text() == "4", "panel: açık talep sayısı 4")
    await pg.locator("#leads input[data-lead]").first.check(); await pg.wait_for_timeout(500)
    check(await pg.locator("#lead-count").inner_text() == "3", "panel: 'Arandı' işareti kaydediliyor")
    await pg.click("#pb-tur")
    r1 = pg.locator("#rows tr").nth(0)
    await r1.locator("[data-k=price]").fill("4.950 TL"); await r1.locator("[data-k=badge]").fill("Son 3 yer")
    await pg.locator("#rows tr").nth(1).locator("[data-k=on]").uncheck()
    await pg.click("#save"); await pg.wait_for_timeout(500)
    await pg.click("#pb-duyuru"); await pg.check("#an-on"); await pg.fill("#an-text", "Yılbaşında ofisimiz kapalıdır."); await pg.click("#an-save")
    await pg.wait_for_timeout(500)
    await pg.goto(base + "/"); await pg.wait_for_timeout(800)
    f = await pg.locator("#featured").inner_text()
    check("4.950 TL" in f and "Son 3 yer" in f, "site: panelde girilen fiyat ve etiket görünüyor")
    check("Mavi yolculuk" not in f, "site: yayından kaldırılan tur gizlendi")
    check("Yılbaşında" in await pg.locator("#announce").inner_text(), "site: duyuru şeridi görünüyor")
    st = await pg.request.put(base + "/api/content", data={"tours": []}, headers={"Authorization": "Bearer yanlis"})
    check(st.status == 401, "API: şifresiz içerik değişikliği reddediliyor")
    st = await pg.request.get(base + "/api/leads")
    check(st.status == 401, "API: şifresiz talep listesi reddediliyor")


async def main():
    tiers = sys.argv[1:] or ["baslangic", "kurumsal", "premium"]
    for i, t in enumerate(tiers):
        await run(t, 5600 + i)
    print("\nSONUÇ:", "tüm kontroller geçti" if not fails else f"{len(fails)} hata")
    for f in fails: print("  -", f)

asyncio.run(main())
