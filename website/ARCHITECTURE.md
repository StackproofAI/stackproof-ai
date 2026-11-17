# STACKPROOF AI Website — Architecture

## Production runtime
- Cloudflare Worker: `stackproof-ai-site`.
- Public URL: https://stackproof-ai-site.stackproofai.workers.dev
- GitHub source: `website/public/index.html`, `website/public/style.css`, `website/public/script.js`, `website/public/favicon.svg`.
- Existing embedded HTML/CSS/JS Worker deployment is preserved; no hosting migration in this release.
- Three.js is loaded as a pinned ES module from jsDelivr. React/Vite/R3F were not introduced because they require a separate build/deployment migration not needed for this visual redesign.

## Design and interaction
- Graphite `#0B0F14`, slate `#6F7F90`, electric lime `#C8FF3D`.
- New editorial agency layout, glass navigation, fine-line grids, drafting circles, coordinates, and isometric 3D stack/checkmark mark.
- Three.js scene: extruded bevelled planes, metallic materials, lighting, orbit rings, constellation points, pointer parallax.
- Pixel ratio capped at 2; animation pauses offscreen/hidden; reduced-motion disables continuous animation; context loss or CDN failure uses CSS fallback.
- Existing site copy, sections, services, process, testimonials, assessment, FAQs, founder, video, Cal.com booking, contact details, social links, legal footer and route endpoints are retained.

## Routes
`/`, `/index.html`, `/style.css`, `/script.js`, `/favicon.svg`, `/robots.txt`, `/sitemap.xml`, `/health`.

## Security
- Retains security response headers.
- CSP permits the pinned Three.js module host; YouTube privacy-enhanced and Cal.com remain the only iframe origins.
- No API keys or secrets added to frontend.

## Release QA
See `TEST_RESULTS.md`. Live rendering, 3D module runtime, mobile visual review, provider end-to-end and Core Web Vitals must be tested before claiming full production QA.
