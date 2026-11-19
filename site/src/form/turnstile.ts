/** Loads Cloudflare Turnstile only when the form comes near the viewport (never on first paint). */
declare global {
  interface Window {
    turnstile?: { render: (el: HTMLElement, o: Record<string, unknown>) => string; reset: (id?: string) => void; getResponse: (id?: string) => string | undefined };
    __tsReady?: () => void;
  }
}
let widgetId: string | undefined;
let loading: Promise<void> | null = null;

function load(): Promise<void> {
  if (loading) return loading;
  loading = new Promise((resolve, reject) => {
    window.__tsReady = () => resolve();
    const s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=__tsReady';
    s.async = true;
    s.onerror = () => reject(new Error('turnstile load failed'));
    document.head.appendChild(s);
  });
  return loading;
}

export function initTurnstile(form: HTMLFormElement): void {
  const slot = form.querySelector<HTMLElement>('[data-turnstile]');
  if (!slot) return;
  const mount = async () => {
    try {
      await load();
      if (widgetId === undefined && window.turnstile) {
        widgetId = window.turnstile.render(slot, { sitekey: slot.dataset.sitekey, theme: 'dark', appearance: 'interaction-only', action: 'lead' });
      }
    } catch { /* submit will report verification failure honestly */ }
  };
  const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); mount(); } }, { rootMargin: '600px 0px' });
  io.observe(form);
  form.addEventListener('focusin', mount, { once: true });
}

export const resetTurnstile = () => { try { window.turnstile?.reset(widgetId); } catch { /* ignore */ } };
