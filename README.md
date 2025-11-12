# Portfolio

Personal portfolio website for Saahil Mehta - Data & AI Engineer.

**Live site:** https://saahil-mehta.github.io (or your custom domain)

## Tech Stack

- Vanilla HTML, CSS, JavaScript
- Markdown content
- GitHub Pages hosting
- Zero dependencies, zero build process

## Development

```bash
# Serve locally
python -m http.server 8000 -d docs/
# Then open http://localhost:8000
```

## Structure

- `docs/index.html` - Main page with navigation and layout
- `docs/about.md` - About section content
- `docs/publications.md` - Projects showcase (renamed from publications)
- `docs/resume.md` - CV/résumé content
- `docs/styles.css` - Styling and theme (dark/light mode)
- `docs/script.js` - Markdown loading and interactivity
- `docs/assets/` - Images, logos, project screenshots

## Customisation

1. **Profile Image:** Replace `docs/assets/profile.jpg` with your photo
2. **Projects:** Add project screenshots to `docs/assets/` and update `publications.md`
3. **Résumé:** Edit `docs/resume.md` with your experience
4. **Custom Domain:** Create `docs/CNAME` file with your domain name

## Deployment

Push to GitHub and enable GitHub Pages in repository settings:
- Settings → Pages → Source: main branch → docs folder → Save

Site will be live at `https://saahil-mehta.github.io` in ~60 seconds.

---

Template inspired by [jrosseruk.github.io](https://github.com/jrosseruk/jrosseruk.github.io) and [astro-theme-cactus](https://astro-cactus.chriswilliams.dev/).
