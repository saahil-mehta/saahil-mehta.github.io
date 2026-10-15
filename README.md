# Portfolio

Personal site for Saahil Mehta – Data & AI Engineer.

**Live:** https://saahil-mehta.github.io

## Stack

Vanilla HTML, CSS, JavaScript. Markdown for content. No build process, no dependencies.

## Development

```bash
python -m http.server 8000 -d docs/
```

Open `http://localhost:8000`

## Structure

```
profile/
├── profile.yaml        # Single source of truth: roles, projects, bio, skills
├── templates/          # Jinja2 templates for the site pages and the pastes
└── out/                # Generated: cv.md (Rezi), linkedin.md
scripts/
└── render_profile.py   # render | --check
docs/
├── index.html          # Shell and navigation
├── about.md            # Bio paragraphs generated between markers
├── contributions.md    # GitHub graph
├── projects.md         # Generated
├── experience.md       # Generated
├── volunteering.md     # Generated
├── education.md        # Hand-written
├── resume.md           # PDF embed
├── styles.css          # Theme and layout
├── script.js           # Markdown loader + graph
└── assets/             # Images, resume PDF
```

## Editing

1. Edit `profile/profile.yaml`.
2. `pip install -r scripts/requirements.txt` once, then `python scripts/render_profile.py`.
3. Commit the YAML and the generated files together. CI runs `--check` and fails the deploy if they disagree.
4. Paste `profile/out/cv.md` into Rezi, export the PDF, replace `docs/assets/Saahil-Mehta-Resume.pdf`.
5. Paste `profile/out/linkedin.md` into LinkedIn.

- **Profile photo**: replace `docs/assets/profile.jpg`
- **Domain**: `docs/CNAME`

## Deployment

GitHub Actions workflow deploys automatically on push to `main`.

Manual setup: Settings → Pages → Source: GitHub Actions

---

Inspired by [jrosseruk.github.io](https://github.com/jrosseruk/jrosseruk.github.io) and [astro-theme-cactus](https://astro-cactus.chriswilliams.dev/)
