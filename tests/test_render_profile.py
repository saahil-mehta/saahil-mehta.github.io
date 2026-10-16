import copy

import pytest
import yaml

import render_profile as rp

MINIMAL = {
    "person": {"name": "A", "title": "T", "title_official": "T", "headline": "H",
               "location": "L", "email": "a@b.c",
               "links": {"github": "g", "linkedin": "l", "calendly": "c", "site": "s"}},
    "summaries": {"cv": "cv", "site_bio": "bio", "linkedin": "li"},
    "roles": [
        {"org": "O", "unit": None, "title": "New", "start": "2026-07", "end": "present",
         "location": "L", "tags": [], "cv_bullets": ["did x"], "site_desc": "d", "linkedin_desc": "d"},
        {"org": "O", "unit": None, "title": "Old", "start": "2024-03", "end": "2026-07",
         "location": "L", "tags": [], "cv_bullets": ["did y"], "site_desc": "d", "linkedin_desc": "d"},
    ],
    "projects": [
        {"name": "P", "org": "O", "venue": "O · Production", "period": "2026", "status": "live",
         "tags": [], "icon": "assets/x.json", "link": None, "cv_line": "p", "site_summary": "s",
         "site_detail": None}
    ],
    "volunteering": [],
    "education": [],
    "skills": {"platform": [], "ai": [], "governance": [], "leadership": []},
}


def write_profile(tmp_path, data=None, text=None):
    path = tmp_path / "profile.yaml"
    path.write_text(text if text is not None else yaml.safe_dump(data), encoding="utf-8")
    return path


def test_load_valid_profile(tmp_path):
    data = rp.load_profile(write_profile(tmp_path, MINIMAL))
    assert data["roles"][0]["title"] == "New"


def test_em_dash_rejected_with_line_number(tmp_path):
    text = yaml.safe_dump(MINIMAL) + "\nnote: a — b\n"
    with pytest.raises(rp.ProfileError, match=r"em dash at profile\.yaml:\d+"):
        rp.load_profile(write_profile(tmp_path, text=text))


def test_missing_top_level_key(tmp_path):
    data = copy.deepcopy(MINIMAL)
    del data["skills"]
    with pytest.raises(rp.ProfileError, match="missing keys: \\['skills'\\]"):
        rp.load_profile(write_profile(tmp_path, data))


def test_bad_project_status(tmp_path):
    data = copy.deepcopy(MINIMAL)
    data["projects"][0]["status"] = "done"
    with pytest.raises(rp.ProfileError, match="status 'done'"):
        rp.load_profile(write_profile(tmp_path, data))


def test_roles_must_be_newest_first(tmp_path):
    data = copy.deepcopy(MINIMAL)
    data["roles"].reverse()
    with pytest.raises(rp.ProfileError, match="newest first"):
        rp.load_profile(write_profile(tmp_path, data))


def test_bad_role_date(tmp_path):
    data = copy.deepcopy(MINIMAL)
    data["roles"][0]["start"] = "July 2026"
    with pytest.raises(rp.ProfileError, match="start 'July 2026'"):
        rp.load_profile(write_profile(tmp_path, data))


def test_fmt_month():
    assert rp.fmt_month("2026-07") == "Jul 2026"
    assert rp.fmt_month("present") == "Present"



def test_check_reports_stale_file(tmp_path, capsys):
    target = tmp_path / "out.md"
    target.write_text("old\n", encoding="utf-8")
    assert rp.check_outputs({target: "new\n"}) == 1
    assert "-old" in capsys.readouterr().out
    assert rp.check_outputs({target: "old\n"}) == 0


def test_check_reports_missing_file(tmp_path):
    assert rp.check_outputs({tmp_path / "absent.md": "x\n"}) == 1


def test_write_outputs_creates_parents(tmp_path):
    target = tmp_path / "deep" / "out.md"
    rp.write_outputs({target: "x\n"})
    assert target.read_text(encoding="utf-8") == "x\n"
