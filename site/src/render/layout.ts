import { SITE, type Locale } from '../content/en.ts';
import { markSvg } from './mark.ts';

export const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const ext = (t: Locale, href: string, label: string, cls = '') =>
  `<a class="${cls}" href="${href}" target="_blank" rel="noopener noreferrer">${label}<span class="sr-only"> ${t.a11y.newTab}</span><span class="ext" aria-hidden="true">↗</span></a>`;

interface HeadOpts {
  title: string;
  description: string;
  path: string; // canonical path, e.g. "/"
  noindex?: boolean;
  jsonLd?: object[];
  preloadFonts?: boolean;
}

export function head(t: Locale, o: HeadOpts): string {
  const url = SITE.origin + o.path;
  const ld = (o.jsonLd ?? [])
    .map((j) => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, '\\u003c')}</script>`)
    .join('\n');
  return `<meta charset="utf-8">
<script>document.documentElement.classList.add('js')</script>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(o.title)}</title>
<meta name="description" content="${esc(o.description)}">
<link rel="canonical" href="${url}">
${o.noindex ? '<meta name="robots" content="noindex, nofollow">' : ''}
<meta name="theme-color" content="#0B1220">
<meta name="color-scheme" content="dark">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:locale" content="${t.locale}">
<meta property="og:title" content="${esc(o.title)}">
<meta property="og:description" content="${esc(o.description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE.origin}/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Stackproof AI: five interlocking blocks forming an S, with a lime centre block">
<meta name="twitter:card" content="summary_large_image">
${o.preloadFonts === false ? '' : '<link rel="preload" href="/fonts/geist-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>'}
${ld}`;
}

export function header(t: Locale, onHome = true): string {
  const base = onHome ? '' : '/';
  return `<a class="skip" href="#main">${t.a11y.skip}</a>
<header class="site-header" data-header>
  <div class="wrap header-inner">
    <a class="brand" href="/" aria-label="${t.a11y.home}">${markSvg('brand-mark')}<span class="brand-word">STACKPROOF<span class="brand-ai"> AI</span></span></a>
    <nav class="nav" aria-label="${t.a11y.primaryNav}">
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-list" data-nav-toggle>
        <span class="nav-toggle-bars" aria-hidden="true"></span><span class="sr-only" data-nav-label>${t.a11y.menu}</span>
      </button>
      <ul class="nav-list" id="nav-list">
        ${t.nav.items.map((i) => `<li><a href="${base}${i.href}">${i.label}</a></li>`).join('')}
        <li class="nav-cta-item"><a class="btn btn-sm btn-primary" href="${SITE.calUrl}" target="_blank" rel="noopener noreferrer" data-cta="book">${t.nav.cta}<span class="sr-only"> ${t.a11y.newTab}</span></a></li>
      </ul>
    </nav>
  </div>
</header>`;
}

export function footer(t: Locale): string {
  const year = new Date().getUTCFullYear();
  return `<footer class="site-footer">
  <div class="wrap footer-inner">
    <div class="footer-brand">
      <a class="brand" href="/" aria-label="${t.a11y.home}">${markSvg('brand-mark')}<span class="brand-word">STACKPROOF<span class="brand-ai"> AI</span></span></a>
      <p class="footer-tag">${t.footer.tagline}</p>
      <p class="footer-motto mono">${t.footer.motto}</p>
    </div>
    <nav class="footer-nav" aria-label="${t.a11y.footerNav}">
      <ul>
        <li><a href="/privacy/">${t.footer.privacy}</a></li>
        <li><a href="mailto:${SITE.contactEmail}">${SITE.contactEmail}</a></li>
        <li>${ext(t, SITE.social.linkedin, 'LinkedIn')}</li>
        <li>${ext(t, SITE.social.instagram, 'Instagram')}</li>
        <li>${ext(t, SITE.social.github, 'GitHub')}</li>
      </ul>
    </nav>
    <p class="footer-legal mono">© ${year} ${SITE.legalName}. ${t.footer.rights}</p>
  </div>
</footer>`;
}

export function page(t: Locale, headHtml: string, body: string, opts: { onHome?: boolean; bodyClass?: string; script?: boolean } = {}): string {
  return `<!doctype html>
<html lang="${t.lang}">
<head>
${headHtml}
<link rel="stylesheet" href="/src/styles/main.css">
</head>
<body class="${opts.bodyClass ?? ''}">
${header(t, opts.onHome ?? true)}
<main id="main" tabindex="-1">
${body}
</main>
${footer(t)}
${opts.script === false ? '' : `<script type="application/json" id="i18n">${JSON.stringify({ menu: t.a11y.menu, closeMenu: t.a11y.closeMenu, contactEmail: SITE.contactEmail }).replace(/</g, '\\u003c')}</script>\n<script type="module" src="/src/main.ts"></script>`}
</body>
</html>`;
}
