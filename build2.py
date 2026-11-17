"""Yayına hazır üç siteyi dist/ altına üretir:  python3 build2.py [baslangic kurumsal premium]"""
import sys, pathlib, importlib
sys.path.insert(0, str(pathlib.Path(__file__).parent / "src"))
OUT = pathlib.Path(__file__).parent / "dist"
for name in (sys.argv[1:] or ["baslangic", "kurumsal", "premium"]):
    urls = importlib.import_module("t_" + name).build(OUT / name)
    print(f"ok {name}: {len(urls)} sayfa")

from config import TEST_ITEMS
OUT.mkdir(exist_ok=True)
guide = (pathlib.Path(__file__).parent / "src" / "YAYIN_REHBERI.md").read_text()
(OUT / "YAYIN_REHBERI.md").write_text(guide.replace("{TEST_LIST}", "\n".join(f"- [ ] {t}" for t in TEST_ITEMS)))
import shutil
shutil.copy(pathlib.Path(__file__).parent / "devserver.mjs", OUT / "devserver.mjs")
