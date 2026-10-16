# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: hiring managers and executive recruiters evaluating Saahil for Director and Head-of level data and AI roles. They arrive from LinkedIn or a CV link, skim for under a minute, and want proof of scale, leadership and shipped systems before deciding whether to reach out.

Secondary: peers in the data and AI community (engineers, leaders, Data Science Festival mentees, Medium readers) who want depth: how the systems were built, the design decisions, the GitHub activity.

Both audiences are served by one site: the proof for the first group sits at the top of the home page; the depth for the second group sits beneath it and on the section pages.

## Product Purpose

A personal site that presents Saahil Mehta's work, role and record, and makes the case that he is a hands-on director: someone who sets data strategy for a company and still ships the systems himself. Success on a visit: the visitor leaves convinced of director-level scope and of technical prowess, and remembers the site.

## Positioning

The combination a neighbouring profile cannot truthfully copy: built an enterprise AI assistant (Orca) used by over a quarter of a 501-person company within three weeks of its 2.0 release, designed the governed platform underneath it (semantic layer, self-hosted orchestration, access governance, FinOps), wrote the data strategy adopted by ExCo, leads a team of six, and still commits code daily. The GitHub contribution history is the visible evidence of the last point and is a hallmark of the site.

## Operating Context

The site is read on a laptop or phone, often while a LinkedIn profile or CV PDF is open in another tab. It is reached by direct link, LinkedIn, search, or an LLM answering a question about Saahil. Content is maintained by Saahil through one YAML file and rebuilt in CI; there is no CMS and no backend.

## Capabilities and Constraints

- Static Astro site at https://saahil.co.uk on GitHub Pages; one URL per section (home, experience, projects, volunteering, education, GitHub, resume) plus `/llms.txt`, `/cv.md`, `/resume.json`.
- All copy and facts come from `profile/profile.yaml`; the build fails on an invalid field. No numbers may appear on the site that are not in that file.
- Figures are verified (billing export, BigQuery metadata, Cloud Monitoring, GitHub, Confluence) and must not be inflated beyond the agreed rounding.
- Orca disclosure rule: capabilities and outcomes anywhere; architecture only as Saahil's own design decisions; no client data, security specifics or contract figures beyond the published savings.
- Every page must be fully readable without JavaScript; all motion sits behind `prefers-reduced-motion`.
- The GitHub contribution calendar is fetched client-side from a public API and must stay prominent.
- Lighthouse floor: Performance 90+, Accessibility 95+, SEO 100.

## Brand Commitments

None binding. Saahil has released every current visual element (orb logo, Satoshi and JetBrains Mono, purple light / green dark accents, the bee and party-hat easter eggs) for replacement if the redesign calls for it. The GitHub activity graph is the one element that must remain a visible hallmark.

Voice: plain statements, each claim once, no em dashes, no rhetorical contrast constructions, headings are labels. First person on the site, action-verb bullets in the CV.

## Evidence on Hand

- `profile/profile.yaml`: roles, bullets, projects with "how it's built" detail, volunteering, education, skills, headline stats (501 employees, 560,000+ Orca requests at 99.99%, ~295k EUR/yr direct savings, 6 reports).
- `public/profile-512.jpg|webp`: portrait.
- `public/Saahil-Mehta-Resume.pdf`: resume (to be refreshed from Rezi).
- `public/assets/*.json`: Lottie icons and the orb mark; `public/logo.png` rasterised orb.
- Live GitHub contributions via github-contributions-api.jogruber.de.
- No testimonials, press, talks or client logos exist; none may be invented.

## Product Principles

1. Proof before prose: the first screen shows scale, systems and leadership as facts, not adjectives.
2. Hands-on director: strategy and code appear together; the GitHub graph sits beside the strategy claims.
3. One scroll, little clicking: the home page carries the whole case; section pages add depth rather than hide essentials.
4. Readable under everything: motion, colour and layout never cost legibility or speed.
5. Every number traceable: nothing on the page that `profile.yaml` cannot back.
