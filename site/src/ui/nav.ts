import { i18n } from './i18n';

export function initNav(): void {
  const btn = document.querySelector<HTMLButtonElement>('[data-nav-toggle]');
  const list = document.getElementById('nav-list');
  if (!btn || !list) return;
  const label = btn.querySelector('[data-nav-label]');
  const set = (open: boolean) => {
    btn.setAttribute('aria-expanded', String(open));
    list.classList.toggle('is-open', open);
    if (label) label.textContent = open ? i18n().closeMenu : i18n().menu;
  };
  btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
  list.addEventListener('click', (e) => { if ((e.target as HTMLElement).closest('a')) set(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { set(false); btn.focus(); }
  });
  matchMedia('(min-width: 52.01rem)').addEventListener('change', (m) => { if (m.matches) set(false); });
}
