---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: ["src/pages/projects.astro","src/pages/experience.astro","src/pages/volunteering.astro","src/pages/education.astro","src/pages/github.astro","src/pages/resume.astro"]
---

# Home page surface brief

Scope: the whole public site (home leads; systems, experience, community, education, activity, resume follow the same world). Mode: Persuade.

Audience and job: hiring managers and exec recruiters deciding in under a minute whether Saahil is a director-level, hands-on data and AI leader; peers wanting the depth. Action: book a call or email. Proof: Orca adoption and reliability, the ~295k EUR/yr plan adopted by ExCo, the team of six, the systems shipped, the live GitHub calendar. Constraints: every figure from profile.yaml; readable without JavaScript; motion behind prefers-reduced-motion; Lighthouse floor 90/95/100; the GitHub profile README is a status-page rendition of the same facts and the site must be distinguishable from it.

## Direction contract

THESIS: Saahil's record as a state kiosk of printed goods: every system is a product on the shelf, printed in three permitted inks on recycled board with its own geometric office mark; the career is a strip of tram tickets; the operator's commits are the production ledger. It refuses the portfolio arrangement (hero, cards, timeline) and it refuses the status-page grammar now living on the GitHub README: no green banner, no uptime strips, no pills.

OWN-WORLD: Recycled board ground (#D7D2C6) with a faint fleck grain, one paper stock, no dark theme. Three inks only: night ink (#1E3A6B) for all text, rules and primary controls; civic red (#C23A2B) as the third ink that marks the active cell, the headline figure and the hero's middle line; depot green (#6A7A43) for secondary marks and the operational state. White is paper knock-out. Archivo at width 100 for text, Archivo at width 125 weight 800 in tracked caps for display and labels, JetBrains Mono for ticket serials and dates. Every container is a 1.5px night-ink rule box; cells sit in a kiosk grid; one constructed office mark per system (ring, arch, chevron, bars, keyhole, quarter, grid, half) drawn on a 64-unit grid with no strokes. The portrait is a halftone in night ink. Registration shift is the hover grammar: the active cell's rule box gains a 1.5px red duplicate offset 2px.

STORY: The visitor sees a masthead that reads as a design office and a three-line headline printed in the three inks: I run the platform. I ship the systems. For 501 people. The kiosk grid shows what is on the shelf, Orca largest, each good with its mark, category, one line and the headline figure where a price would be. The production ledger shows a year of commits beside the ExCo and savings facts. The ticket strip tells the career in punched stubs. Subscribe becomes the office counter: email, LinkedIn, book a call.

FIRST VIEWPORT: Masthead 72px: office marks (three small geometric shapes) and the wordmark SAAHIL MEHTA in expanded caps, nav as rule-boxed caps tabs (Status, Systems, Experience, Community, Education, Activity, Resume), no theme toggle. Below, a two-column hero on a rule box: left, the headline at 64px expanded caps in night, red, green over three lines, one plain sentence, two controls (Browse systems filled night; Book a call outlined); right, the halftone portrait at 280px on a labelled printed card (OPERATOR · LONDON · EST. 2019). Under the hero, three office facts with marks (Team of six · Strategy adopted by ExCo · Orca 560,000+ requests). The kiosk grid header (ON THE SHELF · 7 GOODS) starts inside the first viewport at 1440x900.

FORM: Socialist kiosk print, dealt first in the bolder re-roll of seed 8e222f9f and chosen by the user. Raises kept: a halftone portrait in the permitted inks (silkscreen loft), rank expressed by cell span not type size (cutting bench), one geometric construction behind every office mark (curved-crease shell). Signature interaction: the print run. On load the night-ink pass is already on the page; the red pass lands at 180ms and the green pass at 360ms, each settling from a 2px registration offset; nothing else animates on entry. Hover: registration shift on cells and tickets; controls fill with the third ink. Motion grammar: stepped, 180ms per pass, ease-out, all behind prefers-reduced-motion.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
