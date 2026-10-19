---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: ["src/pages/projects.astro","src/pages/experience.astro","src/pages/volunteering.astro","src/pages/education.astro","src/pages/github.astro","src/pages/resume.astro"]
---

---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: ["src/pages/projects.astro","src/pages/experience.astro","src/pages/volunteering.astro","src/pages/education.astro","src/pages/github.astro","src/pages/resume.astro"]
---

# Home page surface brief

Scope: the whole public site (home leads; work, experience, community, education, activity, resume follow the same world). Mode: Persuade.

Audience and job: hiring managers and exec recruiters deciding in under a minute whether Saahil is a director-level, hands-on data and AI leader; peers wanting the depth. Action: book a call or email. Proof: the systems shipped and how they were built, the strategy adopted by ExCo, the team, the live GitHub calendar. Constraints: every figure from profile.yaml; readable without JavaScript; motion behind prefers-reduced-motion; Lighthouse floor 90/95/100; the GitHub profile README is a status-page rendition of the same facts and the site must be distinguishable from it.

Pins from the user (2026-10-19): modern, contemporary, minimal; smooth 120Hz motion, subtle and polished; the profile reads top to bottom as one story; no conceit language in labels; figures never carry the design (no stat tiles, no repeated numerals); generic enough to scale as content grows and still draw attention; the all-out goes into details.

## Direction contract

THESIS: The profile told the way a modern film title sequence tells its story: one dark field, one warm accent, type that arrives line by line as the visitor scrolls, the systems as the cast with one still each, the live commit field as the interlude, the roles as the credits. It refuses the portfolio arrangement (centred pitch, stat tiles, cards, timeline) and it refuses showreel chrome: no glow, no gradients, no lit edges, no timecode. Section names are plain words.

OWN-WORLD: Film black (#0B0B0D) as the field, warm off-white (#F2EFE9) type, dim (#8C8780) for secondary lines, one accent, vermilion (#FF4A1C), used for the single underline that draws beneath the key phrase, the primary button and the progress hairline. A light scheme (#F3F1EC field, #15140F ink, same vermilion) follows the system preference; a toggle in the top line. One face, Mona Sans, variable on weight and width: 500 to 600 for titles at tight tracking, 400 for text, tracked small caps for credits lines; tabular figures inside sentences. No hairline containers; composition is type on the field with generous vertical space; a 1px progress line at the top edge. Each system has a still: a single matte off-white object on black at one shared scale (codex-generated, provenance embedded). The portrait is a monochrome film still of Saahil on black. Icons: the existing 1.75-stroke set.

STORY: The visitor reads a main title (the name, the role, one plain statement of what Saahil does), scrolls into "What I do now" in three short lines, then "Work" as a sequence of stills with one line each and a quiet "how it's built" disclosure, then "Still shipping" where the commit field fills the width, then "Experience" as credits, then community and education as short credits, and an end card: email, LinkedIn, book a call, and a small line of machine-readable files. The visitor believes scope and prowess from the writing and the objects, never from a tile of numbers, and acts on the end card or the top line's button.

FIRST VIEWPORT: Top line 64px: the name at left in 500, nav at right in 400 (Work, Experience, Community, Education, Activity, Resume), a vermilion text button Book a call, a theme toggle. The main title fills the rest of 1440x900: left column 7 of 12, the statement at 72px weight 560 width 95, tracking -0.03em, three lines: "I set the data strategy for South Pole, and I still ship the systems myself." with "ship the systems" carrying the drawn vermilion underline; under it the role line in dim (Associate Director, Data & Insights · London), and two controls: See the work (accent fill) and Book a call (text). Right column 4 of 12: the portrait still at 400px tall with a slight cursor parallax, its caption a credit line (Saahil Mehta, South Pole, 2026). The lead of "What I do now" sits at the viewport's foot, already arriving.

FORM: The main-title sequence, index 4 of the re-rolled grounded list, seed key 3e7c9518 re-roll 1, chosen as chef's choice by the user. Raises kept from the declined hand: state is drawn by weight and line, never by a second colour (jackfield); every section is re-enterable by URL and the credits are ranked by time with fixed columns (split-flap); every still shares one exact scale and ground (botanical folio); nothing appears before its line (starship terminal); translucent overlap during section transitions (silk canopy); deep dark pauses between sections (cloud quarry). Signature interaction: the arrival. Each line enters as the visitor scrolls, rising 24px behind a mask while its width axis settles from 110 to 100 over 700ms on an exponential ease-out, lines 60ms apart; the vermilion underline draws left to right once the statement has landed; the commit field lights cell by cell in a wave; stills fade through a mask wipe. Hover: underlines draw, stills brighten by 8%, buttons lift 1px. Everything is transform, opacity, clip and font-variation-settings; nothing animates layout; reduced motion renders every element settled.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
