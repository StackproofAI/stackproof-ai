import { initNav } from './ui/nav';
import { initConstellation } from './ui/constellation';
import { initVideo } from './ui/video';
import { initStickyCta } from './ui/sticky-cta';
import { afterFirstPaint, canUse3D } from './motion/capability';

initNav();
initConstellation();
initVideo();
initStickyCta();

// Motion and 3D load only after first paint / idle: never in the LCP path.
afterFirstPaint(async () => {
  const { initMotion } = await import('./motion/index');
  initMotion();
  const art = document.querySelector<HTMLElement>('[data-hero-art]');
  const host = art?.querySelector<HTMLElement>('[data-hero-canvas]');
  if (art && host && canUse3D()) {
    try {
      const { mountHero3D } = await import('./three/hero3d');
      mountHero3D(host, art);
    } catch {
      /* SVG hero stays: it is the complete fallback */
    }
  }
});
