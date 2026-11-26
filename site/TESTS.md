# Test report

Status codes: **PASS** = run and observed; **UNTESTED** = not yet run (reason given).

| Test | Result | Evidence | Untested and why |
|---|---|---|---|
| Lighthouse mobile ≥ 90/95/95/95 | PASS | **Live preview:** 100 / 100 / 100 / 100 · LCP 1.2 s · CLS 0 · TBT 30 ms (simulated 4G). Local: 99/100/100/100 | — |
| Lighthouse desktop | PASS | **Live preview:** 100 / 100 / 100 / 100 · LCP 0.4 s · CLS 0.033 | — |
| Initial JS ≤ 150 KB gz | PASS | main 3.5 + motion 55.8 ≈ 59 KB | — |
| 3D chunk ≤ 350 KB gz | PASS | 152.8 KB (lazy, desktop only) | — |
| INP ≤ 200 ms | PASS (lab) | Worst 64 ms (motion on) / 104 ms (off) at 4× CPU slowdown | Field INP after launch |
| Reduced motion | PASS | No 3D, no Lenis, all final states visible (`reduced-desktop-*` frames) | — |
| WebGL disabled / save-data | PASS | SVG hero, 3D chunk never requested, no console errors | — |
| Widths 1440 / 1280 / 768 / 390 | PASS | No horizontal overflow, no console errors (Chromium) | Real iPhone Safari, Android Chrome, desktop Firefox/Safari: UNTESTED (no devices here) |
| Keyboard walkthrough | PASS | Logical order; constellation = 1 tab stop + arrow keys; focus ring visible; skip link moves focus | Screen reader: UNTESTED |
| No external request on page load | PASS | Only same-origin requests; Turnstile loads near the form; YouTube only after click | — |
| i18n: no hard-coded copy | PASS | All strings in `src/content/en.ts`; client strings via an i18n JSON block | — |
| Lead form tests | N/A | Form removed by owner decision (D-21); the backend tests passed before removal (see git history, commit 8298f8c) | — |
| Primary CTA → Cal.com | PASS | All primary buttons open `cal.com/sean-fields-qf4rle/20-min` in a new tab; with time zone Europe/Berlin the page showed local times | Page still titled "Sean Fields": George to rename |
| No secrets in build | PASS | There are no secrets (assets-only deploy) | — |
| GSAP licence | PASS | Standard "No Charge" licence; commercial use on a free site is allowed | — |
| Live preview deployed | PASS | https://stackproof-ai-site-v2.stackproofai.workers.dev: 200; security headers present; 404 page; no console errors; no requests to other hosts; 3D on desktop, SVG on phone | — |
| Current live site untouched | PASS | Cloudflare API: `stackproof-ai-site` last modified 2026-11-19T12:17Z (before this work) | — |
| GO-LIVE | PASS | Worker `stackproof-ai-site` → version 3984ef91 (2026-11-19). `/` 200, `/privacy/` 200, `/_styleguide/` 404 (excluded from production), 404 page OK, CSP present, canonical points to the live URL. Live Lighthouse mobile 100/100/100/100, LCP 1.2 s, CLS 0 | Rollback target 24ec29d1 recorded; old code in `website/live-backup/` |
| REBRAND live (2026-11-26) | PASS | Version 26d411c9: navy theme colour, new favicon (navy/lime/white), canonical OK; live Lighthouse mobile 99/100/100/100, LCP 1.2 s, CLS 0; desktop 3D assembles the five blocks; no console errors | Roll back to the pre-rebrand version: `wrangler rollback 3984ef91-fc1d-4272-9455-89cc26bfb007 --name stackproof-ai-site` |
| Demo video replaced (2026-11-26) | PASS | Live version 0daef2a5 embeds `e7BzXK1OA7E`; no request to YouTube until click; on click loads youtube-nocookie.com | Video title not verified (youtube.com blocked from the sandbox); button reads "Watch the demo" |
