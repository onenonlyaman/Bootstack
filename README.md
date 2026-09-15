# Bootstack — Homepage

Frontend for the Bootstack agency homepage. React + Vite, no backend.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/
npm run preview
```

## Structure

```
src/
  data/          content only — swap for API/CMS responses later
  sections/      one file per chapter of the page (+ its CSS)
  components/    reusable pieces: nav, cursor, loader, marquee, artwork
  hooks/         smooth scroll, reveal observer, media queries, scroll flex
  lib/motion.js  gsap + ScrollTrigger registration and small helpers
  styles/        tokens.css (colour, type, space, motion) + base.css
```

**Content lives in `src/data/`.** Nothing in `sections/` hard-codes copy that a
client would want to edit, so wiring these files to an API later is a drop-in
change — the shapes already match what an endpoint would return (see
`data/approach.js` → `impact`, and `data/work.js`).

## Design system

All colour, type, spacing and easing are CSS custom properties in
`styles/tokens.css`. The brand palette is fixed:

| Token | Value | Use |
| --- | --- | --- |
| `--yellow` | `#F7AA00` | accent, CTAs, the closing band |
| `--blue` | `#235784` | structure, secondary fills |
| `--navy` | `#1A425F` | the growth-engine band |
| `--cyan` | `#40A8C4` | labels, technical detail |
| `--mist` | `#EEF6F7` | light grounds, text on dark |
| `--ink` | `#08161F` | the deep ground (derived, for contrast) |

Type: Poppins throughout — SemiBold 600 for headlines, Regular 400 for body and labels.

## How the scroll story works

The page is one continuous surface, not a stack of blocks:

- **`components/BackgroundStage.jsx`** renders a single fixed colour plane. Every
  section declares `data-bg="ink | ink2 | navy | mist | yellow"` and the plane
  tweens between those grounds as you scroll. Sections themselves are transparent.
- **`hooks/useSmoothScroll.js`** runs Lenis and drives `ScrollTrigger.update`, so
  every scroll-linked animation shares one clock.
- **`hooks/useScrollFlex.js`** skews `[data-flex]` elements by scroll velocity —
  the page has a little give.
- Pinned chapters (`GrowthEngine`, `Approach`) use `gsap.matchMedia()` and only
  pin at ≥1024px. Below that they become ordinary readable columns.

Pinned sections must never be taller than the viewport, or their lower half
becomes unreachable — that is why `.approach` and `.engine` drop their band
padding at desktop widths and let an inner frame carry the spacing.

## Accessibility and performance

- `prefers-reduced-motion` is honoured everywhere: Lenis is skipped, the loader
  is bypassed, scrub timelines resolve to their end state, and decorative
  animation stops.
- The custom cursor and grain only render for fine pointers / larger screens.
- Case-study artwork is generated SVG (`components/WorkVisual.jsx`) rather than
  photography — original, and it costs no image bandwidth. Swap a composition
  for a real `<img>` when final assets exist.

## Placeholders to replace

- `src/data/site.js` — email, phone, location, social URLs
- `src/data/work.js` — the five case studies
- `src/data/approach.js` — `impact` figures and `testimonials`
- `src/components/Wordmark.jsx` — stand-in logotype
