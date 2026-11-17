# STACKPROOF AI Website — Test Results

## Candidate: Worker version 11
Status recorded 2026-11-17. These results distinguish staging/API evidence from browser execution.

| Test | Status | Evidence / notes |
|---|---|---|
| Worker version creation | PASS | Cloudflare API returned version 10 and a preview URL. |
| Production traffic unchanged during staging | PASS | Version created with `deploy:false`; no production deployment was requested in that operation. |
| HTML/CSS/JS source presence | PASS | Candidate built from current GitHub source files. |
| Desktop hero visual screenshot | PASS | Cloudflare Browser Rendering captured the 3D hero at 1100×760; the WebGL sphere and orbit scene rendered. |
| Mobile accessibility tree | PASS | Cloudflare Browser Rendering returned HTTP 200 at 390×844; all primary sections, headings, booking/video iframes, phone, LinkedIn, Instagram, GitHub, and mobile navigation control were present. This confirms semantic structure, not visual layout. |\n| Mobile hero visual screenshot | PASS | Cloudflare Browser Rendering captured the hero at 390×844; headline, CTA, responsive scene, and labels remained visible. |
| WebGL rendering in a real browser | PASS | Browser Rendering confirmed WebGL context support; shader compilation/linking passed after fixing a uniform precision mismatch; candidate version 11 rendered the 3D sphere and orbit scene. |
| Reduced-motion runtime behavior | NOT TESTED | Source-level implementation present; browser preference test pending. |
| Keyboard navigation | NOT TESTED | Semantic links and mobile menu controls are present; interactive keyboard test pending. |
| Cal.com iframe and booking flow | NOT TESTED | Existing event URL preserved; no test appointment made. |
| YouTube playback | NOT TESTED on candidate | Existing video ID preserved; prior production playback test was user-confirmed before this refresh. |
| Core Web Vitals / Lighthouse | NOT TESTED | No measured LCP, INP, CLS, or Lighthouse score available. |
| Security header behavior | NOT TESTED | Headers are configured in candidate source; response-level browser verification pending. |
| Production deployment | NOT DEPLOYED | Candidate remains staged; do not treat as live. |

## Prior production baseline
The user previously confirmed desktop and phone layout passed and video playback was perfect on the prior production design. Those results do not automatically transfer to version 10.
