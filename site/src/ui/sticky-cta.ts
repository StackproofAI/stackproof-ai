/** Phone-only sticky CTA: visible once the hero CTA has scrolled away, hidden while the form section is in view. */
export function initStickyCta(): void {
  const bar = document.querySelector<HTMLElement>('[data-sticky-cta]');
  const hero = document.querySelector('.hero .cta-row');
  const form = document.getElementById('assessment');
  if (!bar || !('IntersectionObserver' in window)) return;
  let heroVisible = !!hero, formVisible = false;
  const inline = new Set<Element>();
  const update = () => { bar.hidden = heroVisible || formVisible || inline.size > 0; };
  const io = new IntersectionObserver((es) => { for (const e of es) e.isIntersecting ? inline.add(e.target) : inline.delete(e.target); update(); });
  for (const b of document.querySelectorAll('main .btn-primary')) if (!bar.contains(b) && !b.closest('.cta-row')) io.observe(b);
  if (hero) new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting || e.boundingClientRect.top > 0; update(); }).observe(hero);
  if (form) new IntersectionObserver(([e]) => { formVisible = e.isIntersecting || e.boundingClientRect.top < 0; update(); }, { rootMargin: '0px 0px -20% 0px' }).observe(form);
  update();
}
