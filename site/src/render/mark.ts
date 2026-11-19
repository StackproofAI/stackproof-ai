import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/** The approved master mark (brand/stackproof-mark.svg), parsed once at build time. */
const raw = readFileSync(fileURLToPath(new URL('../../brand/stackproof-mark.svg', import.meta.url)), 'utf8');
const path = (id: string) => {
  const m = raw.match(new RegExp(`id="${id}"[^>]*d="([^"]+)"`));
  if (!m) throw new Error(`mark: path ${id} missing`);
  return m[1];
};
export const MARK = {
  viewBox: '0 0 780 656',
  bottom: path('layer-bottom'),
  middle: path('layer-middle'),
  top: path('layer-top'),
  check: path('check'),
};

/** Flat mark (header, footer, favicon-sized). Colors via tokens; never restyled. */
export function markSvg(cls = 'mark', label?: string): string {
  const a11y = label ? `role="img" aria-label="${label}"` : 'aria-hidden="true" focusable="false"';
  return `<svg class="${cls}" viewBox="${MARK.viewBox}" ${a11y} xmlns="http://www.w3.org/2000/svg">
<path fill="#CEF949" d="${MARK.bottom}"/><path fill="#75879A" d="${MARK.middle}"/><path fill="#CEF949" d="${MARK.top}"/><path fill="#040508" d="${MARK.check}"/></svg>`;
}

/**
 * Layered mark for the hero / static fallback. Each layer is its own group so motion
 * can separate and press them together ("stacked → proven").
 */
export function layeredMark(): string {
  return `<g class="mk" data-mark>
<g class="mk-layer" data-layer="bottom"><path fill="#CEF949" d="${MARK.bottom}"/></g>
<g class="mk-layer" data-layer="middle"><path fill="#75879A" d="${MARK.middle}"/></g>
<g class="mk-layer" data-layer="top"><path fill="#CEF949" d="${MARK.top}"/><path class="mk-check" fill="#040508" d="${MARK.check}"/></g>
</g>`;
}
