# Portfolio

Personal site for Saahil Mehta, Associate Director, Data & Insights at South Pole.

**Live:** https://saahil.co.uk

## Stack

Astro (static output), one `profile.yaml` as the source of truth, self-hosted fonts (Archivo at two widths, JetBrains Mono), vanilla scripts. The site reads as a state kiosk of printed goods: three permitted inks on recycled board, each system a product with its own geometric office mark, the career as a strip of tram tickets, the GitHub calendar as the production ledger. The GitHub profile README keeps a status-page rendition of the same facts, re-rendered daily from `/status.json`. A small Python renderer turns the same YAML into a CV paste for Rezi and a LinkedIn paste.

## Structure

```
profile/
├── profile.yaml        # Single source of truth: roles, projects, bio, skills, site meta
├── templates/          # Jinja2 templates for the CV and LinkedIn pastes
└── out/                # Generated: cv.md (Rezi), linkedin.md
src/
├── lib/profile.ts      # Loads and validates profile.yaml (zod); build fails on a bad field
├── lib/seo.ts          # JSON-LD builders
├── layouts/Base.astro  # Head (meta, OG, JSON-LD), header, footer, scripts
├── components/         # KioskHero, Kiosk, Good, Mark, Ledger, Ticket, Counter, SiteHeader, SiteFooter, Icon
├── pages/              # index, experience, projects, volunteering, education, github, resume
│   └── *.ts            # resume.json, llms.txt, robots.txt endpoints
├── scripts/            # print run, menu, copy button, easter eggs, GitHub graph
└── styles/global.css   # Tokens, components, motion (all motion behind prefers-reduced-motion)
public/                 # Fonts, halftone portrait, marks, resume PDF, CNAME, og.png
scripts/
├── render_profile.py   # YAML -> profile/out/*.md   (render | --check)
├── sync-public.mjs     # Copies cv.md into public/ (prebuild)
├── assert-html.mjs     # Post-build checks on dist/
└── make_og.py          # Renders scripts/og-template.html to public/og.png (run when the headline changes)

```

## Development

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # dist/
npm run assert       # checks on dist/
```

Node 22 or newer. Python 3.11+ with `pip install -r scripts/requirements.txt` for the pastes.

## Editing content

1. Edit `profile/profile.yaml`. Each project carries `since`, `until`, a `metric`, a `category` and a `mark` (one of ring, arch, chevron, bars, keyhole, quarter, grid, half) that drive its kiosk cell.
2. `python scripts/render_profile.py` regenerates `profile/out/cv.md` and `profile/out/linkedin.md`.
3. Commit the YAML and the regenerated pastes together. CI fails if they disagree.
4. Paste `profile/out/cv.md` into Rezi, export the PDF, replace `public/Saahil-Mehta-Resume.pdf`.
5. Paste `profile/out/linkedin.md` into LinkedIn.

Other assets: profile photo at `public/profile.jpg`, domain in `public/CNAME`, Open Graph image via `python scripts/make_og.py`.

## Machine-readable

- `/llms.txt`: summary and index for LLM crawlers
- `/cv.md`: the CV as Markdown
- `/resume.json`: JSON Resume v1
- `/sitemap-index.xml`, `/robots.txt`

## Deployment

Push to `main`. GitHub Actions runs the Python check, builds the site, runs the HTML assertions and deploys `dist/` to GitHub Pages.

---

Inspired by [jrosseruk.github.io](https://github.com/jrosseruk/jrosseruk.github.io) and [astro-theme-cactus](https://astro-cactus.chriswilliams.dev/)
