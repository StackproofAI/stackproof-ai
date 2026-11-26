import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/** The master mark (brand/stackproof-mark.svg, 2026-11 identity), parsed once at build time. */
const raw = readFileSync(fileURLToPath(new URL('../../brand/stackproof-mark.svg', import.meta.url)), 'utf8');
const path = (id: string) => {
  const m = raw.match(new RegExp(`id="${id}"[^>]*d="([^"]+)"`));
  if (!m) throw new Error(`mark: path ${id} missing`);
  return m[1];
};
/** Five blocks on a 200-unit grid (40-unit blocks, 10-unit gaps, 20-unit chamfers). The middle block is the lime accent. */
export const BLOCKS = ['left', 'top', 'right', 'bottom', 'middle'] as const;
export const MARK = {
  viewBox: '0 0 200 200',
  ...Object.fromEntries(BLOCKS.map((b) => [b, path(`block-${b}`)])) as Record<(typeof BLOCKS)[number], string>,
};
const WHITE = '#FFFFFF';
const LIME = '#C6FF00';

/** Flat mark (header, footer, favicon-sized). Brand colours, never restyled. */
export function markSvg(cls = 'mark', label?: string): string {
  const a11y = label ? `role="img" aria-label="${label}"` : 'aria-hidden="true" focusable="false"';
  return `<svg class="${cls}" viewBox="${MARK.viewBox}" ${a11y} xmlns="http://www.w3.org/2000/svg"><g fill="${WHITE}"><path d="${MARK.left}"/><path d="${MARK.top}"/><path d="${MARK.right}"/><path d="${MARK.bottom}"/></g><path fill="${LIME}" d="${MARK.middle}"/></svg>`;
}

/**
 * Block-by-block mark for the hero / static fallback. Each block is its own group so motion
 * can spread them apart and assemble them ("stacked → proven"). Default markup = assembled (final state).
 */
export function layeredMark(): string {
  return `<g class="mk" data-mark>${BLOCKS.map((b) => `<g class="mk-block" data-block="${b}"><path fill="${b === 'middle' ? LIME : WHITE}" d="${MARK[b]}"/></g>`).join('')}</g>`;
}
