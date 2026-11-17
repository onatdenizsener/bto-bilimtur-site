"""Premium için destinasyon çizimleri (1200x800 SVG). Gerçek fotoğraf gelince img/ altındaki dosya değiştirilir."""
import random


def _svg(defs, body, label):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" role="img" aria-label="{label}">'
            f"<defs>{defs}</defs>{body}</svg>")


def _sky(id_, stops):
    s = "".join(f'<stop offset="{o}" stop-color="{c}"/>' for o, c in stops)
    return f'<linearGradient id="{id_}" x1="0" y1="0" x2="0" y2="1">{s}</linearGradient>'


def _balloon(x, y, s, c1, c2):
    return (f'<g transform="translate({x},{y}) scale({s})"><path d="M0,0 C-30,0 -36,36 -19,55 L-8,68 L8,68 L19,55 C36,36 30,0 0,0Z" fill="{c1}"/>'
            f'<path d="M0,0 C-11,0 -13,36 -7,55 L-3,68 L3,68 L7,55 C13,36 11,0 0,0Z" fill="{c2}"/>'
            '<path d="M-8,68 L-6,78 M8,68 L6,78" stroke="#4a2c1a" stroke-width="1.5"/><rect x="-7" y="78" width="14" height="11" rx="2" fill="#7a4a26"/></g>')


def kapadokya():
    r = random.Random(3)
    d = _sky("s", [(0, "#F7A26B"), (0.45, "#FBC98E"), (1, "#FCE6C4")]) + '<radialGradient id="sun"><stop offset="0" stop-color="#FFF4D6"/><stop offset="1" stop-color="#FFF4D6" stop-opacity="0"/></radialGradient>'
    b = '<rect width="1200" height="800" fill="url(#s)"/><circle cx="820" cy="520" r="260" fill="url(#sun)"/><circle cx="820" cy="520" r="70" fill="#FFF1C9"/>'
    b += '<path d="M0 520 Q200 470 400 505 T800 490 T1200 500 V800 H0Z" fill="#E7B48A"/>'
    for x in range(-20, 1240, 70):
        h = r.randint(110, 230); w = r.randint(38, 60)
        b += f'<path d="M{x-w} 800 L{x-w*0.55} {800-h} Q{x} {800-h-40} {x+w*0.55} {800-h} L{x+w} 800Z" fill="#C98C5E"/>'
        b += f'<ellipse cx="{x}" cy="{800-h-8}" rx="{w*0.42}" ry="12" fill="#8C5A3C"/>'
    b += '<path d="M0 700 Q300 660 600 690 T1200 680 V800 H0Z" fill="#B57449"/>'
    cols = [("#E8432E", "#F4C430"), ("#2A7FD4", "#F2F2F2"), ("#3BA55C", "#F4C430"), ("#F28C28", "#7B3FA0"), ("#D6336C", "#FFFFFF"), ("#1C8C8C", "#F4C430")]
    for i, (x, y, s) in enumerate([(240, 170, 1.5), (420, 300, 0.9), (610, 120, 1.1), (900, 220, 0.8), (1040, 120, 1.3), (760, 360, 0.6), (130, 380, 0.6)]):
        b += _balloon(x, y, s, *cols[i % len(cols)])
    return _svg(d, b, "Kapadokya'da gün doğumunda sıcak hava balonları")


def mavi():
    d = (_sky("s", [(0, "#7CC6F2"), (1, "#DDF2FC")]) + _sky("sea", [(0, "#1AA6B7"), (1, "#0B6E8C")]))
    b = '<rect width="1200" height="800" fill="url(#s)"/>'
    b += '<path d="M0 360 Q160 250 330 330 Q450 380 560 320 L560 470 H0Z" fill="#5E9C5A"/><path d="M700 470 Q820 260 980 300 Q1100 330 1200 260 V470Z" fill="#4E8A4C"/>'
    b += '<path d="M0 400 Q200 330 420 400 L420 470 H0Z" fill="#3F7A42"/>'
    b += '<rect y="460" width="1200" height="340" fill="url(#sea)"/>'
    for y in range(500, 800, 36):
        b += f'<path d="M0 {y} q40 -8 80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0" fill="none" stroke="#ffffff" stroke-opacity=".18" stroke-width="3"/>'
    b += ('<g transform="translate(420 420)"><path d="M0 120 L380 120 L340 175 L50 175Z" fill="#7A4A26"/><path d="M30 120 L360 120 L352 132 L38 132Z" fill="#F5F0E6"/>'
          '<rect x="120" y="90" width="150" height="30" rx="4" fill="#F5F0E6"/><path d="M150 -150 V120 M290 -110 V120" stroke="#5a3a1e" stroke-width="6"/>'
          '<path d="M150 -140 L270 90 H150Z" fill="#fff"/><path d="M290 -100 L370 90 H290Z" fill="#fff" opacity=".95"/><path d="M150 -140 L60 90 H150Z" fill="#F6F1E3"/>'
          '<path d="M0 182 Q190 196 380 182" stroke="#ffffff" stroke-opacity=".5" stroke-width="5" fill="none"/></g>')
    return _svg(d, b, "Turkuaz bir koyda demirli gulet")


def akdeniz():
    d = _sky("s", [(0, "#4FB3E8"), (1, "#C9ECFB")]) + _sky("sea", [(0, "#14A3C7"), (1, "#7FD6E4")])
    b = '<rect width="1200" height="800" fill="url(#s)"/><circle cx="980" cy="150" r="70" fill="#FFE27A"/>'
    b += '<rect y="380" width="1200" height="220" fill="url(#sea)"/><path d="M0 560 Q400 520 800 560 T1200 540 V800 H0Z" fill="#F2DDB0"/><path d="M0 600 Q400 570 800 600 T1200 590 V800 H0Z" fill="#EBCF98"/>'
    b += '<path d="M180 800 Q160 600 240 430" stroke="#7A5A3A" stroke-width="22" fill="none"/>'
    for a in (-60, -20, 20, 60, 100, 150):
        b += f'<path d="M240 430 q{60*__import__("math").cos(__import__("math").radians(a))} {-40+abs(a)/2} {140*__import__("math").cos(__import__("math").radians(a))} {20+abs(a)/2.5}" stroke="#2E8B57" stroke-width="26" stroke-linecap="round" fill="none"/>'
    b += '<path d="M760 640 L760 500" stroke="#555" stroke-width="6"/><path d="M660 510 Q760 430 860 510Z" fill="#E8432E"/><path d="M700 510 Q760 455 820 510" fill="#fff" opacity=".6"/>'
    b += '<rect x="690" y="640" width="150" height="16" rx="8" fill="#ffffff"/>'
    return _svg(d, b, "Akdeniz'de palmiyeli kumsal")


def karadeniz():
    d = _sky("s", [(0, "#B9D8D2"), (1, "#EEF5F0")])
    b = '<rect width="1200" height="800" fill="url(#s)"/>'
    layers = [("#9CC3A5", 330), ("#6FA67E", 420), ("#3F7F57", 520), ("#2B6644", 630)]
    for i, (c, y) in enumerate(layers):
        b += f'<path d="M0 {y} ' + " ".join(f"Q{x+75} {y-90+((x//150+i)%3)*35} {x+150} {y}" for x in range(0, 1200, 150)) + f' V800 H0Z" fill="{c}"/>'
        b += f'<rect y="{y-30}" width="1200" height="40" fill="#ffffff" opacity=".28"/>'
    b += '<g transform="translate(760 540)"><rect width="120" height="80" fill="#8A5A34"/><path d="M-14 0 L60 -50 L134 0Z" fill="#5B3A22"/><rect x="48" y="36" width="24" height="44" fill="#3a2614"/><rect x="14" y="20" width="22" height="18" fill="#F2E3B3"/><rect x="86" y="20" width="22" height="18" fill="#F2E3B3"/></g>'
    for x in range(40, 1200, 46):
        b += f'<path d="M{x} 760 l14 -60 l14 60Z" fill="#1F5236"/>'
    return _svg(d, b, "Karadeniz yaylasında sisli dağlar ve ahşap ev")


def istanbul():
    d = _sky("s", [(0, "#3B4A8C"), (0.5, "#E9827A"), (1, "#FBC58E")]) + _sky("sea", [(0, "#4E5E9C"), (1, "#26325F")])
    b = '<rect width="1200" height="800" fill="url(#s)"/><circle cx="600" cy="470" r="90" fill="#FFD9A0" opacity=".9"/>'
    sil = "#2A2440"
    b += f'<path d="M0 520 H1200 V800 H0Z" fill="url(#sea)"/><path d="M0 520 V470 H120 V440 H180 V520Z M960 520 V450 H1040 V420 H1100 V520 H1200 V470 H1200Z" fill="{sil}"/>'
    b += f'<path d="M260 520 V440 H560 V520Z" fill="{sil}"/><path d="M300 440 Q410 330 520 440Z" fill="{sil}"/><path d="M270 440 Q300 405 330 440Z M490 440 Q520 405 550 440Z" fill="{sil}"/>'
    for x, h in [(252, 250), (568, 250), (330, 210), (490, 210)]:
        b += f'<path d="M{x-6} 520 V{520-h} L{x} {500-h} L{x+6} {520-h} V520Z" fill="{sil}"/>'
    b += f'<path d="M760 520 V380 H800 V520Z" fill="{sil}"/><path d="M752 380 L780 320 L808 380Z" fill="{sil}"/>'
    b += '<path d="M0 600 Q600 520 1200 600" stroke="#F5D2A8" stroke-width="5" fill="none"/>'
    b += "".join(f'<path d="M{x} 600 V{560-abs(600-x)//12}" stroke="#F5D2A8" stroke-width="2" opacity=".7"/>' for x in range(60, 1180, 40))
    b += '<path d="M240 640 V470 M960 640 V470" stroke="#F5D2A8" stroke-width="10"/>'
    for y in range(560, 800, 28):
        b += f'<path d="M100 {y} h120 M420 {y+10} h200 M820 {y-6} h160" stroke="#FFD9A0" stroke-opacity=".35" stroke-width="3"/>'
    return _svg(d, b, "Gün batımında İstanbul silüeti ve Boğaz")


def kibris():
    d = _sky("s", [(0, "#5FB8F0"), (1, "#E2F4FD")]) + _sky("sea", [(0, "#1F8FD1"), (1, "#0C5C96")])
    b = '<rect width="1200" height="800" fill="url(#s)"/><path d="M0 420 Q300 300 600 380 T1200 360 V500 H0Z" fill="#9AA77A"/>'
    b += '<rect y="480" width="1200" height="320" fill="url(#sea)"/>'
    b += '<g fill="#D9C08F"><rect x="660" y="360" width="260" height="140"/><rect x="640" y="320" width="60" height="180"/><rect x="880" y="330" width="60" height="170"/>'
    b += "".join(f'<rect x="{x}" y="348" width="16" height="14"/>' for x in range(660, 920, 28)) + '</g><rect x="760" y="430" width="40" height="70" rx="20" fill="#7A6340"/>'
    b += '<path d="M0 520 L360 500 L420 560 L0 600Z" fill="#B9A276"/>'
    for x in (180, 300, 1000):
        b += f'<g transform="translate({x} 600)"><path d="M0 0 H90 L76 22 H12Z" fill="#fff"/><path d="M45 0 V-60 L80 -6Z" fill="#fff"/></g>'
    return _svg(d, b, "Kıbrıs'ta liman ve kale")


def sehir():
    d = _sky("s", [(0, "#22305E"), (1, "#7C8CC9")])
    b = '<rect width="1200" height="800" fill="url(#s)"/>'
    b += "".join(f'<circle cx="{x}" cy="{y}" r="2" fill="#fff" opacity=".7"/>' for x, y in [(100, 80), (300, 140), (520, 60), (760, 120), (980, 70), (1120, 160)])
    c = "#141B36"
    b += f'<path d="M0 800 V560 H90 V500 H150 V560 H220 V470 H300 V560 H360 V520 H420 V800Z" fill="{c}"/>'
    b += f'<path d="M430 800 V430 H470 V330 L490 290 L510 330 V430 H550 V800Z" fill="{c}"/><circle cx="490" cy="370" r="16" fill="#F7D774"/>'
    b += f'<path d="M560 800 V520 H640 V470 H700 V800Z M710 800 V400 L740 330 L770 400 V800Z M780 800 V540 H860 V800Z" fill="{c}"/>'
    b += f'<path d="M880 800 L930 600 L950 380 L965 250 L980 380 L1000 600 L1050 800Z" fill="{c}"/><path d="M915 700 H1015 M935 540 H995" stroke="#7C8CC9" stroke-width="5"/>'
    b += f'<path d="M1060 800 V560 H1200 V800Z" fill="{c}"/>'
    for x in range(20, 1200, 34):
        for y in range(580, 780, 40):
            if (x * y) % 7 < 3:
                b += f'<rect x="{x}" y="{y}" width="10" height="14" fill="#F7D774" opacity=".8"/>'
    return _svg(d, b, "Akşam ışıklarıyla bir Avrupa şehri")


def yol():
    d = _sky("s", [(0, "#8CCBF0"), (1, "#E9F6FC")])
    b = '<rect width="1200" height="800" fill="url(#s)"/><path d="M0 430 Q300 380 600 420 T1200 400 V800 H0Z" fill="#C9C58A"/><path d="M0 520 Q300 470 700 520 T1200 500 V800 H0Z" fill="#B4AE6E"/>'
    b += '<path d="M520 800 Q600 600 640 430 L660 430 Q700 600 860 800Z" fill="#59606B"/><path d="M688 800 Q650 600 650 440" stroke="#fff" stroke-width="6" stroke-dasharray="26 22" fill="none"/>'
    b += ('<g transform="translate(560 600)"><rect width="200" height="96" rx="16" fill="#F5F7FA"/><path d="M200 30 h30 q16 0 20 20 v46 h-50Z" fill="#E4E9F0"/>'
          '<rect x="16" y="14" width="160" height="34" rx="6" fill="#1660D9" opacity=".85"/><circle cx="50" cy="98" r="18" fill="#222"/><circle cx="190" cy="98" r="18" fill="#222"/></g>')
    return _svg(d, b, "Bozkırda yolda giden transfer aracı")


def ucak():
    d = _sky("s", [(0, "#2F7FE0"), (1, "#BFE2FB")])
    b = '<rect width="1200" height="800" fill="url(#s)"/>'
    for x, y, s in [(120, 560, 1.4), (600, 640, 1.8), (980, 520, 1.2), (330, 300, .8), (1040, 260, .7)]:
        b += f'<g transform="translate({x} {y}) scale({s})" fill="#fff"><circle r="60"/><circle cx="70" cy="10" r="50"/><circle cx="-70" cy="14" r="46"/><rect x="-116" y="10" width="236" height="50" rx="25"/></g>'
    b += ('<g transform="translate(600 330) rotate(-12)"><path d="M-260 0 Q-260 -26 -220 -26 H220 Q270 -26 290 0 Q270 26 220 26 H-220 Q-260 26 -260 0Z" fill="#fff"/>'
          '<path d="M-40 -10 L-150 -170 H-100 L60 -10Z M-40 10 L-150 170 H-100 L60 10Z" fill="#E9EEF5"/><path d="M-230 -20 L-280 -110 H-245 L-180 -20Z" fill="#1660D9"/>'
          + "".join(f'<circle cx="{x}" cy="-4" r="6" fill="#9DB8DA"/>' for x in range(-180, 220, 26)) + "</g>")
    return _svg(d, b, "Bulutların üzerinde uçan yolcu uçağı")


def ankara():
    d = _sky("s", [(0, "#9DD0F2"), (1, "#EEF8FD")])
    c = "#3B4E7A"
    b = '<rect width="1200" height="800" fill="url(#s)"/><path d="M0 600 Q300 520 600 580 T1200 560 V800 H0Z" fill="#C7D9B6"/>'
    b += f'<path d="M560 640 V330 M600 640 V330" stroke="{c}" stroke-width="24"/><path d="M520 330 Q580 250 640 330Z" fill="{c}"/><path d="M580 270 V200" stroke="{c}" stroke-width="6"/>'
    b += f'<path d="M100 640 V540 H420 V640Z" fill="{c}" opacity=".85"/>' + "".join(f'<path d="M{x} 640 V560" stroke="#EEF8FD" stroke-width="6"/>' for x in range(130, 400, 26))
    b += f'<path d="M700 640 V470 H780 V640Z M800 640 V420 H860 V640Z M880 640 V500 H960 V640Z M980 640 V450 H1040 V640Z M1060 640 V520 H1160 V640Z" fill="{c}" opacity=".7"/>'
    b += '<path d="M0 640 H1200 V800 H0Z" fill="#9FB98A"/>'
    return _svg(d, b, "Ankara silüeti ve Atakule")


SCENES = {"kapadokya.svg": kapadokya, "mavi-yolculuk.svg": mavi, "akdeniz.svg": akdeniz, "karadeniz.svg": karadeniz,
          "istanbul.svg": istanbul, "kibris.svg": kibris, "sehir.svg": sehir, "yol.svg": yol, "ucak.svg": ucak, "ankara.svg": ankara}


def all_svgs():
    return {k: f() for k, f in SCENES.items()}


if __name__ == "__main__":
    import pathlib
    o = pathlib.Path("/home/claude/bto/shots/scenes"); o.mkdir(parents=True, exist_ok=True)
    for k, v in all_svgs().items():
        (o / k).write_text(v)
    html = "<body style='margin:0;display:grid;grid-template-columns:repeat(4,1fr);gap:4px'>" + "".join(f"<img src='{k}' style='width:100%;aspect-ratio:3/2;object-fit:cover'>" for k in SCENES) + "</body>"
    (o / "index.html").write_text(html)
