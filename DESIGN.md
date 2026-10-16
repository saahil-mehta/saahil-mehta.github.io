---
name: saahil.co.uk
description: A personal record printed as a state kiosk of goods. Recycled board, three inks, rule boxes, one geometric mark per system.
colors:
  board: "#d7d2c6"
  board-2: "#cdc7b9"
  board-3: "#c2bcad"
  board-stock-b: "#d3cec0"
  board-stock-c: "#dad5c9"
  paper: "#f1ede3"
  night: "#1e3a6b"
  ink-2: "#44527a"
  ink-3: "#5d6a8a"
  red: "#c23a2b"
  red-ink: "#8e2518"
  green: "#6a7a43"
  green-ink: "#46542c"
  ledger-1: "#aeb8cf"
  ledger-2: "#7a8fb8"
  ledger-3: "#456aa3"
typography:
  display:
    fontFamily: "Archivo Expanded, Archivo, Helvetica, sans-serif"
    fontSize: "clamp(2rem, 1.4rem + 2.2vw, 3.25rem)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "0.04em"
    textTransform: "uppercase"
  headline:
    fontFamily: "Archivo, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, sans-serif"
    fontSize: "clamp(2.25rem, 1rem + 3.4vw, 3.75rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0"
    textTransform: "uppercase"
  title:
    fontFamily: "Archivo Expanded, Archivo, Helvetica, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "0.04em"
    textTransform: "uppercase"
  title-sm:
    fontFamily: "Archivo Expanded, Archivo, Helvetica, sans-serif"
    fontSize: "1rem"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "0.06em"
    textTransform: "uppercase"
  figure:
    fontFamily: "Archivo Expanded, Archivo, Helvetica, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "0.02em"
    fontFeature: "tabular-nums"
  body:
    fontFamily: "Archivo, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  body-sm:
    fontFamily: "Archivo, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  label:
    fontFamily: "Archivo Expanded, Archivo, Helvetica, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.14em"
    textTransform: "uppercase"
  label-sm:
    fontFamily: "Archivo Expanded, Archivo, Helvetica, sans-serif"
    fontSize: "0.625rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.14em"
    textTransform: "uppercase"
  serial:
    fontFamily: "JetBrains Mono, ui-monospace, Menlo, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
    fontFeature: "tabular-nums"
rounded:
  none: "0"
spacing:
  rule: "1.5px"
  xs: "0.375rem"
  sm: "0.75rem"
  md: "1.125rem"
  gutter: "1.5rem"
  lg: "2rem"
  masthead: "4.5rem"
  measure: "76rem"
components:
  button-outline:
    backgroundColor: "{colors.board}"
    textColor: "{colors.night}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 1.125rem"
    height: "2.75rem"
  button-outline-hover:
    backgroundColor: "{colors.board}"
    textColor: "{colors.red}"
  button-fill:
    backgroundColor: "{colors.night}"
    textColor: "{colors.board}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 1.125rem"
    height: "2.75rem"
  button-fill-hover:
    backgroundColor: "{colors.red}"
    textColor: "{colors.board}"
  nav-tab:
    backgroundColor: "{colors.board}"
    textColor: "{colors.night}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 0.75rem"
    height: "2.125rem"
  nav-tab-active:
    backgroundColor: "{colors.night}"
    textColor: "{colors.board}"
  good-cell:
    backgroundColor: "{colors.board}"
    textColor: "{colors.night}"
    rounded: "{rounded.none}"
    padding: "1.125rem 1.25rem 0"
  ticket-stub:
    backgroundColor: "{colors.board-2}"
    textColor: "{colors.red-ink}"
    typography: "{typography.serial}"
    rounded: "{rounded.none}"
    padding: "1.125rem 1rem 1.125rem 1.25rem"
    width: "8.75rem"
  tag:
    textColor: "{colors.ink-2}"
    typography: "{typography.label-sm}"
    padding: "0"
---

# Design System: saahil.co.uk

## Overview

**Creative North Star: "The State Kiosk"**

The site is printed matter from a civic design office. Every system Saahil has shipped is a good on a kiosk shelf, printed on recycled board in three permitted inks and stamped with its own geometric mark. The career is a strip of tram tickets with punched stubs. The commit calendar is the production ledger. Contact is the office counter.

The build carries this through one paper stock and three inks. Night ink sets all text, rules and primary controls. Civic red is the third ink: the active cell outline on hover, the headline figure where a price would sit, and the middle line of the headline. Depot green marks the secondary good and the operational state. There is no dark theme. The kiosk is a printed object, printed once on one stock; `color-scheme: light` is declared on `:root` and no toggle exists. The previous world's dark theme was removed with it.

Density is high and even. Rule boxes abut, cells share 1.5px gutters of night ink, and type is set in tracked expanded caps for every label. Motion is one authored moment: the print run, where the red and green passes land after the night pass. Everything else is a hover that reads as misregistration.

**Key Characteristics:**
- One recycled board stock with a fleck grain under everything; no second surface, no dark mode
- Three inks only: night, civic red, depot green, each with a darker small-text variant where needed for contrast
- Every container is a 1.5px night-ink rule box; corners are square everywhere
- Archivo at two widths: text at width 100, display and labels at width 125 in tracked caps; JetBrains Mono for serials and dates
- Eight filled geometric office marks drawn on a 64-unit grid, one per system, no strokes
- Hover is a registration shift: a red duplicate of the rule box offset 3px
- Entry motion is the print run: red at 180ms, green at 360ms, nothing else animates in

## Colors

A printed palette: one board stock, three inks, and the knock-out paper the inks leave uncovered.

### Primary
- **Night Ink** (`night`): all running text, headings, rules, borders, filled controls, the active nav tab, selection ground, the darkest ledger cell and the halftone portrait. The single working ink.
- **Steel Ink** (`ink-2`): secondary text: sub-lines, descriptions, labels, serials, footer. It is night at reduced density, used wherever text sits below the heading in the hierarchy.
- **Faint Steel** (`ink-3`): the middot separator between tags, and the label and dashed outline of an empty shelf slot.

### Secondary
- **Civic Red** (`red`): the third ink. Headline line two, the red hover outline of the registration shift, hover colour on links, buttons and nav tabs, the focus ring, list markers in tickets, caret colour, scrollbar thumb on hover, in-build marks.
- **Red Ink** (`red-ink`): civic red darkened for small text: the headline figure in each good, ticket serials, the in-build state label. Red at display size is `red`; red below 1.125rem is `red-ink`.

### Tertiary
- **Depot Green** (`green`): headline line three, the featured good's mark, the hero's Orca fact mark, the third masthead mark.
- **Green Ink** (`green-ink`): depot green darkened for small text: the production state label in each good's foot and the copied-state border on the email button.

### Neutral
- **Recycled Board** (`board`): the page ground and the fill of every rule box, cell, button and nav tab. Also the knock-out colour for text on night fills.
- **Board, second stock** (`board-2`): the operator card and ticket stubs, one shade down.
- **Board, third stock** (`board-3`): the empty ledger cell.
- **Board, run B / run C** (`board-stock-b`, `board-stock-c`): kiosk goods alternate stock by position (every 3n+2 cell, every 3n cell) so the shelf reads as separate printed cards.
- **Paper** (`paper`): knock-out panels that sit on top of the board: the ledger tooltip, the opened detail panel, the resume frame.
- **Ledger ramp** (`ledger-1`, `ledger-2`, `ledger-3`): the three mid-steps of the commit calendar between empty board and full night.

### Named Rules
**The Three Inks Rule.** Night, red and green are the only hues on the sheet. New surfaces pick from these three and their two darkened small-text variants; there is no fourth ink.

**The Small Red Rule.** Red and green text below 1.125rem uses `red-ink` or `green-ink`. The display inks are reserved for large type, marks and outlines.

**The One Stock Rule.** There is one paper stock and no dark theme. Depth, state and hierarchy are all expressed in ink, never in a second ground.

## Typography

**Display Font:** Archivo Expanded, the width-125 instance of Archivo (with Archivo, Helvetica fallback)
**Body Font:** Archivo at width 100 (with system sans fallback)
**Label/Mono Font:** JetBrains Mono, 400 and 500 (with ui-monospace, Menlo fallback)

**Character:** A single geometric grotesque at two widths. The expanded cut in tracked uppercase does the office signage: headings, labels, buttons, nav, footer. The normal cut sets the running text and the hero headline. The mono carries ticket serials, dates, ledger labels and the machine-readable file list.

### Hierarchy
- **Display** (800, `clamp(2rem, 1.4rem + 2.2vw, 3.25rem)`, 1.05): page `h1` on inner pages; Archivo Expanded, uppercase, tracked 0.04em.
- **Headline** (800, `clamp(2.25rem, 1rem + 3.4vw, 3.75rem)`, 1): the hero's three-line headline only. Set in Archivo at width 100, uppercase, no tracking. The direction contract asked for expanded caps here; the build uses the text width so three lines fit the column, and that is the record.
- **Title** (800, 1.25rem, 1.05): section `h2`; the featured good's name at 1.5rem; the box head's `h2` at 0.9375rem with 0.12em tracking.
- **Title, small** (800, 1rem, 1.05): `h3`, ticket titles and good names at 1.0625rem, tracked 0.06em.
- **Figure** (800, 1.125rem, tabular-nums, `red-ink`): the headline figure in each good's foot; 1.5rem on the featured good. Its unit sits beneath in body text at 0.75rem.
- **Body** (400, 1rem, 1.55): running text. Prose blocks are 1.0625rem at 64ch; the hero line is 1.125rem at 50ch; secondary copy, descriptions and ledger facts are 0.9375rem.
- **Label** (700, 0.6875rem, 0.14em, uppercase, `ink-2`): all signage: `.label`, buttons at 0.75rem, nav tabs, box-head links, detail summaries. Labels at 0.625rem (`label-sm`) carry tags, category, state and the footer.
- **Serial** (JetBrains Mono 400, 0.75rem, tabular-nums): good serials, dates, operator card, machine-readable list. Ticket serials are 500 at 0.8125rem in `red-ink`. Ledger month labels 0.6875rem, weekday labels 0.5625rem.

### Named Rules
**The Signage Rule.** Anything that names, categorises or operates is Archivo Expanded 700 to 800, uppercase, tracked 0.12em to 0.18em. Running text never is.

**The Serial Rule.** Numbers that identify (dates, ticket and good serials, build run) are JetBrains Mono with tabular numerals. Numbers that persuade (the headline figure) are Archivo Expanded 800.

## Layout

The page is a stack of rule-boxed sheets inside a 76rem measure with a 1.5rem gutter. Each sheet is a `.container.box` with 2rem above it. The sticky masthead is 4.5rem tall with a 1.5px bottom rule and a 92% board fill blurred 10px.

The kiosk is a dense grid: four columns, auto rows with a 13rem floor, `grid-auto-flow: dense`, 1.5px gaps filled with night ink so the cell borders are the grid. The featured good spans two columns; rank is expressed by span, never by a different type size on the shelf head. Columns step 4/3/2/1 at 1100px, 760px and 480px; at 480px the featured span drops to one.

Two-column sheets (hero 1.9fr/1fr, ledger 1.6fr/1fr, counter, page head) stack to one column at 960px, their vertical dividing rule becoming a horizontal one. The ticket's 8.75rem stub column stacks above the body at 640px and its perforation turns from a vertical to a horizontal line of holes. The box head wraps at 640px. The nav collapses to a hamburger and a full-height board overlay at 1140px. The brand sub-line hides at 480px.

The ledger grid and its month label row share a 480px floor and scroll horizontally inside the sheet on phones; the weekday column is 20px, cells are square with 3px gaps.

Spacing rhythm: 1.5px for rules, 0.375rem for tight gaps, 0.75rem for control gaps and box-head padding, 1.125rem to 1.25rem for cell padding, 1.5rem for gutters and ledger padding, 2rem for sheet separation and hero padding.

## Elevation & Depth

No shadows. Depth is paper: a fleck grain SVG tiled at 240px and multiplied at 28% opacity under the whole page (`body::before`), board shades one and two steps down for the operator card, ticket stubs and the empty ledger cell, and paper knock-out panels for the tooltip and opened detail. The only lifted treatments are the registration shift on hover (a red duplicate border translated 3px) and the ledger cell scaling to 1.35 under the pointer.

### Named Rules
**The No Shadow Rule.** Nothing casts a shadow. State and depth are drawn in ink or printed on a different stock.

## Shapes

Square everywhere. Every container, button, tab, cell and tooltip is a 1.5px night-ink rule box with no radius. Perforations and the loading spinner are the only circles: the ticket stub carries a column of 2.6px board-coloured holes on a 10px pitch along its right edge, and the spinner is a 12px ring in the rule weight.

The eight office marks (ring, arch, chevron, bars, keyhole, quarter, grid, half) are filled constructions on a 64-unit grid with no strokes, rendered in one of the three inks. They appear at 22px in the masthead, 28px in hero facts, 56 to 88px in goods and 120 to 200px on the featured good. Interface icons are a separate 24-unit set at 1.75 stroke with round joins and are decorative unless labelled.

## Components

### Buttons
- **Shape:** rule box, 2.75rem tall, square corners (1.5px night border, radius 0)
- **Outline:** board fill, night text, Archivo Expanded 700 at 0.75rem tracked 0.14em uppercase, padding 0 1.125rem, 0.625rem gap to a 16px icon
- **Fill:** night fill, board text; the primary action on each sheet (Browse the systems, Book a call)
- **Hover:** outline turns red text and border; fill turns red fill; icons slide 2px right; 160ms ease-out
- **Active:** translate 1px, 1px
- **Copied state:** green-ink border and green text with swapped label, 1.8s

### Chips
Tags are inline uppercase labels at 0.625rem in `ink-2`, separated by a trailing middot in `ink-3` on all but the last. There is no chip box, no fill, no pill. The separator trails so a wrapped line never opens with a dot.

### Cards / Containers
- **Corner Style:** square
- **Background:** board; goods alternate run B and run C stock by position; operator card and ticket stubs use board-2
- **Shadow Strategy:** none; see Elevation
- **Border:** 1.5px night rule; inside the kiosk the grid gap supplies the border
- **Internal Padding:** 1.125rem 1.25rem for cells; 0.75rem 1.25rem for box heads; 1.25rem to 1.5rem for sheet panels

### Inputs / Fields
No form fields exist. The copy-email control is a button.

### Navigation
Rule-boxed tabs, 2.125rem tall, Archivo Expanded 700 at 0.6875rem tracked 0.14em uppercase, board fill, night text, 0.375rem apart. Hover turns red. The current page is a night-filled tab that carries a `nav-active` view transition between pages. Below 1140px the tabs become a fixed board overlay under the masthead with one full-width row per link at 0.875rem, 0.16em, separated by rules; the toggle is a 2.5rem rule box swapping menu and close icons. The brand is three office marks in the three inks beside the wordmark; hovering shifts the marks 2px up, down, up.

### Good (kiosk cell)
Grid of head, mark and foot. Head: name in title small and a one-line sub at 0.9375rem in `ink-2`. Mark: the system's office mark, bottom-right, in night (live), red (in build) or green (featured). Foot: a serial row (category label, `No. YYYY.MM`, state label) and the headline figure in `red-ink` with its unit under it. Hover: registration shift plus the mark drifting 2px up-right. Detail pages add inline tags and a disclosure (How it's built) that opens a paper panel with a 320ms grid-rows transition.

A shelf whose last row is short ends in one empty slot spanning the free columns: board stock, a dashed inner outline in `ink-3`, and a centred Shelf space label. Kiosk.astro computes the span per column count and CSS hides the slot where the row is already full.

### Ticket (career)
Two columns: an 8.75rem stub in board-2 with the serial `A YYYYMM` in mono 500 `red-ink` and a Valid or Punched label, perforated along its right edge; a body with title, org, mono dates aligned right, description and optional bullets with red markers. Rows separate with rules; the whole strip is a rule box; each ticket carries the registration shift.

### Ledger (production calendar)
Fifty-two week columns of square cells on a 480px floor, five levels from board-3 through the ledger ramp to night, mono month and weekday labels, a mono legend, and a paper tooltip on hover. Beside it, a rule-separated list of office facts with values in Archivo Expanded 800 at 0.8125rem.

### Counter (contact)
A rule box with heading, one sentence at 54ch, three controls aligned right (copy email, LinkedIn, filled Book a call) and a mono list of machine-readable files below a rule.

### Print run (entry motion)
Night ink is painted on first load. Elements marked `data-ink="red"` start 3px up-right at opacity 0 and land after a 180ms delay over 180ms; `data-ink="green"` starts 3px down-left and lands at 360ms. Both use `cubic-bezier(0.2, 0.8, 0.2, 1)`. The hidden start state is gated on `html.js` so the sheet is fully printed without JavaScript, and `prefers-reduced-motion: reduce` prints everything at once. On view transitions the main sheet fades out in 140ms and in over 260ms from a 2px offset, the active nav tab slides, and the body re-runs the passes for the new page.

## Do's and Don'ts

### Do:
- **Do** draw every container as a 1.5px night rule box with square corners.
- **Do** use `red-ink` and `green-ink` for red or green text below 1.125rem; keep `red` and `green` for display lines, marks and outlines.
- **Do** mark new red or green elements on the entry sheet with `data-ink` so they join the print run.
- **Do** set signage in Archivo Expanded, uppercase, tracked; set running text in Archivo at width 100.
- **Do** give every new system one filled office mark from the eight on the 64-unit grid, in one of the three inks.
- **Do** express rank by cell span in the kiosk, never by a louder type size on the shelf head.
- **Do** keep tags inline with trailing middots.

### Don't:
- **Don't** add a dark theme, a theme toggle or a second page ground; the kiosk is one stock.
- **Don't** introduce a fourth hue, a gradient fill or a tinted background outside the board shades and paper.
- **Don't** use shadows, radius or pills; depth is ink and stock, and tags are text.
- **Don't** animate anything on entry other than the red and green passes.
- **Don't** reintroduce status-page grammar: green banners, uptime strips, pill badges.
- **Don't** stroke the office marks; they are filled constructions only.
