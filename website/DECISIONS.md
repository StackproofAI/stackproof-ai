# STACKPROOF AI Website — Design and Technical Decisions

## D-001 — Preserve the Cloudflare Worker architecture
**Decision:** Keep the existing single-Worker production deployment and embedded HTML/CSS/JS model for the current release cycle.

**Reason:** The site is not currently a Vite, React, Next.js, or Pages application. Replacing the stack would add operational complexity before demonstrating a business or engineering benefit.

## D-002 — Use Three.js for the current 3D hero
**Decision:** The current production redesign loads Three.js 0.180.0 as a pinned ES module from jsDelivr.

**Reason:** The hero uses extruded geometry, lighting, materials, orbit rings, and pointer parallax. The dependency is justified by the current scene; React Three Fiber is not needed without a React application.

## D-003 — 3D supports the message, not the navigation
**Decision:** Keep conventional navigation, headings, service content, and booking links accessible in the document.

**Reason:** Prospects must understand the business and reach the booking flow without learning a 3D interface.

## D-004 — Keep the STACKPROOF visual identity
**Decision:** Use graphite `#0B0F14`, slate `#6F7F90`, and electric lime `#C8FF3D`.

**Reason:** Preserve brand continuity while improving typography, spatial composition, surfaces, and depth.

## D-005 — Progressive enhancement and graceful fallback
**Decision:** Keep semantic HTML as the content foundation; add WebGL, reveal effects, and pointer interactions as enhancements. Respect reduced motion and provide a CSS fallback.

**Reason:** Usability and accessibility must survive unsupported graphics hardware, JavaScript limitations, and user motion preferences.

## D-006 — Isolate development from production
**Decision:** Use Git branch `quae/3d-preview-qa` and separate Cloudflare Worker `stackproof-ai-preview`.

**Reason:** A separate Worker allows preview testing without routing production traffic to development code.

**Consequences:** The preview must remain noindexed and must not be treated as a production release. Production deployment requires separate explicit approval.

## D-007 — No fabricated social proof
**Decision:** Testimonials must be genuine, permissioned, and attributable or clearly anonymized with permission. Until evidence exists, use transparent explanations of the assessment process rather than invented customer quotes.

## D-008 — No production changes during preview setup
**Decision:** The preview Worker is cloned from the current production Worker source and uses preview-specific noindex metadata. Production Worker configuration and traffic allocation are not changed by this setup.

**Consequences:** Preview-specific runtime behavior still requires independent browser verification before sharing broadly.
