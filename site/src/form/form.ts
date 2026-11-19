import { i18n } from '../ui/i18n';

type Errors = Partial<Record<string, string>>;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const URLISH = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/\S*)?$/i;

function validate(fd: FormData): Errors {
  const t = i18n().form;
  const e: Errors = {};
  for (const k of ['name', 'email', 'company', 'country', 'team_size', 'process']) {
    if (!String(fd.get(k) ?? '').trim()) e[k] = t.required;
  }
  const email = String(fd.get('email') ?? '').trim();
  if (email && !EMAIL.test(email)) e.email = t.email;
  const site = String(fd.get('website') ?? '').trim();
  if (site && !URLISH.test(site)) e.website = t.url;
  if (!fd.get('consent')) e.consent = t.consent;
  return e;
}

function showErrors(form: HTMLFormElement, errors: Errors): void {
  for (const el of form.querySelectorAll<HTMLElement>('[data-error-for]')) {
    const k = el.dataset.errorFor!;
    const msg = errors[k];
    el.hidden = !msg;
    el.textContent = msg ?? '';
    const field = el.closest('[data-field]');
    field?.classList.toggle('has-error', !!msg);
    const control = form.querySelector<HTMLElement>(`[name="${k}"]`);
    if (control) control.setAttribute('aria-invalid', String(!!msg));
  }
}

export function initForm(): void {
  const form = document.querySelector<HTMLFormElement>('[data-lead-form]');
  if (!form) return;
  const alert = form.querySelector<HTMLElement>('[data-form-alert]')!;
  const submit = form.querySelector<HTMLButtonElement>('[data-submit]')!;
  const success = document.querySelector<HTMLElement>('[data-form-success]');
  const otherBox = form.querySelector<HTMLInputElement>('[data-tools-other]');
  const otherWrap = form.querySelector<HTMLElement>('[data-tools-other-wrap]');
  otherBox?.addEventListener('change', () => { if (otherWrap) otherWrap.hidden = !otherBox.checked; });

  // Re-validate a field once it has been flagged, so errors clear as the visitor fixes them.
  form.addEventListener('input', (ev) => {
    const name = (ev.target as HTMLInputElement).name;
    const field = form.querySelector(`[data-error-for="${name}"]`);
    if (field && !(field as HTMLElement).hidden) {
      const errs = validate(new FormData(form));
      const el = field as HTMLElement;
      el.hidden = !errs[name]; el.textContent = errs[name] ?? '';
      el.closest('[data-field]')?.classList.toggle('has-error', !!errs[name]);
      form.querySelector(`[name="${name}"]`)?.setAttribute('aria-invalid', String(!!errs[name]));
    }
  });

  let busy = false;
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    if (busy) return; // double-click guard
    const t = i18n().form;
    const fd = new FormData(form);
    const errors = validate(fd);
    showErrors(form, errors);
    alert.hidden = true;
    const first = Object.keys(errors)[0];
    if (first) {
      alert.textContent = t.summary;
      alert.hidden = false;
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    busy = true;
    submit.setAttribute('aria-disabled', 'true');
    submit.textContent = t.sending;
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { accept: 'application/json' },
        body: fd,
        signal: AbortSignal.timeout(15000),
      });
      const data = (await res.json().catch(() => ({}))) as { status?: string; errors?: Errors };
      if (res.ok && (data.status === 'saved' || data.status === 'duplicate')) {
        form.hidden = true;
        if (success) { success.hidden = false; success.focus(); }
        return;
      }
      if (res.status === 400 && data.errors) {
        showErrors(form, data.errors);
        alert.textContent = t.summary;
      } else if (res.status === 429) {
        alert.textContent = t.rate;
      } else if (res.status === 403) {
        alert.textContent = t.verify;
      } else {
        throw new Error(String(res.status));
      }
      alert.hidden = false;
    } catch {
      const mail = i18n().contactEmail;
      alert.innerHTML = '';
      alert.append(`${t.server} `);
      const a = document.createElement('a'); a.href = `mailto:${mail}`; a.textContent = mail;
      alert.append(a, '.');
      alert.hidden = false;
    } finally {
      busy = false;
      submit.removeAttribute('aria-disabled');
      submit.textContent = t.submit;
    }
  });
}
