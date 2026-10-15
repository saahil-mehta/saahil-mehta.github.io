#!/usr/bin/env python3
"""Render profile/profile.yaml into the site pages, a CV paste and a LinkedIn paste.

Usage:
    python scripts/render_profile.py          # write every output
    python scripts/render_profile.py --check  # exit 1 with a diff if any output is stale
"""
from __future__ import annotations

import argparse
import difflib
import re
import sys
from pathlib import Path

import yaml
from jinja2 import Environment, FileSystemLoader, StrictUndefined

ROOT = Path(__file__).resolve().parent.parent
PROFILE = ROOT / "profile" / "profile.yaml"
TEMPLATES = ROOT / "profile" / "templates"
ABOUT = ROOT / "docs" / "about.md"
BIO_START = "<!-- profile:bio:start -->"
BIO_END = "<!-- profile:bio:end -->"

# template name -> output path
OUTPUTS = {
    "experience.md.j2": ROOT / "docs" / "experience.md",
    "projects.md.j2": ROOT / "docs" / "projects.md",
    "volunteering.md.j2": ROOT / "docs" / "volunteering.md",
    "cv.md.j2": ROOT / "profile" / "out" / "cv.md",
    "linkedin.md.j2": ROOT / "profile" / "out" / "linkedin.md",
}

REQUIRED = {"person", "summaries", "roles", "projects", "volunteering", "education", "skills"}
STATUSES = {"live", "in_progress", "paused", "archived"}
MONTH = re.compile(r"\d{4}-(0[1-9]|1[0-2])")
MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
               "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]


class ProfileError(ValueError):
    """A problem in profile.yaml that must be fixed by hand."""


def load_profile(path: Path = PROFILE) -> dict:
    text = path.read_text(encoding="utf-8")
    if "—" in text:
        line = text[: text.index("—")].count("\n") + 1
        raise ProfileError(f"em dash at {path.name}:{line}")
    data = yaml.safe_load(text)
    validate(data)
    return data


def validate(data: dict) -> None:
    missing = REQUIRED - set(data)
    if missing:
        raise ProfileError(f"missing keys: {sorted(missing)}")
    previous_start = None
    for role in data["roles"]:
        start, end = str(role["start"]), str(role["end"])
        if not MONTH.fullmatch(start):
            raise ProfileError(f"bad start {start!r} in role {role['title']!r}, want YYYY-MM")
        if end != "present" and not MONTH.fullmatch(end):
            raise ProfileError(f"bad end {end!r} in role {role['title']!r}, want YYYY-MM or present")
        if previous_start is not None and start > previous_start:
            raise ProfileError(f"roles must be newest first; {role['title']!r} starts after the role above it")
        previous_start = start
    for project in data["projects"]:
        if project["status"] not in STATUSES:
            raise ProfileError(f"status {project['status']!r} in project {project['name']!r}, want one of {sorted(STATUSES)}")
