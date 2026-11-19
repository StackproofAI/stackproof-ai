// Packs the static build (dist/) into a single Worker script for deploy environments
// where the Static Assets upload can't run (see DECISIONS.md D-24). Applies the same
// rules as public/_headers and not_found_handling = "404-page".
import { readFileSync, readdirSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, relative, extname } from 'node:path';
const root = new URL('..', import.meta.url).pathname;
const dist = join(root, 'dist');
const SKIP = new Set(['wrangler.json', '_headers', '.assetsignore', '.dev.vars']);
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8', '.json': 'application/json' };
const files = {};
(function walk(d) {
  for (const n of readdirSync(d)) {
    const p = join(d, n);
    if (statSync(p).isDirectory()) { walk(p); continue; }
    const rel = '/' + relative(dist, p).split('\\').join('/');
    if (SKIP.has(n)) continue;
    files[rel] = { t: TYPES[extname(n)] ?? 'application/octet-stream', b: readFileSync(p).toString('base64') };
  }
})(dist);
// Security headers: parsed from public/_headers "/*" block so there is one source of truth.
const hdr = readFileSync(join(root, 'public/_headers'), 'utf8');
const global = {};
const block = hdr.split(/\n(?=\/)/)[0].split('\n').slice(1);
for (const line of block) { const m = line.match(/^\s+([\w-]+):\s*(.+)$/); if (m) global[m[1]] = m[2].trim(); }
const src = `const FILES = ${JSON.stringify(files)};
const GLOBAL = ${JSON.stringify(global)};
const bin = (b) => Uint8Array.from(atob(b), (c) => c.charCodeAt(0));
const cache = new Map();
function body(f) { let v = cache.get(f.b); if (!v) { v = bin(f.b); cache.set(f.b, v); } return v; }
function resolve(path) {
  if (FILES[path]) return path;
  if (path.endsWith('/') && FILES[path + 'index.html']) return path + 'index.html';
  if (FILES[path + '.html']) return path + '.html';
  return null;
}
export default {
  async fetch(req) {
    const url = new URL(req.url);
    if (req.method !== 'GET' && req.method !== 'HEAD') return new Response('Method not allowed', { status: 405, headers: { allow: 'GET, HEAD', ...GLOBAL } });
    let path = decodeURIComponent(url.pathname);
    if (path.endsWith('/index.html')) return Response.redirect(url.origin + path.slice(0, -10), 308);
    if (!path.endsWith('/') && FILES[path + '/index.html']) return Response.redirect(url.origin + path + '/' + url.search, 308);
    const key = resolve(path);
    const f = FILES[key ?? '/404.html'];
    const h = new Headers(GLOBAL);
    h.set('content-type', f.t);
    if (key && (key.startsWith('/assets/') || key.startsWith('/fonts/'))) h.set('cache-control', 'public, max-age=31536000, immutable');
    else if (key && /\\.(png|webp|svg)$/.test(key)) h.set('cache-control', 'public, max-age=86400');
    else h.set('cache-control', 'public, max-age=0, must-revalidate');
    if (path.startsWith('/_styleguide')) h.set('x-robots-tag', 'noindex, nofollow');
    return new Response(req.method === 'HEAD' ? null : body(f), { status: key ? 200 : 404, headers: h });
  },
};
`;
mkdirSync(join(root, 'dist-embedded'), { recursive: true });
writeFileSync(join(root, 'dist-embedded/worker.js'), src);
console.log(`packed ${Object.keys(files).length} files, ${(src.length / 1024).toFixed(0)} KB script`);
