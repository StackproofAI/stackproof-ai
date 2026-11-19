export interface ClientStrings {
  menu: string;
  closeMenu: string;
  contactEmail: string;
  form: Record<'required' | 'email' | 'url' | 'consent' | 'summary' | 'server' | 'rate' | 'verify' | 'sending' | 'submit', string>;
}
let cache: ClientStrings | null = null;
/** Strings rendered by the server from the locale file (no hard-coded copy in client code). */
export function i18n(): ClientStrings {
  if (!cache) cache = JSON.parse(document.getElementById('i18n')?.textContent ?? '{}') as ClientStrings;
  return cache;
}
