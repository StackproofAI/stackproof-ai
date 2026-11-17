# STACKPROOF AI Website — Known Issues and Validation Gaps

Status date: 2026-11-17

## Preview environment
1. Git branch `quae/3d-preview-qa` exists, based on `main`.
2. A separate Cloudflare Worker named `stackproof-ai-preview` was uploaded from the current production Worker source.
3. Intended preview URL: https://stackproof-ai-preview.stackproofai.workers.dev/
4. Preview upload succeeded and its workers.dev subdomain was enabled. External HTTP response and rendered-page verification are still NOT TESTED; do not claim the URL is fully working until browser verification succeeds.
5. Preview HTML has a `noindex,nofollow` meta directive, and Browser Run verified `/robots.txt` returns HTTP 200 with `User-agent: *` and `Disallow: /`.
6. Preview source retains production canonical and Open Graph URLs. This is intentional for canonical attribution but does not replace noindex verification.

## 3D and runtime
7. The current Worker source imports Three.js 0.180.0 from a pinned jsDelivr ES module.
8. Actual preview WebGL rendering, pointer/touch interaction, and CDN failure behavior remain NOT TESTED.
9. WebGL context-loss recovery needs an end-to-end test; a handler that only resumes the animation loop may not rebuild all GPU resources.
10. Reduced-motion support is implemented in source but needs a real browser preference test.
11. Mobile and tablet visual quality, including low-power device behavior, needs fresh validation.

## Integrations
12. Cal.com direct event route is verified at https://cal.com/sean-fields-qf4rle/20-min. The embedded frame previously showed loading placeholders. Full in-frame availability, test booking, and calendar synchronization remain unverified.
13. YouTube playback on the latest redesign needs an end-to-end test. A direct fallback link remains present.

## Performance and accessibility
14. Lighthouse and Core Web Vitals (LCP, INP, CLS) have not been measured for the current release. Do not publish performance scores.
15. Full keyboard-only, screen-reader, color-contrast, and reduced-motion testing remains incomplete.

## Operational
16. GitHub commits do not automatically deploy the production Worker; deployment remains manual/API-driven.
17. Do not deploy preview code to production without code review, QA evidence, and explicit user approval.
18. Production Worker and its rollback versions must remain untouched during preview work.
