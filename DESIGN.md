---
name: saahil.co.uk
description: A personal record presented as a status page. One committed green, white operational ground, hairline rows, tabular numerals.
colors:
  ground: "#ffffff"
  ground-2: "#f4f6f8"
  ground-3: "#e9edf1"
  ink: "#0f1419"
  ink-2: "#4b5563"
  ink-3: "#6b7280"
  rule: "#e3e7eb"
  rule-2: "#cfd5db"
  green: "#0b7a46"
  green-ink: "#0a6b3e"
  green-soft: "#d8f1e3"
  green-cell: "#1f9d5f"
  green-cell-hi: "#27b76f"
  green-field: "#0b6b40"
  green-field-2: "#0f7f4c"
  green-on-field: "#ffffff"
  green-dot: "#7ff0b2"
  amber: "#7a4d0b"
  amber-cell: "#e3a63b"
  amber-soft: "#fbefd6"
  grey-cell: "#c2c8cf"
  grey-soft: "#eef0f3"
  cell-off: "#e9ecef"
  tip-bg: "#0f1419"
  tip-fg: "#ffffff"
typography:
  display:
    fontFamily: "Bricolage Grotesque, Satoshi, sans-serif"
    fontSize: "clamp(1.75rem, 1.2rem + 2.2vw, 2.75rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.02em"
    fontVariation: "'opsz' 64"
  headline:
    fontFamily: "Bricolage Grotesque, Satoshi, sans-serif"
    fontSize: "clamp(2rem, 1.4rem + 2.4vw, 2.75rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.015em"
    fontVariation: "'opsz' 48"
  banner:
    fontFamily: "Bricolage Grotesque, Satoshi, sans-serif"
    fontSize: "clamp(1.5rem, 1.1rem + 1.6vw, 2rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.01em"
    fontVariation: "'opsz' 48"
  section:
    fontFamily: "Bricolage Grotesque, Satoshi, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.015em"
    fontVariation: "'opsz' 24"
  title:
    fontFamily: "Bricolage Grotesque, Satoshi, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.015em"
    fontVariation: "'opsz' 18"
  figure:
    fontFamily: "Bricolage Grotesque, Satoshi, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.01em"
    fontFeature: "tabular-nums"
    fontVariation: "'opsz' 24"
  body:
    fontFamily: "Satoshi, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  body-sm:
    fontFamily: "Satoshi, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "JetBrains Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0.02em"
    fontFeature: "tabular-nums"
  caption:
    fontFamily: "JetBrains Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "0.6875rem"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "normal"
rounded:
  cell: "2px"
  focus: "3px"
  tag: "4px"
  tip: "5px"
  skip: "6px"
  control: "8px"
  panel: "10px"
  pill: "999px"
  avatar: "50%"
spacing:
  "1": "0.125rem"
  "2": "0.25rem"
  "3": "0.375rem"
  "4": "0.5rem"
  "5": "0.625rem"
  "6": "0.75rem"
  "7": "0.875rem"
  "8": "1rem"
  "9": "1.125rem"
  "10": "1.25rem"
  gutter: "1.5rem"
  "14": "1.75rem"
  "16": "2rem"
  "20": "2.5rem"
  "24": "3rem"
components:
  button-secondary:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.control}"
    padding: "0 0.875rem"
    height: "2.5rem"
  button-secondary-hover:
    backgroundColor: "{colors.ground-2}"
    textColor: "{colors.ink}"
  button-primary:
    backgroundColor: "{colors.green-field-2}"
    textColor: "{colors.green-on-field}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.control}"
    padding: "0 0.875rem"
    height: "2.5rem"
  button-primary-hover:
    backgroundColor: "{colors.green-field}"
    textColor: "{colors.green-on-field}"
  icon-button:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.control}"
    size: "2.25rem"
  icon-button-hover:
    backgroundColor: "{colors.ground-2}"
    textColor: "{colors.ink}"
  pill-operational:
    backgroundColor: "{colors.green-soft}"
    textColor: "{colors.green-ink}"
    rounded: "{rounded.pill}"
    padding: "0 0.625rem 0 0.5rem"
    height: "1.75rem"
  pill-in-build:
    backgroundColor: "{colors.amber-soft}"
    textColor: "{colors.amber}"
    rounded: "{rounded.pill}"
    padding: "0 0.625rem 0 0.5rem"
    height: "1.75rem"
  pill-paused:
    backgroundColor: "{colors.grey-soft}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.pill}"
    padding: "0 0.625rem 0 0.5rem"
    height: "1.75rem"
  tag:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink-2}"
    typography: "{typography.caption}"
    rounded: "{rounded.tag}"
    padding: "0.15rem 0.45rem"
  tooltip:
    backgroundColor: "{colors.tip-bg}"
    textColor: "{colors.tip-fg}"
    typography: "{typography.caption}"
    rounded: "{rounded.tip}"
    padding: "0.25rem 0.5rem"
  detail-panel:
    backgroundColor: "{colors.ground-2}"
    textColor: "{colors.ink-2}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.panel}"
    padding: "1rem 1.25rem"
  banner:
    backgroundColor: "{colors.green-field}"
    textColor: "{colors.green-on-field}"
    typography: "{typography.banner}"
    padding: "1.25rem 0"
    height: "6rem"
  nav-link:
    textColor: "{colors.ink-2}"
    typography: "{typography.body-sm}"
    padding: "0 0.75rem"
    height: "3.5rem"
  nav-link-current:
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    padding: "0 0.75rem"
    height: "3.5rem"
---

# Design System: saahil.co.uk

## Overview

**Creative North Star: "The Status Page"**

A career record presented the way an operations team presents uptime. White ground, one committed green, hairline dividers, and every number sitting in the row it describes. The scene is a hiring manager at a laptop in a daylit office; the light theme is the default and a dark panel theme is one toggle away, swapping every token without changing the layout.

Density is tabular. Rows carry a name, a 36-cell month strip, one figure and a status pill, and the same row grammar repeats for projects (components), roles (releases), degrees and volunteering. Ornament is limited to things the status metaphor already has: a drawn dot in a pill, a strip of cells, a timestamp in mono. One authored motion exists: the strips sweep in from the left, staggered by row, once.

**Key Characteristics:**
- One green owns the banner field, the strips, the primary button, the focus ring, selection, caret and scrollbar hover.
- Hairline rules (1px, `rule`) separate rows and sections; there are no boxed cards on the lead surface.
- Numbers are set in Bricolage Grotesque 600 with tabular numerals and right-aligned in their column.
- JetBrains Mono is the voice of metadata: timestamps, strip captions, version tags, column labels, tooltips, calendar legend.
- Every page reads without JavaScript; all motion sits behind `prefers-reduced-motion`.

## Colors

A white operational ground with a greyscale ink ramp, one status green in several roles, amber for the single in-progress system, and grey for anything paused.

### Primary
- **Status Green** (`green`): the committed status colour. Focus ring (`--focus` is the same value), caret, scrollbar thumb on hover, list markers, sparkles. In dark mode it brightens to `#2fd27a`.
- **Green Ink** (`green-ink`): green used as text. Prose links, "more" links, pill text, release tags, hover colour on row titles. Dark: `#4ade80`.
- **Green Field** (`green-field`) and **Green Field 2** (`green-field-2`): the banner gradient (field-2 at top to field at bottom) and the primary button (field-2 at rest, field on hover). `green-field` is also the brand mark's ring, the theme-color meta tag and the deepest calendar level. Dark: `#0c5a37` and `#0f6b41`.
- **Green Cell** (`green-cell`) and **Green Cell Hi** (`green-cell-hi`): a lit month cell and its hover state; the brand mark's lit dot is `green-cell`. Calendar levels 1 and 2 are `color-mix` of `green-cell` at 35% and 60% into `cell-off`. Dark: `#2bbf6f` and `#43d88a`.
- **Green Soft** (`green-soft`): the Operational pill background and text selection. Dark: `#0f2d1e`.
- **Green Dot** (`green-dot`): the banner check icon only; it stays `#7ff0b2` in both themes.
- **Green On Field** (`green-on-field`): text on any green field. Dark: `#eafff3`.

### Secondary
- **Amber** (`amber`), **Amber Cell** (`amber-cell`), **Amber Soft** (`amber-soft`): the one in-progress system. Pill text, lit strip cells, pill background. Also the hover colour of the `.hover-b` easter egg. Dark: `#f0b454`, `#d99a2b`, `#2d2410`.

### Tertiary
- **Grey Cell** (`grey-cell`) and **Grey Soft** (`grey-soft`): paused or retired systems; lit cells and pill background. Dark: `#3a4148`, `#1a1f25`.

### Neutral
- **Ground** (`ground`): page background, button and tag surfaces, header at 88% with blur. Dark: `#0b0d10`.
- **Ground 2** (`ground-2`): row hover wash, detail panel, hovered button. Dark: `#121519`.
- **Ground 3** (`ground-3`): defined, used only as a dark-mode alias for grey surfaces. Dark: `#1a1f25`.
- **Ink** (`ink`): headings, body text, fact values. Dark: `#e8eaed`.
- **Ink 2** (`ink-2`): secondary copy, summaries, nav links at rest, role line. Dark: `#b4bac2`.
- **Ink 3** (`ink-3`): labels, captions, footer, hovered button border. Dark: `#8b929b`.
- **Rule** (`rule`): every hairline divider and resting border. Dark: `#1f242a`.
- **Rule 2** (`rule-2`): button borders, tag borders, nav hover underline, scrollbar thumb. Dark: `#2c333b`.
- **Cell Off** (`cell-off`): an unlit month or calendar cell. Dark: `#1a1f25`.
- **Tip** (`tip-bg`, `tip-fg`): tooltips invert the ink and ground pair in both themes.

### Named Rules
**The One Green Rule.** Status green is the only saturated colour on a page unless a system is in build (amber) or paused (grey). No second accent is introduced for emphasis, links or decoration.

**The Field Rule.** Green appears as a filled field in exactly two places: the status banner and the primary button. Everywhere else it is text, a cell, a dot or a hairline.

**The Token Swap Rule.** Dark mode redefines every colour token under `[data-theme="dark"]` and changes nothing else. New colours get a dark value in the same commit.

## Typography

**Display Font:** Bricolage Grotesque (self-hosted Latin subset, weight axis 200 to 800, optical size axis 12 to 96), falling back to Satoshi
**Body Font:** Satoshi (self-hosted variable, 300 to 900, upright and italic), falling back to the system sans
**Label/Mono Font:** JetBrains Mono (self-hosted, 400 and 500), falling back to ui-monospace

**Character:** A grotesque with visible optical sizing for names and numbers, a quiet humanist sans for sentences, and a monospace for anything a machine would print. Headings are tight (negative tracking, line-height 1.1, `text-wrap: balance`). Nothing is uppercase.

### Hierarchy
- **Display** (600, `clamp(1.75rem, 1.2rem + 2.2vw, 2.75rem)`, 1.1, opsz 64, -0.02em): the operator's name in the identity row. 44px on desktop.
- **Headline** (600, `clamp(2rem, 1.4rem + 2.4vw, 2.75rem)`, 1.1, opsz 48, -0.015em): h1 on section pages (page-head).
- **Banner** (600, `clamp(1.5rem, 1.1rem + 1.6vw, 2rem)`, 1.1, -0.01em): the status claim inside the green field.
- **Section** (600, 1.25rem, opsz 24): section-head h2. The same role at 1.375rem is used for the subscribe heading and bare h2.
- **Title** (600, 1.0625rem, opsz 18): component name, release title.
- **Figure** (600, 1.375rem, tabular numerals, opsz 24): the headline figure in a component row; fact values in the operator block use the same face at body size.
- **Body** (400, 1rem, 1.6): prose, identity line, subscribe copy. Prose measure 68ch; identity line 54ch; page-head intro 62ch at 1.0625rem.
- **Body small** (400, 0.9375rem): summaries, nav links, buttons (500), release descriptions, fact rows, detail panel.
- **Label** (mono, 0.75rem, +0.02em, `ink-3`): table column heads, section counts, banner meta, release dates, integrations line.
- **Caption** (mono, 0.6875rem, line-height 1.2): strip captions, tooltips, tags, calendar month labels and legend. Weekday labels drop to 0.625rem.
- **Version tag** (mono, 0.8125rem, `green-ink`): the `vYYYY.MM` release tag.

### Named Rules
**The Machine Voice Rule.** JetBrains Mono is for values a system would emit: timestamps, dates, version tags, captions, column labels, tooltips, tags. It never sets a sentence or a heading.

**The Tabular Rule.** Any number that sits in a column is set with `font-variant-numeric: tabular-nums` and right-aligned.

## Layout

One container (`max-width: 68rem`, `padding-inline: 1.5rem`) carries every section, and every left edge on the page (banner text, name, table, section headings, footer) sits on that same 24px gutter. The sticky header is 3.5rem tall on a translucent ground (88% `ground`, `blur(14px) saturate(140%)`) with a hairline below.

The home page is a single column of full-width sections. The banner is a full-bleed green field with `min-height: 6rem` and 1.25rem vertical padding; its container is a flex row (icon, claim, right-aligned meta). The identity row is a three-column grid (`auto minmax(0,1fr) auto`): 72px portrait, name block, actions. Each section opens with a `section-head` flex row (heading left, mono count and "more" link right) closed by a hairline, with `padding-block: 2.5rem 0.5rem`.

Row grids:
- Component row: `minmax(0,1.4fr) minmax(220px,1fr) minmax(150px,auto) 8.25rem`, gap `1rem 1.5rem`, `padding-block: 1.125rem`, hairline below.
- Release row: `7.5rem minmax(0,1fr) auto`, gap `0.5rem 1.5rem`, `padding-block: 1.125rem`.
- Operator block: `minmax(0,1.6fr) minmax(260px,1fr)`, gap 2rem.
- Facts list: `minmax(0,1fr) auto`, `padding-block: 0.75rem`, hairlines top and between.

Row hover is a wash: a `::before` layer in `ground-2` with 10px radius that bleeds half a gutter past the row on each side, fading in over 160ms.

Strips are a 36-column grid, 22px tall, 2px gap. Calendar days are 11px squares, 3px gap, with a 26px left margin for weekday labels.

Breakpoints:
- `860px`: nav collapses behind a menu button into a full-height panel; the components table drops its header and stacks each row into named areas (name/pill, strip, figure, detail); operator and subscribe go single column; identity actions move under the name.
- `640px`: banner wraps and its meta moves left at full width; the banner icon shrinks to 26px; release rows stack with dates first.

Spacing uses a 2px-based rem ladder: 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1, 1.125, 1.25, 1.5, 1.75, 2, 2.5, 3rem. The gutter (1.5rem) and the section top (2.5rem) are the anchors.

## Elevation & Depth

Flat by default. Depth is carried by hairlines and tonal steps (`ground` to `ground-2`), and two soft shadow tokens appear only on things that sit on the page rather than in it: the portrait, the primary button, tooltips and the resume frame. The dark theme uses the same two tokens with deeper black values.

### Shadow Vocabulary
- **shadow-1** (`0 1px 2px rgba(15,20,25,0.06), 0 8px 24px -12px rgba(15,20,25,0.18)`): portrait, primary button at rest, tooltip, resume frame.
- **shadow-2** (`0 2px 4px rgba(15,20,25,0.08), 0 16px 40px -16px rgba(15,20,25,0.28)`): primary button on hover, paired with `translateY(-1px)`.

### Named Rules
**The Two Shadow Rule.** Only `shadow-1` and `shadow-2` exist. Rows, panels, pills, tags and the header carry no shadow; the header separates itself with blur and a hairline.

## Shapes

Small radii that scale with the element. Cells are 2px, tags 4px, tooltips 5px, controls (buttons, icon buttons) 8px, panels (row hover wash, detail body, resume frame) 10px. Pills are fully round (999px) and the portrait is a circle. Borders are always 1px: `rule` at rest, `rule-2` on controls and tags, `ink-3` on a hovered button. The focus ring is a 2px outline in green, offset 3px, with a 3px radius.

Icons are a single drawn set on a 24-unit grid, 1.75 stroke, round caps and joins, `currentColor`, decorative unless given a label. Default size 18px; 16px inside buttons, 14px beside link text, 32px in the banner. The brand mark is a green ring (`green-field`, stroke 6 on a 64 grid) with a lit dot (`green-cell`) and is drawn from the same two tokens as the page.

## Components

### Buttons
Quiet controls that read as part of the row, with one filled green primary per group.
- **Shape:** 8px radius, 2.5rem tall, `0 0.875rem` padding, 0.5rem gap to a 16px icon, 0.9375rem at weight 500.
- **Secondary (default):** `ground` fill, 1px `rule-2` border, `ink` text. Hover: `ground-2` fill, `ink-3` border. Active: `scale(0.98)`.
- **Primary:** `green-field-2` fill, `green-field` border, `green-on-field` text, `shadow-1`. Hover: `green-field` fill, `shadow-2`, `translateY(-1px)`. Active: back to rest with `scale(0.98)`.
- **Copied state:** `data-copied="true"` swaps the border to `green`, the text to `green-ink`, and shows the "Copied" label.
- **Icon button:** 2.25rem square, 8px radius, `rule` border, `ink-2` glyph; hover `rule-2` border, `ground-2` fill, glyph rotates 15deg over 320ms; active `scale(0.94)`.

### Status Pills
- **Style:** 1.75rem tall, 999px radius, 0.8125rem at weight 500, a drawn 8px dot in `currentColor` before the label.
- **Operational:** `green-soft` on `green-ink`. **In build:** `amber-soft` on `amber`. **Paused / Retired:** `grey-soft` on `ink-2`.
- **Behaviour:** when the parent row is hovered the dot pulses once (box-shadow ring to 6px over 1.2s).

### Tags
Mono caption (0.6875rem) on `ground`, 1px `rule-2` border, 4px radius, `0.15rem 0.45rem` padding, 0.375rem gap, used under a detailed component or volunteering entry.

### Rows (Components, Releases)
- **Divider:** 1px `rule` below each row; no card border, no shadow.
- **Hover:** `ground-2` wash with 10px radius bleeding `calc(gutter * 0.5)` past the row.
- **Internal padding:** 1.125rem block.
- **Release tag:** `vYYYY.MM` in mono `green-ink`; the first column is 7.5rem.

### Month Strip
36 cells in a grid, 22px tall, 2px gap, 2px radius. Unlit cells are `cell-off`; lit cells take the row's status colour (`green-cell`, `amber-cell`, `grey-cell`). Hover scales a cell to 1.18 on the Y axis and lights `green-cell-hi`; a mono tooltip names the month above it (edge cells pin left or right). Caption below in mono: span on the left, duration on the right.

### Detail Disclosure
A `details` element whose summary is a chevron plus "How it's built" in `green-ink` at 0.875rem; the chevron rotates 90deg when open. The body expands with a `grid-template-rows` 0fr to 1fr transition over 320ms into a `ground-2` panel with `rule` border, 10px radius, `1rem 1.25rem` padding, 72ch measure.

### Tooltip
`tip-bg` on `tip-fg` (ink on ground inverted), mono 0.6875rem, `0.25rem 0.5rem`, 5px radius, `shadow-1`, 8px above the target, fading up 4px over 160ms.

### Navigation
- **Header:** sticky, 3.5rem, translucent ground with blur, hairline below. Brand is the 26px mark plus the name in Bricolage 600 at 1rem; the mark rotates -12deg and scales 1.08 on hover.
- **Links:** 0.9375rem `ink-2`, `0 0.75rem` padding, full header height. Hover: `ink` with a 2px `rule-2` underline scaling in from the left over 220ms. Current: `ink` at weight 600 with a 2px `green` indicator that carries a view-transition name so it slides between pages.
- **Mobile (≤860px):** links stack in a fixed panel below the header, 1.125rem with hairlines between; the current page is `green-ink`. The menu button swaps a menu glyph for a close glyph via `aria-expanded`.

### Status Banner
Full-bleed field, gradient `green-field-2` to `green-field`, `green-on-field` text, min 6rem tall. A 32px `check-circle` icon in `green-dot`, the claim at the banner size, a sub-line at 0.9375rem in 82% on-field colour, and a right-aligned mono meta block ("Last checked" over a bold timestamp).

### Contribution Calendar
Fetched client-side; the loading state is a 14px ring spinner (`rule-2` with a `green` top). Days are 11px, 3px gap, 2px radius, five levels from `cell-off` through two `color-mix` steps to `green-cell` and `green-field`. Month and weekday labels and the legend are mono captions in `ink-3`. Days scale 1.35 on hover with the same tooltip as the strips.

### Motion
- **Tokens:** `--ease: cubic-bezier(0.16, 1, 0.3, 1)` (exponential out), `--ease-io: cubic-bezier(0.65, 0, 0.35, 1)`, `--fast: 160ms`, `--dur: 420ms`.
- **Entry:** under `html.js` and no reduced-motion preference, lit strip cells start at `opacity 0; scaleY(0.2)` from the bottom and transition in over 420ms with a delay of `row * 70ms + cell * 9ms`, triggered once per strip by an IntersectionObserver. Nothing else animates on entry.
- **Page change:** `main` fades out over 160ms and in over 320ms with an 8px rise; the nav indicator slides over 320ms.
- **Theme change:** body background and colour cross-fade over 240ms with `--ease-io`.
- **Reduced motion:** view transitions are disabled, every hover transform is removed, the pill pulse and detail expand are cut, the strips render complete.

## Do's and Don'ts

### Do:
- **Do** put every left edge on the 1.5rem container gutter: banner text, name, table, headings, footer.
- **Do** place a number inside the row it describes, set in Bricolage 600 with tabular numerals, right-aligned.
- **Do** separate rows with a 1px `rule` hairline and signal hover with the `ground-2` wash.
- **Do** colour status with the three pill pairs only: green-soft/green-ink, amber-soft/amber, grey-soft/ink-2.
- **Do** set metadata (timestamps, dates, version tags, captions, column labels, tooltips) in JetBrains Mono at 0.75rem or 0.6875rem in `ink-3`.
- **Do** draw new icons on the 24-unit grid at 1.75 stroke with round joins, in `currentColor`.
- **Do** give every new colour a `[data-theme="dark"]` value in the same change.
- **Do** keep every page readable with scripts off and every transform inside `prefers-reduced-motion: no-preference`.

### Don't:
- **Don't** introduce a second accent; green owns the page, amber is reserved for in-build systems.
- **Don't** fill a surface with green outside the status banner and the primary button.
- **Don't** add shadows beyond `shadow-1` and `shadow-2`, and never on rows, pills, tags or the header.
- **Don't** box rows into cards; the lead surface has no bordered containers except the detail panel and the resume frame.
- **Don't** set headings, sentences or button labels in the mono face, and do not use uppercase or letter-spaced caps anywhere.
- **Don't** add a hero metric tile row, a portrait hero or a timeline; the status rows are the arrangement.
- **Don't** add a second entry animation; the strip sweep is the only authored entry motion.
