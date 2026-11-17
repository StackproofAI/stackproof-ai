# STACKPROOF AI Website — Project Context

## Purpose
Public B2B website for STACKPROOF AI, an AI automation and business operations consultancy. The site explains services, establishes credibility, and converts qualified visitors into complimentary consultation bookings.

## Audience and positioning
- Audience: owners, operators, and decision-makers at growing businesses.
- Keep positioning industry-neutral; do not restore a dedicated real-estate landing section.
- Initial offer: complimentary, no-commitment automation opportunity assessment. Do not imply implementation is included.

## Production environment
- Platform: Cloudflare Workers.
- Worker: `stackproof-ai-site`.
- Production URL: https://stackproof-ai-site.stackproofai.workers.dev/
- Current verified production version: `6c7f8e65-e06e-45da-9984-3e742fcf855f`.
- Current production deployment: `5d67bfcf-873b-4e03-b360-a4a23d4dbbf6` (100% traffic).
- GitHub repository: https://github.com/StackproofAI/stackproof-ai
- Source files: `website/public/index.html`, `website/public/style.css`, `website/public/script.js`, `website/public/favicon.svg`.
- Worker serves embedded HTML/CSS/JS strings; GitHub commits do not automatically deploy the Worker.
- Current 3D implementation imports Three.js 0.180.0 as a pinned ES module from jsDelivr.
- No React, Vite, Next.js, React Three Fiber, or Tailwind build is configured.

## Brand
- Graphite: `#0B0F14`.
- Slate: `#6F7F90`.
- Electric lime: `#C8FF3D`.
- Wordmark: STACKPROOF AI.
- Legal identity: STACKPROOF AI is a trade name of Soulectiv3 LLC.

## Core content and integrations
- Six service categories, process, testimonials, FAQ, founder/about section, and complimentary assessment CTA.
- Cal.com event page: https://cal.com/sean-fields-qf4rle/20-min. The configured duration is 20 minutes; the event title currently says "15 min meeting", so website copy should avoid stating a duration unless corrected in Cal.com.
- YouTube demo: https://youtube.com/shorts/Ia0wtpAQp3E
- Preserve contact, social, booking, video, SEO, security headers, and existing routes unless an approved change requires otherwise.
- Do not fabricate testimonials, customer names, ratings, logos, or outcome metrics.

## Isolated development environment
- Git branch: `quae/3d-preview-qa`, created from `main`.
- Preview Worker: `stackproof-ai-preview`.
- Intended preview URL: https://stackproof-ai-preview.stackproofai.workers.dev/
- Preview Worker is a separate script cloned from production source; it has a `noindex,nofollow` meta directive and a robots.txt disallow rule in source.
- Preview deployment version: `d6378d28-e5d7-4a34-8b5f-e1424f5ff3c0`.
- Preview browser response and rendered experience remain NOT TESTED. Do not treat the preview as verified or production-ready.

## Operating rules
Use incremental changes, reversible deployments, evidence-based QA, and explicit PASS / FAIL / BLOCKED / NOT TESTED reporting. Never claim runtime behavior or performance scores without execution evidence. Production deployment requires explicit approval.
