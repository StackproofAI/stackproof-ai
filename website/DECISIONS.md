# STACKPROOF AI Website — Design and Technical Decisions

## D-001 — Preserve the Cloudflare Worker architecture
**Decision:** Keep the existing single-Worker deployment and embedded HTML/CSS/JS model.

**Reason:** The current site is a small brochure/consulting site with no server-side application or asset pipeline. Replacing the stack would add operational cost and risk without a demonstrated requirement.

## D-002 — Use custom WebGL instead of a Three.js bundle
**Decision:** Implement a small custom WebGL 1 scene.

**Reason:** The intended 3D element is one interactive operations core, not a navigable game world. A focused renderer avoids a new dependency, build pipeline, large bundle, and unnecessary complexity.

## D-003 — 3D supports the message, not the navigation
**Decision:** Keep conventional navigation, headings, service content, and booking links accessible in the document.

**Reason:** Prospects must understand the business and reach the booking flow without learning a 3D interface.

## D-004 — Keep the STACKPROOF visual identity
**Decision:** Retain the charcoal/black foundation and lime `#C6FF00` accent; refine spacing, typography, surfaces, and depth.

**Reason:** Brand continuity is more valuable than an unrelated visual rebrand.

## D-005 — Progressive enhancement and graceful fallback
**Decision:** Keep semantic HTML as the content foundation; add WebGL, reveal effects, and pointer interactions as enhancements. Respect reduced motion and provide a CSS fallback.

**Reason:** Usability and accessibility must survive unsupported graphics hardware, JavaScript limitations, and user motion preferences.

## D-006 — No new external visual dependencies
**Decision:** No external font, image, 3D model, animation CDN, or analytics dependency was added.

**Reason:** Keep the site lightweight, reduce third-party requests, and avoid dependency maintenance.
