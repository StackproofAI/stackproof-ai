# Independent critic: score history

The critic is a separate agent with a fresh context. It sees only screenshots (1440 / 1280 / 768 / 390, one viewport at a time) and the Lighthouse numbers. It never sees code, the brief or my notes. Target: every item ≥ 8.5.

## Checkpoint 2 (static site, no motion)

| Item | Round 1 | Round 2 |
|---|---|---|
| Design (40%) | 7.0 | 7.5 |
| Usability (30%) | 7.5 | 8.0 |
| Creativity (20%) | 6.5 | 7.0 |
| Content (10%) | 6.0 | 6.0 |
| **Weighted** | **6.95** | **7.4** |
| B1 5-second test | 8 | 8 desktop / 7 phone |
| B2 Trust | 4.5 | 4.5 |
| B3 Friction | 7 | 7 |
| B4 Objections | 6 | 6 |

**Fixed after round 1:**
- Solid header: content no longer bleeds through it.
- Phone problem diagram redrawn vertically, so it is no longer cropped.
- System labels readable on phone.
- Lime connector only on the live S1→S2 link.
- Less dead space; smaller hero image on phone.
- Non-breaking "mid-sized".
- Sticky phone CTA.
- Spiral ends in the "proven" check.
- Clearer skip link.

**Fixed after round 2:**
- Sticky phone CTA now hides once the form has been reached or passed.
- On phone, the form comes directly after the section headline; the steps, call link and email moved below it.

**Not re-run as round 3:** the remaining gap is almost entirely trust and content (B2 4.5, Content 6.0), and every cause needs George's input (COPY-SUGGESTIONS.md K-1…K-9). Another round now would score the same. Rule 2: stop and report what blocks it.

### Top blockers (both rounds agree)
1. Gmail contact address (K-1).
2. No founder photo or bio and no measured result. The testimonials praise intentions (K-2, K-3, K-5).
3. Generic owner-supplied copy in section 05 and Title Case headings (K-6, K-7). Objections (FAQ) sit after the form. **Proposal:** move the FAQ above the final CTA (brief §4 allows a reasoned reorder). This needs George's OK.

## Checkpoint 3 (motion + 3D)

The critic received frame sequences, which stand in for screen recordings because it can only view stills: hero (3D, phone SVG), problem diagram, system map, spiral, and reduced motion.

| Item | Round 1 |
|---|---|
| Design | 7.0 |
| Usability | 7.5 |
| Creativity | 6.0 |
| Content | 6.5 |
| **Weighted** | **6.9** |
| B1 5-second test / B2 Trust / B3 Friction / B4 Objections | 8 / 4 / 6.5 / 7 |

**Round 1, top issue:** the desktop 3D hero read "backwards". The top layer was dark at rest while the header logo was lit, and the payoff finished only after the mark had scrolled under the header. Load also showed a ghosted double exposure.

**Fixed:**
- The hero keeps the exact brand colours. "Proven" is now a lime verification ring closing plus a glow.
- The press completes within the first 45% of the hero's height of scrolling.
- The 2D→3D crossfade shortened to 0.3 s.
- Section padding cut by about 30%.
- System names on the map, with a halo behind labels ("S10" no longer reads as "$10").
- Roadmap systems collapse to one line each on phone.
- The cost FAQ is open by default.
- The offer CTA spans both columns.
- The sticky phone CTA hides while another CTA is visible.
- Larger, higher-contrast small print.
- The "manual step" label no longer collides on phone and is more visible on desktop.

**Declined (brief or owner decision):**
- Replace the spiral (it's in the brief).
- Drop the book or trim the 14 FAQs (George kept them).
- Real video poster (needs George's screenshot).
