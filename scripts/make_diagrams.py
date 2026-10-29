#!/usr/bin/env python3
"""Render the platform diagram and the roadmap from profile/profile.yaml.

    python scripts/make_diagrams.py            # writes src/generated/*.svg and public/diagrams/*.svg
    python scripts/make_diagrams.py --out DIR  # write everything under DIR instead (tests)

One geometry, three renditions of each picture:
- inline: colours as CSS variables, no font embedded, classes the site's arrival animates;
  Astro inlines it, so it follows the page's scheme and face.
- dark and light: hex colours and Mona Sans embedded, the drawing animated once on load;
  status.json links them and the GitHub profile README embeds them.

The platform diagram ("How it fits together") reads site.ecosystem: nodes placed on a column
and a row, edges labelled with a short verb. The roadmap ("The plan") reads site.roadmap:
workstreams with a start quarter, an end quarter and a state. Node state follows the linked
project's status when a node names one. Text is measured with fontTools so underlines and
label halos fit the letters they belong to.
"""
from __future__ import annotations

import argparse
import base64
import sys
from dataclasses import dataclass, field
from datetime import datetime, timezone
from functools import lru_cache
from pathlib import Path
from xml.sax.saxutils import escape

sys.path.insert(0, str(Path(__file__).resolve().parent))
from render_profile import ProfileError, ROOT, load_profile  # noqa: E402

FONT = ROOT / "public" / "fonts" / "MonaSans-latin.woff2"
INLINE_DIR = ROOT / "src" / "generated"
PUBLIC_DIR = ROOT / "public" / "diagrams"
W = 1240

PALETTES = {
    "inline": {"field": "var(--field)", "ink": "var(--ink)", "ink2": "var(--ink-2)", "ink3": "var(--ink-3)", "line": "var(--line-2)", "accent": "var(--accent)"},
    "dark": {"field": "#0c0c0e", "ink": "#f2efe9", "ink2": "#b3aea5", "ink3": "#8a857d", "line": "rgb(242 239 233 / 0.12)", "accent": "#ff4a1c"},
    "light": {"field": "#f3f1ec", "ink": "#15140f", "ink2": "#5b5852", "ink3": "#6d6962", "line": "rgb(21 20 15 / 0.12)", "accent": "#c8350d"},
}
STATES = ("built", "in_build", "planned")
STATE_LABEL = {"built": "Built", "in_build": "In build", "planned": "Planned"}
PROJECT_STATE = {"live": "built", "in_progress": "in_build", "paused": "planned", "archived": "planned"}
FAMILY = '"Mona Sans",system-ui,-apple-system,"Segoe UI",Helvetica,Arial,sans-serif'


# ---------------------------------------------------------------- measuring text

class Measure:
    """Advance widths for Mona Sans at one weight, so drawn rules sit under their letters."""

    def __init__(self, path: Path, wght: float, wdth: float = 100):
        from fontTools.ttLib import TTFont
        from fontTools.varLib.instancer import instantiateVariableFont

        font = instantiateVariableFont(TTFont(str(path)), {"wght": wght, "wdth": wdth})
        self.cmap = font.getBestCmap()
        self.hmtx = font["hmtx"]
        self.upm = font["head"].unitsPerEm

    def width(self, text: str, size: float, tracking_em: float = 0.0) -> float:
        space = self.cmap.get(32)
        units = sum(self.hmtx[self.cmap.get(ord(ch), space)][0] for ch in text)
        return units / self.upm * size + max(len(text) - 1, 0) * tracking_em * size


@lru_cache(maxsize=None)
def measure(wght: int) -> Measure:
    return Measure(FONT, wght)


# ---------------------------------------------------------------- shared pieces

def font_face() -> str:
    data = base64.b64encode(FONT.read_bytes()).decode()
    return f'@font-face{{font-family:"Mona Sans";font-weight:200 900;font-stretch:75% 125%;src:url(data:font/woff2;base64,{data}) format("woff2")}}'


def text(x: float, y: float, s: str, size: float, fill: str, weight: int = 400, anchor: str = "start", cls: str = "", tracking: str = "0", upper: bool = False, extra: str = "") -> str:
    attrs = f'x="{x:.1f}" y="{y:.1f}" font-size="{size}" font-weight="{weight}" fill="{fill}" letter-spacing="{tracking}"'
    if anchor != "start":
        attrs += f' text-anchor="{anchor}"'
    if cls:
        attrs += f' class="{cls}"'
    if upper:
        s = s.upper()
    return f"<text {attrs}{extra}>{escape(s)}</text>"


def no_em_dash(s: str, where: str) -> None:
    if "—" in s:
        raise ProfileError(f"em dash in {where}")


# ---------------------------------------------------------------- the platform diagram

@dataclass
class Node:
    id: str
    name: str
    line: str
    col: int
    row: int
    span: int = 1
    kind: str = "system"  # system | people | band
    state: str = "built"
    cx: float = 0.0
    y: float = 0.0
    w: float = 0.0
    order: int = 0
    span_x: tuple[float, float] = (0.0, 0.0)

    @property
    def left(self) -> float:
        return self.cx - self.w / 2

    @property
    def right(self) -> float:
        return self.cx + self.w / 2

    @property
    def top(self) -> float:
        return self.y - NAME_SIZE * 0.78 - 8

    @property
    def bottom(self) -> float:
        return self.y + LINE_SIZE + 12 if self.line else self.y + 10

    @property
    def mid(self) -> float:
        return self.y - NAME_SIZE * 0.34


@dataclass
class Edge:
    src: Node
    dst: Node
    label: str
    order: int = 0
    d: str = ""
    label_at: tuple[float, float, str] = (0.0, 0.0, "middle")
    head: tuple[float, float, str] | None = None  # arrowhead position and direction


NAME_SIZE = 18
LINE_SIZE = 12.5
LABEL_SIZE = 10
MIN_GUTTER = 44
ROW_Y = {-1: 76, 0: 228, 1: 354}
ARC_Y = 158
HEAD_Y = 18
BAND_Y = 430
HEIGHT = 506
X0 = 6


def resolve_state(node: dict, projects: dict[str, dict]) -> str:
    if "project" in node:
        if node["project"] not in projects:
            raise ProfileError(f"ecosystem node {node['id']!r} names a project that does not exist: {node['project']!r}")
        return PROJECT_STATE[projects[node["project"]]["status"]]
    state = node.get("state", "built")
    if state not in STATES:
        raise ProfileError(f"ecosystem node {node['id']!r}: state must be one of {STATES}")
    return state


def layout_platform(eco: dict, projects: dict[str, dict]) -> tuple[list[Node], list[Edge], dict[int, tuple[float, float]]]:
    nodes: list[Node] = []
    for i, raw in enumerate(eco["nodes"]):
        n = Node(id=raw["id"], name=raw["name"], line=raw.get("line", ""), col=int(raw.get("col", 0)), row=int(raw.get("row", 0)),
                 span=int(raw.get("span", 1)), kind=raw.get("kind", "system"), state=resolve_state(raw, projects), order=i)
        no_em_dash(n.name + n.line, f"ecosystem node {n.id}")
        weight = 540 if n.kind == "system" else 440
        n.w = measure(weight).width(n.name, NAME_SIZE, -0.012)
        nodes.append(n)
    by_id = {n.id: n for n in nodes}
    if len(by_id) != len(nodes):
        raise ProfileError("ecosystem node ids must be unique")
    placed = [n for n in nodes if n.kind != "band"]
    ncols = max(n.col + n.span for n in placed)
    # Columns take the width of their widest content (name or line); the slack is shared out
    # as gutters, so edges along the flow always have room for a line between the names.
    need = [0.0] * ncols
    for n in placed:
        if n.span == 1:
            need[n.col] = max(need[n.col], n.w, measure(400).width(n.line, LINE_SIZE) if n.line else 0)
    gutter = max(MIN_GUTTER, (W - 2 * X0 - sum(need)) / max(1, ncols - 1))
    if sum(need) + MIN_GUTTER * (ncols - 1) > W - 2 * X0:
        raise ProfileError(f"ecosystem needs {sum(need) + MIN_GUTTER * (ncols - 1):.0f}px across, more than the drawing allows; shorten a name or a line")
    left = [0.0] * ncols
    x = X0
    for i in range(ncols):
        left[i] = x
        x += need[i] + gutter
    for n in nodes:
        if n.kind == "band":
            continue
        x1 = left[n.col]
        x2 = left[n.col + n.span - 1] + need[n.col + n.span - 1]
        n.cx = (x1 + x2) / 2
        n.y = ROW_Y[n.row]
        n.span_x = (x1, x2)
    for raw in eco.get("columns", []):
        for key in ("from", "to"):
            if not 0 <= int(raw[key]) < ncols:
                raise ProfileError(f"ecosystem column {raw['title']!r} spans a column that does not exist")
    extents = {i: (left[i], left[i] + need[i]) for i in range(ncols)}
    edges: list[Edge] = []
    for i, raw in enumerate(eco["edges"]):
        for key in ("from", "to"):
            if raw[key] not in by_id:
                raise ProfileError(f"ecosystem edge names an unknown node: {raw[key]!r}")
        e = Edge(by_id[raw["from"]], by_id[raw["to"]], raw["label"], order=i)
        no_em_dash(e.label, "ecosystem edge")
        route(e, nodes)
        edges.append(e)
    return nodes, edges, extents


def route(e: Edge, nodes: list[Node]) -> None:
    """Orthogonal routes: straight along a row, straight up a column, an elbow between rows,
    and an arc over the top when another node sits between two nodes on the same row."""
    s, d = e.src, e.dst
    gap = 12
    if s.row == -1 and s.span > 1:
        # A spanning node above the flow: one bracket beneath it, no ticks.
        y = s.bottom + 6
        x1, x2 = s.span_x
        e.d = f"M{x1:.1f} {y + 8:.1f} V{y:.1f} H{x2:.1f} V{y + 8:.1f}"
        e.label_at = (s.cx, y + 22, "middle")
        return
    if s.row == d.row:
        between = [n for n in nodes if n.row == s.row and n is not s and n is not d and min(s.col, d.col) < n.col < max(s.col, d.col)]
        if between:
            e.d = f"M{s.cx:.1f} {s.top - gap:.1f} V{ARC_Y:.1f} H{d.cx:.1f} V{d.top - gap:.1f}"
            e.label_at = ((s.cx + d.cx) / 2, ARC_Y - 7, "middle")
            e.head = (d.cx, d.top - gap, "down")
        else:
            a, b = (s, d) if s.col < d.col else (d, s)
            x1, x2 = a.right + gap, b.left - gap
            if s.col < d.col:
                e.d = f"M{x1:.1f} {s.mid:.1f} H{x2:.1f}"
                e.head = (x2, s.mid, "right")
            else:
                e.d = f"M{x2:.1f} {s.mid:.1f} H{x1:.1f}"
                e.head = (x1, s.mid, "left")
            e.label_at = ((x1 + x2) / 2, s.top - 2, "middle")
        return
    if s.col == d.col:
        if d.row < s.row:
            e.d = f"M{s.cx:.1f} {s.top - gap:.1f} V{d.bottom + gap:.1f}"
            ymid = (s.top - gap + d.bottom + gap) / 2
            e.head = (s.cx, d.bottom + gap, "up")
        else:
            e.d = f"M{s.cx:.1f} {s.bottom + gap:.1f} V{d.top - gap:.1f}"
            ymid = (s.bottom + d.top) / 2
            e.head = (s.cx, d.top - gap, "down")
        e.label_at = (s.cx + 10, ymid + 4, "start")
        return
    if d.row > s.row:
        # Leave the bottom, arrive at the left: a fork beneath the source.
        e.d = f"M{s.cx:.1f} {s.bottom + gap:.1f} V{d.mid:.1f} H{d.left - gap:.1f}"
        e.label_at = (s.cx + 10, (s.bottom + gap + d.mid) / 2 + 4, "start")
        e.head = (d.left - gap, d.mid, "right")
        return
    # Leave the right, arrive at the bottom.
    e.d = f"M{s.right + gap:.1f} {s.mid:.1f} H{d.cx:.1f} V{d.bottom + gap:.1f}"
    e.label_at = ((s.right + gap + d.cx) / 2, s.mid - 8, "middle")
    e.head = (d.cx, d.bottom + gap, "up")


def arrowhead(x: float, y: float, direction: str, stroke: str) -> str:
    a, b = 5.0, 3.5
    d = {
        "right": f"M{x - a:.1f} {y - b:.1f} L{x:.1f} {y:.1f} L{x - a:.1f} {y + b:.1f}",
        "left": f"M{x + a:.1f} {y - b:.1f} L{x:.1f} {y:.1f} L{x + a:.1f} {y + b:.1f}",
        "up": f"M{x - b:.1f} {y + a:.1f} L{x:.1f} {y:.1f} L{x + b:.1f} {y + a:.1f}",
        "down": f"M{x - b:.1f} {y - a:.1f} L{x:.1f} {y:.1f} L{x + b:.1f} {y - a:.1f}",
    }[direction]
    return f'<path class="head" d="{d}" fill="none" stroke="{stroke}" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>'


def platform_svg(eco: dict, projects: dict[str, dict], palette: str) -> str:
    c = PALETTES[palette]
    nodes, edges, extents = layout_platform(eco, projects)
    standalone = palette != "inline"
    parts: list[str] = []
    # Column headings: the layer each column belongs to, with a hairline under its span.
    for col in eco.get("columns", []):
        x1, x2 = extents[int(col["from"])][0], extents[int(col["to"])][1]
        no_em_dash(col["title"], "ecosystem column")
        parts.append(
            f'<g class="node head" style="--i:{int(col["from"])}">'
            f'{text(x1, HEAD_Y, col["title"], 10.5, c["ink3"], 540, "start", "lab", "0.08em", upper=True)}'
            f'<path d="M{x1:.1f} {HEAD_Y + 10} H{x2:.1f}" stroke="{c["line"]}" stroke-width="1" fill="none"/>'
            "</g>"
        )
    # Edges first so nodes sit over them.
    for e in edges:
        lx, ly, anchor = e.label_at
        lw = measure(540).width(e.label.upper(), LABEL_SIZE, 0.08) + 12
        hx = lx - lw / 2 if anchor == "middle" else lx - 6
        parts.append(
            f'<g class="edge" style="--i:{e.src.col + 1}">'
            f'<path d="{e.d}" pathLength="1" fill="none" stroke="{c["ink3"]}" stroke-width="1" stroke-linejoin="round" stroke-linecap="round"/>'
            + (arrowhead(*e.head, c["ink3"]) if e.head else "")
            + f'<rect class="halo" x="{hx:.1f}" y="{ly - 10:.1f}" width="{lw:.1f}" height="14" fill="{c["field"]}"/>'
            f'{text(lx, ly, e.label, LABEL_SIZE, c["ink3"], 540, anchor, "lab", "0.08em", upper=True)}'
            "</g>"
        )
    legend_states: set[str] = set()
    for n in nodes:
        if n.kind == "band":
            continue
        weight = 540 if n.kind == "system" else 440
        ink = c["ink"] if n.state != "planned" else c["ink2"]
        name_w = measure(weight).width(n.name, NAME_SIZE, -0.012)
        g = [f'<g class="node" style="--i:{n.col}">', text(n.cx, n.y, n.name, NAME_SIZE, ink, weight, "middle", "name", "-0.012em")]
        if n.state == "in_build":
            legend_states.add("in_build")
            g.append(f'<rect class="u" x="{n.cx - name_w / 2:.1f}" y="{n.y + 5:.1f}" width="{name_w:.1f}" height="2" fill="{c["accent"]}"/>')
        elif n.state == "planned":
            legend_states.add("planned")
            g.append(f'<path class="u" d="M{n.cx - name_w / 2:.1f} {n.y + 6:.1f} H{n.cx + name_w / 2:.1f}" stroke="{c["ink3"]}" stroke-width="1" stroke-dasharray="3 3" fill="none"/>')
        if n.line:
            g.append(text(n.cx, n.y + LINE_SIZE + 10, n.line, LINE_SIZE, c["ink2"], 400, "middle"))
        g.append("</g>")
        parts.append("".join(g))
    # The band: services that run under every layer, in a row beneath a hairline.
    band = [n for n in nodes if n.kind == "band"]
    if band:
        title = eco.get("band_title", "")
        parts.append(f'<g class="node band-head" style="--i:0"><path d="M{X0} {BAND_Y} H{W - X0}" stroke="{c["line"]}" stroke-width="1" fill="none"/>'
                     + (text(X0, BAND_Y - 9, title, 10.5, c["ink3"], 540, "start", "lab", "0.08em", upper=True) if title else "") + "</g>")
        slot = (W - 2 * X0) / len(band)
        for n in band:
            widest = max(measure(540).width(n.name, 15, -0.012), measure(400).width(n.line, 12))
            if widest > slot - 18:
                raise ProfileError(f"ecosystem band node {n.id!r} is {widest:.0f}px wide, its slot allows {slot - 18:.0f}px; shorten its name or line")
        for i, n in enumerate(band):
            x = X0 + i * slot
            ink = c["ink"] if n.state != "planned" else c["ink2"]
            name_w = measure(540).width(n.name, 15, -0.012)
            g = [f'<g class="node band-node" style="--i:{i + 1}">', text(x, BAND_Y + 28, n.name, 15, ink, 540, tracking="-0.012em")]
            if n.state == "in_build":
                legend_states.add("in_build")
                g.append(f'<rect class="u" x="{x:.1f}" y="{BAND_Y + 33:.1f}" width="{name_w:.1f}" height="2" fill="{c["accent"]}"/>')
            elif n.state == "planned":
                legend_states.add("planned")
                g.append(f'<path class="u" d="M{x:.1f} {BAND_Y + 34:.1f} H{x + name_w:.1f}" stroke="{c["ink3"]}" stroke-width="1" stroke-dasharray="3 3" fill="none"/>')
            if n.line:
                g.append(text(x, BAND_Y + 48, n.line, 12, c["ink2"]))
            g.append("</g>")
            parts.append("".join(g))
    # Legend: only the states that appear, at the right of the band's title line.
    legend = []
    lx = W - X0
    for state in ("planned", "in_build"):
        if state not in legend_states:
            continue
        label = STATE_LABEL[state]
        lw = measure(540).width(label.upper(), 11, 0.08)
        legend.append(text(lx, BAND_Y - 9, label, 11, c["ink3"], 540, "end", "lab", "0.08em", upper=True))
        lx -= lw + 10
        if state == "in_build":
            legend.append(f'<rect x="{lx - 18:.1f}" y="{BAND_Y - 13}" width="18" height="2" fill="{c["accent"]}"/>')
        else:
            legend.append(f'<path d="M{lx - 18:.1f} {BAND_Y - 12} H{lx:.1f}" stroke="{c["ink3"]}" stroke-width="1" stroke-dasharray="3 3"/>')
        lx -= 18 + 22
    title = "How it fits together"
    desc = "; ".join(f"{e.src.name} {e.label} {e.dst.name}" for e in edges)
    style = inline_style(c) if not standalone else standalone_style(c, len(nodes))
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {HEIGHT}" width="{W}" height="{HEIGHT}" role="img" aria-labelledby="platform-title platform-desc" class="diagram-svg platform">'
        f'<title id="platform-title">{escape(title)}</title><desc id="platform-desc">{escape(desc)}.</desc>'
        f'<defs><style>{style}</style></defs>'
        + (f'<rect width="{W}" height="{HEIGHT}" fill="{c["field"]}"/>' if standalone else "")
        + "".join(parts) + "".join(legend)
        + "</svg>\n"
    )


def inline_style(c: dict) -> str:
    return (
        f".diagram-svg text{{font-family:{FAMILY};font-feature-settings:'ss01','cv11'}}"
        ".diagram-svg .lab{font-variant-numeric:tabular-nums}"
    )


def standalone_style(c: dict, count: int) -> str:
    # Draw once on load: edges trace, nodes rise, underlines draw; still under reduced motion.
    return (
        font_face()
        + f"text{{font-family:{FAMILY}}}"
        ".edge path:not(.head){stroke-dasharray:1;stroke-dashoffset:1;animation:trace 900ms cubic-bezier(0.16,1,0.3,1) forwards;animation-delay:calc(var(--i,0) * 90ms + 250ms)}"
        ".edge .halo,.edge text,.edge .head{opacity:0;animation:appear 400ms linear forwards;animation-delay:calc(var(--i,0) * 90ms + 700ms)}"
        ".node{opacity:0;transform:translateY(8px);animation:rise 700ms cubic-bezier(0.16,1,0.3,1) forwards;animation-delay:calc(var(--i,0) * 90ms)}"
        ".node .u{transform-box:fill-box;transform-origin:left center;transform:scaleX(0);animation:draw 900ms cubic-bezier(0.16,1,0.3,1) forwards;animation-delay:calc(var(--i,0) * 90ms + 500ms)}"
        "@keyframes trace{to{stroke-dashoffset:0}}@keyframes appear{to{opacity:1}}@keyframes rise{to{opacity:1;transform:none}}@keyframes draw{to{transform:scaleX(1)}}"
        "@media (prefers-reduced-motion: reduce){.edge path:not(.head),.edge .halo,.edge text,.edge .head,.node,.node .u{animation:none;opacity:1;transform:none;stroke-dashoffset:0}}"
    )


# ---------------------------------------------------------------- the roadmap

@dataclass
class Lane:
    name: str
    start: int  # quarter index: year * 4 + (q - 1)
    end: int
    state: str
    line: str = ""


def quarter_index(value: str, where: str) -> int:
    try:
        year, q = value.split("-Q")
        y, qi = int(year), int(q)
    except ValueError:
        raise ProfileError(f"{where}: want YYYY-Qn, got {value!r}") from None
    if not 1 <= qi <= 4:
        raise ProfileError(f"{where}: quarter must be 1 to 4, got {value!r}")
    return y * 4 + (qi - 1)


def layout_roadmap(road: dict) -> list[Lane]:
    lanes = []
    for raw in road["workstreams"]:
        where = f"roadmap workstream {raw.get('name', '?')!r}"
        if raw.get("state") not in STATES:
            raise ProfileError(f"{where}: state must be one of {STATES}")
        lane = Lane(raw["name"], quarter_index(str(raw["start"]), where), quarter_index(str(raw["end"]), where), raw["state"], raw.get("line", ""))
        if lane.end < lane.start:
            raise ProfileError(f"{where}: ends before it starts")
        no_em_dash(lane.name + lane.line, where)
        lanes.append(lane)
    if not lanes:
        raise ProfileError("roadmap has no workstreams")
    return lanes


ROAD_LABEL_W = 250
ROAD_HEAD = 58
ROAD_ROW = 46
ROAD_FOOT = 44


def roadmap_svg(road: dict, palette: str, now: datetime | None = None) -> str:
    c = PALETTES[palette]
    lanes = layout_roadmap(road)
    standalone = palette != "inline"
    q0 = min(l.start for l in lanes)
    q1 = max(l.end for l in lanes)
    nq = q1 - q0 + 1
    gx0, gx1 = X0 + ROAD_LABEL_W, W - X0
    qw = (gx1 - gx0) / nq
    height = ROAD_HEAD + len(lanes) * ROAD_ROW + ROAD_FOOT
    parts: list[str] = []
    # Quarter hairlines and year labels along the head.
    for i in range(nq + 1):
        x = gx0 + i * qw
        q = q0 + i
        strong = (q % 4 == 0) or i == 0 or i == nq
        parts.append(f'<path class="grid" d="M{x:.1f} {ROAD_HEAD - 14} V{height - ROAD_FOOT + 10}" stroke="{c["line"]}" stroke-width="1" fill="none"{" stroke-dasharray=\"2 4\"" if not strong else ""}/>')
        if i < nq and (q % 4 == 0 or i == 0):
            parts.append(text(x + 8, ROAD_HEAD - 24, str(q // 4), 14, c["ink"], 540, tracking="-0.012em"))
        if i < nq:
            parts.append(text(x + qw / 2, ROAD_HEAD - 24, f"Q{q % 4 + 1}", 10, c["ink3"], 540, "middle", "lab", "0.08em"))
    # Lanes.
    for r, lane in enumerate(lanes):
        y = ROAD_HEAD + r * ROAD_ROW
        ym = y + ROAD_ROW / 2
        parts.append(f'<path d="M{X0} {y + ROAD_ROW:.1f} H{gx1}" stroke="{c["line"]}" stroke-width="1" fill="none"/>')
        parts.append(text(X0, ym + 5, lane.name, 15, c["ink"] if lane.state != "planned" else c["ink2"], 500 if lane.state != "planned" else 440, tracking="-0.01em"))
        bx0, bx1 = gx0 + (lane.start - q0) * qw + 3, gx0 + (lane.end - q0 + 1) * qw - 3
        bw = bx1 - bx0
        if lane.state == "built":
            bar = f'<rect class="bar" x="{bx0:.1f}" y="{ym - 5:.1f}" width="{bw:.1f}" height="10" rx="2" fill="{c["ink"]}"/>'
        elif lane.state == "in_build":
            bar = f'<rect class="bar" x="{bx0:.1f}" y="{ym - 5:.1f}" width="{bw:.1f}" height="10" rx="2" fill="{c["accent"]}"/>'
        else:
            bar = f'<rect class="bar" x="{bx0 + 0.5:.1f}" y="{ym - 4.5:.1f}" width="{bw - 1:.1f}" height="9" rx="2" fill="none" stroke="{c["ink3"]}" stroke-width="1"/>'
        parts.append(f'<g class="lane" style="--i:{r}">{bar}</g>')
    # Now: a hairline at the build month, labelled.
    now = now or datetime.now(timezone.utc)
    nowq = now.year * 4 + (now.month - 1) // 3
    if q0 <= nowq <= q1:
        frac = ((now.month - 1) % 3 + (now.day - 1) / 31) / 3
        x = gx0 + (nowq - q0 + frac) * qw
        parts.append(f'<g class="now"><path d="M{x:.1f} {ROAD_HEAD - 14} V{height - ROAD_FOOT + 10}" stroke="{c["accent"]}" stroke-width="1" fill="none" stroke-dasharray="3 3"/>'
                     f'{text(x, height - ROAD_FOOT + 26, "Now", 10, c["accent"], 540, "middle", "lab", "0.08em", upper=True)}</g>')
    # Legend.
    legend = []
    lx = gx1
    for state in ("planned", "in_build", "built"):
        label = STATE_LABEL[state]
        lw = measure(540).width(label.upper(), 10, 0.08)
        legend.append(text(lx, height - 12, label, 10, c["ink3"], 540, "end", "lab", "0.08em", upper=True))
        lx -= lw + 8
        if state == "built":
            legend.append(f'<rect x="{lx - 16:.1f}" y="{height - 19}" width="16" height="6" rx="1.5" fill="{c["ink"]}"/>')
        elif state == "in_build":
            legend.append(f'<rect x="{lx - 16:.1f}" y="{height - 19}" width="16" height="6" rx="1.5" fill="{c["accent"]}"/>')
        else:
            legend.append(f'<rect x="{lx - 15.5:.1f}" y="{height - 18.5}" width="15" height="5" rx="1.5" fill="none" stroke="{c["ink3"]}"/>')
        lx -= 16 + 20
    title = "The plan"
    desc = "; ".join(f"{l.name}, {STATE_LABEL[l.state].lower()}" for l in lanes)
    style = inline_style(c) if not standalone else roadmap_standalone_style(c)
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {height}" width="{W}" height="{height}" role="img" aria-labelledby="roadmap-title roadmap-desc" class="diagram-svg roadmap">'
        f'<title id="roadmap-title">{escape(title)}</title><desc id="roadmap-desc">{escape(desc)}.</desc>'
        f"<defs><style>{style}</style></defs>"
        + (f'<rect width="{W}" height="{height}" fill="{c["field"]}"/>' if standalone else "")
        + "".join(parts) + "".join(legend) + "</svg>\n"
    )


def roadmap_standalone_style(c: dict) -> str:
    return (
        font_face()
        + f"text{{font-family:{FAMILY}}}"
        ".lane{transform-box:fill-box;transform-origin:left center;transform:scaleX(0);animation:draw 800ms cubic-bezier(0.16,1,0.3,1) forwards;animation-delay:calc(var(--i,0) * 80ms + 150ms)}"
        "@keyframes draw{to{transform:scaleX(1)}}"
        "@media (prefers-reduced-motion: reduce){.lane{animation:none;transform:none}}"
    )


# ---------------------------------------------------------------- entry

def render_all(data: dict, inline_dir: Path, public_dir: Path, now: datetime | None = None) -> list[Path]:
    site = data["site"]
    projects = {p["name"]: p for p in data["projects"]}
    written: list[Path] = []
    inline_dir.mkdir(parents=True, exist_ok=True)
    public_dir.mkdir(parents=True, exist_ok=True)
    eco = site.get("ecosystem")
    if eco:
        (inline_dir / "platform.svg").write_text(platform_svg(eco, projects, "inline"), encoding="utf-8")
        written.append(inline_dir / "platform.svg")
        for theme in ("dark", "light"):
            p = public_dir / f"platform-{theme}.svg"
            p.write_text(platform_svg(eco, projects, theme), encoding="utf-8")
            written.append(p)
    road = site.get("roadmap")
    if road:
        (inline_dir / "roadmap.svg").write_text(roadmap_svg(road, "inline", now), encoding="utf-8")
        written.append(inline_dir / "roadmap.svg")
        for theme in ("dark", "light"):
            p = public_dir / f"roadmap-{theme}.svg"
            p.write_text(roadmap_svg(road, theme, now), encoding="utf-8")
            written.append(p)
    else:
        # A plan taken out of the YAML must not linger as a file the build would still publish.
        for stale in (inline_dir / "roadmap.svg", public_dir / "roadmap-dark.svg", public_dir / "roadmap-light.svg"):
            stale.unlink(missing_ok=True)
    return written


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--out", type=Path, help="write inline/ and public/ renditions under this directory")
    args = parser.parse_args()
    try:
        data = load_profile()
        if args.out:
            written = render_all(data, args.out / "inline", args.out / "public")
        else:
            written = render_all(data, INLINE_DIR, PUBLIC_DIR)
    except ProfileError as err:
        print(f"make_diagrams: {err}")
        return 1
    for p in written:
        print(f"wrote {p.relative_to(ROOT) if p.is_relative_to(ROOT) else p} ({p.stat().st_size // 1024} KB)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
