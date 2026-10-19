# Working in this repository

Personal site and CV pipeline for Saahil Mehta. Public repository: nothing here may name internal systems, clients, colleagues or figures beyond what `profile/profile.yaml` already carries. Tailored applications live under `applications/`, which is gitignored.

## One source of truth

`profile/profile.yaml` holds every fact: roles, bullets, projects, volunteering, education, skills, the site narrative and page metadata. The site, the CV paste, the LinkedIn paste, the resume PDF, `resume.json`, `llms.txt` and `status.json` all render from it. Never write a figure or a claim into a template, a page or a letter that the YAML does not carry. Figures in the YAML are verified against billing exports, BigQuery metadata, monitoring, GitHub and Confluence; do not inflate them beyond the agreed rounding.

## Commands

```bash
# Python: /opt/homebrew/Caskroom/miniconda/base/envs/platform/bin/python (has playwright, pypdf, jinja2, pyyaml, pytest)
# Node 22: export PATH=/opt/homebrew/opt/node@22/bin:$PATH

python scripts/render_profile.py          # YAML -> profile/out/cv.md and linkedin.md
python scripts/make_cv.py                 # YAML -> public/Saahil-Mehta-Resume.pdf (two-page limit enforced)
python scripts/render_profile.py --check  # CI check: pastes match the YAML
python scripts/make_cv.py --check         # CI check: PDF carries the hash of its source
python -m pytest tests -q
npm run build && npm run assert           # site build and HTML assertions
```

Commit the YAML, the pastes and the PDF together. CI fails when any of them disagree.

## CV fine-tuning

Requests like "tighten the CV", "lead with X", "add the Y achievement" are edits to `profile/profile.yaml`:

- Wording and ordering live in `roles[].cv_bullets`, `summaries.cv`, `projects[].cv_line`, `skills`.
- Site-only copy lives in `roles[].site_desc`, `roles[].site_line`, `projects[].site_summary`, `site.narrative`. Keep CV and site copy consistent in facts, different in register where the templates differ (action-verb bullets on the CV, first person on the site).
- Layout lives in `profile/templates/cv.html.j2`; the renderer is `scripts/make_cv.py`. The PDF must stay at two A4 pages; trim content before shrinking type below 9.5pt.
- After any edit: render the pastes and the PDF, run the tests and both checks, read the PDF (the Read tool renders pages) to confirm the break between pages lands cleanly, then commit all three together.
- A new achievement needs a source. Ask for the number or the evidence before writing it in.

## Job applications

When asked to apply for a specific role, create `applications/<company>-<role>/` (gitignored) and work there. Never edit `profile/profile.yaml` to tailor an application.

1. Read the job description the user provides. Map its requirements to existing bullets and projects; the tailoring is selection, ordering and wording, never new facts.
2. `overlay.yaml`: supported keys are `summary`, `title`, `role_bullets` (role title to ordered bullets), `projects` (names to keep, in order), `skills` (group to list). Render with `python scripts/make_cv.py --overlay applications/<slug>/overlay.yaml --out applications/<slug>/cv.pdf`. The public resume is never overwritten by an overlay.
3. `letter.md` when a cover letter is wanted: YAML front matter (`date`, `recipient`, `company`, `role`, `greeting`, `signoff`) then paragraphs separated by blank lines; `**bold**` and `[links](https://...)` are the only markup. Render with `python scripts/make_letter.py applications/<slug>/letter.md --out applications/<slug>/cover-letter.pdf`. One page.
4. Cover letters: plain statements, specific to the role and the company's stated problem, three to five short paragraphs, no adjectives about character, evidence from the record only. First person. Open with what Saahil would do in the role, not with how he found the posting.
5. Read both PDFs before handing them over and state what was selected and what was left out.

## Writing rules

No em dashes anywhere (the loaders reject them). Plain statements, each claim once; no rhetorical contrast constructions; headings are labels. British spelling. Action-verb bullets on the CV, first person on the site.

## The site

Astro 7, static, deployed to GitHub Pages from `main`. The visual world is recorded in `DESIGN.md` and `.impeccable/design.json`; design changes go through the Impeccable skill and must end with the finish review and an updated `DESIGN.md`. Every page is readable without JavaScript; all motion sits behind `prefers-reduced-motion`; Lighthouse floor 90 performance, 95 accessibility, 100 SEO. Section pages and the home share one grammar; new content types extend `site.narrative` and the existing components rather than adding bespoke sections.

Stills: one per project at `public/stills/<slug>.webp` (dark ground) and `<slug>-light.webp` (light ground), generated with the codex CLI using the prompt text in the matching `.webp.json` sidecar. A new project needs both stills, the object rescaled to the set's shared size, and sidecars.

## Deploy and verify

Push to `main` in its own command (the permission classifier blocks pushes combined with other steps). Watch the run with `gh run watch <id> --exit-status`, then check the live URL. Preview locally with `npx astro preview` on `http://localhost:4321` (IPv6 only); Lighthouse against `npx serve dist -l 4322`.
