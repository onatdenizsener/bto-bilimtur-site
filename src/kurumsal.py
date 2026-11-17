from parts import *
from data import TOURS, CATS, FLEET, SERVICES, CITIES

NAV = [("Anasayfa", "#/"), ("Turlar", "#/turlar"), ("Araç ve transfer", "#/arac-transfer"),
       ("Hizmetler", "#/hizmetler"), ("İletişim", "#/iletisim")]
LINKS = dict(ucak="#/hizmetler", otel="#/hizmetler", vize="#/hizmetler", transfer="#/arac-transfer",
             arac="#/arac-transfer", balon="#/turlar", mavi="#/turlar", tur="#/turlar", kurum="#/hizmetler")


def phead(title, lead, crumb):
    return (f'<section class="phead"><div class="wrap"><div><div class="crumb"><a href="#/">Anasayfa</a> / {crumb}</div>'
            f'<h1>{title}</h1></div><p class="lead">{lead}</p></div></section>')


def tour_card(t, feature=False, href="#/iletisim", more="Tarih ve fiyat sorun"):
    return (f'<a class="tour{" feature" if feature else ""}" data-cat="{t["cat"]}" href="{href}">'
            f'<div class="art">{ico(t["icon"], "")}</div><h3>{t["title"]}</h3><p>{t["text"]}</p>'
            f'<span class="more">{more}</span></a>')


def cta(title="Gitmek istediğiniz yeri söyleyin, planı biz çıkaralım."):
    return (f'<section class="sec"><div class="wrap"><div class="cta-band"><h2>{title}</h2>'
            f'{call_buttons(sun=True)}</div></div></section>')


def fleet_table(btn_href="#/iletisim"):
    rows = "".join(
        f'<tr><td><span class="veh">{ico(i, "")}{n}</span></td><td class="hide-m">{t}</td><td><span class="seats">{s}</span> yolcu</td>'
        f'<td class="hide-m">{u}</td><td><a class="btn btn-wa" href="{btn_href}">Fiyat sor</a></td></tr>'
        for n, t, s, i, u in FLEET)
    return ('<table class="fleet"><thead><tr><th>Araç</th><th>Sınıf</th><th>Kapasite</th><th>En uygun olduğu iş</th><th></th></tr></thead>'
            f'<tbody>{rows}</tbody></table>')


def build():
    home = f"""<div data-page="home" class="on">
{hero()}
<section class="sec"><div class="wrap">
<div class="sec-head"><h2 class="reveal">Yolculuğun her adımında yanınızdayız</h2>
<p class="lead">Gitmeden önceki hazırlıktan döndüğünüz ana kadar, ihtiyacınız olan her şey tek yerde.</p></div>
{journey(LINKS)}
</div></section>
<section class="sec sec-sky"><div class="wrap">
<div class="sec-head"><h2 class="reveal">Bu sezon en çok sorulanlar</h2><p class="lead">Tüm turları görmek için <a href="#/turlar">Turlar</a> sayfasına bakın.</p></div>
<div class="tours">{tour_card(TOURS[0], True)}{tour_card(TOURS[1])}{tour_card(TOURS[3])}</div>
</div></section>
<section class="sec"><div class="wrap">
<div class="sec-head"><h2 class="reveal">Üç adımda yoldasınız</h2><p class="lead">Formlarla, bekleme müziğiyle uğraşmazsınız.</p></div>
{steps()}
</div></section>
{why()}
{cta()}
</div>"""

    turlar = f"""<div data-page="turlar" data-title="Turlar">
{phead("Turlar", "Grup turuna katılın ya da tarihi ve rotayı siz seçin. Ankara'dan ulaşım her pakette ayarlanır.", "Turlar")}
<section class="sec"><div class="wrap">
<div class="chips" data-for="tourgrid" role="group" aria-label="Tur türü">{"".join(f'<button type="button" data-cat="{k}" aria-pressed="{str(k=="hepsi").lower()}">{v}</button>' for k,v in CATS)}</div>
<div class="tours" id="tourgrid">{"".join(tour_card(t, i==0) for i,t in enumerate(TOURS))}</div>
</div></section>
<section class="sec sec-sky"><div class="wrap split">
<div><h2 class="reveal">Yurt dışında otel arıyorsanız</h2><p class="lead">Avrupa'dan Amerika'ya anlaşmalı otellerimizde indirimli fiyat alırız. Uçak ve vizeyle birlikte planlayalım.</p>{call_buttons()}</div>
<ul class="cities">{"".join(f"<li>{c}</li>" for c in CITIES)}</ul>
</div></section>
</div>"""

    arac = f"""<div data-page="arac-transfer" data-title="Araç ve transfer">
{phead("Araç kiralama ve havalimanı transferi", "Kendi filomuzla, şoförlü ya da şoförsüz. Esenboğa'da adınızın yazılı olduğu tabelayla karşılanırsınız.", "Araç ve transfer")}
<section class="sec"><div class="wrap split">
<div><h2 class="reveal">Havalimanı transferi</h2>
<p class="lead">Uçuş numaranızı verin, gerisini takip edelim. Uçağınız rötar yaparsa şoförümüz bekler.</p>
<ul class="checks"><li>Esenboğa ve Ankara içi her adres</li><li>Gece ve sabah erken uçuşlar</li><li>Bebek koltuğu isteğe göre</li><li>Grup ve kongre katılımcıları için toplu transfer</li></ul></div>
{form_box("Transfer fiyatı alın", "Nereden nereye ve ne zaman, yazmanız yeterli.", ["Havalimanı transferi", "Şehir içi transfer", "Şehirlerarası transfer", "Grup transferi"], cta="Fiyat isteyin", ph="Örneğin: 12 Mart 06:40 Esenboğa'dan Çankaya'ya, 3 kişi")}
</div></section>
<section class="sec sec-sky"><div class="wrap">
<div class="sec-head"><h2 class="reveal">Filomuz</h2><p class="lead">Tek kişilik iş seyahatinden 27 kişilik gruba kadar.</p></div>
{fleet_table()}
</div></section>
{cta("Hangi aracın size uygun olduğunu bilmiyorsanız sorun, birlikte seçelim.")}
</div>"""

    svc = "".join(f'<article>{ico(i, "")}<div><h3>{t}</h3><p>{d}</p></div></article>' for i, t, d in SERVICES)
    hizmet = f"""<div data-page="hizmetler" data-title="Hizmetler">
{phead("Tüm hizmetlerimiz", "Bileti, oteli, evrakı ve aracı ayrı ayrı yerlerden ayarlamakla uğraşmayın.", "Hizmetler")}
<section class="sec"><div class="wrap"><div class="svc">{svc}</div></div></section>
<section class="sec sec-sky"><div class="wrap">
<div class="sec-head"><h2 class="reveal">Sık sorulanlar</h2><p class="lead">Başka bir sorunuz varsa bir telefon uzağınızdayız.</p></div>
{faq()}
</div></section>
</div>"""

    iletisim = f"""<div data-page="iletisim" data-title="İletişim">
{phead("Hakkımızda ve iletişim", "1995'ten beri Ankara'dan yola çıkan yolcuların yanındayız.", "İletişim")}
<section class="sec"><div class="wrap split">
<div><h2 class="reveal">BTO Bilimtur kimdir?</h2>
<p>BTO Bilimtur Turizm Organizasyon Transfer, 1995 yılında Ankara'da kuruldu. Uçak bileti ve otelle başlayan işimiz bugün turları, havalimanı transferini, araç kiralamayı, vize işlemlerini ve kongre organizasyonlarını kapsıyor.</p>
<p>Değişmeyen tek şey çalışma şeklimiz: yolcuyu bir kez dinlemek, işi baştan sona üstlenmek ve yolculuk bitene kadar ulaşılabilir olmak.</p></div>
<div class="why" style="grid-template-columns:1fr"><div><div class="big" style="color:var(--teal)">30+</div><p class="lead">yıldır Ankara'da</p></div></div>
</div></section>
<section class="sec sec-sky"><div class="wrap">
<div class="sec-head"><h2 class="reveal">Bize ulaşın</h2><p class="lead">Arayın, yazın ya da formu doldurun. Size aynı gün dönüyoruz.</p></div>
{contact()}
</div></section>
</div>"""

    return (head("BTO Bilimtur", (SRC / "multi.css").read_text())
            + header(NAV, multipage=True)
            + "<main>" + home + turlar + arac + hizmet + iletisim + "</main>"
            + footer()
            + script((SRC / "router.js").read_text()))
