"""Adobe Stock fotoğraflarını siteye hazırlar: 2000 px genişlik, WebP, public/foto/<ad>.webp
Kullanım: python3 kaynak/foto.py /indirilenler/klasoru
Dosya adındaki Adobe Stock numarasına göre doğru isme çevirir."""
import re
import sys
from pathlib import Path

from PIL import Image, ImageOps

# Adobe Stock numarası -> sitedeki adı (hepsi ücretsiz, Standart lisans, 19.11.2026)
ESLEME = {
    '209300553': 'kapadokya',   # Kapadokya balon
    '485808046': 'gulet',       # Phaselis'te gulet
    '399473112': 'kaleici',     # Antalya Kaleiçi
    '1592782890': 'uzungol',    # Uzungöl
    '228384240': 'istanbul',    # Ortaköy ve Boğaz Köprüsü
    '1832231016': 'girne',      # Girne limanı
    '216619797': 'londra',      # Tower Bridge
    '269497024': 'ucak',        # kalkan uçak
    '239770338': 'terminal',    # havalimanı terminali
    '630630754': 'bodrum',      # Bodrum kalesi
}

kaynak = Path(sys.argv[1])
hedef = Path(__file__).resolve().parent.parent / 'public' / 'foto'
hedef.mkdir(parents=True, exist_ok=True)
for f in sorted(kaynak.iterdir()):
    m = re.search(r'(\d{6,})', f.name)
    if not m or m.group(1) not in ESLEME:
        continue
    ad = ESLEME[m.group(1)]
    im = ImageOps.exif_transpose(Image.open(f)).convert('RGB')
    if im.width > 2000:
        im = im.resize((2000, round(im.height * 2000 / im.width)), Image.LANCZOS)
    im.save(hedef / f'{ad}.webp', 'WEBP', quality=78, method=6)
    print(f'{f.name} -> {ad}.webp ({(hedef / f"{ad}.webp").stat().st_size // 1024} KB)')
