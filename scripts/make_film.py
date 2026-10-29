"""Render the showreel film from profile/profile.yaml.

The composition (film/showreel.html.j2) is a 1920x1080 stage driven by one function, render(t).
This script fills it from site.showreel, then seeks it frame by frame in headless Chromium and
encodes the frames with ffmpeg, so every frame is exact and the film can be re-rendered whenever
the YAML changes. Writes public/showreel/orca-showreel.mp4 and its poster.

    python scripts/make_film.py              # render the film and poster
    python scripts/make_film.py --html-only  # write film/.build/index.html to inspect in a browser
    python scripts/make_film.py --at 14 30   # write stills at those seconds to film/.build/
"""

from __future__ import annotations

import argparse
import base64
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

import yaml
from jinja2 import Environment, FileSystemLoader, select_autoescape

ROOT = Path(__file__).resolve().parent.parent
BUILD = ROOT / "film" / ".build"
FPS = 30
POSTER_AT = 14.4

# Scene windows in seconds: id, start, end, the label in the corner.
SCENES = [
    ("s1", 0.0, 6.2, ""),
    ("s2", 6.2, 20.0, "The product"),
    ("s3", 20.0, 27.2, "How it works"),
    ("s4", 27.2, 33.0, "What it does"),
    ("s5", 33.0, 39.6, "Adoption"),
    ("s6", 39.6, 46.4, "Running cost and footprint"),
    ("s7", 46.4, 56.0, "The platform"),
    ("s8", 56.0, 62.2, "Scale"),
    ("s9", 62.2, 70.0, "Savings"),
    ("s10", 70.0, 76.5, "How it fits together"),
    ("s11", 76.5, 82.0, ""),
]
DURATION = SCENES[-1][2]
LEAD_NUMBER = re.compile(r"^(\d[\d,]*)(\D.*)?$")


def film_line(line: dict) -> dict:
    """Split a lead like "15,227 queries" so the number can count up; small numbers stay still."""
    out = dict(line)
    m = LEAD_NUMBER.match(line["lead"])
    rest = (m.group(2) or "") if m else ""
    if m and int(m.group(1).replace(",", "")) >= 100 and not rest.startswith(" to"):
        out.update(count=int(m.group(1).replace(",", "")), comma="," in m.group(1), num=m.group(1), rest=rest)
    return out


def build_html(data: dict) -> str:
    site = data["site"]
    reel = site["showreel"]
    film = reel["film"]
    diagram = ROOT / "public" / "diagrams" / "platform-dark.svg"
    if not diagram.exists():
        sys.exit("public/diagrams/platform-dark.svg is missing; run python scripts/make_diagrams.py first")
    measures = []
    for m in reel["platform"]["measures"]:
        top = max(v or 0 for v in m["values"])
        measures.append({**m, "shares": [round((v or 0) / top, 4) if top else 0 for v in m["values"]]})
    env = Environment(loader=FileSystemLoader(ROOT / "film"), autoescape=select_autoescape(["html", "j2"]))
    return env.get_template("showreel.html.j2").render(
        font_url=(ROOT / "public" / "fonts" / "MonaSans-latin.woff2").as_uri(),
        # A mask image must be same-origin, which a file:// page never is, so the mark goes in inline.
        mark_url="data:image/png;base64," + base64.b64encode((ROOT / "public" / "logos" / "orca.png").read_bytes()).decode(),
        title_line=reel["orca"]["line"].split(". ")[0] + ".",
        film={**film, **{k: [film_line(x) for x in film[k]] for k in ("adoption", "lean", "scale")}},
        demo=reel["orca"]["demo"],
        loop=reel["orca"]["loop"],
        loop_note=reel["orca"]["loop_note"],
        caps=reel["orca"]["capabilities"],
        platform=reel["platform"],
        eras=reel["platform"]["eras"],
        measures=measures,
        money=reel["platform"]["money"],
        diagram=diagram.read_text(encoding="utf-8"),
        name=data["person"]["name"],
        role=data["person"]["title"],
        scenes=[{"id": s, "tag": tag} for s, _, _, tag in SCENES],
        scenes_json=json.dumps([{"id": s, "a": a, "b": b} for s, a, b, _ in SCENES]),
        duration=DURATION,
        diagram_at=next(a for s, a, _, _ in SCENES if s == "s10") + 0.3,
    )


def capture(html: Path, times: list[float], out_dir: Path, quality: int = 94) -> list[Path]:
    from playwright.sync_api import sync_playwright

    paths = []
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1920, "height": 1080}, device_scale_factor=1)
        page.goto(html.as_uri())
        page.evaluate("document.fonts.ready")
        page.wait_for_timeout(300)
        cdp = page.context.new_cdp_session(page)
        for i, t in enumerate(times):
            page.evaluate(f"render({t})")
            data = cdp.send("Page.captureScreenshot", {"format": "jpeg", "quality": quality})["data"]
            path = out_dir / f"{i:05d}.jpg"
            path.write_bytes(base64.b64decode(data))
            paths.append(path)
        browser.close()
    return paths


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--html-only", action="store_true")
    ap.add_argument("--at", nargs="*", type=float, help="write stills at these seconds instead of the film")
    args = ap.parse_args()

    data = yaml.safe_load((ROOT / "profile" / "profile.yaml").read_text(encoding="utf-8"))
    BUILD.mkdir(parents=True, exist_ok=True)
    html = BUILD / "index.html"
    html.write_text(build_html(data), encoding="utf-8")
    if args.html_only:
        print(f"wrote {html.relative_to(ROOT)}")
        return 0
    if args.at:
        for t, path in zip(args.at, capture(html, args.at, BUILD)):
            final = BUILD / f"still-{t:05.1f}.jpg"
            path.replace(final)
            print(f"wrote {final.relative_to(ROOT)}")
        return 0

    out = ROOT / "public" / "showreel"
    out.mkdir(parents=True, exist_ok=True)
    frames = int(round(DURATION * FPS))
    with tempfile.TemporaryDirectory() as tmp:
        capture(html, [i / FPS for i in range(frames)], Path(tmp))
        mp4 = out / "orca-showreel.mp4"
        subprocess.run(
            ["ffmpeg", "-y", "-loglevel", "error", "-framerate", str(FPS), "-i", f"{tmp}/%05d.jpg",
             "-vf", "scale=out_color_matrix=bt709:out_range=tv", "-c:v", "libx264", "-preset", "slow", "-crf", "21", "-pix_fmt", "yuv420p",
             "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv", "-movflags", "+faststart", str(mp4)],
            check=True,
        )
        poster_frame = Path(tmp) / f"{int(POSTER_AT * FPS):05d}.jpg"
        from PIL import Image

        Image.open(poster_frame).resize((1600, 900), Image.LANCZOS).save(out / "orca-showreel.webp", quality=82, method=6)
    print(f"wrote {mp4.relative_to(ROOT)} ({mp4.stat().st_size // 1024} KB, {DURATION:.0f}s at {FPS} fps) and its poster")
    return 0


if __name__ == "__main__":
    sys.exit(main())
