import { defineConfig, type Plugin } from 'vite';
import { cloudflare } from '@cloudflare/vite-plugin';
import { en } from './src/content/en.ts';
import { renderHome } from './src/render/home.ts';
import { renderPrivacy, renderNotFound, renderStyleguide } from './src/render/pages.ts';

/** Renders each HTML entry from the locale at build/dev time (all copy lives in src/content). */
function renderPages(): Plugin {
  const renderers: Record<string, () => string> = {
    home: () => renderHome(en),
    privacy: () => renderPrivacy(en),
    '404': () => renderNotFound(en),
    styleguide: () => renderStyleguide(en),
  };
  return {
    name: 'stackproof-render',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        const m = html.match(/<!--render:([\w-]+)-->/);
        if (!m) return html;
        const r = renderers[m[1]];
        if (!r) throw new Error(`Unknown page renderer: ${m[1]}`);
        return r();
      },
    },
  };
}

export default defineConfig({
  plugins: [renderPages(), cloudflare()],
  build: { target: 'es2022', cssCodeSplit: false },
  environments: {
    client: {
      build: {
        rollupOptions: {
          input: {
            index: 'index.html',
            privacy: 'privacy/index.html',
            notfound: '404.html',
            styleguide: '_styleguide/index.html',
          },
        },
      },
    },
  },
});
