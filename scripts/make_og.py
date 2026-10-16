"""Render scripts/og-template.html to public/og.png at 1200x630.

Run once locally when the template or the headline changes, then commit the PNG:
    python scripts/make_og.py
Needs Playwright with Chromium (python -m playwright install chromium).
"""
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
TEMPLATE = ROOT / "scripts" / "og-template.html"
OUT = ROOT / "public" / "og.png"

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1200, "height": 630}, device_scale_factor=1)
    page.goto(TEMPLATE.resolve().as_uri())
    page.wait_for_timeout(300)
    page.screenshot(path=str(OUT), type="png")
    browser.close()
print(f"wrote {OUT.relative_to(ROOT)} ({OUT.stat().st_size // 1024} KB)")
