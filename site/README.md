# Stackproof AI website v2

Static-first marketing site on **Cloudflare Workers with Static Assets**, built with Vite + TypeScript and the Cloudflare Vite plugin. The old site (`../website/`, Worker `stackproof-ai-site`) is untouched.

Status: **static site complete (no lead form, by owner decision); preview deploy pending a working Cloudflare API token.**

## Develop

```bash
cd site
npm install
npm run dev          # Vite dev server, Worker runs in workerd
npm run typecheck
npm run build        # → dist/client (assets) + dist/stackproof_ai_site_v2 (Worker + generated wrangler.json)
npm run preview      # serve the production build locally in workerd
```

## Change copy

- **All visible text is in `src/content/en.ts`.** Edit it and the dev server restarts automatically.
- Lines marked `// supplied` are George's copy (brief §11). Lines marked `// draft` need sign-off (`PLACEHOLDERS.md`).
- Legal text (privacy draft) lives in `src/render/pages.ts`, so a lawyer can review it in one place.
- Adding German later: copy `en.ts` to `de.ts`, translate, add a `/de/` entry in `vite.config.ts`, and add `hreflang` links in `src/render/layout.ts`.

## Structure

| Path | What |
|---|---|
| `src/content/en.ts` | Locale: every UI string |
| `src/render/*.ts` | Build-time HTML renderers (home, privacy, 404, styleguide) |
| `src/geometry/primitives.ts` | "Proof geometry" SVG primitives (hexNode, rays, goldenSpiral, orbit, regMark, axis, dotRun) |
| `src/styles/` | Tokens, base, layout, sections, form |
| `src/ui/`, `src/form/` | Small client scripts (nav, constellation, click-to-load video, form validation) |
| `public/_headers` | CSP + security headers, cache rules |
| `brand/` | Approved master mark (`stackproof-mark.svg`), source PNG, fitting scripts |
| `scripts/` | Image generation (favicons, OG) and screenshot tools |

## No forms, no backend
Assets only: no Worker script, database or secrets. The main CTA opens Cal.com. Bookings and contact details live in your Cal.com dashboard.

## Deploy

`npm run deploy:preview` builds and deploys Worker `stackproof-ai-site-v2` (assets only) to workers.dev. It needs `CLOUDFLARE_API_TOKEN` (Workers Scripts: Edit, Account Settings: Read). The live site `stackproof-ai-site` is a separate Worker and isn't touched.

Regenerate icons and the OG image after changing the mark or headline: `node scripts/make-images.mjs`.
