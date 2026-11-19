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
