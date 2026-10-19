#!/usr/bin/env python3
"""Render a cover letter to PDF in the resume's typography.

Usage:
    python scripts/make_letter.py applications/acme-head-of-data/letter.md --out applications/acme-head-of-data/cover-letter.pdf

The letter file is Markdown with an optional YAML front matter block:

    ---
    date: 19 October 2026
    recipient: Hiring team
    company: Acme
    role: Head of Data
    greeting: Dear hiring team,
    signoff: Kind regards,
    ---
    First paragraph.

    Second paragraph with **bold** and a [link](https://example.com).

Paragraphs are separated by blank lines. Sender details come from profile.yaml.
"""
from __future__ import annotations

import argparse
import html
import re
import sys
import tempfile
from pathlib import Path

import yaml

sys.path.insert(0, str(Path(__file__).resolve().parent))
from render_profile import ProfileError, TEMPLATES, load_profile, make_env  # noqa: E402

FRONT = re.compile(r"\A---\n(.*?)\n---\n", re.S)


def inline(text: str) -> str:
    text = html.escape(text, quote=False)
    text = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)
    text = re.sub(r"\[([^\]]+)\]\((https?://[^)\s]+)\)", r'<a href="\2">\1</a>', text)
    return text


def parse_letter(path: Path) -> dict:
    text = path.read_text(encoding="utf-8")
    if "\u2014" in text:
        raise ProfileError(f"em dash in {path}")
    meta: dict = {}
    m = FRONT.match(text)
    if m:
        meta = yaml.safe_load(m.group(1)) or {}
        text = text[m.end():]
    paragraphs = [inline(" ".join(p.split())) for p in re.split(r"\n\s*\n", text.strip()) if p.strip()]
    if not paragraphs:
        raise ProfileError(f"{path} has no body paragraphs")
    fields = {k: None for k in ("date", "recipient", "company", "role", "greeting", "signoff")}
    unknown = set(meta) - set(fields)
    if unknown:
        raise ProfileError(f"front matter keys not supported: {sorted(unknown)}; allowed: {sorted(fields)}")
    return {**fields, **meta, "paragraphs": paragraphs}


def render_html(data: dict, letter: dict, base_href: str = "") -> str:
    return make_env().get_template("letter.html.j2").render(base_href=base_href, letter=letter, **data)


def write_pdf(data: dict, letter: dict, out: Path) -> int:
    from playwright.sync_api import sync_playwright
    from pypdf import PdfReader

    html_text = render_html(data, letter, base_href=TEMPLATES.resolve().as_uri() + "/")
    with tempfile.TemporaryDirectory() as tmp:
        src = Path(tmp) / "letter.html"
        src.write_text(html_text, encoding="utf-8")
        out.parent.mkdir(parents=True, exist_ok=True)
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page()
            page.goto(src.resolve().as_uri())
            page.wait_for_timeout(200)
            page.pdf(path=str(out), format="A4", print_background=True, prefer_css_page_size=True)
            browser.close()
    return len(PdfReader(str(out)).pages)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("letter", type=Path, help="Markdown letter with optional front matter")
    parser.add_argument("--out", type=Path, required=True, help="PDF path to write")
    args = parser.parse_args(argv)
    try:
        data = load_profile()
        letter = parse_letter(args.letter)
    except ProfileError as err:
        print(f"letter error: {err}", file=sys.stderr)
        return 1
    pages = write_pdf(data, letter, args.out)
    print(f"wrote {args.out} ({pages} page{'s' if pages != 1 else ''})")
    if pages > 1:
        print("cover letter runs past one page; trim it", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
