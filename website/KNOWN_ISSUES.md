# STACKPROOF AI Website — Known Issues and Validation Gaps

1. The 3D refresh is deployed as Worker version 13. Previous production version 8 is retained as the rollback target.
2. WebGL scene rendering is verified, but pointer-driven rotation and touch interaction have not been tested end-to-end.
3. Reduced-motion support is implemented in source but has not been tested with an actual browser reduced-motion preference.
4. Core Web Vitals (LCP, INP, CLS) and Lighthouse scores have not been measured. Do not claim performance scores.
5. The corrected Cal.com event URL is verified and the embedded frame shows the event title and 20-minute duration. A Browser Rendering screenshot captured loading placeholders for the calendar grid; direct booking-page fallback is present. Full in-iframe availability and an actual appointment-to-calendar synchronization test remain pending.
6. YouTube playback on version 13 has not been independently verified because Browser Rendering reported a network connection error. The video ID is unchanged, the direct YouTube fallback link is present, and the prior production design's playback was user-confirmed.
7. Full keyboard-only navigation and screen-reader interaction testing remain pending.
8. GitHub source changes do not automatically deploy the Cloudflare Worker; the deployment process remains manual/API-driven.
