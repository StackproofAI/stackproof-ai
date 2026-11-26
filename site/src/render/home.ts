import { SITE, type Locale } from '../content/en.ts';
import { axis, dotRun, goldenSpiral, hexNode, hexPath, orbit, rays, regMark, svg, terminal } from '../geometry/primitives.ts';
import { esc, ext, head, page } from './layout.ts';
import { layeredMark } from './mark.ts';

const pad2 = (n: number) => String(n).padStart(2, '0');

/* ───────────────────────── Hero ───────────────────────── */
function heroArt(t: Locale): string {
  const C = 320;
  // rays from the mark's centre to registration points on the orbit
  const targets: Array<[number, number]> = [-150, -110, -62, -20, 28, 205, 245].map((deg) => {
    const a = (deg * Math.PI) / 180;
    return [C + 268 * Math.cos(a), C + 268 * Math.sin(a)];
  });
  const inner =
    orbit(C, C, 268, 268, { tone: 'steel', cls: 'hero-orbit' }) +
    orbit(C, C, 214, 214, { tone: 'lime', gap: 11, cls: 'hero-orbit2' }) +
    `<circle class="g-line g-steel g-faint" cx="${C}" cy="${C}" r="300"/>` +
    targets.map(([x, y]) => { const a = Math.atan2(y - C, x - C); return rays(C + 150 * Math.cos(a), C + 150 * Math.sin(a), [[x, y]], { tone: 'lime', cls: 'hero-ray' }); }).join('') +
    axis(C, 0, 36, 0) +
    axis(C, 604, 640, 0) +
    regMark(40, 40) + regMark(600, 40) + regMark(40, 600) + regMark(600, 600) +
    hexNode(78, 470, 26, { tone: 'steel', cls: 'hero-hex' }) +
    hexNode(566, 150, 18, { tone: 'steel', rings: 0, cls: 'hero-hex' }) +
    `<defs><radialGradient id="hero-glow-g"><stop offset="0" stop-color="#C6FF00" stop-opacity=".22"/><stop offset="1" stop-color="#C6FF00" stop-opacity="0"/></radialGradient></defs>` +
    `<circle class="hero-glow" cx="${C}" cy="${C}" r="200" fill="url(#hero-glow-g)"/>` +
    `<circle class="g-line g-lime g-thick hero-proof" cx="${C}" cy="${C}" r="178" transform="rotate(-90 ${C} ${C})"/>` +
    `<g transform="translate(212 212) scale(1.08)">${layeredMark()}</g>`;
  return `<figure class="hero-art" data-hero-art>
  ${svg('0 0 640 640', inner, 'hero-svg', t.hero.markLabel)}
  <div class="hero-canvas" data-hero-canvas aria-hidden="true"></div>
</figure>`;
}

function hero(t: Locale): string {
  return `<section class="hero" aria-labelledby="hero-title">
  <div class="wrap hero-grid">
    <div class="hero-copy">
      <p class="eyebrow mono">${t.hero.eyebrow}</p>
      <h1 id="hero-title" class="hero-title">${t.hero.title}</h1>
      <p class="hero-sub">${t.hero.sub}</p>
      <div class="cta-row">
        ${calBtn(t)}
        <a class="btn btn-ghost btn-lg" href="#how">${t.cta.secondary}</a>
      </div>
      <ul class="hero-facts mono" role="list">${t.hero.facts.map((f) => `<li>${f}</li>`).join('')}</ul>
    </div>
    ${heroArt(t)}
  </div>
</section>`;
}

/* ───────────────────────── Problem ───────────────────────── */
function problemDiagram(t: Locale): string {
  const xs = [80, 270, 460, 640], y = 96;
  const d = t.problem.diagram;
  let s = '';
  // fixed path (final state)
  for (let i = 0; i < 3; i++) {
    s += `<path class="g-line g-lime g-draw flow-seg" data-seg="${i}" d="M${xs[i] + 36} ${y}H${xs[i + 1] - 36}"/>`;
    s += terminal(xs[i + 1] - 40, y, 'diamond', 2.6);
  }
  // the old manual detour (ghost, crossed out)
  s += `<path class="g-dots g-steel flow-ghost" stroke-dasharray="0.01 6" d="M${xs[1]} ${y + 36}C${xs[1]} ${y + 92} ${xs[2]} ${y + 92} ${xs[2]} ${y + 36}"/>`;
  s += `<text class="g-text g-steel flow-ghost" x="${(xs[1] + xs[2]) / 2}" y="${y + 96}" text-anchor="middle">${d.gap}</text>`;
  s += `<path class="g-line g-steel flow-ghost" d="M${(xs[1] + xs[2]) / 2 - 46} ${y + 92}H${(xs[1] + xs[2]) / 2 + 46}"/>`;
  xs.forEach((x, i) => {
    s += hexNode(x, y, 34, { tone: i === 3 ? 'lime' : 'steel', rings: 1, crosshair: i !== 3 });
    s += `<text class="g-text g-ink" x="${x}" y="${y - 50}" text-anchor="middle">${d.nodes[i]}</text>`;
  });
  // check at the end: verified
  s += `<path class="g-line g-lime g-thick flow-check" d="M${xs[3] - 12} ${y}l8 8 16-16"/>`;
  s += `<text class="g-text g-lime flow-check" x="${xs[3]}" y="${y + 58}" text-anchor="middle">${d.check}</text>`;
  s += regMark(14, 14) + regMark(706, 14);
  // Vertical variant for narrow screens (same meaning, readable at phone width).
  const ys = [40, 150, 260, 370], X = 110;
  let v = '';
  for (let i = 0; i < 3; i++) {
    v += `<path class="g-line g-lime g-draw flow-seg" d="M${X} ${ys[i] + 34}V${ys[i + 1] - 34}"/>` + terminal(X, ys[i + 1] - 38, 'diamond', 2.6);
  }
  v += `<path class="g-dots g-steel flow-ghost" stroke-dasharray="0.01 6" d="M${X - 34} ${ys[1]}C${X - 100} ${ys[1]} ${X - 100} ${ys[2]} ${X - 34} ${ys[2]}"/>`;
  v += `<text class="g-text g-steel flow-ghost" x="${X + 44}" y="${(ys[1] + ys[2]) / 2 + 5}">${d.gap}</text><path class="g-line g-steel flow-ghost" d="M${X + 40} ${(ys[1] + ys[2]) / 2}H${X + 148}"/>`;
  ys.forEach((y2, i) => {
    v += hexNode(X, y2, 30, { tone: i === 3 ? 'lime' : 'steel', rings: 1, crosshair: i !== 3 });
    v += `<text class="g-text g-ink" x="${X + 52}" y="${y2 + 5}">${d.nodes[i]}</text>`;
  });
  v += `<path class="g-line g-lime g-thick flow-check" d="M${X - 11} ${ys[3]}l7 7 15-15"/><text class="g-text g-lime flow-check" x="${X + 52}" y="${ys[3] + 26}">${d.check}</text>`;
  return `<figure class="diagram problem-diagram">
  ${svg('0 0 720 210', s, 'flow-svg flow-h')}
  ${svg('0 0 320 410', v, 'flow-svg flow-v')}
  <figcaption class="sr-only">${d.broken}. ${d.fixed}.</figcaption>
</figure>`;
}

function problem(t: Locale): string {
  const p = t.problem;
  return `<section class="section problem" id="problem" aria-labelledby="problem-title">
  <div class="wrap">
    <p class="label mono">${p.label}</p>
    <div class="split">
      <h2 id="problem-title" class="h2">${p.title}</h2>
      <div>
        <p class="lead">${p.body}</p>
        <dl class="pain-list">${p.points.map((x) => `<div><dt class="mono">${x.k}</dt><dd>${x.v}</dd></div>`).join('')}</dl>
      </div>
    </div>
    ${problemDiagram(t)}
  </div>
</section>`;
}

/* ───────────────────────── Offer ───────────────────────── */
function offer(t: Locale): string {
  const o = t.offer;
  return `<section class="section offer" id="offer" aria-labelledby="offer-title">
  <div class="wrap">
    <p class="label mono">${o.label}</p>
    <div class="offer-head">
      <h2 id="offer-title" class="h2">${o.title}</h2>
      <p class="lead">${o.lead}</p>
    </div>
    <div class="offer-grid">
      <div class="card offer-get">
        <h3 class="h3">${o.getTitle}</h3>
        <ol class="ticks" role="list">${o.get.map((g, i) => `<li><span class="tick mono" aria-hidden="true">${pad2(i + 1)}</span>${g}</li>`).join('')}</ol>
      </div>
      <div class="offer-side">
        <div class="card"><h3 class="h3">${o.termsTitle}</h3><p>${o.terms}</p></div>
        <div class="card"><h3 class="h3">${o.nextTitle}</h3><p>${o.next}</p></div>
      </div>
    </div>
    <div class="offer-cta">${calBtn(t)}</div>
  </div>
</section>`;
}

/* ───────────────────────── Systems constellation ───────────────────────── */
/** Map layout, read left to right in number order:
 *  supporting systems S6–S9 in a row on top · core flow S1→S5 across the middle · S10 (executive view) below. */
const NODE_POS: Record<string, [number, number]> = {
  S6: [168, 100], S7: [323, 100], S8: [478, 100], S9: [633, 100],
  S1: [90, 275], S2: [245, 275], S3: [400, 275], S4: [555, 275], S5: [710, 275],
  S10: [400, 430],
};
const CORE = ['S1', 'S2', 'S3', 'S4', 'S5'];
/** Split a system name over two balanced lines so labels never run into their neighbours. */
function labelLines(name: string): string[] {
  const w = name.split(' ');
  if (w.length < 2 || name.length <= 12) return [name];
  let best = 1, diff = Infinity;
  for (let i = 1; i < w.length; i++) { const d = Math.abs(w.slice(0, i).join(' ').length - w.slice(i).join(' ').length); if (d < diff) { diff = d; best = i; } }
  return [w.slice(0, best).join(' '), w.slice(best).join(' ')];
}
const SUPPORT = ['S6', 'S7', 'S8', 'S9'];

function systems(t: Locale): string {
  const s = t.systems;
  const P = (k: string) => NODE_POS[k].join(' ');
  const liveCore = CORE.filter((k) => s.items.find((i) => i.id === k)?.live);
  const lastLive = liveCore[liveCore.length - 1] ?? 'S1';
  // Background: one dotted orbit (automations running in the background); dots drift when motion is on.
  let g = orbit(400, 262, 372, 218, { tone: 'steel', cls: 'sys-orbit' });
  // Supporting row: a dotted bus joining S6→S9, each one plugging down into the core flow.
  for (let i = 0; i < SUPPORT.length - 1; i++) g += dotRun(NODE_POS[SUPPORT[i]][0] + 28, 100, NODE_POS[SUPPORT[i + 1]][0] - 28, 100, 'steel', 7);
  for (const k of SUPPORT) g += `<path class="g-dots g-steel sys-drop" stroke-dasharray="0.01 7" d="M${NODE_POS[k][0]} 128V275"/>`;
  // S10 consolidates: dotted links from the first, middle and last core systems.
  for (const k of ['S1', 'S3', 'S5']) g += `<path class="g-dots g-steel sys-drop" stroke-dasharray="0.01 7" d="M${P(k)}L${P('S10')}"/>`;
  // Core flow: live part in lime (data pulses travel along it), roadmap part dashed.
  g += `<path class="g-line g-steel sys-flow-road" stroke-dasharray="6 6" d="M${CORE.slice(CORE.indexOf(lastLive)).map(P).join('L')}"/>`;
  g += `<path id="sys-live-path" class="g-line g-lime g-thick g-draw sys-flow" d="M${liveCore.map(P).join('L')}"/>`;
  for (const it of s.items) {
    const [x, y] = NODE_POS[it.id];
    const r = CORE.includes(it.id) ? 34 : 26;
    const lines = labelLines(it.name);
    const above = SUPPORT.includes(it.id);
    const labelY = above ? y - r - 12 - (lines.length - 1) * 14 : y + r + 20;
    const label = lines.map((l, i) => `<tspan x="${x}" dy="${i ? 14 : 0}">${esc(l)}</tspan>`).join('');
    g += `<g class="sys-node ${it.live ? 'is-live' : ''}" data-node="${it.id}">` +
      (it.live ? `<circle class="g-line g-lime sys-live-ring" cx="${x}" cy="${y}" r="${r}" opacity="0"/>` : '') +
      hexNode(x, y, r, { tone: it.live ? 'lime' : 'steel', rings: it.live ? 2 : 1, crosshair: false }) +
      `<path class="sys-hit" d="${hexPath(x, y, r)}"/>` +
      `<text class="g-text ${it.live ? 'g-lime' : 'g-ink'} sys-id" x="${x}" y="${y + 5}" text-anchor="middle">${it.id}</text>` +
      `<text class="g-text g-steel sys-name-label" x="${x}" y="${labelY}" text-anchor="middle">${label}</text></g>`;
  }
  // Data pulses (hidden until motion starts them).
  g += [0, 1, 2].map(() => `<circle class="g-fill g-lime sys-pulse" r="4.5" cx="${NODE_POS.S1[0]}" cy="${NODE_POS.S1[1]}" opacity="0"/>`).join('');
  g += regMark(16, 16) + regMark(784, 16) + regMark(16, 484) + regMark(784, 484);

  const buttons = s.items
    .map((it) => {
      const [x, y] = NODE_POS[it.id];
      return `<button type="button" class="sys-btn" style="left:${(x / 800) * 100}%;top:${(y / 500) * 100}%" data-sys="${it.id}" aria-controls="sys-${it.id}" aria-expanded="false"><span class="sr-only">${it.id} ${esc(it.name)}</span></button>`;
    })
    .join('');

  const list = s.items
    .map(
      (it) => `<li id="sys-${it.id}" class="sys-item ${it.live ? 'is-live' : ''}" data-sys-item="${it.id}">
  <p class="sys-meta mono"><span class="sys-id-tag">${it.id}</span><span class="status ${it.live ? 'status-live' : 'status-roadmap'}">${it.live ? s.statusLive : s.statusRoadmap}</span></p>
  <h3 class="sys-name">${esc(it.name)}</h3>
  <p class="sys-purpose">${it.purpose}</p>
</li>`,
    )
    .join('');

  return `<section class="section systems" id="systems" aria-labelledby="systems-title">
  <div class="wrap">
    <p class="label mono">${s.label}</p>
    <div class="split">
      <h2 id="systems-title" class="h2">${s.title}</h2>
      <p class="lead">${s.intro}</p>
    </div>
    <div class="constellation" data-constellation>
      <div class="const-stage">
        ${svg('0 0 800 500', g, 'const-svg')}
        <div class="const-buttons">${buttons}</div>
        <p class="const-legend mono" aria-hidden="true"><span class="lg lg-live">${s.legendLive}</span><span class="lg lg-road">${s.legendRoadmap}</span></p>
      </div>
      <div class="const-panel">
        <p class="const-hint mono" data-const-hint>${s.hint}</p>
        <ol class="sys-list" role="list" aria-live="polite">${list}</ol>
      </div>
    </div>
  </div>
</section>`;
}

/* ───────────────────────── How we work (spiral) ───────────────────────── */
function how(t: Locale): string {
  const h = t.how;
  const steps = goldenSpiral(12, 12, 616, h.stages.length, true);
  // The spiral's eye (where construction converges) carries the 'proven' check.
  const eye: [number, number] = [457.74, 287.48]; // limit point of the construction (computed)
  const inner = steps.join('') + regMark(12, 12, 6, 'lime') +
    `<g class="spiral-eye">${hexNode(eye[0], eye[1], 22, { tone: 'lime', rings: 0, crosshair: false })}<path class="g-line g-lime g-thick" d="M${eye[0] - 9} ${eye[1]}l6 6 12-12"/></g>`;
  return `<section class="section how" id="how" aria-labelledby="how-title">
  <div class="wrap">
    <p class="label mono">${h.label}</p>
    <div class="split">
      <h2 id="how-title" class="h2">${h.title}</h2>
      <p class="lead">${h.intro}</p>
    </div>
    <div class="how-grid" data-how>
      <div class="how-art">${svg('0 0 640 408', inner, 'spiral-svg')}</div>
      <ol class="stages" role="list">
        ${h.stages
          .map(
            (st, i) => `<li class="stage" data-stage="${i}"><span class="stage-n mono" aria-hidden="true">${pad2(i + 1)}</span><div><h3 class="stage-name">${st.name}</h3><p>${st.text}</p></div></li>`,
          )
          .join('')}
      </ol>
    </div>
    <a class="skip-link mono" href="#assessment">${h.skip} ↓</a>
  </div>
</section>`;
}

/* ───────────────────────── Proof ───────────────────────── */
function proof(t: Locale): string {
  const p = t.proof;
  const poster =
    orbit(240, 135, 110, 110, { tone: 'steel' }) +
    hexNode(240, 135, 54, { tone: 'lime', rings: 1, crosshair: false }) +
    `<path class="g-fill g-lime" d="M228 113l34 22-34 22z"/>` +
    regMark(20, 20) + regMark(460, 20) +
    dotRun(20, 135, 120, 135) + dotRun(360, 135, 460, 135);
  return `<section class="section proof" id="proof" aria-labelledby="proof-title">
  <div class="wrap">
    <p class="label mono">${p.label}</p>
    <div class="split">
      <h2 id="proof-title" class="h2">${p.title}</h2>
      <div>${p.intro.map((x) => `<p class="lead">${x}</p>`).join('')}</div>
    </div>

    <div class="spec" role="group" aria-labelledby="spec-title">
      <p id="spec-title" class="spec-head mono"><span>${p.specTitle}</span><span aria-hidden="true">REV 2026.11</span></p>
      <dl class="spec-list">
        ${p.principles
          .map(
            (x, i) => `<div class="spec-row"><dt><span class="spec-id mono" aria-hidden="true">P-${pad2(i + 1)}</span><span class="spec-name">${x.title}</span></dt><dd>${x.text}</dd></div>`,
          )
          .join('')}
      </dl>
    </div>

    <div class="real">
      <div class="real-copy">
        <p class="eyebrow mono"><span class="pulse" aria-hidden="true"></span>${p.real.label}</p>
        <h3 class="h3 h3-lg">${p.real.title}</h3>
        <p>${p.real.text}</p>
      </div>
      <div class="video" data-video="${SITE.youtubeId}" data-video-title="${esc(p.real.videoTitle)}">
        <button type="button" class="video-btn" data-video-play>
          ${svg('0 0 480 270', poster, 'video-poster')}
          <span class="video-label">${p.real.video}</span>
        </button>
        <p class="video-note mono">${p.real.videoNote}</p>
      </div>
    </div>

    <div class="quotes">
      <div class="quotes-head"><h3 class="h3">${p.quotesTitle}</h3><p class="mono quotes-note">${p.quotesNote}</p></div>
      <ul class="quote-grid" role="list">
        ${p.quotes
          .map(
            (q) => `<li class="quote"><figure>
  <blockquote><p>${q.text}</p></blockquote>
  <figcaption><span class="q-initials mono" aria-hidden="true">${q.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}</span><span><span class="q-name">${q.name}</span><span class="q-role">${q.role}</span></span></figcaption>
  <p class="q-sector mono">${q.sector}</p>
</figure></li>`,
          )
          .join('')}
      </ul>
    </div>

  </div>
</section>`;
}

/* ───────────────────────── Final CTA: book the assessment call ───────────────────────── */
/** Primary CTA: opens the Cal.com 20-minute booking (new tab, announced to screen readers). */
export function calBtn(t: Locale, cls = 'btn btn-primary btn-lg', label: string = t.cta.primary): string {
  return `<a class="${cls}" href="${SITE.calUrl}" target="_blank" rel="noopener noreferrer" data-cta="book">${label}<span class="sr-only"> ${t.a11y.newTab}</span><span class="ext" aria-hidden="true">↗</span></a>`;
}

function finalCta(t: Locale): string {
  const f = t.final;
  return `<section class="section final" id="assessment" aria-labelledby="final-title">
  <div class="wrap final-grid">
    <div class="final-intro">
      <p class="label mono">${f.label}</p>
      <h2 id="final-title" class="h2">${f.title}</h2>
      ${f.text.map((x) => `<p class="lead">${x}</p>`).join('')}
    </div>
    <div class="final-details">
      <h3 class="h4 mono steps-title">${f.stepsTitle}</h3>
      <ol class="steps" role="list">${f.steps.map((s, i) => `<li><span class="step-n mono" aria-hidden="true">${pad2(i + 1)}</span><div><p class="step-name">${s.name}</p><p>${s.text}</p></div></li>`).join('')}</ol>
      <p class="no-ob mono">${f.noObligation}</p>
      <p class="owner">${f.owner}</p>
      <div class="contact">
        <p class="contact-title">${f.contactTitle}</p>
        <p class="mono contact-name">${f.contactName}</p>
        <p>${f.contactTagline}</p>
        <p><a class="text-link" href="mailto:${SITE.contactEmail}">${SITE.contactEmail}</a></p>
      </div>
    </div>
    <div class="final-book card">
      ${svg('0 0 120 120', hexNode(60, 60, 50, { tone: 'lime', rings: 1, crosshair: false }) + `<path class="g-line g-lime g-thick" d="M40 60l14 14 28-28"/>`, 'success-mark')}
      <h3 class="h3">${f.book.title}</h3>
      <ul class="book-facts-list mono" role="list">${f.book.facts.map((x) => `<li>${x}</li>`).join('')}</ul>
      ${calBtn(t)}
      <p class="book-note mono">${f.book.note}</p>
    </div>
  </div>
</section>`;
}

/* ───────────────────────── FAQ + book ───────────────────────── */
function faq(t: Locale): string {
  return `<section class="section faq" id="faq" aria-labelledby="faq-title">
  <div class="wrap faq-grid">
    <div><p class="label mono">${t.faq.label}</p><h2 id="faq-title" class="h2">${t.faq.title}</h2></div>
    <div class="faq-list">
      ${t.faq.items
        .map(
          (x, i) => `<details class="faq-item"${/cost/i.test(x.q) ? ' open' : ''}><summary><span class="faq-n mono" aria-hidden="true">${pad2(i + 1)}</span><span class="faq-q">${x.q}</span><span class="faq-icon" aria-hidden="true"></span></summary><div class="faq-a"><p>${x.a}</p></div></details>`,
        )
        .join('')}
    </div>
  </div>
</section>`;
}

function book(t: Locale): string {
  const b = t.book;
  return `<section class="section-sm book" aria-labelledby="book-title">
  <div class="wrap book-grid">
    <img class="book-img" src="/images/prompt-or-perish.webp" width="480" height="270" alt="${b.imageAlt}" loading="lazy" decoding="async">
    <div>
      <p class="eyebrow mono">${b.label}</p>
      <h2 id="book-title" class="h3 h3-lg">${b.title}</h2>
      <p class="book-sub">${b.sub}</p>
      <p>${b.text}</p>
      <p class="mono book-facts">${b.facts.join(' · ')}</p>
      ${ext(t, SITE.bookUrl, b.link, 'text-link')}
    </div>
  </div>
</section>`;
}

/* ───────────────────────── JSON-LD ───────────────────────── */
function jsonLd(t: Locale): object[] {
  const org = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'ProfessionalService'],
    name: SITE.name,
    url: SITE.origin + '/',
    logo: SITE.origin + '/logo.png',
    email: SITE.contactEmail,
    description: t.meta.description,
    areaServed: ['United States', 'Europe'],
    sameAs: [SITE.social.linkedin, SITE.social.instagram, SITE.social.github],
  };
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: t.faq.items.map((x) => ({ '@type': 'Question', name: x.q, acceptedAnswer: { '@type': 'Answer', text: x.a } })),
  };
  return [org, faqLd];
}

export function renderHome(t: Locale): string {
  const h = head(t, { title: t.meta.title, description: t.meta.description, path: '/', jsonLd: jsonLd(t) });
  const sticky = `<div class="sticky-cta" data-sticky-cta hidden>${calBtn(t, 'btn btn-primary')}</div>`;
  const body = [hero(t), problem(t), offer(t), systems(t), how(t), proof(t), faq(t), finalCta(t), book(t), sticky].join('\n');
  return page(t, h, body, { onHome: true, bodyClass: 'home' });
}
