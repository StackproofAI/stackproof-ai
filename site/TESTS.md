# Test report

Status codes: **PASS** = run and observed; **UNTESTED** = not yet run (reason given).

| Test | Result | Evidence | Untested and why |
|---|---|---|---|
| Lighthouse mobile ≥ 90/95/95/95 | PASS | 99 / 100 / 100 / 100 · LCP 1.8 s · CLS 0 · TBT 70 ms (local preview, simulated 4G) | Real numbers on Cloudflare pending deploy |
| Lighthouse desktop | PASS | 100 / 100 / 100 / 100 · LCP 0.6 s | — |
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
