# STACKPROOF AI Website — Known Issues and Validation Gaps

1. The 3D candidate is Worker version 11, staged but not yet promoted to production. Version 10 was superseded after browser testing exposed a WebGL shader precision link error.
2. Browser Rendering returned HTTP 429 during the first QA attempt. Desktop and mobile screenshots, accessibility tree, and browser runtime checks remain outstanding.
3. WebGL shader compilation/linking and initial desktop/mobile rendering were verified on version 11. Pointer-driven movement and reduced-motion behavior still need interaction testing.
4. Performance metrics (LCP, INP, CLS, Lighthouse) have not been measured. No score should be claimed.
5. The corrected Cal.com event URL is known, but iframe rendering and a complete appointment-to-calendar synchronization test on the candidate remain pending.
6. YouTube playback on the candidate has not been tested. The previous production design's playback was user-confirmed.
7. CSP and security headers are defined in the candidate Worker but need response-level verification, including embedded-provider behavior.
8. GitHub source changes do not automatically deploy the Cloudflare Worker; the deployment process remains manual/API-driven.
