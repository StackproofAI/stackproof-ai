# STACKPROOF AI Website — Known Issues and Validation Gaps

1. The 3D candidate is staged, not yet promoted to production.
2. Browser Rendering returned HTTP 429 during the first QA attempt. Desktop and mobile screenshots, accessibility tree, and browser runtime checks remain outstanding.
3. WebGL rendering and shader behavior have not yet been verified in a real browser session.
4. Performance metrics (LCP, INP, CLS, Lighthouse) have not been measured. No score should be claimed.
5. Cal.com booking iframe appearance and a complete appointment-to-calendar synchronization test have not been performed on the candidate.
6. YouTube playback on the candidate has not been tested. The previous production design's playback was user-confirmed.
7. CSP and security headers are defined in the candidate Worker but need response-level verification, including embedded-provider behavior.
8. GitHub source changes do not automatically deploy the Cloudflare Worker; the deployment process remains manual/API-driven.
