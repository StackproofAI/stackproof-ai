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
| Form: valid submit → 1 row | PASS (local D1) | 200 `saved`, row present | On deployed preview: pending |
| Same email, same day → 1 row, thank-you | PASS | 200 `duplicate`, still 1 row | — |
| Double-click → 1 row | PASS | Client sends 1 request; 2 parallel server requests → `saved` + `duplicate`, 1 row | — |
| Bad Turnstile token rejected | PASS (local mock*) | 403 `verify_failed` | Real siteverify: pending deploy (*sandbox can't reach challenges.cloudflare.com) |
| Honeypot dropped | PASS | 200 `saved`, no row | — |
| Consent unticked blocked | PASS | Client blocks + server 400 `consent` | — |
| Cross-origin POST blocked | PASS | 403 | — |
| Rate limit triggers | PASS (local) | 429 after 5/min per IP | On Cloudflare: pending |
| D1 forced failure → honest error | PASS | 503 → "your request was not saved… email us at …" | — |
| Email failure → lead saved | N/A | No email at launch (no Cloudflare domain, D-13) | — |
| No secrets in build | PASS | grep of `dist/client` finds no secret; `.dev.vars` git-ignored | — |
| Thank-you → Cal.com link | PASS | Link `cal.com/sean-fields-qf4rle/20-min` | Visitor local-time display: UNTESTED (host blocked here) |
| `/admin` unreachable without Access | Code: fail-closed + JWT check | Returns 403 until Access is configured | Deploy + enable Access: pending |
