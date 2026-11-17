# STACKPROOF AI Website — Test Results

## Production release: Worker version 13
Status recorded 2026-11-17. Results distinguish verified API state, browser execution, and untested behavior.

| Test | Status | Evidence / notes |
|---|---|---|
| Worker version creation | PASS | Cloudflare created Worker version 13: `417648c2-e34a-48fe-af0b-53b4c741e2ba`. |
| Desktop hero visual | PASS | Browser Rendering screenshot of production at 1100×760 showed the WebGL sphere and orbit scene. |
| Mobile hero visual | PASS | Browser Rendering screenshot at 390×844 showed headline, CTA, responsive scene, and labels. |
| Mobile accessibility tree | PASS | Production Browser Rendering returned HTTP 200 at 390×844; primary sections, headings, navigation control, video/booking iframes, social links, and direct fallback links were present. |
| WebGL context and shader linking | PASS | Browser Rendering confirmed WebGL support; shader compile/link succeeded after fixing a uniform precision mismatch. Production screenshot confirms the scene renders. |
| Production homepage response | PASS | Production URL returned HTTP 200 and the expected page title. |
| Health endpoint | PASS | `/health` returned HTTP 200 and “STACKPROOF AI site is online”. |
| Security response headers | PASS | Production response includes CSP, HSTS, Permissions-Policy, Referrer-Policy, and X-Content-Type-Options. |
| Cal.com event route | PASS | Connected Cal.com listing confirms `https://cal.com/sean-fields-qf4rle/20-min`; direct page returned HTTP 200, showed a 20-minute duration, and exposed available time buttons. |
| Cal.com iframe visual | PARTIAL | Embedded frame shows the event title and 20-minute duration; screenshot captured calendar loading placeholders. Direct booking-page fallback is present. Full in-iframe availability and an actual test booking remain unverified. |
| YouTube playback on new release | NOT TESTED | Browser Rendering screenshot attempt ended with a network-connection error. The video ID is unchanged and a direct YouTube fallback link is present. The prior production design's playback was user-confirmed before this refresh. |
| Reduced-motion runtime behavior | NOT TESTED | Source-level support is implemented; browser preference test remains pending. |
| Pointer-driven 3D interaction | NOT TESTED | Pointer-responsive rotation is implemented; a real pointer/touch interaction test remains pending. |
| Keyboard navigation | NOT TESTED | Semantic links and an accessible mobile menu control are present; full keyboard interaction testing remains pending. |
| Core Web Vitals / Lighthouse | NOT TESTED | No measured LCP, INP, CLS, or Lighthouse score is available. |
| Production deployment | PASS | Deployment `730e02d3-737a-4ff8-a769-29978a190575` routes 100% of production traffic to version 13. |
| Preview URL exposure | PASS | Cloudflare preview URLs were disabled after release. |

## Rollback
Previous production version 8 (`c75579c6-7473-4a13-a2f3-e974b7d4cbda`) remains available as the rollback target.

## Prior production baseline
Before this refresh, the user confirmed desktop/mobile layout and YouTube playback passed on the previous production design. Those user-confirmed tests are not treated as independent tests of the new release.


## Testimonials section update
- Source markup and navigation link: PASS — `#testimonials` section and navigation anchor added.
- Review integrity: PASS — no fabricated client quotes, identities, ratings, or outcome metrics; section explains permission and evidence standards.
- Live production DOM at mobile viewport: PASS — Browser Rendering loaded the deployed page and verified the testimonials section, navigation anchor, all three cards, and the no-fabricated-reviews notice.
- Desktop screenshot capture: PASS — Browser Rendering returned a screenshot for the testimonials section; visual inspection of the captured image remains NOT TESTED.
- Mobile visual screenshot inspection: NOT TESTED — rendered DOM and responsive stylesheet are present, but pixel-level visual review remains pending.
