// Viewport screenshots per section (header in its natural sticky position), for the independent critic.
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const [base, out] = process.argv.slice(2);
const widths = [[1440, 900, 'desktop'], [1280, 800, 'laptop'], [768, 1024, 'tablet'], [390, 844, 'phone']];
const ids = ['top', 'problem', 'offer', 'systems', 'how', 'proof', 'assessment', 'faq', 'footer'];
const b = await chromium.launch();
for (const [w, h, name] of widths) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto(base, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  let i = 0;
  // Step through the page one viewport at a time so every pixel is covered once.
  const total = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < total; y += h - 80) {
    await p.evaluate((yy) => window.scrollTo(0, yy), y);
    await p.waitForTimeout(80);
    await p.screenshot({ path: `${out}/${name}-${String(++i).padStart(2, '0')}.png` });
  }
  await p.close();
}
await b.close();
console.log('ok');
