---
name: saahil.co.uk
description: A personal record told as a film title sequence. One dark field, one warm accent, one variable face, type that arrives line by line.
colors:
  field: "#0c0c0e"
  ink: "#f2efe9"
  ink-2: "#b3aea5"
  ink-3: "#8a857d"
  line-2: "rgb(242 239 233 / 0.07)"
  accent: "#ff4a1c"
  on-accent: "#0c0c0e"
  cell-0: "rgb(242 239 233 / 0.08)"
  cell-1: "rgb(242 239 233 / 0.28)"
  cell-2: "rgb(242 239 233 / 0.5)"
  cell-3: "rgb(242 239 233 / 0.74)"
  cell-4: "#f2efe9"
  glass: "rgb(12 12 14 / 0.72)"
  light-field: "#f3f1ec"
  light-ink: "#15140f"
  light-ink-2: "#5b5852"
  light-ink-3: "#6d6962"
  light-line-2: "rgb(21 20 15 / 0.08)"
  light-accent: "#c8350d"
  light-on-accent: "#ffffff"
  light-cell-0: "rgb(21 20 15 / 0.07)"
  light-cell-1: "rgb(21 20 15 / 0.26)"
  light-cell-2: "rgb(21 20 15 / 0.48)"
  light-cell-3: "rgb(21 20 15 / 0.72)"
  light-cell-4: "#15140f"
  light-glass: "rgb(243 241 236 / 0.76)"
  plate-black: "#000000"
typography:
  title:
    fontFamily: "Mona Sans, system-ui, -apple-system, Segoe UI, Helvetica, Arial, sans-serif"
    fontSize: "clamp(2.625rem, 1.25rem + 4.4vw, 4.5rem)"
    fontWeight: 560
    lineHeight: 1.02
    letterSpacing: "-0.03em"
    fontStretch: "98%"
  h2:
    fontFamily: "Mona Sans, system-ui, -apple-system, Segoe UI, Helvetica, Arial, sans-serif"
    fontSize: "clamp(1.75rem, 1rem + 2vw, 2.75rem)"
    fontWeight: 540
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  h3:
    fontFamily: "Mona Sans, system-ui, -apple-system, Segoe UI, Helvetica, Arial, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 530
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  still-title:
    fontFamily: "Mona Sans, system-ui, -apple-system, Segoe UI, Helvetica, Arial, sans-serif"
    fontSize: "clamp(1.5rem, 1.1rem + 1.2vw, 2rem)"
    fontWeight: 530
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  lines:
    fontFamily: "Mona Sans, system-ui, -apple-system, Segoe UI, Helvetica, Arial, sans-serif"
    fontSize: "clamp(1.25rem, 1rem + 0.9vw, 1.625rem)"
    fontWeight: 440
    lineHeight: 1.4
    letterSpacing: "-0.012em"
  lede:
    fontFamily: "Mona Sans, system-ui, -apple-system, Segoe UI, Helvetica, Arial, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  body:
    fontFamily: "Mona Sans, system-ui, -apple-system, Segoe UI, Helvetica, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  credit:
    fontFamily: "Mona Sans, system-ui, -apple-system, Segoe UI, Helvetica, Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 540
    lineHeight: 1.6
    letterSpacing: "0.08em"
    textTransform: "uppercase"
  button:
    fontFamily: "Mona Sans, system-ui, -apple-system, Segoe UI, Helvetica, Arial, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 540
    lineHeight: 1
    letterSpacing: "-0.005em"
  nav:
    fontFamily: "Mona Sans, system-ui, -apple-system, Segoe UI, Helvetica, Arial, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  small:
    fontFamily: "Mona Sans, system-ui, -apple-system, Segoe UI, Helvetica, Arial, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
rounded:
  cell: "2px"
  label: "4px"
  frame: "6px"
  pill: "999px"
spacing:
  cell-gap: "3px"
  xs: "0.375rem"
  sm: "0.875rem"
  md: "1.25rem"
  lg: "1.75rem"
  credit-row: "1.5rem"
  gutter: "clamp(1.25rem, 4vw, 3rem)"
  beat-head: "clamp(2.25rem, 5vh, 3.5rem)"
  stills-gap: "clamp(2.5rem, 6vh, 4.5rem)"
  beat: "clamp(4.5rem, 11vh, 8rem)"
  end-card: "clamp(5rem, 14vh, 10rem)"
  topline: "4rem"
  text-measure: "40rem"
  lines-measure: "44rem"
  measure: "76rem"
components:
  button-fill:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "0 1.125rem"
    height: "2.75rem"
  button-fill-hover:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "0 0.25rem"
    height: "2.75rem"
  icon-button:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.pill}"
    size: "2.25rem"
  icon-button-hover:
    backgroundColor: "{colors.line-2}"
    textColor: "{colors.ink}"
  topline:
    backgroundColor: "{colors.glass}"
    textColor: "{colors.ink-2}"
    typography: "{typography.nav}"
    height: "{spacing.topline}"
  credit-row:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.h3}"
    padding: "1.5rem 0"
  cell:
    backgroundColor: "{colors.cell-0}"
    rounded: "{rounded.cell}"
  cell-label:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.field}"
    rounded: "{rounded.label}"
    padding: "0.3rem 0.5rem"
  portrait-frame:
    backgroundColor: "{colors.plate-black}"
    rounded: "{rounded.frame}"
    width: "280px"
  still:
    backgroundColor: "transparent"
    width: "420px"
---

# saahil.co.uk Design System

## Overview

**Creative North Star: "The Title Sequence"**

The profile reads the way a modern film title sequence tells its story. The field is near black, the type is warm off-white, and one vermilion accent is spent on three things: the underline drawn beneath the key phrase of the main title, the filled button, and the 1px progress hairline at the top edge. Systems are the cast, each with one still; the live commit field is the interlude; roles, community and education are the credits. Sections are plain words (Now, Work, Still shipping, Experience, Beyond work).

Two schemes ship. Dark is canonical and the one the tokens are written against. Light follows the system preference until the visitor chooses with the toggle in the top line; the choice is stored and applied before first paint. Both schemes are the same world at different exposures: the same face, the same voices, the same spacing, with the accent deepened in light so it holds contrast on paper.

Composition is type on the field with generous vertical space. There are no cards, no panels and no boxed sections. The only drawn rules on the page are the 1px row dividers inside credits lists and the footer's top rule. Nothing glows and nothing casts a shadow. Motion is the one place the site goes all out, and it is confined to transform, opacity and clip.

**Key Characteristics:**

- One field, one ink family, one accent, in two exposures (dark canonical, light by preference or choice).
- One variable face (Mona Sans, weight 200 to 900, width 75% to 125%) at a handful of named settings; weight and tracking carry hierarchy, never a second face or a second colour.
- No containers: no cards, no bordered sections, no backgrounds behind text. Credits rows divide with a 1px hairline and nothing else.
- Stills are matte off-white objects on plates that blend into the field (screen on black, multiply on white), so each object floats on the page with no frame.
- Everything arrives: lines rise behind a mask as the visitor scrolls, stills wipe in from the left, the commit field lights column by column. Every element is already settled without JavaScript and under reduced motion.
- State is drawn by weight, line and colour within the ink ramp; the accent never marks state except on the copied email button.

## Colors

Dark is the canonical scheme; every token has a light counterpart under the `light-` prefix, swapped by `prefers-color-scheme: light` or by `[data-theme]` on the root.

**Primary: the ink ramp.** Three steps of warm off-white on the field. `ink` is headings, body, buttons and the main title. `ink-2` is secondary lines: ledes, the sentence under each still, the organisation and the description in a credits row, nav links at rest. `ink-3` is the credit voice (dates, captions, state lines), the brand role in the top line, file links on the end card and the footer. In light the ramp inverts to three warm near-blacks.

**Secondary: the accent.** Vermilion (`accent`) is used for the drawn underline under the key phrase, the filled button, the progress hairline, the Book a call text link in the top line, list markers inside credits rows, text selection and the focus ring. In light the vermilion deepens (`light-accent`) so it holds contrast on paper, and the text on it turns white (`light-on-accent`). On dark the text on the accent is the field itself (`on-accent`).

**Tertiary: the commit field.** Five levels, `cell-0` to `cell-4`, from an 8% tint of ink to full ink. The field is monochrome in both schemes; commits read as exposure, not colour.

**Neutral: field, hairline, glass.** `field` is the page and the html background. `line-2` is the only hairline in use: credits row dividers, the footer's top rule, the resume frame's border and the icon button hover fill. `glass` is the top line's translucent backdrop (blurred 14px, saturated 1.2). `plate-black` is the portrait frame's ground in both schemes, because the portrait still is on black and does not blend.

**The One Accent Rule.** Vermilion is spent on the key phrase, the filled button, the progress hairline and nothing structural. It never fills a background larger than a button, never tints a section and never marks a state other than the copied email.

**The Two Exposures Rule.** Light and dark are the same system at different exposures. A new token gets a value in both blocks, and the two `--still-blend` values (screen on dark, multiply on light) travel with it so stills keep floating.

## Typography

One face, Mona Sans, served as one latin-subset variable file (`/fonts/MonaSans-latin.woff2`, weight 200 to 900, width 75% to 125%), with `ss01` and `cv11` on by default. The system face stack behind it is a fallback for the swap period only.

The voices are the whole ramp:

- **Title.** The main title and the end card. Weight 560 at width 98% with tracking -0.03em and line height 1.02, balanced wrapping. The key phrase inside it carries the drawn vermilion underline, 0.06em thick at 94% of the line.
- **H2.** Section titles. Weight 540, tracking -0.025em, balanced.
- **H3 and still title.** Credit row titles at 1.375rem; still titles step up to a fluid 1.5rem to 2rem. Weight 530, tracking -0.015em.
- **Lines.** The three lines of Now. A fluid 1.25rem to 1.625rem at weight 440 and line height 1.4, measure 44rem.
- **Lede and body.** Regular weight at 1.125rem and 1.0625rem, line height 1.6, measure 40rem, pretty wrapping. Ledes are set in `ink-2`.
- **Credit.** 0.75rem, weight 540, tracked 0.08em, uppercase, `ink-3`, tabular figures. Dates in credits rows, captions under stills and the portrait, state lines, the commit field's footer and legend.
- **Button and nav.** 0.9375rem. Buttons at weight 540 with tracking -0.005em; nav links at regular weight in `ink-2`, white on hover. Below 900px the nav becomes a full-field list at a fluid 1.75rem to 2.25rem, weight 540.
- **Small.** 0.8125rem for tags, the end card's file list and the footer, in `ink-3`.

**The One Face Rule.** Hierarchy is weight, width, size and tracking inside Mona Sans. No second family, no monospace, no italic voice.

**The Tabular Figures Rule.** Any figure inside a sentence, date line or count sits in tabular numerals (`font-variant-numeric: tabular-nums`, the `.num` and `.credit` voices).

**The Drawn Underline Rule.** Links underline with a 1px line of their own colour. Nav links and credit row titles draw the line from the left on hover (320ms); prose links, the end card's file links and inline links carry it at rest and turn vermilion on hover.

## Layout

The page is a single column of beats on one measure (76rem, gutters fluid from 1.25rem to 3rem). Each beat is a section with a head (title, optional lede, optional "more" text button at the right edge) and a body, padded top and bottom by a fluid 4.5rem to 8rem. The end card pads 5rem to 10rem above. The deep dark pause between beats is spacing alone.

**Main title.** A 12-column grid, 2rem gap. The copy takes columns 1 to 7 as a stack with 1.75rem between the title, the role line and the controls. The portrait takes columns 9 to 12: a 2:3 frame up to 280px wide with its credit caption beneath. The section fills at least 82svh under the 4rem top line, content vertically centred.

**Stills.** Each still row is a 5:7 grid, image side and copy side, alternating sides on even rows. The still is square, up to 420px, centred in its column. Rows are spaced by a fluid 2.5rem to 4.5rem. Compact rows (inner pages) use a 3:9 split with a 300px still. Copy is a 36rem stack: title, one sentence, credit line, optional tags and a "How it's built" disclosure that opens with a grid-row transition.

**Credits.** A list of rows on a 10rem date column and a fluid content column, 2rem apart, 1.5rem padding above and below each row, hairlines between rows and at the top and bottom of the list.

**Commit field.** Columns of seven square cells with 3px gaps, 640px minimum width inside a horizontal scroller, a footer line with the total and date span at left and the Less to More legend at right.

**Top line.** Sticky, 4rem tall, on the glass backdrop: brand at left (name at weight 560, role in `ink-3` at 0.875rem), nav at right with the vermilion Book a call link, then the theme toggle and, below 900px, the menu button.

**Breakpoints.**

- 1100px: the brand role hides; nav gap and size tighten.
- 900px: the hamburger appears and the nav becomes a full-field overlay under the top line (absolute, not fixed, because the header's backdrop filter would otherwise become the containing block); the portrait moves after the statement at 240px, square.
- 760px: still rows stack, image first, still at 260px aligned left.
- 640px: credit rows stack with the date after the row; the beat head's "more" button drops under the lede.
- 560px: the portrait spans the full width at 200px.

**The No Container Rule.** Sections, stills, credits and the end card are set on the field with no background, border or panel. If a surface needs a boundary it uses space; if it needs separation inside a list it uses one `line-2` hairline.

## Elevation & Depth

There is no elevation. No box shadow, no glow, no gradient fill and no lit edge appears anywhere in the built CSS. Depth is carried by three things:

- **Blend.** Stills are rendered on pure plates and blended into the field (`mix-blend-mode: screen` on black plates in dark, `multiply` on white plates in light), so the object sits on the page without a frame. The clip used for the arrival sits on the image, because a clip on the figure would isolate the blend group and the plate would reappear.
- **Glass.** The top line is a translucent band of the field, blurred 14px with saturation 1.2.
- **Lift.** Buttons rise 1px on hover and press to 98.5% on active; still images rise 4px on row hover; commit cells scale to 1.5 on hover with the label above them.

**The No Shadow Rule.** Nothing on the site casts a shadow or glows. A new surface that seems to need one uses blend, space or weight instead.

## Shapes

Form is square-cornered type on a field. The few radii in use are functional:

- Pill (999px) on the two buttons and the icon buttons.
- 6px on the portrait frame and the resume iframe.
- 4px on the commit cell's hover label and the skip link.
- 2px on commit cells and on the focus ring.

Stills, credits rows, beats and the end card have no corner at all because they have no box. Icons are the drawn set in `Icon.astro`: a 24-unit grid, 1.75 stroke, round caps and joins, inheriting `currentColor`.

## Components

**Filled button** (`button-fill`). A 2.75rem pill in the accent with on-accent text, 0.9375rem at weight 540, an optional 16px icon after the label with a 0.5rem gap. Hover lifts 1px over 240ms on the exponential ease; active presses to 98.5% in 80ms. The email button on the end card uses it as a copy control and turns its text vermilion for 1.8s when copied.

**Text button** (`button-ghost`). The same height and type in `ink` with 0.25rem side padding and no fill, always followed by the arrow icon. Hover lifts 1px and slides the arrow 3px right. Used for Book a call, LinkedIn, and the "more" link in each beat head.

**Icon button** (`icon-button`). A 2.25rem round target in `ink-2`; hover turns `ink` on a `line-2` fill; active scales to 94%. The theme toggle (moon on dark, sun on light) and the menu toggle.

**Top line** (`topline`). Sticky 4rem band on glass. Brand, nav, tools. Nav links draw their underline on hover and keep it on the current page in `ink`.

**Progress hairline.** 1px of accent fixed at the top edge, scaled from the left by a scroll-driven animation (`animation-timeline: scroll(root)`); browsers without it get a `--progress` custom property set from a passive scroll listener.

**Main title.** Title with the key phrase, role line as a lede, two controls (filled "See the work", text "Book a call"), and the portrait: a monochrome still on a black 2:3 frame with a credit caption. On pointer devices the image drifts up to 8px against the cursor, eased at 12% per frame, scaled 1.04 so no edge shows.

**Beat.** Section with an H2, optional lede and optional text button, then its body. One grammar for every section on every page.

**Still row** (`still`). Figure plus copy. The figure holds a `picture` with a light-plate source whose media the theme script sets (`all`, `not all`, or the light preference query) so a stored choice overrides the system. Both plates are 1024px squares generated by codex with the prompt and conversion recorded in a sidecar JSON next to each file; dark stills are matte off-white objects on pure black (near-black floored to 0), light stills the same forms rendered in matte charcoal-grey on pure white (near-white lifted to 255), scaled and aligned to the dark plate's object. Title underline draws on hover; the image rises 4px.

**Credit row** (`credit-row`). Date in the credit voice, then title (H3, with a drawn-on-hover link when it has one), organisation, line and optional bullets with vermilion markers. Hairline between rows.

**Commit field** (`cell`, `cell-label`). Rendered client-side from the public contributions API for the last twelve months, cached for an hour. Five exposure levels; cells scale 1.5 on hover with a small `ink` label on `field` above them. The footer carries the total and span, the legend and a loading or failure line that links to GitHub.

**End card.** Title voice, lede, three controls (email copy, LinkedIn, Book a call) and a small line of machine-readable files. The footer below it carries the build line and three links separated by middle dots.

**Arrival.** Every `[data-arrive]` group reveals once, when 18% of it enters the viewport (or at load if it is above 90% of the viewport height). Children start at opacity 0, 22px down, scaled 103% on the x axis from the left edge, and clipped from the bottom; on reveal they move to rest over 820ms (opacity 600ms) on the exponential ease-out, each child delayed 70ms times its `--i`. The `fade` variant rises 10px with no clip or scale. The key phrase's underline draws over 900ms once the statement has landed (700ms delay). Stills wipe in from the left on the image over 700ms. The commit field lights column by column at 14ms per column over 520ms per cell, then clears its animation so hover applies.

**The Settled Without Script Rule.** The arrival exists only under `html.js`. Without JavaScript, and under `prefers-reduced-motion: reduce`, every line, still, underline and cell is already at rest, parallax does not bind, and smooth scrolling is off.

**The Width Settle Rule.** The contract described a width-axis settle from 110 to 100. The build substitutes `scaleX(1.03)` resolving to 1, because animating `font-variation-settings` reflows the text every frame. New motion follows the same constraint: transform, opacity and clip only; nothing that animates layout.

## Do's and Don'ts

**Do:**

- Do set every new element in Mona Sans at one of the named voices; add a voice only when a reused role has no fit.
- Do give every new colour a value in both scheme blocks and keep the two exposures parallel.
- Do compose with vertical space; separate items in a list with one `line-2` hairline.
- Do keep new motion on transform, opacity and clip, on the exponential ease-out, settled under reduced motion and without JavaScript.
- Do give each new system still the shared ground: one object centred at about 55% of a 1024px square, matte off-white on a pure black plate and matte charcoal-grey on a pure white plate, aligned to each other, with its provenance sidecar.
- Do keep figures in tabular numerals inside sentences, and only figures that `profile.yaml` carries.

**Don't:**

- Don't add cards, panels, bordered sections or background tints behind text.
- Don't add shadows, glows, gradients or lit edges.
- Don't spend the accent on anything beyond the key phrase, the filled button, the progress hairline, the Book a call link and list markers.
- Don't introduce a second face, a monospace voice or glyph icons; icons come from the drawn 1.75-stroke set.
- Don't animate `font-variation-settings`, width, height or any layout property.
- Don't add stat tiles, repeated numerals, timelines or kicker labels above headings; the headings are the labels.
