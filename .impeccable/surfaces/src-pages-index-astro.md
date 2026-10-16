---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: ["src/pages/experience.astro","src/pages/projects.astro","src/pages/volunteering.astro","src/pages/education.astro","src/pages/github.astro","src/pages/resume.astro"]
---

# Home page surface brief

Scope: the whole public site (home leads; experience, projects, volunteering, education, github, resume follow the same world). Mode: Persuade.

Audience and job: hiring managers and exec recruiters deciding in under a minute whether Saahil is a director-level, hands-on data and AI leader; peers wanting the depth. Action: book a call or email. Proof: Orca adoption and reliability figures, the ~295k EUR/yr plan adopted by ExCo, the team of six, the systems shipped, and the live GitHub calendar. Constraints: every figure from profile.yaml; readable without JavaScript; motion behind prefers-reduced-motion; Lighthouse floor 90/95/100.

## Direction contract

THESIS: Saahil's record presented as a status page: systems with their time in production and their one hard number, the operator's own commit calendar as the longest green bar, and the career as release history. It refuses the portfolio arrangement of portrait hero, three cards and a timeline, and it refuses the hero-metric tile row; numbers live inside the rows they belong to.

OWN-WORLD: White operational ground (light by default, the scene is a hiring manager at a laptop in a daylit office; a true dark panel theme stays one toggle away). One committed status green owns the banner field and every presence bar; amber for the single in-progress system; ink near-black. Hairline row dividers, status pills with a drawn dot, month-strip bars of 36 cells, right-aligned tabular numerals. Display face Bricolage Grotesque (self-hosted), body Satoshi, JetBrains Mono only for timestamps, uptime figures and the calendar legend. Drawn SVG icon set in one 1.75px stroke. Themed selection, caret, scrollbar and focus ring in the green.

STORY: The visitor sees a status banner that is itself the claim: all systems operational, 7 systems, 501 people served. Scanning the rows they learn what Saahil has built and runs, each with its time in production and one verified number. The operator block shows a year of commits beside the strategy adopted by ExCo, which makes the hands-on director point without a sentence. Release history reads as the career. Subscribe to updates is the contact.

FIRST VIEWPORT: Full-width green banner, 96px tall on desktop: drawn check icon, "All systems operational", right-aligned "Last checked" build timestamp in mono. Below, a two-column identity row: left, portrait at 72px beside "Saahil Mehta" in Bricolage at 44px and "Associate Director, Data & Insights at South Pole" at 18px; right, three quiet contact actions (Email, LinkedIn, Book a call), Book a call filled green as the primary action. Then the Components table begins within the first viewport: header row (Component · Time in production · Headline figure · Status) and the first three rows (Orca, Orca Core, Orca Semantics) with their 36-month strips filling. Strict left margin: banner text, name, table and every section heading share one 24px gutter.

FORM: The Status Page, candidate 1 on the ordered grounded list, presented as the pick card and chosen by the user. Seed key 8e222f9f. Raises kept from the assigned Board Paper: the data strategy appears as a component row of its own (Data Foundation Plan: adopted by ExCo, 7 workstreams), and one strict aligned margin runs the page. Signature interaction: on load the month strips sweep in left to right, staggered by row, once; hovering a cell names the month. Motion grammar: exponential ease-out, 420ms, nothing else animates on entry.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
