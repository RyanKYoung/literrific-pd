# LiTerrific Professional Development

Static HTML site targeting teachers and school district leadership. No auth, no payments — conversion is a contact/quote form.

**Live site:** literacylive.org
**Repo:** https://github.com/RyanKYoung/literrific-pd

---

## Pages

| File | Description |
|------|-------------|
| `index.html` | Landing page — hero, photo strip, stats, services, Research Partner (Dr. Chase Young), approach, testimonials, resources preview, CTA strip |
| `resources.html` | Blog & webinar library with JS filter tabs (All / Articles / Webinar Recordings / Guides) |
| `gallery.html` | Professional development photo gallery with accessible lightbox |
| `publications.html` | Books by the LiTerrific facilitators and collaborators |
| `contact.html` | Quote request form — submits to the production Apps Script, inline success state |
| `signup.html` | Resource request form routed through the same Apps Script |

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
- **Forms:** Google Apps Script
  - Quote forms use `form_type=quote`
  - Newsletter forms use `form_type=newsletter`
  - Resource requests omit `form_type` and are handled as signup requests
  - The deployed endpoint and server-side handlers are documented in `Code.gs`
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

## Form handling

All production forms post to the deployed Apps Script endpoint in `Code.gs` using hidden iframes so visitors remain on the current page. Preserve the endpoint, `form_type` values, and field names when changing form presentation. The Apps Script sends confirmation emails and records leads in the configured Google Sheet.

## Pending

- Fill in real testimonial names, roles, and quotes
