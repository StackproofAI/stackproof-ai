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


## Complete visual redesign — 2026-11-17
- Existing page content and public destinations preserved in source: PASS.
- New graphite/slate/lime visual system: PASS — source updated.
- Hero geometry and Three.js scene: IMPLEMENTED; live runtime NOT TESTED.
- Responsive CSS and navigation: IMPLEMENTED; live visual review NOT TESTED.
- Reduced-motion, context-loss and CSS fallback: IMPLEMENTED; runtime NOT TESTED.
- Cal.com/YouTube end-to-end: NOT TESTED.
- Core Web Vitals / Lighthouse: NOT TESTED.


## Production verification — complete visual redesign
- Cloudflare upload/deployment: PASS — Worker `stackproof-ai-site`, version `6c7f8e65-e06e-45da-9984-3e742fcf855f`, 100% production traffic.
- Production page DOM: PASS — Browser Rendering loaded the live homepage and found the hero canvas, all six service categories, video ID, Cal.com booking URL, testimonials, and legal footer.
- Production script route: PASS — Browser Rendering fetched `/script.js` and confirmed pinned Three.js import, reduced-motion branch, WebGL context-loss handler, and DPR cap.
- Mobile production DOM: NOT TESTED — browser call attempt was rate-limited / interrupted; responsive rules are present in source.
- Actual WebGL scene render, pointer/touch interaction, context-loss recovery: NOT TESTED end-to-end.
- YouTube playback and Cal.com appointment completion: NOT TESTED end-to-end.
- Lighthouse / Core Web Vitals: NOT TESTED.
- Visual image inspection: NOT TESTED.


## Isolated QUAE development preview — 2026-11-17

| Check | Status | Evidence / notes |
|---|---|---|
| Git development branch | PASS | Created `quae/3d-preview-qa` from `main`. |
| Separate Cloudflare Worker upload | PASS | Uploaded cloned source as `stackproof-ai-preview`; production Worker was not modified by the upload. |
| Preview workers.dev subdomain | PASS | Cloudflare API reports subdomain enabled for `stackproof-ai-preview`. |
| Preview-only noindex directive | PASS | Downloaded preview source contains `noindex,nofollow`. |
| Preview robots.txt disallow rule | PASS (source) | Preview Worker source updated to return `User-agent: *\\nDisallow: /`. HTTP response has not been browser-verified. |
| Preview page HTTP response | NOT TESTED | External browser request did not return a usable response in this session. |
| Preview DOM / screenshot | NOT TESTED | No rendered browser capture available yet. |
| Preview WebGL rendering and interaction | NOT TESTED | Requires browser runtime testing. |
| Production isolation | PASS | No production Worker upload or production traffic change was made during preview setup. |
| Production homepage and integrations after setup | NOT TESTED in this work session | No production deployment was changed; fresh smoke test still recommended. |

Preview URL intended for browser QA: https://stackproof-ai-preview.stackproofai.workers.dev/

The preview retains the production canonical and Open Graph URLs. The preview must remain noindexed; do not treat its URL as a public launch destination.
