"""Ankara merkezli, sade Türkiye rota haritası (SVG) üretir."""

K = 40
LATK = 52


def P(lon, lat):
    return round((lon - 25.5) * K, 1), round((42.5 - lat) * LATK, 1)


TR = [(26.0,41.7),(26.6,41.95),(27.9,42.0),(28.0,41.6),(29.1,41.25),(30.5,41.15),(31.4,41.3),(32.3,41.75),
      (33.5,42.0),(34.9,42.05),(35.2,41.7),(36.1,41.65),(36.6,41.3),(37.5,41.1),(38.4,40.95),(39.7,41.0),
      (40.6,41.0),(41.5,41.5),(42.6,41.55),(43.5,41.1),(43.7,40.5),(44.8,39.7),(44.4,39.4),(44.1,38.9),
      (44.3,38.3),(44.8,37.2),(44.2,37.1),(42.4,37.1),(41.2,37.1),(40.0,36.85),(38.4,36.8),(36.7,36.8),
      (36.6,36.2),(36.15,35.85),(35.8,36.3),(36.1,36.75),(35.6,36.6),(34.6,36.8),(33.6,36.15),(32.5,36.1),
      (31.0,36.85),(30.6,36.7),(30.3,36.25),(29.4,36.25),(28.4,36.75),(27.4,36.95),(27.3,37.4),(26.3,38.25),
      (26.7,38.65),(26.7,39.3),(26.1,39.5),(26.4,40.2),(26.2,40.6),(26.0,40.8)]
CY = [(32.3,35.1),(33.0,35.35),(34.0,35.45),(34.6,35.7),(33.9,35.05),(33.0,34.6),(32.3,34.9)]
MARMARA = [(27.3,40.45),(28.7,40.45),(29.9,40.75),(29.0,40.98),(28.0,40.95),(27.4,40.7)]

ANKARA = (32.85, 39.93)
DEST = [
    ("kapadokya", "Kapadokya", (34.83, 38.64), 1),
    ("istanbul", "İstanbul", (28.98, 41.01), -1),
    ("karadeniz", "Karadeniz", (39.72, 41.0), 1),
    ("antalya", "Antalya", (30.71, 36.9), 1),
    ("bodrum", "Bodrum", (27.43, 37.03), -1),
    ("fethiye", "Fethiye", (29.12, 36.62), -1),
    ("kibris", "Kıbrıs", (33.36, 35.18), 1),
]


def poly(pts):
    return "M" + " L".join(f"{x},{y}" for x, y in (P(*p) for p in pts)) + "Z"


def arc(a, b, bend):
    (x1, y1), (x2, y2) = P(*a), P(*b)
    mx, my = (x1 + x2) / 2, (y1 + y2) / 2
    dx, dy = x2 - x1, y2 - y1
    L = (dx * dx + dy * dy) ** 0.5 or 1
    off = 0.22 * L * bend
    cx, cy = mx - dy / L * off, my + dx / L * off
    return f"M{x1},{y1} Q{round(cx,1)},{round(cy,1)} {x2},{y2}"


def svg(extra_class=""):
    ax, ay = P(*ANKARA)
    out = [f'<svg class="routemap {extra_class}" viewBox="0 0 800 400" role="img" '
           f'aria-label="Ankara\'dan Kapadokya, İstanbul, Karadeniz, Antalya, Bodrum, Fethiye ve Kıbrıs\'a uzanan rotalar">',
           f'<path class="land" d="{poly(TR)}"/>',
           f'<path class="sea" d="{poly(MARMARA)}"/>',
           f'<path class="land" d="{poly(CY)}"/>']
    for i, (key, name, ll, bend) in enumerate(DEST):
        out.append(f'<path class="route" style="--i:{i}" pathLength="1" d="{arc(ANKARA, ll, bend)}"/>')
    for i, (key, name, ll, bend) in enumerate(DEST):
        x, y = P(*ll)
        anchor = "end" if x < ax - 40 else "start"
        tx = x - 12 if anchor == "end" else x + 12
        out.append(f'<g class="dest" style="--i:{i}"><circle cx="{x}" cy="{y}" r="5.5"/>'
                   f'<text x="{tx}" y="{y + 5}" text-anchor="{anchor}">{name}</text></g>')
    kx, ky = P(*DEST[0][2])
    # balon (Kapadokya üstünde)
    out.append(f'<g class="balloon" transform="translate({kx - 6},{ky - 92})">'
               '<g class="balloon-in"><path d="M0,0 C-22,0 -26,26 -14,40 L-6,50 L6,50 L14,40 C26,26 22,0 0,0Z" class="b-env"/>'
               '<path d="M0,0 C-8,0 -10,26 -5,40 L-2,50 M0,0 C8,0 10,26 5,40 L2,50" class="b-seam"/>'
               '<path d="M-6,50 L-5,58 M6,50 L5,58" class="b-rope"/><rect x="-6" y="58" width="12" height="9" rx="2" class="b-basket"/></g></g>')
    out.append(f'<g class="origin"><circle class="pulse" cx="{ax}" cy="{ay}" r="9"/>'
               f'<circle cx="{ax}" cy="{ay}" r="9"/><text x="{ax}" y="{ay - 18}" text-anchor="middle">Ankara</text></g>')
    out.append("</svg>")
    return "".join(out)


if __name__ == "__main__":
    print(svg())
