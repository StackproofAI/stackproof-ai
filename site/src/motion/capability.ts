/** Cheap capability checks (no network, no third-party probe). */
export const prefersReducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export function canUse3D(): boolean {
  if (prefersReducedMotion()) return false;
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  if (nav.connection?.saveData) return false;
  if (!matchMedia('(min-width: 60rem) and (pointer: fine)').matches) return false; // desktop only; phones get the SVG hero
  if (nav.deviceMemory && nav.deviceMemory < 4) return false;
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) return false;
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2');
    if (!gl) return false;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  } catch { return false; }
  return true;
}

/** Run after first paint and when the main thread is idle, so motion never competes with LCP. */
export function afterFirstPaint(fn: () => void): void {
  const go = () => ('requestIdleCallback' in window ? requestIdleCallback(fn, { timeout: 1500 }) : setTimeout(fn, 200));
  if (document.readyState === 'complete') go();
  else addEventListener('load', go, { once: true });
}
