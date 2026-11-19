/** Systems constellation: on wide screens show one system at a time in the side panel;
 *  narrow screens (and no-JS) show the full list. Hover/focus on a node previews it. */
export function initConstellation(): void {
  const root = document.querySelector<HTMLElement>('[data-constellation]');
  if (!root) return;
  const btns = [...root.querySelectorAll<HTMLButtonElement>('[data-sys]')];
  const items = [...root.querySelectorAll<HTMLElement>('[data-sys-item]')];
  const nodes = [...root.querySelectorAll<SVGGElement>('[data-node]')];
  const wide = matchMedia('(min-width: 62rem)');
  let active = 'S1';

  const show = (id: string) => {
    active = id;
    for (const b of btns) { b.setAttribute('aria-expanded', String(b.dataset.sys === id)); b.tabIndex = b.dataset.sys === id ? 0 : -1; }
    for (const n of nodes) n.classList.toggle('is-active', n.dataset.node === id);
    for (const it of items) it.hidden = wide.matches && it.dataset.sysItem !== id;
  };
  const hover = (id: string | null) => { for (const n of nodes) n.classList.toggle('is-hover', n.dataset.node === id); };

  for (const b of btns) {
    const id = b.dataset.sys!;
    b.addEventListener('click', () => show(id));
    b.addEventListener('focus', () => show(id));
    b.addEventListener('pointerenter', () => { hover(id); if (wide.matches) show(id); });
    b.addEventListener('pointerleave', () => hover(null));
  }
  root.addEventListener('keydown', (e) => {
    const i = btns.findIndex((b) => b === document.activeElement);
    if (i < 0) return;
    const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    const j = e.key === 'Home' ? 0 : e.key === 'End' ? btns.length - 1 : d ? (i + d + btns.length) % btns.length : -1;
    if (j < 0) return;
    e.preventDefault();
    btns[j].focus(); // focus handler shows it and moves the roving tabindex
  });
  wide.addEventListener('change', () => show(active));
  show(active);
}
