"""The resume PDF check compares a hash of the rendered template with the hash stored in the PDF."""
from pathlib import Path

from pypdf import PdfWriter

import make_cv
from render_profile import load_profile


def _pdf_with_keywords(path: Path, keywords: str) -> None:
    writer = PdfWriter()
    writer.add_blank_page(width=595, height=842)
    writer.add_metadata({"/Keywords": keywords})
    with path.open("wb") as fh:
        writer.write(fh)


def test_content_hash_is_stable():
    data = load_profile()
    assert make_cv.content_hash(data) == make_cv.content_hash(data)
    assert len(make_cv.content_hash(data)) == 64


def test_check_passes_when_hash_matches(tmp_path, monkeypatch):
    data = load_profile()
    out = tmp_path / "resume.pdf"
    _pdf_with_keywords(out, make_cv.HASH_PREFIX + make_cv.content_hash(data))
    monkeypatch.setattr(make_cv, "OUT", out)
    assert make_cv.check(data) == 0


def test_check_fails_when_stale_or_missing(tmp_path, monkeypatch, capsys):
    data = load_profile()
    out = tmp_path / "resume.pdf"
    monkeypatch.setattr(make_cv, "OUT", out)
    assert make_cv.check(data) == 1
    assert "missing" in capsys.readouterr().out
    _pdf_with_keywords(out, make_cv.HASH_PREFIX + "0" * 64)
    assert make_cv.check(data) == 1
    assert "stale" in capsys.readouterr().out


def test_rendered_html_has_no_em_dash_and_names_the_person():
    data = load_profile()
    html = make_cv.render_html(data)
    assert "—" not in html
    assert data["person"]["name"] in html
    assert data["roles"][0]["title"] in html
