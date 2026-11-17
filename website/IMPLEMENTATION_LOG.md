# STACKPROOF AI Website — Implementation Log

## 2026-11-17 — Premium 3D refresh staged
- Reworked the homepage into a premium dark operations-focused layout while retaining the B2B consulting positioning.
- Added custom WebGL operations core with pointer-responsive rotation, a procedural sphere, orbit rings, and node points.
- Added mobile geometry/DPR reductions, viewport and tab visibility pausing, reduced-motion behavior, and a CSS fallback.
- Added accessible mobile navigation and progressive scroll reveals.
- Refined service cards, process section, video presentation, assessment CTA, FAQ, founder section, booking, and contact hierarchy.
- Added favicon.
- Preserved the YouTube video, Cal.com 15-minute booking, phone, LinkedIn, Instagram, GitHub, six services, and advisory assessment language.
- Added restrictive response headers and explicit MIME types for Worker-served assets.

## Source commits
- Homepage HTML: `7873996c17d94a63bdbc166463aced1b841b5cf0`
- Main stylesheet: `4725fa2df1117b8b25bf731c79654f9083754dc8`
- Client script initial: `93ce07dfb741ceb2f2489f0c67b366f677587dd7`
- Resize animation-loop fix: `a8571ec8a3f5b4bb7c920e1e1e9a6bed9425f574`
- Reduced-motion pointer fix: `023c21f012d06c02c2bed273340a2192c2cd05e3`
- Favicon: `8561ec928d136ba5bbd46f7555c239b5088ad97a`

## Cloudflare staging
- Worker: `stackproof-ai-site`
- Candidate version: 10
- Candidate version ID: `48332b8b-7218-48cf-b7e9-8439bfbecf68`
- Preview URL: https://48332b8b-stackproof-ai-site.stackproofai.workers.dev
- Production deployment was not changed by version creation.


## 2026-11-17 — WebGL validation fix
- Browser Rendering initially showed the CSS fallback because WebGL program linking failed: `uPointSize` had mismatched vertex/fragment precision.
- Added explicit `precision mediump float` to the vertex shader so the shared uniform precision matches.
- Re-staged as Worker version 11.
- Version 11 ID: `09a681f1-49ff-45ce-a700-e262d35c6135`.
- Preview URL: https://09a681f1-stackproof-ai-site.stackproofai.workers.dev
- Desktop hero screenshot: PASS (1100×760).
- Mobile hero screenshot: PASS (390×844).
- Browser Rendering accessibility tree: PASS (390×844).
- Version 11 remains staged; production promotion has not occurred.


## 2026-11-17 — Booking URL correction
- Cal.com connector showed the previously embedded `/15min` route is stale; the current event is listed at `https://cal.com/sean-fields-qf4rle/20-min`.
- The current Cal.com event title is “15 min meeting”, but its configured duration is 20 minutes.
- Updated the website iframe URL and removed the inaccurate “15-minute introduction” duration claim. The candidate now uses duration-neutral “complimentary introduction” wording.


## 2026-11-17 — Version 12 booking correction and final staging
- Replaced stale Cal.com `/15min` route with the current `/20-min` event URL from the connected Cal.com account.
- Cal.com currently labels the event “15 min meeting” but its configured duration is 20 minutes; website wording is duration-neutral to avoid a false promise.
- Direct Cal.com page returned HTTP 200 and exposed available time buttons.
- Version 12 is the current staged Worker candidate: `dc655ff0-f21a-4b9c-b1a5-5aec3e836871`.
- Preview URL: https://dc655ff0-stackproof-ai-site.stackproofai.workers.dev
- Version 12 has not yet been promoted to production.
