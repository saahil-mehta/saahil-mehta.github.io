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
docs/
├── index.html          # Shell and navigation
├── about.md            # Bio
├── contributions.md    # GitHub graph
├── projects.md         # Project cards
├── experience.md       # Timeline
├── resume.md           # PDF embed
├── styles.css          # Theme and layout
├── script.js           # Markdown loader + graph
└── assets/             # Images, resume PDF
```

## Editing

- **Profile**: Replace `docs/assets/profile.jpg`
- **Projects**: Update `projects.md` and add screenshots to `assets/`
- **Experience**: Edit `experience.md` and `docs/assets/Saahil-Mehta-Resume.pdf`
- **Domain**: Add `docs/CNAME` with your domain

## Deployment

GitHub Actions workflow deploys automatically on push to `main`.

Manual setup: Settings → Pages → Source: GitHub Actions

---

Inspired by [jrosseruk.github.io](https://github.com/jrosseruk/jrosseruk.github.io) and [astro-theme-cactus](https://astro-cactus.chriswilliams.dev/)
