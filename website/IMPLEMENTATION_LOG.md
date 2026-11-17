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


## 2026-11-17 — Version 13 release candidate
- Added direct “Open the demo on YouTube” fallback below the embedded video.
- Added direct Cal.com booking-page fallback below the embedded booking calendar.
- Reduced CSS/JS asset cache TTL to five minutes for safer updates.
- Re-staged as Worker version 13.
- Version ID: `417648c2-e34a-48fe-af0b-53b4c741e2ba`.
- Preview URL: https://417648c2-stackproof-ai-site.stackproofai.workers.dev
- Mobile accessibility tree returned HTTP 200 and includes the two fallback links, booking/video iframes, primary headings, and navigation control.
- Production promotion remains pending.


## 2026-11-17 — Production deployment
- Deployed Worker version 13 to `stackproof-ai-site`.
- Deployment ID: `730e02d3-737a-4ff8-a769-29978a190575`.
- Version ID: `417648c2-e34a-48fe-af0b-53b4c741e2ba`.
- Cloudflare confirms 100% of production traffic routes to version 13.
- Production Browser Rendering accessibility tree returned HTTP 200; primary content, six services, navigation control, booking/video iframes, and direct fallback links were present.
- Production desktop screenshot confirmed the WebGL hero renders.
- Production `/health` returned HTTP 200 and the expected online message.
- Production security headers were verified in the response.
- Preview URLs disabled after deployment; previous production version 8 retained as rollback target.


## 2026-11-17 — Client testimonials section
- Added `#testimonials` after the How We Work section and before the assessment CTA.
- Added a navigation anchor for direct access.
- Added three trust-standard cards: permission, context, and evidence.
- Added explicit notice that client feedback is being collected and no fabricated reviews or unverified ratings are published.
- Updated the shared HTML/CSS source and deployed the matching embedded Worker content.
- Production Browser Rendering confirmed the section, nav anchor, three cards, and integrity notice are present.


## 2026-11-17 — Complete website design rebuild
- Reworked presentation without removing existing public business content or changing video, booking, phone, social, or GitHub destinations.
- Updated hero markup, complete stylesheet, and Three.js client interactions.
- Retained Worker architecture and added CDN origin to CSP.
- Release requires live browser, mobile, WebGL, provider, and performance QA.


## 2026-11-17 — Isolated QUAE preview created
- Created Git branch `quae/3d-preview-qa` from `main`.
- Created separate Cloudflare Worker `stackproof-ai-preview` by cloning the current production Worker source; no production Worker upload was performed.
- Enabled the preview Worker's workers.dev subdomain.
- Added `noindex,nofollow` to the preview HTML and changed its robots response to disallow crawling.
- Retained production canonical and Open Graph URLs in the preview clone.
- Preview deployment version: `d6378d28-e5d7-4a34-8b5f-e1424f5ff3c0`; preview deployment ID: `7196f472-6096-4180-8c55-be318a27dc16`.
- Production deployment remains `5d67bfcf-873b-4e03-b360-a4a23d4dbbf6`, with 100% traffic on version `6c7f8e65-e06e-45da-9984-3e742fcf855f`.
- Browser verification of the preview URL, page rendering, robots response, and WebGL runtime remains pending.


## 2026-11-17 — Preview QA and copy correction
- Cloudflare Browser Run loaded the preview at desktop and mobile viewport sizes; both returned HTTP 200.
- Desktop and mobile accessibility trees were captured. Main navigation, primary content, services, booking and video destinations were present.
- Found duplicated phrase in booking introduction: "complimentary, no-obligation complimentary introduction".
- Corrected source file `website/public/index.html` on the development branch and updated only the isolated preview Worker. Production remains unchanged.
- Desktop and mobile screenshots were captured by Browser Run, but image payload rendering failed in this review environment; pixel-level visual inspection remains pending.
- Actual Three.js runtime, WebGL interaction, and performance measurements remain pending.
