# Portfolio

Personal site for Saahil Mehta, Associate Director, Data & Insights at South Pole.

**Live:** https://saahil.co.uk

## Stack

Astro (static output), one `profile.yaml` as the source of truth, one self-hosted variable font (Mona Sans), vanilla scripts. The site reads as a title sequence: one dark field, one accent, type that arrives line by line as you scroll. The home page tells the record in order: the statement, what I do now, the work as a sequence of stills (one matte object per system), the live commit field, the roles as credits, community and education, and an end card. A light scheme follows the system preference. The GitHub profile README keeps a status-page rendition of the same facts, re-rendered daily from `/status.json`. A small Python renderer turns the same YAML into a CV paste for Rezi and a LinkedIn paste.

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
├── components/         # MainTitle, Beat, StillRow, CreditRow, CommitField, EndCard, SiteHeader, SiteFooter, Icon
├── pages/              # index, experience, projects, volunteering, education, github, resume
│   └── *.ts            # resume.json, llms.txt, robots.txt endpoints
├── scripts/            # arrival (scroll reveal), theme, parallax, progress hairline, menu, copy button, commit field
└── styles/global.css   # Tokens, components, motion (all motion behind prefers-reduced-motion)
public/                 # Font, portrait still, stills/ (one per system, with provenance sidecars), resume PDF, CNAME, og.png
scripts/
├── render_profile.py   # YAML -> profile/out/*.md   (render | --check)
├── sync-public.mjs     # Copies cv.md into public/ (prebuild)
├── assert-html.mjs     # Post-build checks on dist/
├── make_og.py          # Renders scripts/og-template.html to public/og.png (run when the headline changes)
├── make_cv.py          # YAML -> public/Saahil-Mehta-Resume.pdf via profile/templates/cv.html.j2 (render | --check | --overlay)
└── make_letter.py      # Markdown cover letter -> PDF in the resume's typography

```

## Development

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # dist/
npm run assert       # checks on dist/
```

Node 22 or newer. Python 3.11+ with `pip install -r scripts/requirements.txt` for the pastes and the PDF check; `python -m playwright install chromium` to render the PDF.

## Editing content

1. Edit `profile/profile.yaml`. Each project carries `since`, `until`, a `metric`, a `category` and a still at `public/stills/<slug>.webp` (slug from the name: `Data Marts Core` is `data-marts-core`). The home page's statement, the lines under Now, the section ledes and the end card live under `site.narrative`.
2. `python scripts/render_profile.py` regenerates `profile/out/cv.md` and `profile/out/linkedin.md`.
3. `python scripts/make_cv.py` renders `public/Saahil-Mehta-Resume.pdf` (two pages; the script fails on a third). Needs Playwright Chromium: `python -m playwright install chromium`.
4. Commit the YAML, the pastes and the PDF together. CI fails if the pastes or the PDF disagree with the YAML (the PDF carries a hash of its source in its metadata).
5. Paste `profile/out/linkedin.md` into LinkedIn.

Other assets: portrait still at `public/portrait-still.webp` (generated from `public/profile-512.jpg`), domain in `public/CNAME`, Open Graph image via `python scripts/make_og.py`.

## Tailored applications

`applications/` is gitignored. For one role, write `applications/<slug>/overlay.yaml` (keys: `summary`, `title`, `role_bullets`, `projects`, `skills`) and render a tailored CV with `python scripts/make_cv.py --overlay applications/<slug>/overlay.yaml --out applications/<slug>/cv.pdf`; write `applications/<slug>/letter.md` and render it with `python scripts/make_letter.py ... --out ...`. Overlays select, order and reword; the facts stay in `profile.yaml`. See `CLAUDE.md` for the working rules.

## Machine-readable

- `/llms.txt`: summary and index for LLM crawlers
- `/cv.md`: the CV as Markdown
- `/resume.json`: JSON Resume v1
- `/sitemap-index.xml`, `/robots.txt`

## Deployment

Push to `main`. GitHub Actions runs the Python check, builds the site, runs the HTML assertions and deploys `dist/` to GitHub Pages.

---

Inspired by [jrosseruk.github.io](https://github.com/jrosseruk/jrosseruk.github.io) and [astro-theme-cactus](https://astro-cactus.chriswilliams.dev/)
