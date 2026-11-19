# Stackproof AI website v2

Static-first marketing site on **Cloudflare Workers with Static Assets**, built with Vite + TypeScript and the Cloudflare Vite plugin. The old site (`../website/`, Worker `stackproof-ai-site`) is untouched.

Status: **checkpoint 4 (lead form built and tested locally; not deployed yet).**

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
| `worker/index.ts` | Worker: only `/api/*` runs here (`run_worker_first`) |
| `public/_headers` | CSP + security headers, cache rules |
| `brand/` | Approved master mark (`stackproof-mark.svg`), source PNG, fitting scripts |
| `scripts/` | Image generation (favicons, OG) and screenshot tools |

## Lead form

- Endpoint: `POST /api/lead` (`worker/lead.ts`). Order: rate limit → honeypot → validation → Turnstile (server-side) → D1 insert. Duplicates are prevented by a unique index on (`email_normalised`, `submit_date`).
- Schema: `migrations/0001_leads.sql`.
- Local testing: `.dev.vars` uses Turnstile's always-pass **test** secret. The sandbox can't reach Cloudflare, so run `node scripts/mock-siteverify.mjs` too.

```bash
npx wrangler d1 migrations apply stackproof-leads-preview --local
node scripts/mock-siteverify.mjs &   # local only
npm run build && npm run preview
```

### Read and export leads
- Private page: Worker `stackproof-leads-admin` (`admin-worker/`), protected by Cloudflare Access, with a CSV link.
- CLI: `npx wrangler d1 execute stackproof-leads-preview --remote --command "SELECT created_at,name,email,company,status FROM leads ORDER BY created_at DESC"`

### Retention (24 months)
`npx wrangler d1 execute stackproof-leads --remote --command "DELETE FROM leads WHERE created_at < datetime('now','-24 months')"`

### Secrets (never in the repo)
`npx wrangler secret put TURNSTILE_SECRET` (preview: Turnstile test secret; production: the real secret).

## Deploy

Not deployed yet. Planned for checkpoint 5: `npm run deploy:preview` deploys Worker `stackproof-ai-site-v2` to workers.dev. Secrets, D1 and Turnstile setup will be documented at checkpoint 4.

Regenerate icons and the OG image after changing the mark or headline: `node scripts/make-images.mjs`.
