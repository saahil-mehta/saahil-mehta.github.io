"""The diagrams render from the YAML in every palette, with the state taken from the projects."""
from datetime import datetime, timezone

import pytest

import make_diagrams
from render_profile import ProfileError, load_profile

ROAD = {
    "project": "Data Foundation Plan",
    "workstreams": [
        {"name": "Orchestration", "start": "2026-Q3", "end": "2026-Q3", "state": "built"},
        {"name": "Semantic layer", "start": "2026-Q3", "end": "2027-Q1", "state": "in_build"},
        {"name": "Service levels", "start": "2027-Q4", "end": "2028-Q2", "state": "planned"},
    ],
}


def test_platform_renders_in_every_palette_from_the_record():
    data = load_profile()
    projects = {p["name"]: p for p in data["projects"]}
    for palette in ("inline", "dark", "light"):
        svg = make_diagrams.platform_svg(data["site"]["ecosystem"], projects, palette)
        assert svg.startswith("<svg") and svg.rstrip().endswith("</svg>")
        assert "—" not in svg
        assert "Orca Semantics" in svg and "Data Marts Core" in svg
        assert svg.count('class="edge"') == len(data["site"]["ecosystem"]["edges"])
    inline = make_diagrams.platform_svg(data["site"]["ecosystem"], projects, "inline")
    assert "var(--ink)" in inline and "@font-face" not in inline
    dark = make_diagrams.platform_svg(data["site"]["ecosystem"], projects, "dark")
    assert "@font-face" in dark and "#0c0c0e" in dark


def test_node_state_follows_the_project_status():
    data = load_profile()
    projects = {p["name"]: p for p in data["projects"]}
    nodes, _, _ = make_diagrams.layout_platform(data["site"]["ecosystem"], projects)
    by_id = {n.id: n for n in nodes}
    assert by_id["orca"].state == "built"
    assert by_id["semantics"].state == "in_build"
    assert by_id["marts"].state == "built"


def test_edges_and_projects_must_exist():
    data = load_profile()
    projects = {p["name"]: p for p in data["projects"]}
    eco = {"nodes": [{"id": "a", "name": "A", "col": 0, "row": 0}], "edges": [{"from": "a", "to": "zz", "label": "x"}]}
    with pytest.raises(ProfileError):
        make_diagrams.layout_platform(eco, projects)
    eco = {"nodes": [{"id": "a", "name": "A", "col": 0, "row": 0, "project": "Nope"}], "edges": []}
    with pytest.raises(ProfileError):
        make_diagrams.layout_platform(eco, projects)


def test_routes_cover_every_shape():
    data = load_profile()
    projects = {p["name"]: p for p in data["projects"]}
    nodes, edges, _ = make_diagrams.layout_platform(data["site"]["ecosystem"], projects)
    shapes = {(e.src.id, e.dst.id): e.d for e in edges}
    assert shapes[("sources", "raw")].count(" H") == 1 and " V" not in shapes[("sources", "raw")]  # along the row
    assert shapes[("core", "marts")].count(" H") == 1  # along the row
    assert shapes[("marts", "orca")].count(" V") == 2  # the arc over Orca Semantics
    assert shapes[("plan", "core")].count(" V") == 2  # the bracket
    for e in edges:
        assert e.label.upper() in make_diagrams.platform_svg(data["site"]["ecosystem"], projects, "inline")


def test_roadmap_renders_and_marks_now():
    now = datetime(2026, 10, 20, tzinfo=timezone.utc)
    for palette in ("inline", "dark", "light"):
        svg = make_diagrams.roadmap_svg(ROAD, palette, now)
        assert svg.count('class="lane"') == 3
        assert "NOW" in svg
        assert "2026" in svg and "2028" in svg
    before = make_diagrams.roadmap_svg(ROAD, "inline", datetime(2020, 1, 1, tzinfo=timezone.utc))
    assert "NOW" not in before


def test_roadmap_rejects_bad_quarters_and_states():
    with pytest.raises(ProfileError):
        make_diagrams.layout_roadmap({"workstreams": [{"name": "x", "start": "2026-3", "end": "2026-Q4", "state": "built"}]})
    with pytest.raises(ProfileError):
        make_diagrams.layout_roadmap({"workstreams": [{"name": "x", "start": "2026-Q4", "end": "2026-Q1", "state": "built"}]})
    with pytest.raises(ProfileError):
        make_diagrams.layout_roadmap({"workstreams": [{"name": "x", "start": "2026-Q1", "end": "2026-Q2", "state": "done"}]})


def test_render_all_writes_both_renditions(tmp_path):
    data = load_profile()
    data["site"]["roadmap"] = ROAD
    written = make_diagrams.render_all(data, tmp_path / "inline", tmp_path / "public", datetime(2026, 10, 20, tzinfo=timezone.utc))
    names = sorted(p.name for p in written)
    assert names == ["platform-dark.svg", "platform-light.svg", "platform.svg", "roadmap-dark.svg", "roadmap-light.svg", "roadmap.svg"]


def test_band_lines_must_fit_their_slot():
    data = load_profile()
    projects = {p["name"]: p for p in data["projects"]}
    eco = dict(data["site"]["ecosystem"])
    eco["nodes"] = [dict(n) for n in eco["nodes"]]
    band = next(n for n in eco["nodes"] if n.get("kind") == "band")
    band["line"] = "a line written far too long to sit beside its neighbours in the band under every layer"
    with pytest.raises(ProfileError):
        make_diagrams.platform_svg(eco, projects, "inline")
