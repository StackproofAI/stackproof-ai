// Usage: node scripts/shots.mjs <baseUrl> <outDir> [dpr]
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const [base, out, dpr = '1'] = process.argv.slice(2);
const widths = [[1440, 900], [1280, 800], [768, 1024], [390, 844]];
const sections = ['.hero', '#problem', '#offer', '#systems', '#how', '#proof', '#assessment', '#faq', '.book', '.site-footer'];
const b = await chromium.launch();
const errors = [];
for (const [w, h] of widths) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: +dpr });
  p.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`${w}: ${m.text()}`); });
  p.on('pageerror', (e) => errors.push(`${w}: ${e.message}`));
  const ext = [];
  p.on('request', (r) => { const u = new URL(r.url()); if (!['localhost', '127.0.0.1'].includes(u.hostname) && !u.hostname.endsWith('workers.dev')) ext.push(r.url()); });
  await p.goto(base, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  const sw = await p.evaluate(() => document.documentElement.scrollWidth);
  if (sw > w) errors.push(`${w}: horizontal overflow scrollWidth=${sw}`);
  await p.screenshot({ path: `${out}/full-${w}.png`, fullPage: true });
  for (const s of sections) {
    const el = await p.$(s);
    if (el) await el.screenshot({ path: `${out}/${w}-${s.replace(/[#.]/g, '')}.png` });
  }
  if (ext.length) errors.push(`${w}: external requests: ${ext.join(', ')}`);
  await p.close();
}
await b.close();
console.log(errors.length ? errors.join('\n') : 'no console errors, no overflow, no external requests');
