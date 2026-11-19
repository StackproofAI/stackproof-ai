# Stackproof AI website v2: Plan (Checkpoint 1)

Status: **awaiting George's approval.** No site code has been written and nothing has been deployed. The live Worker `stackproof-ai-site` has not been touched.

Date: 2026-11-19

---

## 1. What I checked, and how

| Item | How it was checked | Result |
|---|---|---|
| Live site content | Pulled the deployed Worker source via the Cloudflare API (`stackproof-ai-site`). Direct HTTP fetch is blocked by this environment's network. | The live site differs from `website/public/` in the repo. The repo copy is older. Inventory is in §3. |
| Cloudflare account | Cloudflare API | 1 Worker (`stackproof-ai-site`), **0 D1 databases**. Nothing is in the way of a new `-v2` Worker. |
| Workers Static Assets config | Cloudflare docs (Wrangler configuration, Static Assets, Vite plugin) | `assets.directory`, `not_found_handling: "404-page"` and `run_worker_first: ["/api/*"]` (array form) are all current. Set `compatibility_date` on deploy day. |
| Email from a Worker | Cloudflare Email Service docs (send bindings, limits, pricing) | `send_email` binding with `destination_address` restricts the binding to one address. Sending to a **verified destination address is free on every plan**. The **sender must be on a domain using Cloudflare DNS with Email Routing on**. **A workers.dev address cannot send email.** |
| Rate limiting | Workers Rate Limiting binding docs (GA since Sep 2025) | `ratelimits` binding: `namespace_id` (integer as a string), `simple.limit`, `simple.period` of **10 or 60 s only**. Counts are **per Cloudflare location and approximate**, which is fine as an anti-spam layer. Plan availability is unconfirmed; I'll check it on first deploy. |
| Cloudflare Access | Workers docs and changelog (one-click Access, Oct 2025; reusable policies, Dec 2025) | On **workers.dev, Access protects the whole Worker URL, not a single path.** On a custom domain, a path-scoped Access app (e.g. `/admin`) is possible. The docs say the Worker must also **validate the `Cf-Access-Jwt-Assertion` JWT**. → architecture decision D-04 |
| Turnstile | Turnstile docs | Server-side Siteverify is mandatory. Test keys: sitekey `1x00000000000000000000AA` / secret `1x0000000000000000000000000000000AA` (always pass) and `2x…AB` / `2x…AA` (always fail). Test secrets accept only the dummy token, and test responses always return hostname `example.com`. I'll check the hostname only with real keys. |
| Package versions (npm registry, today) | `npm view` | vite 8.3.8 · @cloudflare/vite-plugin 1.70.1 · wrangler 4.165.0 · three 0.187.0 (MIT) · gsap 3.15.1 · lenis 1.3.27 (MIT) · @fontsource-variable/geist and geist-mono 5.3.0 (OFL) · typescript 7.0.2 · Node 22.23 |
| GSAP license | npm metadata says "Standard 'no charge' license". | **Not fully verified:** the gsap.com licensing page is blocked by this environment's network. I'll recheck before launch, or you can open https://gsap.com/licensing/ once. |
| Brand contrast (WCAG 2.x) | Computed | lime/void 16.8:1 · steel/void 5.5:1 · steel/ink-1 5.3:1 · text/void 17.2:1 · void on lime button 16.8:1. **All pass AA, so no token changes are needed.** Steel works for small metadata text; it's AA but not AAA. |
| Cal.com visitor time zones | Not verifiable from here (network). | The current site already claims local-time display. **I'll verify it in a real browser at checkpoint 5**; until then the site won't state it. |

Not yet checked, because each belongs to a later checkpoint: Lenis/ScrollTrigger sync API details (3), SplitText/DrawSVG current API (3), Cloudflare Web Analytics snippet and CSP hosts (5).

---

## 2. Architecture

```
site/                         ← new build (repo's old website/ folder is left untouched)
├─ src/
│  ├─ index.html              single page; all copy pre-rendered at build time from locales
│  ├─ privacy/index.html      legal (marked "draft – lawyer review")
│  ├─ 404.html                geometry 404
│  ├─ _styleguide/index.html  tokens + primitives (noindex; removed or Access-gated at launch)
│  ├─ locales/en.ts           EVERY UI string; de.ts added later at /de/
│  ├─ styles/                 tokens.css, base.css, sections/*.css
│  ├─ geometry/               SVG primitives (hex, rays, spiral, orbit, regmark, terminals)
│  ├─ motion/                 gsap + lenis setup, per-section timelines, reduced-motion gate
│  ├─ three/                  lazy hero module (only imported after first paint + capability probe)
│  └─ form/                   client form logic (validation, Turnstile lazy-load, states)
├─ worker/
│  ├─ index.ts                routes /api/lead only; everything else is static assets
│  ├─ lead.ts                 validate → Turnstile → rate limit → D1 insert → email (best effort)
│  └─ schema.sql              D1 migration
├─ admin-worker/              separate Worker "stackproof-leads-admin" (see D-04)
├─ wrangler.jsonc             env: preview (default) and production
└─ docs: PLAN.md, DECISIONS.md, PLACEHOLDERS.md, COPY-SUGGESTIONS.md, README.md
```

**Static-first.** Every word of copy is in the HTML at build time (SEO, LCP, no-JS readability). JS only adds motion and handles the form.

**Wrangler config (draft, to verify again at checkpoint 4):**
```jsonc
{
  "name": "stackproof-ai-site-v2",
  "main": "./worker/index.ts",
  "compatibility_date": "<deploy date>",
  "assets": { "not_found_handling": "404-page", "run_worker_first": ["/api/*"] },
  "d1_databases": [{ "binding": "DB", "database_name": "stackproof-leads-preview", "database_id": "…" }],
  "ratelimits": [{ "name": "LEAD_RL", "namespace_id": "2001", "simple": { "limit": 5, "period": 60 } }],
  // only if a Cloudflare domain exists:
  "send_email": [{ "name": "LEAD_MAIL", "destination_address": "<George's verified address>" }],
  "preview_urls": false,
  "env": { "production": { /* separate D1, real Turnstile site key, its own namespace_id */ } }
}
```
With the Cloudflare Vite plugin, `assets.directory` comes from the Vite client build output, so the plugin sets it. I'll confirm the exact behaviour when I scaffold.

**Lead path:** `POST /api/lead` → honeypot (silent 200) → rate limit by `CF-Connecting-IP` (429) → schema validation and normalisation (400 with field errors) → Turnstile Siteverify, 5 s timeout (403) → `INSERT … ON CONFLICT (email_normalised, submit_date) DO NOTHING` → if a row was inserted and email is configured, send email inside try/catch and log failure → 200 `{status:"saved"|"duplicate"}`. D1 error → 503 with an honest message and the contact email. Only "saved" or "duplicate" ever shows the thank-you screen.

**Budget plan:** H1 text is the LCP element (no image or canvas in the LCP path). Initial JS is GSAP core + ScrollTrigger + SplitText + DrawSVG + Lenis + form logic, estimated 60–75 KB gz against the 150 KB budget. The 3D chunk (three + SVGLoader + ExtrudeGeometry, tree-shaken) is estimated at 130–170 KB gz against 350 KB. Turnstile loads only when the form nears the viewport. Fonts: 2 variable woff2 files, latin + latin-ext (covers ä ö ü ß), preloaded.

---

## 3. Current live site: keep / drop (recommendation)

| Element on the live site | Recommendation | Why |
|---|---|---|
| Stackproof logo (inline SVG, colours `#c8ff3d` / `#8795a8`) | **Replace with your master file.** | The live mark's colours don't match the brief's sampled `#CEF949` / `#75879A`, which suggests it's already a rebuild. |
| "BOOK YOUR FREE AUTOMATION ASSESSMENT" CTAs → Cal.com | **Change** to the form-first flow. | That's your brief: written-first because of the UTC+8 gap. |
| Problem section ("Too much manual work…") | Keep the idea; rewrite into the new Problem section. | Same job. |
| S1–S10 systems list | Keep, rebuilt as the constellation with honest status labels. | Brief §4.4 |
| "What happens after you book?" 4 steps | Replace with the brief's 4 steps (request → review → written summary → optional call). | The flow has changed. |
| **Testimonials: Ross Gerber (Gerber Kawasaki), Jaqueline PerezCarranza, Cisco Adler (Synqabl)** | **Remove until you confirm each one in writing.** | All three are named people. One is a well-known public figure. They praise the *approach*, not results. If any lacks explicit permission, that's a legal and trust risk. See Q5. |
| YouTube S1+S2 demo (Short `Ia0wtpAQp3E`) | **Keep** in the Proof section as a click-to-load poster; youtube-nocookie loads only on click. | It's the only visual evidence of S1/S2. |
| "PROMPT OR PERISH" book (Gumroad) | **Keep, but demote**: a compact block below the FAQ, or a footer link. | Next to the CTA it competes with the free assessment (a second, paid offer). |
| LinkedIn, Instagram, GitHub | Footer | GitHub is a docs repo, so it's useful only to technical buyers; footer only. |
| Phone +1 (424) 434-8474 (repo version) | **Drop** unless you want it. | You're in UTC+8 and the brief says "don't promise live response". A US number invites calls you can't take. See Q7. |
| Contact `soulectiv3@gmail.com` | Ask | A Gmail address on the parent LLC name looks less credible than `hello@<domain>`. See Q3. |
| "trade name of Soulectiv3 LLC · Malibu, California" | Keep **if** accurate. | Needed for legal and privacy pages. See Q4. |

---

## 4. Positioning options (pick one)

All three keep the CTA **"Get Your Free Automation Assessment"** and the secondary **"See how it works"**. None claims client results.

**A. Outcome-first (recommended)**
- **H1:** Find the work your business should stop doing by hand.
- **Sub:** A free, written Automation Opportunity Assessment for small and mid-sized businesses in the US and Europe. Tell us how your team works today; we send back your top automation opportunities and a practical first step. No call required, no obligation.
- Why: answers *what / for whom / what next* in 5 seconds; "written, no call required" removes the biggest friction for a UTC+8 owner selling to US/EU buyers.

**B. Proof-first (leans on the "stackproof" idea)**
- **H1:** Automation you can verify before you rely on it.
- **Sub:** Stackproof AI designs automation for lead management, follow-up and admin with validation, logging and human approval built in. Start with a free written assessment of where it would actually help your business.
- Why: strongest brand fit and differentiator. Weaker on the 5-second "what do I get" test, because the offer only appears in the subline.

**C. Pain-first (real estate and professional services)**
- **H1:** Leads, follow-up and admin, handled without adding headcount.
- **Sub:** For real estate teams and professional services firms buried in repetitive work. Request a free Automation Opportunity Assessment: we review your workflows and tools and send a written plan for what to automate first.
- Why: most concrete for your two initial verticals. Risk: "without adding headcount" brushes against the FAQ's "not replacing employees" stance, so I'd soften it if chosen.

---

## 5. Things in your brief I'm challenging (rule 4)

1. **`detect-gpu`** fetches its benchmark data from a CDN (unpkg) at runtime. That breaks your "no non-Cloudflare request on page load" test. **Proposal:** a ~1 KB in-house capability probe instead (WebGL2 available, `deviceMemory`, `saveData`, reduced motion, plus a 30-frame frame-time test once the 3D chunk loads, falling back to SVG if frames run > 22 ms). Logged as D-06.
2. **`/admin` on workers.dev:** Access can't gate one path of a workers.dev Worker without gating the whole public site. **Proposal:** a separate small Worker `stackproof-leads-admin` (own workers.dev URL, Access on with one click, JWT validated in code, read-only lead list + CSV export) bound to the same D1. Same design later on a custom domain, e.g. `leads.<domain>`. Logged as D-04.
3. **S1/S2 status conflict.** Your brief says S1 + S2 "run in production in Stackproof's own operation". Your own repo (`docs/SYSTEM_STATUS.md`, `README.md`, updated 2026-11-17) says "Existing core development" and calls the video "not independent proof of production deployment". The site must not say more than you can back up. **I need you to confirm which is true today** (Q1). If it's production, update the repo docs too, so a buyer who clicks the GitHub link doesn't see a contradiction.
4. **Pinned spiral sequence (How we work).** Seven pinned stages is a lot of scroll on a conversion page. **Proposal:** pin for at most about 1.5 viewport heights total on desktop, keep a visible "skip to assessment" link, and use no pinning on mobile or reduced motion (as you specified). I'll show you the feel at checkpoint 3.
5. **Lenis smooth scroll** typically costs some INP and accessibility headroom. I'll implement it as you asked, but measure INP with and without it at checkpoint 3 and drop it if it costs > 30 ms.

---

## 6. Open questions: blocking items I need before checkpoint 2

| # | Question | Blocks |
|---|---|---|
| Q1 | S1 + S2 status today: "live in our own operation" (as in your brief) or "in core development" (as in your repo)? Exact wording you approve? | Proof section, constellation labels |
| Q2 | Pick positioning **A, B or C** (or mix). | Hero, meta |
| Q3 | Contact email for the site and footer (currently `soulectiv3@gmail.com`)? Lead-notification email (can be the same)? | Footer, error state, email binding |
| Q4 | Legal entity and address to publish: is "Soulectiv3 LLC, Malibu, California" correct? Do you want an Impressum (for German buyers it's often expected even if not strictly required for a US LLC; this needs a lawyer's view)? | Privacy page, footer, JSON-LD |
| Q5 | Each testimonial (Ross Gerber, Jaqueline PerezCarranza, Cisco Adler): real, and **written permission** to publish name, title and company? | Proof section |
| Q6 | Cal.com link `cal.com/sean-fields-qf4rle/20-min`: is this your calendar? If not, the correct link. | Thank-you screen, secondary CTA |
| Q7 | Keep the phone number? (I recommend no.) | Footer |
| Q8 | Show your name and photo? If yes, send a photo (I recommend yes: name, photo, one line, "you'll work with me directly"). | Offer/Final CTA section |
| Q9 | Assessment details: how many opportunities, whether hours-saved estimates are included, and turnaround in business days? Until confirmed, the site says "your top automation opportunities" with no number and no turnaround. | Offer section, FAQ |
| Q10 | Custom domain? Is its DNS on Cloudflare? **Without one: no lead emails, and leads are checked via the admin Worker only.** | Checkpoint 4 (not blocking now) |
| Q11 | **Assets:** the logo (SVG or PNG) and the two line-art reference images weren't attached to this session. Please upload them. Until then I'll work from the live site's inline SVG as a stand-in and won't finalise the 3D extrusion. | Checkpoint 2 brand step |
| Q12 | Keep the Prompt or Perish book on the site (demoted below the FAQ)? | Layout |

Non-blocking, with defaults I'll use unless you say otherwise: size band 10–250 employees; no prices; US spelling; leads kept 24 months, cleanup documented as a manual command (no Cron); Cloudflare Web Analytics on.

---

## 7. Next action

You answer Q1–Q9, Q11 and Q12 (Q10 can wait until checkpoint 4) → I start checkpoint 2: brand tokens, logo comparison, geometry primitives on `/_styleguide`, then every section static and responsive, Lighthouse run, critic round 1.
