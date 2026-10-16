"""Render the first frame of the Lottie logo to public/logo.png (192x192, transparent).

The header shows this static mark so the 380 KB Lottie player never loads above the fold.
Run when the animation changes:  python scripts/make_logo.py
"""
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
RENDER_PAGE = ROOT / "scripts" / "logo-render.html"
OUT = ROOT / "public" / "logo.png"

RENDER_PAGE.write_text(
    """<!doctype html><html><head><meta charset="utf-8">
<style>html,body{margin:0;background:transparent}lottie-player{width:192px;height:192px;display:block}</style>
<script src="../node_modules/@lottiefiles/lottie-player/dist/lottie-player.js"></script></head>
<body>
<lottie-player id="p" src="../public/assets/logo-animation.json" background="transparent"></lottie-player>
<script>
  const el = document.getElementById('p');
  for (const name of ['ready', 'load', 'frame']) {
    el.addEventListener(name, () => { document.body.dataset.ready = '1'; }, { once: true });
  }
</script>
</body></html>
""",
    encoding="utf-8",
)

with sync_playwright() as p:
    browser = p.chromium.launch(args=["--allow-file-access-from-files"])
    page = browser.new_page(viewport={"width": 192, "height": 192}, device_scale_factor=1)
    page.on("console", lambda m: print("console:", m.text) if m.type in ("error", "warning") else None)
    page.goto(RENDER_PAGE.resolve().as_uri())
    try:
        page.wait_for_selector("body[data-ready='1']", timeout=8000)
    except Exception as err:  # noqa: BLE001
        print(f"no ready event, screenshotting anyway: {err.__class__.__name__}")
    page.wait_for_timeout(400)
    page.evaluate("document.getElementById('p').seek && document.getElementById('p').seek(0)")
    page.evaluate("document.getElementById('p').pause && document.getElementById('p').pause()")
    page.wait_for_timeout(100)
    page.locator("lottie-player").screenshot(path=str(OUT), omit_background=True)
    browser.close()
RENDER_PAGE.unlink()
print(f"wrote {OUT.relative_to(ROOT)} ({OUT.stat().st_size // 1024} KB)")
