#!/usr/bin/env python3
"""Render profile/profile.yaml into a CV paste (Rezi) and a LinkedIn paste.

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

# template name -> output path. The site itself is rendered by Astro from the same YAML.
OUTPUTS = {
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


def fmt_month(value: str) -> str:
    value = str(value)
    if value == "present":
        return "Present"
    year, month = value.split("-")
    return f"{MONTH_NAMES[int(month) - 1]} {year}"


def make_env(templates: Path = TEMPLATES) -> Environment:
    env = Environment(
        loader=FileSystemLoader(str(templates)),
        undefined=StrictUndefined,
        trim_blocks=True,
        lstrip_blocks=True,
        keep_trailing_newline=True,
        autoescape=False,
    )
    env.filters["month"] = fmt_month
    return env


def render_all(data: dict, env: Environment | None = None) -> dict[Path, str]:
    env = env or make_env()
    outputs: dict[Path, str] = {}
    for template_name, path in OUTPUTS.items():
        text = env.get_template(template_name).render(**data)
        outputs[path] = text if text.endswith("\n") else text + "\n"
    return outputs


def write_outputs(outputs: dict[Path, str]) -> None:
    for path, text in outputs.items():
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding="utf-8")


def check_outputs(outputs: dict[Path, str]) -> int:
    stale = 0
    for path, text in outputs.items():
        current = path.read_text(encoding="utf-8") if path.exists() else ""
        if current == text:
            continue
        stale += 1
        rel = path.relative_to(ROOT) if path.is_relative_to(ROOT) else path
        print(f"stale: {rel}")
        sys.stdout.writelines(difflib.unified_diff(
            current.splitlines(keepends=True), text.splitlines(keepends=True),
            fromfile=f"{rel} (on disk)", tofile=f"{rel} (rendered)"))
    if stale:
        print(f"{stale} stale file(s); run: python scripts/render_profile.py")
        return 1
    print("profile outputs up to date")
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="diff instead of write")
    args = parser.parse_args(argv)
    try:
        outputs = render_all(load_profile())
    except ProfileError as err:
        print(f"profile error: {err}", file=sys.stderr)
        return 1
    if args.check:
        return check_outputs(outputs)
    write_outputs(outputs)
    for path in outputs:
        print(f"wrote {path.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
