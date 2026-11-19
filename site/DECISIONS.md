# Decisions

One line per decision: choice · alternative considered · why. Status: **P** = proposed (awaiting George), **A** = approved.

| ID | Decision | Alternative | Why | Status |
|---|---|---|---|---|
| D-01 | New build lives in `site/`; the old `website/` folder and live Worker `stackproof-ai-site` stay untouched. Deploy as `stackproof-ai-site-v2`. | Overwrite in place | Brief: never overwrite the live site before approval. Gives a clean rollback. | A (from brief) |
| D-02 | Plain Three.js in a lazy module, not React Three Fiber. | R3F | The site has no React; R3F would add ~45 KB gz of React for one canvas. | P |
| D-03 | All copy rendered into static HTML at build time from `locales/en.ts`. | Client-rendered strings | SEO, LCP, no-JS readability, and future `/de/` with `hreflang`. | P |
| D-04 | Lead admin is a separate Worker `stackproof-leads-admin` with Cloudflare Access on its whole workers.dev URL and JWT validation in code. | `/admin` path on the public Worker | Per the docs, Access on workers.dev protects the whole Worker, not a path. Separating it also keeps admin code out of the public Worker. | P |
| D-05 | Rate limiting with the Workers `ratelimits` binding: 5 per 60 s per IP, applied as an anti-spam layer. | WAF rate-limiting rule | A WAF rule needs a zone (custom domain). The binding works on workers.dev. Counts are per location and approximate, which is acceptable behind Turnstile and a honeypot. | P |
| D-06 | In-house capability probe instead of `detect-gpu`. | `detect-gpu` | `detect-gpu` fetches benchmark data from a third-party CDN at runtime, which fails the "no non-Cloudflare requests on page load" test. | P |
| D-07 | Fonts: Geist + Geist Mono variable, self-hosted via @fontsource, latin + latin-ext subsets. | Space Grotesk + JetBrains Mono | Geist pairs a grotesk and a mono from one family, so metrics match. OFL license. latin-ext covers German. | P |
| D-08 | Turnstile script loads only when the form approaches the viewport. | Load on page load | Keeps third-party JS (even Cloudflare's) out of the LCP and initial-JS budget. | P |
| D-09 | Email notification is best effort, after the D1 insert, only for new rows. | Email before insert / fail the request | The brief says a lead is never lost to an email failure, and duplicates send no second email. | A (from brief) |
| D-10 | `preview_urls: false` on the v2 Worker; the preview is the v2 workers.dev URL itself. | Version preview URLs | Fewer public URLs to protect. | P |
| D-11 | Positioning A: "Find the work your business should stop doing by hand." | B, C | Approved by George 2026-11-19. | A |
| D-12 | Logo: rebuilt SVG `brand/stackproof-mark.svg` fitted to the supplied PNG (4 filled paths, ≈1 px mean edge deviation at 1536 px). | Auto-trace (potrace) | Clean geometric paths are needed for the separate 3D layer extrusion; approved by George. | A |
| D-13 | No custom domain → no lead email at launch; the admin Worker is required. | — | Cloudflare email sending needs a domain on Cloudflare DNS. | A |
| D-14 | Owner block shows the name "George Fields" with a geometric monogram until the photo arrives. | Company-only | The live site already shows the name; a photo is promised later. Can be removed with one flag. | P |
| D-15 | "How we work" uses a sticky spiral column + one ScrollTrigger per stage (each draws one construction step); no pinning anywhere. | Pinned 7-stage sequence | Same storytelling with no scroll-jacking (brief §5, PLAN §5.4). Phones: stages draw as they enter, no sticky. | P |
| D-16 | DrawSVG on plain paths (removed `pathLength`); all motion is `from` tweens inside `gsap.matchMedia` (prefers-reduced-motion: no-preference). | CSS-only reveals | The HTML already holds the final state, so reduced motion, no JS or a failed chunk all show complete content. | P |
| D-17 | Lenis kept: interaction latency at 4× CPU slowdown was 64 ms worst with Lenis + motion vs 104 ms with both off (noise; both ≪ 200 ms). Lenis only for fine pointers; in-page links move focus to their target. | Drop Lenis | Measured cost < 30 ms threshold set in PLAN §5.5. | P |
| D-18 | 3D only on desktop (≥60rem, fine pointer), WebGL2, ≥4 cores, ≥4 GB, no save-data, no reduced motion; 40-frame probe falls back to SVG if frames > 22 ms. Phones get the animated SVG hero. | detect-gpu | No third-party request (D-06); phones keep battery and LCP. | P |
| D-19 | Hero "unverified" state colours the top layer #3A4250 (derived dark steel), then lime once pressed ("proven"). Auto-reveal after 6 s if the visitor hasn't scrolled, then the scroll link is released. | Keep the top lime throughout | Makes "stacked → proven" visible; the resting/final state is always the exact brand mark. | P |
| D-20 | Three.js chunk 153 KB gz (budget 350); initial JS (main + motion) ≈ 59 KB gz (budget 150). | — | Measured from the production build. | A |
| D-21 | **No lead form** (George, 2026-11-19). The site is now assets-only: no Worker script, no D1, no Turnstile, no rate limiting, no admin Worker, no secrets. | Keep the form | Owner decision. Smaller attack surface; nothing to store or protect. Lead tracking happens in Cal.com's own dashboard. |  A |
| D-22 | Every primary CTA ("Get Your Free Automation Assessment") opens the Cal.com 20-minute booking in a new tab, announced to screen readers. Copy is now call-first ("book a 20-minute call… get a written summary"). | Email-first; both side by side | George chose Cal.com. |  A |
| D-23 | CSP tightened: no Turnstile host; `form-action 'none'`. | — | No forms on the site. | A |
