/**
 * Motion layer (loaded after first paint). Principles (brief §5):
 * - motion explains: assembly, flow, verification. One house ease, 0.4–1.2 s, no springs.
 * - Everything here is a `from` tween. The HTML/CSS already shows the FINAL state, so
 *   reduced motion, no-JS or a failed load all show complete, readable content.
 * - Nothing pins or hijacks scroll. "How we work" uses a sticky column + scrubbed drawing.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { heroState } from './heroState';

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, SplitText);

let lenisTick: ((t: number) => void) | null = null;
const EASE = 'power3.out'; // house curve (matches --ease)
const q = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => [...root.querySelectorAll<T>(s)];

export function initMotion(): void {
  const mm = gsap.matchMedia();
  gsap.defaults({ ease: EASE, duration: 0.8 });

  mm.add(
    { motionOK: '(prefers-reduced-motion: no-preference)', wide: '(min-width: 60rem)' },
    (ctx) => {
      const { motionOK, wide } = ctx.conditions as { motionOK: boolean; wide: boolean };
      if (!motionOK) {
        heroState.press = 1; // final, proven state
        return;
      }
      const lenis = initLenis();
      hero();
      headings();
      problem();
      systems();
      how(wide);
      proof();
      finalSteps();
      return () => { lenis?.destroy(); lenisTick && gsap.ticker.remove(lenisTick); };
    },
  );
}

/* ───────── Smooth scroll (desktop pointers only; touch scroll stays native) ───────── */
function initLenis(): Lenis | null {
  if (!matchMedia('(pointer: fine)').matches) return null;
  const lenis = new Lenis({ lerp: 0.12, anchors: false, stopInertiaOnNavigate: true });
  lenis.on('scroll', ScrollTrigger.update);
  const tick = (t: number) => lenis.raf(t * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  document.documentElement.classList.add('lenis');

  // In-page links: smooth scroll, then move keyboard focus to the target (skip links stay accessible).
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"], a[href^="/#"]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const id = a.getAttribute('href')!.replace(/^\/?#/, '');
    const target = id ? document.getElementById(id) : document.body;
    if (!target || (a.pathname !== location.pathname)) return;
    e.preventDefault();
    const header = document.querySelector<HTMLElement>('[data-header]')?.offsetHeight ?? 0;
    lenis.scrollTo(target, {
      offset: -header - 8,
      duration: 1,
      onComplete: () => {
        if (!target.hasAttribute('tabindex') && !/^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(target.tagName)) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
        history.replaceState(null, '', `#${id}`);
      },
    });
  });
  lenisTick = tick;
  return lenis;
}

/* ───────── Hero: rays + orbit draw themselves; layers press together on scroll ───────── */
function hero(): void {
  const art = document.querySelector('[data-hero-art]');
  if (!art) return;
  const layers = Object.fromEntries(q<SVGGElement>('[data-layer]', art).map((g) => [g.dataset.layer, g]));
  const SPREAD = 46; // SVG units in mark space (mark is scaled 0.37 in the hero)

  // Intro (does not touch the H1/copy: LCP text is never hidden).
  const intro = gsap.timeline({ defaults: { ease: EASE } });
  intro
    .from(q('.hero-ray path.g-line', art), { drawSVG: '0%', duration: 0.9, stagger: 0.06 }, 0.1)
    .from(q('.hero-ray .g-fill', art), { scale: 0, transformOrigin: '50% 50%', duration: 0.4, stagger: 0.06 }, 0.5)
    .from(q('.hero-orbit, .hero-orbit2', art), { opacity: 0, duration: 1.2 }, 0)
    .from(q('.hero-hex', art), { opacity: 0, duration: 0.8, stagger: 0.15 }, 0.4);

  // Stacked (apart, unverified) → proven (pressed, lit), scrubbed by scrolling out of the hero.
  const apart = { top: -SPREAD, bottom: SPREAD };
  gsap.set(layers.top, { y: apart.top });
  gsap.set(layers.bottom, { y: apart.bottom });
  const ring = art.querySelector('.hero-proof');
  const glow = art.querySelector('.hero-glow');
  gsap.set(ring, { drawSVG: '0%' });
  gsap.set(glow, { opacity: 0 });
  heroState.press = 0;

  const press = gsap.timeline({
    scrollTrigger: { trigger: '.hero', start: 'top top', end: '+=45%', scrub: 0.6 },
    defaults: { ease: 'none' },
    onUpdate() { heroState.press = this.progress(); },
  });
  press
    .to(layers.top, { y: 0, ease: 'power2.inOut' }, 0)
    .to(layers.bottom, { y: 0, ease: 'power2.inOut' }, 0)
    .to(ring, { drawSVG: '100%', ease: 'power1.inOut' }, 0.35)
    .to(glow, { opacity: 1, ease: 'power1.in' }, 0.55);
  // If the visitor never scrolls, reveal the proven state anyway after a beat, so the mark is never left "unverified".
  // Once revealed this way the scroll link is released, so a later scroll can't snap the layers apart again.
  gsap.delayedCall(6, () => {
    if (press.progress() < 0.02 && window.scrollY < 10) {
      press.scrollTrigger?.kill();
      gsap.to(press, { progress: 1, duration: 1.2, ease: EASE });
    }
  });
}

/* ───────── Section headings: line-by-line reveal (masked, so no layout shift) ───────── */
function headings(): void {
  document.fonts.ready.then(() => {
    for (const h of q('main .h2')) {
      SplitText.create(h, {
        type: 'lines',
        mask: 'lines',
        autoSplit: true,
        onSplit(self) {
          return gsap.from(self.lines, {
            yPercent: 105, duration: 0.9, stagger: 0.08,
            scrollTrigger: { trigger: h, start: 'top 85%', once: true },
          });
        },
      });
    }
  });
}

/* ───────── Problem: the broken flow redraws itself fixed ───────── */
function problem(): void {
  for (const svg of q<SVGSVGElement>('.problem-diagram .flow-svg')) {
    if (!svg.getBoundingClientRect().width) continue; // hidden variant (h/v)
    const tl = gsap.timeline({ scrollTrigger: { trigger: svg, start: 'top 75%', end: 'bottom 55%', scrub: 0.5 } });
    // Broken first (the manual detour is prominent), then each link draws in, the detour fades, the result is verified.
    tl.from(q('.flow-seg', svg), { drawSVG: '0%', duration: 1, stagger: 0.8, ease: 'none' }, 0)
      .fromTo(q('.flow-ghost', svg), { opacity: 1 }, { opacity: 0.45, duration: 0.8, ease: 'none' }, 1.2)
      .from(q('.flow-check', svg), { opacity: 0, scale: 0.6, transformOrigin: '50% 50%', duration: 0.5 }, 2.4);
  }
}

/* ───────── Systems: nodes assemble, the live S1→S2 link draws ───────── */
function systems(): void {
  const svg = document.querySelector('.const-svg');
  if (!svg) return;
  const tl = gsap.timeline({ scrollTrigger: { trigger: svg, start: 'top 75%', once: true } });
  tl.from(q('.sys-orbit, .const-svg > ellipse', svg), { opacity: 0, duration: 1 }, 0)
    .from(q('.sys-node', svg), { opacity: 0, scale: 0.6, transformOrigin: '50% 50%', duration: 0.6, stagger: 0.06 }, 0.1)
    .from(q('.sys-flow-road', svg), { opacity: 0, duration: 0.6 }, 0.6)
    .from(q('.sys-flow', svg), { drawSVG: '0%', duration: 0.8 }, 0.9);
}

/* ───────── How we work: each stage draws one construction step of the spiral ───────── */
function how(wide: boolean): void {
  const root = document.querySelector('[data-how]');
  if (!root) return;
  const steps = q<SVGGElement>('[data-step]', root);
  const stages = q<HTMLElement>('[data-stage]', root);
  const eye = root.querySelector('.spiral-eye');
  gsap.set(steps.map((s) => s.querySelector('rect')), { opacity: 0 });
  gsap.set(steps.map((s) => s.querySelector('path.g-lime')), { drawSVG: '0%' });
  gsap.set(eye, { opacity: 0, scale: 0.5, transformOrigin: '50% 50%' });

  const draw = (i: number) => {
    const s = steps[i];
    if (!s) return;
    gsap.to(s.querySelector('rect'), { opacity: 0.45, duration: 0.5 });
    gsap.to(s.querySelector('path.g-lime'), { drawSVG: '100%', duration: 0.9 });
  };
  const undraw = (i: number) => {
    const s = steps[i];
    if (!s) return;
    gsap.to(s.querySelector('rect'), { opacity: 0, duration: 0.4 });
    gsap.to(s.querySelector('path.g-lime'), { drawSVG: '0%', duration: 0.5 });
  };
  stages.forEach((st, i) => {
    ScrollTrigger.create({
      trigger: st,
      start: wide ? 'top 60%' : 'top 80%',
      onEnter: () => { st.classList.add('is-active'); draw(i); if (i === stages.length - 1) gsap.to(eye, { opacity: 1, scale: 1, duration: 0.6, delay: 0.5 }); },
      onLeaveBack: () => { st.classList.remove('is-active'); undraw(i); if (i === stages.length - 1) gsap.to(eye, { opacity: 0, scale: 0.5, duration: 0.3 }); },
    });
  });
}

/* ───────── Proof: spec rows stack in; quotes follow ───────── */
function proof(): void {
  gsap.from(q('.spec-row'), { opacity: 0, y: 16, duration: 0.6, stagger: 0.08, scrollTrigger: { trigger: '.spec', start: 'top 80%', once: true } });
  gsap.from(q('.quote'), { opacity: 0, y: 24, duration: 0.7, stagger: 0.12, scrollTrigger: { trigger: '.quote-grid', start: 'top 85%', once: true } });
}

/* ───────── Final CTA: the four steps light in sequence ───────── */
function finalSteps(): void {
  gsap.from(q('.steps li'), { opacity: 0, x: -12, duration: 0.5, stagger: 0.12, scrollTrigger: { trigger: '.steps', start: 'top 85%', once: true } });
}
