#!/usr/bin/env python3
"""Render profile/profile.yaml into the resume PDF through profile/templates/cv.html.j2.

Usage:
    python scripts/make_cv.py           # write public/Saahil-Mehta-Resume.pdf
    python scripts/make_cv.py --check   # exit 1 if the PDF was not rendered from the current YAML and template
    python scripts/make_cv.py --overlay applications/acme-head-of-data/overlay.yaml --out applications/acme-head-of-data/cv.pdf

An overlay tailors the CV for one application without touching profile.yaml. It is a YAML
file with any of: summary (replaces the CV summary), role_bullets (map of role title to the
bullets to show, in order), projects (names to keep, in order), skills (map of group to list),
title (replaces the headline title). Overlays select and reword; they never add facts.

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


def apply_overlay(data: dict, overlay: dict) -> dict:
    """Return a copy of the profile with an application overlay applied."""
    import copy

    out = copy.deepcopy(data)
    allowed = {"summary", "role_bullets", "projects", "skills", "title"}
    unknown = set(overlay) - allowed
    if unknown:
        raise ProfileError(f"overlay keys not supported: {sorted(unknown)}; allowed: {sorted(allowed)}")
    if "summary" in overlay:
        out["summaries"]["cv"] = overlay["summary"]
    if "title" in overlay:
        out["person"]["title"] = overlay["title"]
    for title, bullets in (overlay.get("role_bullets") or {}).items():
        roles = [r for r in out["roles"] if r["title"] == title]
        if not roles:
            raise ProfileError(f"overlay names a role that does not exist: {title!r}")
        roles[0]["cv_bullets"] = list(bullets)
    if "projects" in overlay:
        by_name = {pr["name"]: pr for pr in out["projects"]}
        missing = [n for n in overlay["projects"] if n not in by_name]
        if missing:
            raise ProfileError(f"overlay names projects that do not exist: {missing}")
        out["projects"] = [by_name[n] for n in overlay["projects"]]
    for group, items in (overlay.get("skills") or {}).items():
        if group not in out["skills"]:
            raise ProfileError(f"overlay names a skills group that does not exist: {group!r}")
        out["skills"][group] = list(items)
    return out


def load_overlay(path: Path) -> dict:
    import yaml

    text = path.read_text(encoding="utf-8")
    if "\u2014" in text:
        raise ProfileError(f"em dash in {path}")
    return yaml.safe_load(text) or {}


def render_html(data: dict, base_href: str = "") -> str:
    return make_env().get_template(TEMPLATE).render(base_href=base_href, **data)


PREVIEWS = ROOT / "public" / "resume"


def write_previews(pdf: Path, out_dir: Path = PREVIEWS, width: int = 900) -> list[Path]:
    """Each page of the PDF as a WebP, for screens that cannot draw a PDF inside a page."""
    import fitz  # PyMuPDF; only needed when writing

    out_dir.mkdir(parents=True, exist_ok=True)
    written = []
    with fitz.open(pdf) as doc:
        for i, page in enumerate(doc, start=1):
            zoom = width / page.rect.width
            pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), alpha=False)
            png = out_dir / f"page-{i}.png"
            pix.save(png)
            from PIL import Image

            target = out_dir / f"page-{i}.webp"
            Image.open(png).save(target, "WEBP", quality=82, method=6)
            png.unlink()
            written.append(target)
    return written


def content_hash(data: dict) -> str:
    return hashlib.sha256(render_html(data).encode("utf-8")).hexdigest()


def pdf_hash(path: Path) -> str | None:
    from pypdf import PdfReader

    meta = PdfReader(str(path)).metadata or {}
    keywords = str(meta.get("/Keywords", ""))
    return keywords.removeprefix(HASH_PREFIX) if keywords.startswith(HASH_PREFIX) else None


def write_pdf(data: dict, out: Path = OUT, stamp_hash: bool = True) -> int:
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
        meta = {
            "/Title": f"{person['name']}, {person['title']}",
            "/Author": person["name"],
            "/Subject": "Resume",
        }
        if stamp_hash:
            meta["/Keywords"] = HASH_PREFIX + content_hash(data)
        writer.add_metadata(meta)
        out.parent.mkdir(parents=True, exist_ok=True)
        with out.open("wb") as fh:
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
    parser.add_argument("--overlay", type=Path, help="application overlay YAML (tailored CV)")
    parser.add_argument("--out", type=Path, help="output path; defaults to the public resume, required with --overlay")
    args = parser.parse_args(argv)
    try:
        data = load_profile()
        if args.overlay:
            if not args.out:
                parser.error("--overlay needs --out so the public resume is never overwritten by a tailored one")
            data = apply_overlay(data, load_overlay(args.overlay))
    except ProfileError as err:
        print(f"profile error: {err}", file=sys.stderr)
        return 1
    if args.check:
        return check(data)
    out = args.out or OUT
    pages = write_pdf(data, out=out, stamp_hash=out == OUT)
    print(f"wrote {_rel(out)} ({pages} page{'s' if pages != 1 else ''}, {out.stat().st_size // 1024} KB)")
    if out == OUT:
        for img in write_previews(out):
            print(f"wrote {_rel(img)}")
    if pages > MAX_PAGES:
        print(f"resume runs to {pages} pages; the limit is {MAX_PAGES}. Trim profile.yaml or the template.", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
