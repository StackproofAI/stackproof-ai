/** Phone-only sticky CTA: visible once the hero CTA has scrolled away, hidden while the form section is in view. */
export function initStickyCta(): void {
  const bar = document.querySelector<HTMLElement>('[data-sticky-cta]');
  const hero = document.querySelector('.hero .cta-row');
  const form = document.getElementById('assessment');
  if (!bar || !hero || !form || !('IntersectionObserver' in window)) return;
  let heroVisible = true, formVisible = false;
  const update = () => { bar.hidden = heroVisible || formVisible; };
  new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting || e.boundingClientRect.top > 0; update(); }).observe(hero);
  new IntersectionObserver(([e]) => { formVisible = e.isIntersecting; update(); }, { rootMargin: '0px 0px -20% 0px' }).observe(form);
}
