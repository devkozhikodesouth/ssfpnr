# Phase 7-Design — Visual Mockup (OPTIONAL)

**Tool:** Claude.ai web (Opus 4.7) — Artifact mode
**Depends on:** nothing (can run anytime after Phase 0)
**Parallel with:** ✅ any phase — touches no project files
**Owns:** nothing in the codebase. Produces a visual reference only.

---

## Why this is optional

If you trust Claude Code to design from the plan alone, skip this.
If you want to lock in visual direction before Phase 7 code generation,
run this and screenshot the result. Pass screenshots to Phase 7.

---

## Prompt

```
Generate a mobile-first HTML/Tailwind mockup of the SSF Poonoor homepage
as an Artifact.

Sections (in order):
1. Dark hero with SSF Poonoor logo placeholder + Malayalam tagline overlay
2. Bottom navigation bar (4 items: Home, News, Gallery, More)
   - sticky to bottom, visible only on mobile viewport (≤640px)
3. Active campaigns horizontal carousel (3 card peek)
4. Latest news (3 cards, single column on mobile, image-on-top)
5. Featured categories grid:
   - Cards for "Sahityotsav 26", "Sensorium 26", "Vertex"
   - Each shows cover image + name + content count badge
6. Latest videos (3 YouTube thumbnail cards)
7. Gallery moments (2-column masonry, 4 images)
8. Latest blogs (3 cards with author + date)
9. Upcoming events (date-block prominent on left)
10. Footer with social icons + quick links

Style:
- Primary green: #1a6b47
- Accent gold: #c9a84c
- Dark background: #141414
- Card backgrounds: white with subtle shadow
- Heading font: serif (Noto Serif Malayalam aesthetic)
- Body font: sans-serif (Inter)
- Border radius: medium (0.5rem)
- Section eyebrows: small uppercase before h2 ("WHAT'S HAPPENING")
- Alternating section backgrounds

Inspired by ssfkerala.org but adapted for Poonoor Division.

Render at 375px viewport (mobile). I will use this as visual reference for
Claude Code in Phase 7.
```

---

## After running

Screenshot the artifact at:
- 375px (mobile)
- 768px (tablet)
- 1280px (desktop)

Save screenshots to project repo at `docs/mockups/` for Phase 7 reference.

---

## No verification gate

This phase produces visual artifacts only. Use the screenshots as input to
Phase 7's code generation if you want stricter visual fidelity.
