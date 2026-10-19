#!/usr/bin/env python3
"""Render profile/profile.yaml into the resume PDF through profile/templates/cv.html.j2.

Usage:
    python scripts/make_cv.py           # write public/Saahil-Mehta-Resume.pdf
    python scripts/make_cv.py --check   # exit 1 if the PDF was not rendered from the current YAML and template

Writing needs Playwright with Chromium (python -m playwright install chromium); checking needs
only pypdf. The PDF carries a content hash of the rendered HTML in its Keywords field, which is
what --check compares, so CI does not need a browser.
"""
from __future__ import annotations

import argparse
import hashlib
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from render_profile import ProfileError, ROOT, TEMPLATES, load_profile, make_env  # noqa: E402

OUT = ROOT / "public" / "Saahil-Mehta-Resume.pdf"
TEMPLATE = "cv.html.j2"
HASH_PREFIX = "profile-sha256:"
MAX_PAGES = 2


def render_html(data: dict, base_href: str = "") -> str:
    return make_env().get_template(TEMPLATE).render(base_href=base_href, **data)


def content_hash(data: dict) -> str:
    return hashlib.sha256(render_html(data).encode("utf-8")).hexdigest()


def pdf_hash(path: Path) -> str | None:
    from pypdf import PdfReader

    meta = PdfReader(str(path)).metadata or {}
    keywords = str(meta.get("/Keywords", ""))
    return keywords.removeprefix(HASH_PREFIX) if keywords.startswith(HASH_PREFIX) else None


def write_pdf(data: dict) -> int:
    from playwright.sync_api import sync_playwright
    from pypdf import PdfReader, PdfWriter

    html = render_html(data, base_href=TEMPLATES.resolve().as_uri() + "/")
    with tempfile.TemporaryDirectory() as tmp:
        src = Path(tmp) / "cv.html"
        raw = Path(tmp) / "cv.pdf"
        src.write_text(html, encoding="utf-8")
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page()
            page.goto(src.resolve().as_uri())
            page.wait_for_timeout(200)
            page.pdf(path=str(raw), format="A4", print_background=True, prefer_css_page_size=True)
            browser.close()
        reader = PdfReader(str(raw))
        pages = len(reader.pages)
        writer = PdfWriter(clone_from=reader)
        person = data["person"]
        writer.add_metadata({
            "/Title": f"{person['name']}, {person['title']}",
            "/Author": person["name"],
            "/Subject": "Resume",
            "/Keywords": HASH_PREFIX + content_hash(data),
        })
        OUT.parent.mkdir(parents=True, exist_ok=True)
        with OUT.open("wb") as fh:
            writer.write(fh)
    return pages


def _rel(path: Path) -> Path:
    return path.relative_to(ROOT) if path.is_relative_to(ROOT) else path


def check(data: dict) -> int:
    if not OUT.exists():
        print(f"missing {_rel(OUT)}; run: python scripts/make_cv.py")
        return 1
    want, have = content_hash(data), pdf_hash(OUT)
    if want != have:
        print(f"stale: {_rel(OUT)} was not rendered from the current profile.yaml and cv.html.j2; run: python scripts/make_cv.py")
        return 1
    print("resume PDF up to date")
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="verify instead of write")
    args = parser.parse_args(argv)
    try:
        data = load_profile()
    except ProfileError as err:
        print(f"profile error: {err}", file=sys.stderr)
        return 1
    if args.check:
        return check(data)
    pages = write_pdf(data)
    print(f"wrote {_rel(OUT)} ({pages} page{'s' if pages != 1 else ''}, {OUT.stat().st_size // 1024} KB)")
    if pages > MAX_PAGES:
        print(f"resume runs to {pages} pages; the limit is {MAX_PAGES}. Trim profile.yaml or the template.", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
