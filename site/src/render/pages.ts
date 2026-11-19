import { SITE, type Locale } from '../content/en.ts';
import { axis, dotRun, goldenSpiral, hexNode, orbit, rays, regMark, svg, terminal } from '../geometry/primitives.ts';
import { esc, head, page } from './layout.ts';
import { markSvg } from './mark.ts';

/* ───────────── Privacy (DRAFT — lawyer review required) ───────────── */
/** Privacy copy is legal text and stays here as one block so a lawyer can review it in one place.
 *  Every [PLACEHOLDER]/[REVIEW] marker is listed in PLACEHOLDERS.md. */
const PRIVACY_SECTIONS: Array<[string, string]> = [
  ['Who is responsible', `<p>This website is operated by Stackproof AI. <mark>[PLACEHOLDER: full legal name of the entity, postal address, and whether an EU/UK representative is required (lawyer)]</mark></p><p>Contact for privacy questions: <a href="mailto:${SITE.contactEmail}">${SITE.contactEmail}</a>.</p>`],
  ['What this website collects', `<p>This website has no forms and sets no cookies. It does not ask you for personal information.</p>`],
  ['Booking an assessment call (Cal.com)', `<p>When you choose to book a call, you leave this website for Cal.com, which handles the booking under its own privacy policy. We receive the details you enter there (such as your name, email address and any notes) and use them only to hold the call, prepare your written summary and follow up about it. <mark>[REVIEW: legal basis under GDPR and retention period for booking details (lawyer)]</mark></p>`],
  ['If you email us', `<p>If you email us, we use your message and address only to reply and to prepare any assessment you ask for. <mark>[REVIEW: retention period (lawyer)]</mark></p>`],
  ['Website analytics', `<p>We use Cloudflare Web Analytics to count visits. It does not use cookies and does not track you across sites. <mark>[REVIEW (lawyer)]</mark></p>`],
  ['Demo video (YouTube)', `<p>The demo video is not loaded until you click it. When you do, it plays from YouTube in privacy-enhanced mode (youtube-nocookie.com), and Google processes data under its own privacy policy.</p>`],
  ['Hosting', `<p>This website is served by Cloudflare. Like any web server, Cloudflare processes technical data such as your IP address to deliver the page and protect it against abuse. <mark>[REVIEW: Cloudflare data processing terms and EU/UK transfer mechanism (lawyer)]</mark></p>`],
  ['Your rights', `<p>Depending on where you live, you may have the right to access, correct, delete or export your personal data, to object to or restrict its processing, and to withdraw consent at any time. Residents of the EU/EEA and UK may also complain to their local data protection authority. California residents have rights under the CCPA/CPRA, including the right to know, delete and correct personal information. We do not sell or share personal information. <mark>[REVIEW: complete GDPR and CCPA/CPRA disclosures (lawyer)]</mark></p><p>To use any of these rights, email <a href="mailto:${SITE.contactEmail}">${SITE.contactEmail}</a>.</p>`],
  ['Changes', `<p>We will update this page if our practices change. The date at the top shows the latest version.</p>`],
];

export function renderPrivacy(t: Locale): string {
  const h = head(t, { title: t.meta.privacyTitle, description: t.meta.privacyDescription, path: '/privacy/', noindex: true });
  const body = `<section class="section legal" aria-labelledby="legal-title">
  <div class="wrap legal-wrap">
    <p class="label mono">${t.privacy.label}</p>
    <h1 id="legal-title" class="h2">${t.privacy.title}</h1>
    <p class="draft-banner mono" role="note">${t.privacy.draftBanner}</p>
    <p class="mono legal-updated">${t.privacy.updated}</p>
    ${PRIVACY_SECTIONS.map(([hh, b]) => `<h2 class="h3">${hh}</h2>${b}`).join('\n')}
  </div>
</section>`;
  return page(t, h, body, { onHome: false, bodyClass: 'legal-page' });
}

/* ───────────── 404 ───────────── */
export function renderNotFound(t: Locale): string {
  const h = head(t, { title: t.meta.notFoundTitle, description: t.notFound.text, path: '/404', noindex: true });
  // A stack that never got its check: three hairline layers, offset, unverified.
  const art =
    orbit(200, 200, 170, 170, { tone: 'steel' }) +
    hexNode(200, 200, 120, { tone: 'steel', rings: 2 }) +
    `<path class="g-line g-steel" d="M110 120l90-40 90 40-90 40z"/><path class="g-line g-steel g-faint" d="M110 168l90 40 90-40"/><path class="g-line g-steel g-faint" d="M110 206l90 40 90-40"/>` +
    `<path class="g-line g-lime" d="M176 112l18 14 30-26" stroke-dasharray="4 6"/>` +
    regMark(30, 30) + regMark(370, 30) + regMark(30, 370) + regMark(370, 370) + axis(200, 0, 26) + axis(200, 374, 400);
  const body = `<section class="section notfound" aria-labelledby="nf-title">
  <div class="wrap nf-grid">
    <div>
      <p class="label mono">${t.notFound.label}</p>
      <h1 id="nf-title" class="h2">${t.notFound.title}</h1>
      <p class="lead">${t.notFound.text}</p>
      <a class="btn btn-primary" href="/">${t.notFound.back}</a>
    </div>
    ${svg('0 0 400 400', art, 'nf-art')}
  </div>
</section>`;
  return page(t, h, body, { onHome: false, script: false });
}

/* ───────────── Styleguide (noindex; internal) ───────────── */
export function renderStyleguide(t: Locale): string {
  const h = head(t, { title: t.meta.styleguideTitle, description: 'Internal styleguide', path: '/_styleguide/', noindex: true });
  const sw = (name: string, v: string, note: string) =>
    `<li class="sw"><span class="sw-chip" style="background:var(${name})"></span><span class="mono">${name}</span><span class="mono sw-v">${v}</span><span class="sw-n">${note}</span></li>`;
  const prim = (title: string, meaning: string, art: string, vb = '0 0 200 200') =>
    `<figure class="prim card">${svg(vb, art, 'prim-svg')}<figcaption><strong>${title}</strong><span>${meaning}</span></figcaption></figure>`;
  const body = `<section class="section sg">
  <div class="wrap">
    <p class="label mono">Internal · noindex</p>
    <h1 class="h2">Styleguide</h1>

    <h2 class="h3 sg-h">Mark</h2>
    <div class="sg-marks">
      <div class="card sg-mark">${markSvg('sg-mark-lg', 'Stackproof AI')}</div>
      <div class="card sg-mark sg-mark-row">${markSvg('sg-mark-sm')}${markSvg('sg-mark-xs')}<span class="brand-word">STACKPROOF<span class="brand-ai"> AI</span></span></div>
    </div>

    <h2 class="h3 sg-h">Colour tokens (WCAG contrast on --sp-void)</h2>
    <ul class="sw-list" role="list">
      ${sw('--sp-lime', '#CEF949', 'Accent, CTAs, active lines · 16.8:1')}
      ${sw('--sp-steel', '#75879A', 'Secondary, metadata · 5.5:1 (AA)')}
      ${sw('--sp-void', '#040508', 'Base background')}
      ${sw('--sp-ink-1', '#0B0D12', 'Raised surfaces')}
      ${sw('--sp-ink-2', '#12151C', 'Raised surfaces, hover')}
      ${sw('--sp-text', '#E8ECEF', 'Body text · 17.2:1')}
      ${sw('--sp-muted', '#9AA8B6', 'Secondary text · 8.4:1')}
      ${sw('--sp-line', 'lime 45%', 'Hairline geometry')}
    </ul>

    <h2 class="h3 sg-h">Type</h2>
    <div class="card sg-type">
      <p class="eyebrow mono">Eyebrow · Geist Mono</p>
      <p class="hero-title" style="margin:0">Display / H1 · Geist</p>
      <p class="h2">Heading 2</p>
      <p class="h3">Heading 3</p>
      <p class="lead">Lead paragraph. Real text only, AA contrast, 65–72ch measure.</p>
      <p>Body text. The quick brown fox jumps over the lazy dog. Ä Ö Ü ß ä ö ü — German-ready subset.</p>
      <p class="mono">Mono label · 0123456789 · S1 → S2 → S3</p>
    </div>

    <h2 class="h3 sg-h">Buttons &amp; states</h2>
    <div class="card sg-btns">
      <a class="btn btn-primary btn-lg" href="#">${t.cta.primary}</a>
      <a class="btn btn-ghost btn-lg" href="#">${t.cta.secondary}</a>
      <a class="btn btn-primary btn-sm" href="#">${t.nav.cta}</a>
      <a class="text-link" href="#">Text link</a>
      <span class="status status-live mono">${t.systems.statusLive}</span>
      <span class="status status-roadmap mono">${t.systems.statusRoadmap}</span>
    </div>

    <h2 class="h3 sg-h">Geometry primitives</h2>
    <div class="prim-grid">
      ${prim('hexNode', 'A system', hexNode(100, 100, 70, { tone: 'lime', rings: 2 }) + regMark(20, 20) + regMark(180, 180))}
      ${prim('rays', 'Data flowing to a decision', `<rect class="g-line g-steel" x="120" y="60" width="70" height="70"/>` + rays(30, 150, [[120, 60], [155, 60], [190, 60], [190, 95], [190, 130]], { tone: 'lime' }))}
      ${prim('goldenSpiral', 'Compounding results', goldenSpiral(10, 40, 180, 7).join(''))}
      ${prim('orbit', 'Automations running in the background', orbit(100, 100, 80, 80, { tone: 'steel' }) + orbit(100, 100, 52, 52, { tone: 'lime', gap: 10 }) + terminal(180, 100, 'dot'))}
      ${prim('regMark · terminals', 'Measured, verified points', regMark(50, 100, 10) + terminal(100, 100, 'dot', 4) + terminal(150, 100, 'diamond', 4))}
      ${prim('axis · dotRun', 'Long axis ties clusters together; data in transit', axis(40, 10, 190, 5) + dotRun(60, 100, 190, 100, 'lime'))}
    </div>
  </div>
</section>`;
  return page(t, h, body, { onHome: false, bodyClass: 'styleguide', script: false });
}

export { esc };
