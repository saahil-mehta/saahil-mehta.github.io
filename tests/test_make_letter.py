from pathlib import Path

import pytest

import make_letter
from render_profile import ProfileError, load_profile


def test_parse_letter_front_matter_and_paragraphs(tmp_path):
    p = tmp_path / "letter.md"
    p.write_text("---\nrole: Head of Data\ncompany: Acme\n---\nFirst **bold** line\nwraps.\n\nSecond with a [link](https://example.com).\n", encoding="utf-8")
    letter = make_letter.parse_letter(p)
    assert letter["role"] == "Head of Data" and letter["company"] == "Acme"
    assert letter["paragraphs"] == ["First <b>bold</b> line wraps.", 'Second with a <a href="https://example.com">link</a>.']


def test_parse_letter_rejects_em_dash_and_empty(tmp_path):
    p = tmp_path / "letter.md"
    p.write_text("Hello \u2014 world\n", encoding="utf-8")
    with pytest.raises(ProfileError):
        make_letter.parse_letter(p)
    p.write_text("---\nrole: x\n---\n", encoding="utf-8")
    with pytest.raises(ProfileError):
        make_letter.parse_letter(p)


def test_render_html_names_sender_and_role(tmp_path):
    p = tmp_path / "letter.md"
    p.write_text("---\nrole: Head of Data\n---\nBody.\n", encoding="utf-8")
    data = load_profile()
    out = make_letter.render_html(data, make_letter.parse_letter(p))
    assert data["person"]["name"] in out and "Re: Head of Data" in out and "Body." in out
