from parts import *

NAV = [("Hizmetler", "#hizmetler"), ("Nasıl çalışır", "#nasil"), ("Sorular", "#sorular"), ("İletişim", "#iletisim")]


def build():
    return (head("BTO Bilimtur | Ankara tur, transfer, uçak bileti")
            + header(NAV)
            + "<main>"
            + hero()
            + f"""<section class="sec" id="hizmetler"><div class="wrap">
<div class="sec-head"><h2 class="reveal">Yolculuğun her adımında yanınızdayız</h2>
<p class="lead">Gitmeden önceki hazırlıktan döndüğünüz ana kadar, ihtiyacınız olan her şey tek yerde.</p></div>
{journey()}
</div></section>
<section class="sec sec-sky" id="nasil"><div class="wrap">
<div class="sec-head"><h2 class="reveal">Üç adımda yoldasınız</h2><p class="lead">Formlarla, bekleme müziğiyle uğraşmazsınız.</p></div>
{steps()}
</div></section>
{why()}
<section class="sec" id="sorular"><div class="wrap">
<div class="sec-head"><h2 class="reveal">Sık sorulanlar</h2><p class="lead">Aklınıza takılan başka bir şey varsa bir telefon uzağınızdayız.</p></div>
{faq()}
</div></section>
<section class="sec sec-sky" id="iletisim"><div class="wrap">
<div class="sec-head"><h2 class="reveal">Nereye gitmek istersiniz?</h2><p class="lead">Arayın, yazın ya da formu doldurun. Size aynı gün dönüyoruz.</p></div>
{contact()}
</div></section>"""
            + "</main>"
            + footer()
            + script())
