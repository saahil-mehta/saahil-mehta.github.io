"""Render the showreel film from profile/profile.yaml.

The composition (film/showreel.html.j2) is a 1920x1080 stage driven by one function, render(t).
This script fills it from site.showreel, bundles the site's own 3D object renderer for the hero
shots (film/stage.ts), then seeks the stage frame by frame in headless Chromium and encodes the
frames with ffmpeg, so every frame is exact and the film re-renders whenever the YAML changes.
Writes the film and its poster to the paths in site.showreel.film.

    python scripts/make_film.py              # render the film and poster
    python scripts/make_film.py --html-only  # write film/.build/index.html to inspect in a browser
    python scripts/make_film.py --at 14 30   # write stills at those seconds to film/.build/
"""

from __future__ import annotations

import argparse
import base64
import json
import math
import os
import random
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
POSTER_AT = 22.6  # the reconstruction, answered, turning toward the camera
NODE = os.environ.get("NODE_BIN", "/opt/homebrew/opt/node@22/bin")

# Scene windows in seconds.
SCENES = [
    ("s-open", 0.0, 5.6), ("s-orca", 5.6, 12.0), ("s-ask", 12.0, 24.4),
    ("s-t1", 24.4, 27.6), ("s-t2", 27.6, 30.8), ("s-t3", 30.8, 34.0), ("s-t4", 34.0, 37.2),
    ("s-n0", 37.2, 39.6), ("s-n1", 39.6, 42.0), ("s-n2", 42.0, 44.4),
    ("s-stack", 44.4, 50.4), ("s-plat", 50.4, 56.4),
    ("s-runs", 56.4, 61.0), ("s-code", 61.0, 65.6), ("s-review", 65.6, 70.0),
    ("s-books", 70.0, 73.6), ("s-ticker", 73.6, 76.8), ("s-people", 76.8, 80.6),
    ("s-save", 80.6, 85.0), ("s-close", 85.0, 87.6), ("s-fits", 87.6, 93.6), ("s-end", 93.6, 99.0),
]
# The corner label names the act on screen.
ACTS = [("Orca", "s-orca", "s-n2"), ("The data platform", "s-plat", "s-fits")]
DURATION = SCENES[-1][2]
NUMBER = re.compile(r"^(\d[\d,]*)")
# Invented rows for the masking shot: stock fictional companies, .example addresses.
MASK_ROWS = [
    ("Northwind Foods", "Europe", "Sales", "a.rivera@northwind.example"),
    ("Contoso Energy", "Americas", "Advisory", "j.okafor@contoso.example"),
    ("Fabrikam Logistics", "Asia Pacific", "Sales", "m.chen@fabrikam.example"),
    ("Tailspin Air", "Europe", "Markets", "s.novak@tailspin.example"),
    ("Woodgrove Bank", "Americas", "Finance", "r.patel@woodgrove.example"),
]


def counted(line: dict) -> dict:
    m = NUMBER.match(line["lead"])
    if not m:
        sys.exit(f"film line has no leading figure to count: {line['lead']!r}")
    return {**line, "count": int(m.group(1).replace(",", "")), "comma": "," in m.group(1), "num": m.group(1), "rest": line["lead"][m.end():]}


def layouts() -> dict:
    """Deterministic positions for the generated motifs: the same film every render."""
    rng = random.Random(20261029)
    # sources converging on the mark: right-aligned on the left, left-aligned on the right
    parts = []
    for side, y in [("l", 560), ("l", 840), ("r", 560), ("r", 840)]:
        if side == "l":
            parts.append({"style": f"right:1300px;top:{y}px;text-align:right", "lx": 640, "ly": y + 22, "cx": 780, "hx": 905})
        else:
            parts.append({"style": f"left:1300px;top:{y}px", "lx": 1280, "ly": y + 22, "cx": 1140, "hx": 1015})
    # a constellation of definitions, lit roughly left to right
    nodes: list[list] = []
    while len(nodes) < 26:
        x, y = rng.uniform(260, 1660), rng.uniform(420, 840)
        if all(math.hypot(x - n[0], y - n[1]) > 120 for n in nodes):
            nodes.append([round(x), round(y), rng.choice([7, 9, 11, 14]), rng.random() < 0.22])
    for rank, i in enumerate(sorted(range(len(nodes)), key=lambda i: nodes[i][0])):
        nodes[i].append(rank)
    links: set[tuple[int, int]] = set()
    for i, n in enumerate(nodes):
        near = sorted(range(len(nodes)), key=lambda j: math.hypot(nodes[j][0] - n[0], nodes[j][1] - n[1]))[1:3]
        links.update(tuple(sorted((i, j))) for j in near)
    lines = [[nodes[i][0], nodes[i][1], nodes[j][0], nodes[j][1]] for i, j in sorted(links)]
    # a hundred runs, 52 of them failing in 2024 (47.7% succeeded)
    fails = set(rng.sample(range(100), 52))
    # hand-made pieces scattered over the frame, and the grid they snap into
    blocks = [[round(rng.uniform(700, 1780)), round(rng.uniform(340, 900)), round(rng.uniform(-40, 40)), 1060 + (i % 10) * 70, 300 + (i // 10) * 42] for i in range(120)]
    # commits on the line, about half reviewed in 2023
    commits = [{"x": 20 + i * 100, "ok": rng.random() < 0.48} for i in range(16)]
    spines = [round(rng.uniform(30, 100)) for _ in range(220)]
    return {"t1_parts": parts, "net_nodes": nodes, "net_links": lines, "run_fails": fails, "code_blocks": blocks, "commits": commits, "spines": spines}


def build_html(data: dict) -> str:
    site = data["site"]
    reel = site["showreel"]
    film = reel["film"]
    diagram = ROOT / "public" / "diagrams" / "platform-dark.svg"
    if not diagram.exists():
        sys.exit("public/diagrams/platform-dark.svg is missing; run python scripts/make_diagrams.py first")
    parts = layouts()
    for p, name in zip(parts["t1_parts"], film["truths"][0]["parts"]):
        p["name"] = name
    starts = {s: (a, b) for s, a, b in SCENES}
    stack = film["stack"]
    env = Environment(loader=FileSystemLoader(ROOT / "film"), autoescape=select_autoescape(["html", "j2"]))
    return env.get_template("showreel.html.j2").render(
        font_url=(ROOT / "public" / "fonts" / "MonaSans-latin.woff2").as_uri(),
        # A mask image must be same-origin, which a file:// page never is, so the mark goes in inline.
        mark_url="data:image/png;base64," + base64.b64encode((ROOT / "public" / "logos" / "orca.png").read_bytes()).decode(),
        film=film,
        adoption=[counted(x) for x in film["adoption"]],
        ticker_count=counted(film["ticker"])["count"],
        demo=reel["orca"]["demo"],
        money=reel["platform"]["money"],
        mask_rows=MASK_ROWS,
        # each label sits level with its slab: the top of the stack is the first name in the list
        stack_label_y=[round(720 - 0.848 * 120 * (len(stack) - 1 - i) - 27) for i in range(len(stack))],
        diagram=diagram.read_text(encoding="utf-8"),
        name=data["person"]["name"],
        role=data["person"]["title"],
        acts=[{"tag": tag, "a": starts[a][0], "b": starts[b][1]} for tag, a, b in ACTS],
        scenes_json=json.dumps([{"id": s, "a": a, "b": b} for s, a, b in SCENES]),
        duration=DURATION,
        **parts,
    )


def bundle_stage() -> None:
    env = {**os.environ, "PATH": f"{NODE}:{os.environ.get('PATH', '')}"}
    subprocess.run(["npx", "vite", "build", "--config", "film/vite.config.mjs"], cwd=ROOT, env=env, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def capture(html: Path, times: list[float], out_dir: Path, quality: int = 94) -> list[Path]:
    from playwright.sync_api import sync_playwright

    paths = []
    with sync_playwright() as p:
        browser = p.chromium.launch(args=["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"])
        page = browser.new_page(viewport={"width": 1920, "height": 1080}, device_scale_factor=1)
        errors: list[str] = []
        page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
        page.goto(html.as_uri())
        page.evaluate("window.ready")
        if errors:
            sys.exit("film page errors: " + "; ".join(errors))
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
    film = data["site"]["showreel"]["film"]
    BUILD.mkdir(parents=True, exist_ok=True)
    html = BUILD / "index.html"
    html.write_text(build_html(data), encoding="utf-8")
    bundle_stage()
    if args.html_only:
        print(f"wrote {html.relative_to(ROOT)}")
        return 0
    if args.at:
        for t, path in zip(args.at, capture(html, args.at, BUILD)):
            final = BUILD / f"still-{t:05.1f}.jpg"
            path.replace(final)
            print(f"wrote {final.relative_to(ROOT)}")
        return 0

    mp4 = ROOT / "public" / film["file"].lstrip("/")
    poster = ROOT / "public" / film["poster"].lstrip("/")
    mp4.parent.mkdir(parents=True, exist_ok=True)
    frames = int(round(DURATION * FPS))
    with tempfile.TemporaryDirectory() as tmp:
        capture(html, [i / FPS for i in range(frames)], Path(tmp))
        subprocess.run(
            ["ffmpeg", "-y", "-loglevel", "error", "-framerate", str(FPS), "-i", f"{tmp}/%05d.jpg",
             "-vf", "scale=out_color_matrix=bt709:out_range=tv", "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-pix_fmt", "yuv420p",
             "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv", "-movflags", "+faststart", str(mp4)],
            check=True,
        )
        from PIL import Image

        Image.open(Path(tmp) / f"{int(POSTER_AT * FPS):05d}.jpg").resize((1600, 900), Image.LANCZOS).save(poster, quality=82, method=6)
    print(f"wrote {mp4.relative_to(ROOT)} ({mp4.stat().st_size // 1024} KB, {DURATION:.0f}s at {FPS} fps) and {poster.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
