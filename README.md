# LiTerrific Professional Development

Static HTML site targeting teachers and school district leadership. No auth, no payments — conversion is a contact/quote form.

**Live site:** ptnmanagement.com (deploy via Netlify — not yet configured)
**Repo:** https://github.com/RyanKYoung/literrific-pd

---

## Pages

| File | Description |
|------|-------------|
| `index.html` | Landing page — hero, photo strip, stats, services, Research Partner (Dr. Chase Young), approach, testimonials, resources preview, CTA strip |
| `resources.html` | Blog & webinar library with JS filter tabs (All / Articles / Webinar Recordings / Guides) |
| `contact.html` | Quote request form — submits to Formspree, inline success state |

## Images

All images are stored locally in `images/`:

| File | Description |
|------|-------------|
| `banner-wide.avif` | Wide banner — children reading in a classroom |
| `teacher-children-reading.avif` | Teacher reading with children (on-site card) |
| `teacher-computer.avif` | Teacher helping students at a computer (virtual card) |
| `kids-reading-group.avif` | Kids reading in a group (coaching card) |
| `chase-young.avif` | Dr. Chase Young headshot |

## Tech Stack

- Plain HTML/CSS/JS — no framework, no npm, no build step
- **Forms:** Formspree
  - Contact form: `contact.html` → replace `PLACEHOLDER` in form action with real Formspree endpoint
  - Newsletter: `resources.html` → same, replace `PLACEHOLDER`
- **Fonts:** Google Fonts — Geologica + Lora + Quattrocento

## Design System

- **Charcoal** `#1a1f2e` — headings, nav
- **Teal** `#1a8f8a` — CTAs, accents, links
- **Tan** `#c8b99a` — warm details
- **Off-white** `#f8f8f6` — page background
- **Lora** serif — display headings (H1, H2)
- **Geologica** sans — body copy, UI labels
- **Quattrocento** — pull quotes

## Research Partner

Dr. Chase Young — Professor of Literacy at Sam Houston State University, Editor of *Reading Research Quarterly*, Chief Literacy Officer at LiTerrific. Website: [thebestclass.org](https://thebestclass.org). LinkedIn: https://www.linkedin.com/in/chase-young-68586625/

## Local Dev

```bash
cd /workspaces/pd
python3 -m http.server 3001
```
Forward port 3001 in VS Code Ports tab (distinct from LFC Reading on port 3000).

## Formspree Setup (required before going live)

1. Sign up at formspree.io
2. Create a new form, set notification email to info@literrific.com
3. Copy the endpoint URL (e.g. `https://formspree.io/f/xabc1234`)
4. Replace `PLACEHOLDER` in `contact.html` and `resources.html`

## Pending

- Replace Formspree PLACEHOLDER with real endpoint
- Fill in real testimonial names, roles, and quotes
- Deploy to Netlify and point ptnmanagement.com domain
