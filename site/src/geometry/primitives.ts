/**
 * "Proof geometry" primitives (brief §3). Pure functions returning SVG markup strings.
 * Every primitive carries meaning:
 *   hexNode   = a system
 *   rays      = data flowing to a decision
 *   spiral    = compounding results
 *   orbit     = automations running in the background
 *   regMark   = a measured / verified point
 * Strokes use `vector-effect: non-scaling-stroke` (via the .g-* classes in geometry.css)
 * so hairlines stay 1–1.5px at every size and pixel density.
 */

const f = (n: number) => +n.toFixed(2);
type Tone = 'lime' | 'steel';

export const PHI = (1 + Math.sqrt(5)) / 2;

/** Small `+` registration mark. */
export function regMark(x: number, y: number, size = 6, tone: Tone = 'steel'): string {
  return `<path class="g-line g-${tone}" d="M${f(x - size)} ${f(y)}H${f(x + size)}M${f(x)} ${f(y - size)}V${f(y + size)}"/>`;
}

/** Ray terminal: dot or diamond. */
export function terminal(x: number, y: number, kind: 'dot' | 'diamond' = 'dot', r = 3, tone: Tone = 'lime'): string {
  if (kind === 'dot') return `<circle class="g-fill g-${tone}" cx="${f(x)}" cy="${f(y)}" r="${r}"/>`;
  return `<path class="g-fill g-${tone}" d="M${f(x)} ${f(y - r * 1.4)}L${f(x + r * 1.4)} ${f(y)}L${f(x)} ${f(y + r * 1.4)}L${f(x - r * 1.4)} ${f(y)}Z"/>`;
}

/** Regular hexagon path (pointy-top), optionally with concentric circles + crosshair. */
export function hexPath(cx: number, cy: number, r: number): string {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    return `${f(cx + r * Math.cos(a))} ${f(cy + r * Math.sin(a))}`;
  });
  return `M${pts.join('L')}Z`;
}

export function hexNode(
  cx: number,
  cy: number,
  r: number,
  opts: { tone?: Tone; rings?: number; crosshair?: boolean; cls?: string } = {},
): string {
  const { tone = 'steel', rings = 1, crosshair = true, cls = '' } = opts;
  let s = `<g class="${cls}"><path class="g-line g-${tone}" d="${hexPath(cx, cy, r)}"/>`;
  for (let i = 1; i <= rings; i++) {
    s += `<circle class="g-line g-${tone} g-faint" cx="${f(cx)}" cy="${f(cy)}" r="${f((r * 0.86 * i) / (rings + 0.4))}"/>`;
  }
  if (crosshair) {
    const c = r * 0.32;
    s += `<path class="g-line g-${tone}" d="M${f(cx - c)} ${f(cy)}H${f(cx + c)}M${f(cx)} ${f(cy - c)}V${f(cy + c)}"/>`;
  }
  return s + '</g>';
}

/** Dotted orbit: a circle (or ellipse) drawn as a dot run. */
export function orbit(cx: number, cy: number, rx: number, ry = rx, opts: { tone?: Tone; dash?: number; gap?: number; cls?: string } = {}): string {
  const { tone = 'steel', dash = 0.01, gap = 7, cls = '' } = opts;
  return `<ellipse class="g-dots g-${tone} ${cls}" cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" stroke-dasharray="${dash} ${gap}"/>`;
}

/** Rays from a focal point to a list of targets, each ending in a terminal. */
export function rays(
  fx: number,
  fy: number,
  targets: Array<[number, number]>,
  opts: { tone?: Tone; terminal?: 'dot' | 'diamond' | 'none'; cls?: string } = {},
): string {
  const { tone = 'lime', terminal: term = 'dot', cls = '' } = opts;
  return (
    `<g class="${cls}">` +
    targets
      .map(([x, y], i) => {
        const line = `<path class="g-line g-${tone} g-draw" pathLength="1" d="M${f(fx)} ${f(fy)}L${f(x)} ${f(y)}"/>`;
        return term === 'none' ? line : line + terminal(x, y, i % 2 ? 'diamond' : 'dot', 2.5, tone);
      })
      .join('') +
    '</g>'
  );
}

/**
 * Golden spiral construction.
 * Returns `steps` construction squares + quarter arcs (one per stage), in drawing order.
 * Each step is a separate <g data-step="i"> so motion can reveal one per stage.
 */
export function goldenSpiral(x: number, y: number, size: number, steps = 7): string[] {
  // Start with a golden rectangle of width `size`, height size/PHI, and recursively cut squares.
  let rx = x, ry = y, w = size, h = size / PHI;
  const out: string[] = [];
  for (let i = 0; i < steps; i++) {
    const dir = i % 4;
    let sq: [number, number, number];
    let arc: string;
    if (dir === 0) {
      // square on the left
      const s = h; sq = [rx, ry, s];
      arc = `M${f(rx)} ${f(ry + s)}A${f(s)} ${f(s)} 0 0 1 ${f(rx + s)} ${f(ry)}`;
      rx += s; w -= s;
    } else if (dir === 1) {
      // square on top
      const s = w; sq = [rx, ry, s];
      arc = `M${f(rx)} ${f(ry)}A${f(s)} ${f(s)} 0 0 1 ${f(rx + s)} ${f(ry + s)}`;
      ry += s; h -= s;
    } else if (dir === 2) {
      // square on the right
      const s = h; sq = [rx + w - s, ry, s];
      arc = `M${f(rx + w)} ${f(ry)}A${f(s)} ${f(s)} 0 0 1 ${f(rx + w - s)} ${f(ry + s)}`;
      w -= s;
    } else {
      // square at bottom
      const s = w; sq = [rx, ry + h - s, s];
      arc = `M${f(rx + s)} ${f(ry + h)}A${f(s)} ${f(s)} 0 0 1 ${f(rx)} ${f(ry + h - s)}`;
      h -= s;
    }
    const [sx, sy, ss] = sq;
    out.push(
      `<g data-step="${i}" class="g-step">` +
        `<rect class="g-line g-steel g-faint" x="${f(sx)}" y="${f(sy)}" width="${f(ss)}" height="${f(ss)}"/>` +
        `<path class="g-line g-lime g-draw" pathLength="1" d="${arc}"/>` +
        regMark(sx, sy, 4) +
        `</g>`,
    );
  }
  return out;
}

/** Long vertical axis line with tick marks (ties clusters together). */
export function axis(x: number, y1: number, y2: number, ticks = 0, tone: Tone = 'steel'): string {
  let s = `<path class="g-line g-${tone} g-faint" d="M${f(x)} ${f(y1)}V${f(y2)}"/>`;
  for (let i = 1; i <= ticks; i++) {
    const y = y1 + ((y2 - y1) * i) / (ticks + 1);
    s += `<path class="g-line g-${tone}" d="M${f(x - 4)} ${f(y)}H${f(x + 4)}"/>`;
  }
  return s;
}

/** Dot run along a straight line (data in transit). */
export function dotRun(x1: number, y1: number, x2: number, y2: number, tone: Tone = 'steel', gap = 6): string {
  return `<path class="g-dots g-${tone}" stroke-dasharray="0.01 ${gap}" d="M${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}"/>`;
}

/** Wrap primitives in an accessible-by-default (decorative) SVG. */
export function svg(viewBox: string, inner: string, cls = '', label?: string): string {
  const a11y = label ? `role="img" aria-label="${label}"` : 'aria-hidden="true" focusable="false"';
  return `<svg class="geo ${cls}" viewBox="${viewBox}" ${a11y} xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
}
