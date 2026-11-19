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
    `<defs><radialGradient id="hero-glow-g"><stop offset="0" stop-color="#CEF949" stop-opacity=".22"/><stop offset="1" stop-color="#CEF949" stop-opacity="0"/></radialGradient></defs>` +
    `<circle class="hero-glow" cx="${C}" cy="${C}" r="200" fill="url(#hero-glow-g)"/>` +
    `<circle class="g-line g-lime g-thick hero-proof" cx="${C}" cy="${C}" r="178" transform="rotate(-90 ${C} ${C})"/>` +
    `<g transform="translate(176 205) scale(0.37)">${layeredMark()}</g>`;
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
        <a class="btn btn-primary btn-lg" href="#assessment">${t.cta.primary}</a>
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
    <div class="offer-cta"><a class="btn btn-primary btn-lg" href="#assessment">${t.cta.primary}</a></div>
  </div>
</section>`;
}

/* ───────────────────────── Systems constellation ───────────────────────── */
const NODE_POS: Record<string, [number, number]> = {
  S1: [110, 330], S2: [255, 250], S3: [400, 300], S4: [545, 220], S5: [690, 290],
  S6: [120, 110], S7: [300, 72], S8: [500, 72], S9: [690, 118], S10: [400, 432],
};

function systems(t: Locale): string {
  const s = t.systems;
  const core = ['S1', 'S2', 'S3', 'S4', 'S5'];
  let g = orbit(400, 250, 330, 196, { tone: 'steel', cls: 'sys-orbit' });
  g += orbit(400, 250, 250, 140, { tone: 'steel', gap: 12 });
  // core flow
  g += `<path class="g-line g-steel sys-flow-road" stroke-dasharray="6 6" d="M${core.slice(1).map((k) => NODE_POS[k].join(' ')).join('L')}"/>`;
  g += `<path class="g-line g-lime g-thick g-draw sys-flow" d="M${NODE_POS.S1.join(' ')}L${NODE_POS.S2.join(' ')}"/>`;
  // supporting links (dot runs to the nearest core node)
  const link: Record<string, string> = { S6: 'S1', S7: 'S2', S8: 'S3', S9: 'S5', S10: 'S3' };
  for (const [a, b] of Object.entries(link)) g += dotRun(...NODE_POS[a], ...NODE_POS[b], 'steel', 7);
  for (const it of s.items) {
    const [x, y] = NODE_POS[it.id];
    const r = core.includes(it.id) ? 36 : 28;
    g += `<g class="sys-node ${it.live ? 'is-live' : ''}" data-node="${it.id}">` +
      hexNode(x, y, r, { tone: it.live ? 'lime' : 'steel', rings: it.live ? 2 : 1, crosshair: false }) +
      `<path class="sys-hit" d="${hexPath(x, y, r)}"/>` +
      `<text class="g-text ${it.live ? 'g-lime' : 'g-ink'} sys-id" x="${x}" y="${y + 5}" text-anchor="middle">${it.id}</text>` +
      `<text class="g-text g-steel sys-name-label" x="${x}" y="${y + r + 18}" text-anchor="middle">${esc(it.name)}</text></g>`;
  }
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

/* ───────────────────────── Final CTA + form ───────────────────────── */
function field(id: string, label: string, control: string, opts: { required?: boolean; hint?: string; t: Locale }): string {
  const req = opts.required
    ? `<span class="req" aria-hidden="true">*</span>`
    : `<span class="opt mono">(${opts.t.form.optional})</span>`;
  return `<div class="field" data-field="${id}">
  <label for="f-${id}">${label} ${req}</label>
  ${opts.hint ? `<p class="hint" id="f-${id}-hint">${opts.hint}</p>` : ''}
  ${control}
  <p class="field-error" id="f-${id}-err" data-error-for="${id}" hidden></p>
</div>`;
}

function form(t: Locale): string {
  const F = t.form;
  const desc = (id: string, hint = false) => `aria-describedby="${hint ? `f-${id}-hint ` : ''}f-${id}-err"`;
  const sel = (id: string, opts: readonly string[]) =>
    `<select id="f-${id}" name="${id}" required ${desc(id)}><option value="">${F.placeholders.select}</option>${opts.map((o) => `<option>${o}</option>`).join('')}</select>`;
  return `<form class="lead-form" id="lead-form" action="/api/lead" method="post" novalidate data-lead-form>
  <h3 class="h3">${F.title}</h3>
  <p class="form-req mono"><span class="req" aria-hidden="true">*</span> ${F.required}</p>
  <div class="form-alert" role="alert" data-form-alert hidden></div>
  <div class="form-grid">
    ${field('name', F.fields.name, `<input id="f-name" name="name" type="text" autocomplete="name" required maxlength="120" ${desc('name')}>`, { required: true, t })}
    ${field('email', F.fields.email, `<input id="f-email" name="email" type="email" autocomplete="email" inputmode="email" required maxlength="200" ${desc('email')}>`, { required: true, t })}
    ${field('company', F.fields.company, `<input id="f-company" name="company" type="text" autocomplete="organization" required maxlength="160" ${desc('company')}>`, { required: true, t })}
    ${field('website', F.fields.website, `<input id="f-website" name="website" type="text" inputmode="url" autocomplete="url" maxlength="200" placeholder="${F.placeholders.website}" ${desc('website')}>`, { t })}
    ${field('country', F.fields.country, sel('country', F.countries), { required: true, t })}
    ${field('team_size', F.fields.teamSize, sel('team_size', F.teamSizes), { required: true, t })}
  </div>
  <fieldset class="field tools" data-field="tools" aria-describedby="f-tools-err">
    <legend>${F.fields.tools} <span class="opt mono">(${F.optional})</span></legend>
    <div class="chips">${F.tools.map((x, i) => `<label class="chip"><input type="checkbox" name="tools" value="${x}" ${x === 'Other' ? 'data-tools-other' : ''}><span>${x}</span></label>`).join('')}</div>
    <div class="tools-other" data-tools-other-wrap hidden>
      <label for="f-tools_other" class="sr-only">${F.fields.toolsOther}</label>
      <input id="f-tools_other" name="tools_other" type="text" maxlength="200" placeholder="${F.fields.toolsOther}">
    </div>
    <p class="field-error" id="f-tools-err" data-error-for="tools" hidden></p>
  </fieldset>
  ${field('process', F.fields.process, `<textarea id="f-process" name="process" rows="5" required maxlength="3000" placeholder="${F.placeholders.process}" ${desc('process', true)}></textarea>`, { required: true, hint: F.fields.processHint, t })}
  <div class="hp" aria-hidden="true"><label for="f-company_fax">${F.honeypot}</label><input id="f-company_fax" name="company_fax" type="text" tabindex="-1" autocomplete="off"></div>
  <div class="field consent" data-field="consent">
    <label class="check"><input id="f-consent" name="consent" type="checkbox" required aria-describedby="f-consent-err"><span>${F.consent} <a href="/privacy/">${F.consentLink}</a>.</span></label>
    <input type="hidden" name="consent_text_version" value="${SITE.consentTextVersion}">
    <p class="field-error" id="f-consent-err" data-error-for="consent" hidden></p>
  </div>
  <div class="turnstile-slot" data-turnstile data-sitekey="${SITE.turnstileSiteKey}"></div>
  <div class="form-actions">
    <button class="btn btn-primary btn-lg" type="submit" data-submit>${F.submit}</button>
    <p class="verify-note mono">${F.verifyNote}</p>
  </div>
</form>
<div class="form-success" data-form-success hidden tabindex="-1">
  ${svg('0 0 120 120', hexNode(60, 60, 50, { tone: 'lime', rings: 1, crosshair: false }) + `<path class="g-line g-lime g-thick" d="M40 60l14 14 28-28"/>`, 'success-mark')}
  <h3 class="h3">${F.success.title}</h3>
  <p>${F.success.text}</p>
  <p class="success-call"><strong>${F.success.callTitle}</strong> ${ext(t, SITE.calUrl, F.success.call, 'text-link')}</p>
</div>`;
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
      <p class="talk">${ext(t, SITE.calUrl, t.cta.talkFirst, 'text-link')}</p>
      <div class="contact">
        <p class="contact-title">${f.contactTitle}</p>
        <p class="mono contact-name">${f.contactName}</p>
        <p>${f.contactTagline}</p>
        <p><a class="text-link" href="mailto:${SITE.contactEmail}">${SITE.contactEmail}</a></p>
      </div>
    </div>
    <div class="final-form card">${form(t)}</div>
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
  const sticky = `<div class="sticky-cta" data-sticky-cta hidden><a class="btn btn-primary" href="#assessment">${t.cta.primary}</a></div>`;
  const body = [hero(t), problem(t), offer(t), systems(t), how(t), proof(t), faq(t), finalCta(t), book(t), sticky].join('\n');
  return page(t, h, body, { onHome: true, bodyClass: 'home' });
}
