# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: hiring managers and executive recruiters evaluating Saahil for Director and Head-of level data and AI roles. They arrive from LinkedIn or a CV link, skim for under a minute, and want proof of scale, leadership and shipped systems before deciding whether to reach out.

Secondary: peers in the data and AI community (engineers, leaders, Data Science Festival mentees, Medium readers) who want depth: how the systems were built, the design decisions, the GitHub activity.

Both audiences are served by one site: the first group reads the statement and the first screen; the second group reads on into the work, the commit field and the section pages. The same record also reaches them as the GitHub profile README, the resume PDF, the LinkedIn profile and the machine-readable files, all rendered from one source.

## Product Purpose

A personal site that presents Saahil Mehta's work, role and record, and makes the case that he is a hands-on director: someone who sets data strategy for a company and still ships the systems himself. Success on a visit: the visitor leaves convinced of director-level scope and of technical prowess, and remembers the site.

## Positioning

The combination a neighbouring profile cannot truthfully copy: built an enterprise AI assistant (Orca) used by over a quarter of a 501-person company within three weeks of its 2.0 release, designed the governed platform underneath it (semantic layer, self-hosted orchestration, access governance, FinOps), wrote the data strategy adopted by ExCo, leads a team of six, and still commits code daily. The GitHub contribution history is the visible evidence of the last point and is a hallmark of the site.

## Operating Context

The site is read on a laptop or phone, often while a LinkedIn profile or CV PDF is open in another tab. It is reached by direct link, LinkedIn, GitHub, search, or an LLM answering a question about Saahil. Content is maintained through one YAML file (`profile/profile.yaml`) and rebuilt in CI; there is no CMS and no backend. The resume PDF, the CV and LinkedIn pastes, `status.json` and the GitHub profile README all render from that file; tailored applications render from it through overlays and never change it.

## Capabilities and Constraints

- Static Astro site at https://saahil.co.uk on GitHub Pages; one URL per section (home, experience, projects, volunteering, education, GitHub, resume) plus `/llms.txt`, `/cv.md`, `/resume.json`, `/status.json` and the resume PDF.
- All copy and facts come from `profile/profile.yaml`; the build fails on an invalid field. No numbers may appear on the site that are not in that file.
- Figures are verified (billing export, BigQuery metadata, Cloud Monitoring, GitHub, Confluence) and must not be inflated beyond the agreed rounding.
- Orca disclosure rule: capabilities and outcomes anywhere; architecture only as Saahil's own design decisions; no client data, security specifics or contract figures beyond the published savings.
- Every page must be fully readable without JavaScript; all motion sits behind `prefers-reduced-motion`.
- The GitHub contribution calendar is fetched client-side from a public API and must stay prominent.
- Lighthouse floor: Performance 90+, Accessibility 95+, SEO 100.
- The GitHub profile README (github.com/saahil-mehta) is a smaller rendition of the same record in the same voice, re-rendered daily from `/status.json`. It has its own design within the same family (Markdown plus SVG images, no scripts, no hover) and never repeats the contribution graph GitHub draws beneath it.
- Every system has a still: one matte object rendered on black and on white, transparent, at a shared scale (`public/stills/`), generated with the codex CLI from the prompt in its sidecar. A new system is not complete without its pair.
- The platform diagram renders from `site.ecosystem` in the YAML, drawn in the two inks by `scripts/make_diagrams.py`, inlined on the site and published as standalone SVGs for `status.json` and the README. The same renderer draws the plan as a swimlane once a `site.roadmap` block is added. Nothing is drawn by hand; a new system is a node with a place.

## Brand Commitments

The title-sequence world shipped on 2026-10-19 and recorded in `DESIGN.md`: film black and paper as two exposures of one field, vermilion as the only accent, Mona Sans as the only face, the stills, the drawn underline under the key phrase of the statement, the arrival on scroll. The monochrome portrait still and the system stills are brand assets. The GitHub activity graph remains a visible hallmark. Organisation marks appear only as one-ink silhouettes. Earlier elements (the orb, Satoshi, Bricolage, Archivo, the kiosk inks, the easter eggs) are retired.

Voice: plain statements, each claim once, no em dashes, no rhetorical contrast constructions, headings are labels in a stranger's words (no conceit language). First person on the site, action-verb bullets in the CV. The full copy principles are in CLAUDE.md.

## Evidence on Hand

- `profile/profile.yaml`: roles (bullets, site copy, a home line), projects (summary, how it's built, metric, category, since), volunteering, education, skills, the site narrative (statement, now, ledes, end card) and page metadata.
- `public/portrait-still.webp`: the monochrome portrait still, generated from `public/profile-512.jpg` (the photograph, kept as the source).
- `public/stills/`: a dark and a light still per system, with provenance sidecars.
- `public/logos/`: organisation marks as one-ink files with their origin noted inside.
- `site.ecosystem` in the YAML: the platform's nodes and edges, rendered as a diagram at build time. A `site.roadmap` block (workstreams with quarters and states) is not recorded yet.
- `public/Saahil-Mehta-Resume.pdf`: rendered by `scripts/make_cv.py` from the YAML; never edited by hand.
- Live GitHub contributions via github-contributions-api.jogruber.de.
- No testimonials, press, talks or client logos exist; none may be invented.

## Product Principles

1. Statement before proof: the first screen says in one plain sentence what Saahil does and how; scale, systems and leadership follow as the record, told in sentences. Figures never carry the design and appear once per page, inside the sentence that gives them meaning.
2. Hands-on director: strategy and code appear together; the commit field follows the lines that claim the strategy, and the work follows the field.
3. One scroll, little clicking: the home page carries the whole case; section pages add depth rather than hide essentials.
4. Readable under everything: motion, colour and layout never cost legibility or speed.
5. Every number traceable: nothing on any surface that `profile.yaml` cannot back.
6. One record, many renditions: the site, the README, the PDF and the pastes render from the same file and may differ in form, never in fact or voice.
