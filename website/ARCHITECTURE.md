# STACKPROOF AI Website — Architecture

## Runtime
A single Cloudflare Worker handles HTTP routing and returns the public website. The deployed Worker embeds HTML, CSS, JavaScript, and SVG favicon content as strings. There is no React, Next.js, Pages build, package manager, or third-party frontend dependency in the production runtime.

## Routes
- `/` and `/index.html`: HTML document.
- `/style.css`: stylesheet.
- `/script.js`: client-side interactions and WebGL renderer.
- `/favicon.svg`: brand favicon.
- `/robots.txt`: crawler instructions.
- `/sitemap.xml`: sitemap.
- `/health`: plain-text health response.
- Other paths: 404.

## 3D experience
- Custom WebGL 1 renderer; no Three.js or React Three Fiber dependency.
- Procedurally generated UV sphere mesh, two orbit lines, and connected node points.
- Pointer movement changes the viewing orientation.
- Animation is paused when the visual is outside the viewport or the browser tab is hidden.
- Mobile rendering uses lower geometry density and a lower device-pixel-ratio cap.
- `prefers-reduced-motion: reduce` disables continuous animation while retaining direct pointer interaction.
- If WebGL is unavailable or shader initialization fails, a CSS 3D-style visual fallback remains visible.

## Content and UX
- Conventional anchor navigation remains available.
- Mobile navigation is an accessible disclosure button.
- Core content is ordinary semantic HTML and remains readable without WebGL.
- Cal.com and YouTube are embedded in their existing sections.
- Reveal transitions are progressive enhancement; content remains visible when JavaScript or IntersectionObserver is unavailable.

## Security headers
The Worker sets:
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- A Content Security Policy restricting scripts/styles to same-origin and frames to YouTube's privacy-enhanced host and Cal.com.
- HSTS for HTTPS.

Review CSP and embedded-provider behavior during browser QA before production release.

## Deployment
Cloudflare Worker versions are staged separately from traffic deployments. Version 12 is the current 3D candidate; the previous production version remains version 8. Versions 9 and 10 were earlier staged candidates; version 10 was superseded after a WebGL shader precision mismatch was found during browser QA. Promotion and rollback are separate deployment operations.
