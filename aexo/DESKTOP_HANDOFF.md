# Aexo Desktop Rebuild Handoff

Updated: 2026-07-14

## Scope

Continue the desktop-first Aexo reproduction in `C:\Projects\aexo`. Do not restart the implementation. Desktop targets are 1200x900 and 1440x900. Tablet and phone remain postponed.

Sources of truth:

- Live site: `https://aexo.framer.website/`
- Purchased Framer/Figma assets already extracted into `public/assets/live`
- Frozen references in `artifacts/reference-2026-07-13` and `artifacts/reference-desktop-1200`

## Completed

- All 12 public routes exist and render.
- Navbar and homepage hero are implemented and should remain locked unless a regression is proven.
- The complete desktop homepage section order is implemented.
- Homepage desktop vertical geometry is matched section-by-section at 1200 and 1440.
- Shared exact desktop components exist for testimonials, FAQ, CTA, footer, pricing, benefits, and navigation.
- About was structurally rebuilt to match Framer: photo-backed hero, overlaid founding cards, thinkers card, team grid, culture panel, CTA, and footer.
- Contact was structurally rebuilt: two-column hero/form, abstract background treatment, call card, three contact cards, testimonials, FAQ, CTA, and footer.
- Works, Pricing, 404, both policy routes, and four project-detail routes are implemented.
- Project details use one template with route-specific assets, copy, headings, exact desktop media rails, gallery coordinates, quote panel, and related projects.
- Exact desktop page heights now match the live references for all routes at 1200 and 1440.
- Privacy policy content/layout was rebuilt from the live text and measured coordinates.
- GSAP/ScrollTrigger + Lenis are wired for hero load, header hide/reveal, general reveals, partner art, pointer movement, brand scrub, process scrub, route media, team images, related projects, and reduced motion.
- `POST /api/contact` remains intact.
- Localhost is serving at `http://localhost:3000`.
- TypeScript passes: `npm run typecheck`.
- Scoped ESLint passes: `npx eslint app components lib --quiet`.

## Continuation update (2026-07-14)

- The desktop regression harness now supports `ROUTE` and `WIDTH` filters and captures with normal motion after a 1.4-second load settle.
- Incorrect route-wide media/reveal animations were removed from project-detail content because they did not match the frozen live state.
- Shared testimonial rails now use a matching scroll reveal.
- The shared CTA now uses the additional exact Framer texture layer instead of the earlier CSS-only approximation.
- Contact was rebuilt with the measured live Framer image layers and transition assets rather than approximate gradients.
- A section-level comparison utility was added at `scripts/compare-route-sections.mjs`.
- Contact at 1440 improved to **7.14% raw full-page mismatch**. Its remaining mismatch is concentrated in the hero (19.31% section mismatch) and CTA (10.01%); contact cards, testimonials, FAQ, and footer are approximately 2-3% each.
- TypeScript and scoped ESLint were rerun after these changes and pass.

## Important files

- `components/live/LivePages.tsx` - all non-homepage route structures
- `components/live/LiveHome.tsx` - homepage sections
- `components/live/LiveShared.tsx` - testimonials, FAQ, CTA, footer
- `components/live/LiveHeader.tsx` - navbar/mobile menu
- `components/live/live.module.css` - principal layout and desktop exact overrides
- `components/live/live-fixes.module.css` - earlier live-fidelity overrides
- `components/MotionProvider.tsx` - Lenis and GSAP motion controllers
- `lib/live-data.ts` - route/project/pricing/testimonial/FAQ/team data
- `scripts/desktop-route-regression.mjs` - captures local routes and produces diffs
- `scripts/inspect-live-route-geometry.mjs` - live/local DOM geometry inspection
- `scripts/compare-full-home.mjs` - homepage comparisons

## Latest desktop regression

All page heights match exactly. Raw pixel mismatch still exceeds the final target:

| Route | 1200 | 1440 |
|---|---:|---:|
| Works | 11.21% | 10.58% |
| Pricing | 11.60% | 6.92% |
| About | 18.33% | 10.02% |
| Contact | 8.95% | 12.91% |
| 404 | 11.70% | 8.61% |
| Ametrix | 13.86% | 9.35% |
| Notlex | 20.38% | 14.87% |
| Botwise | 17.37% | 12.28% |
| Cognefy | 20.26% | 14.73% |
| Privacy | 6.64% | 5.46% |
| Terms | 6.95% | 5.70% |

These latest raw values are partly inflated because the regression runs with reduced motion, which now correctly reveals team/project images while several frozen live full-page captures contain their pre-reveal black states. Before the reduced-motion correction, Ametrix reached 5.05% at 1440. Animation phase must be normalized before treating the raw percentages as acceptance values.

## Remaining work

1. Finish deterministic comparison-state normalization for motion-sensitive sections. The harness now uses normal motion and a fixed load settle, but scroll/continuous-loop checkpoints still need explicit synchronization.
2. Continue visual correction route-by-route, prioritizing:
   - Contact hero and shared CTA at 1440
   - About at 1200
   - Notlex/Cognefy at both widths
   - Works at both widths
3. Correct remaining static differences:
   - exact CTA texture/layer blending after the recent Framer asset swap
   - contact hero background crop/overlay and form details
   - About decorative rings, founder signatures/icons, and 1200 content widths
   - project-detail route-specific text spacing and related-card reveal state
   - 404 background/button blending
   - footer icons/avatar and small decorative details
4. Validate motion checkpoints: load milestones, scroll triggers, reverse behavior, work carousel, FAQ, menu, sticky/process, marquees, and hover states.
5. Run final checks not yet completed after the latest changes:
   - `npm run build`
   - `npm test`
   - route/link and asset smoke tests
   - overflow checks at 1366x768 and 1920x1080
6. Only after desktop acceptance, start the separate tablet and mobile phase.

## Validation notes

- Full `npm run lint` scans archived/minified Framer modules in `artifacts` and currently reports two errors plus many warnings. Use scoped ESLint for production source, or exclude `artifacts` in ESLint configuration before using the broad command.
- The latest comparison outputs are in `artifacts/routes-desktop`.
- Do not claim pixel-perfect or below 1% yet.

## Suggested next-task prompt

> Work in `C:\Projects\aexo`. Read `DESKTOP_HANDOFF.md` first and continue from the existing implementation; do not restart discovery or rebuild completed components. Keep tablet/mobile postponed. Continue route-by-route desktop visual correction at 1200x900 and 1440x900. Start with the Contact hero and shared CTA using the section-diff utility, then About 1200, Notlex/Cognefy, and Works. Preserve exact page heights and the locked navbar/homepage hero. Normalize scroll and looping animation checkpoints before final percentage acceptance. Run comparisons after each route group, then complete build, tests, route/asset checks, and 1366/1920 overflow smoke tests. Keep the app served at `http://localhost:3000`.
