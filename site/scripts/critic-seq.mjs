// Frame sequences standing in for short screen recordings (the critic can only view images).
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const [base, out] = process.argv.slice(2);
const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const shot = (p, name, clip) => p.screenshot({ path: `${out}/${name}.png`, ...(clip ? { clip } : {}) });
async function page(opts) { const p = await b.newPage(opts); await p.goto(base); return p; }
const top = (p, sel) => p.evaluate((s) => document.querySelector(s).getBoundingClientRect().top + scrollY, sel);
const scrollTo = (p, y) => p.evaluate((v) => window.scrollTo(0, v), y);

// 1. Desktop hero (3D): intro over ~4 s, then scroll press.
let p = await page({ viewport: { width: 1440, height: 900 } });
for (const [i, t] of [[1, 300], [2, 700], [3, 1500], [4, 2500], [5, 4000]]) { await p.waitForTimeout(i === 1 ? t : t - [0, 300, 700, 1500, 2500][i - 1]); await shot(p, `hero-desktop-${i}-t${t}ms`); }
for (const [i, y] of [[6, 150], [7, 350], [8, 550]]) { await scrollTo(p, y); await p.waitForTimeout(900); await shot(p, `hero-desktop-${i}-scroll${y}`); }
// 2. Problem diagram scrub.
const pt = await top(p, '.problem-diagram');
for (const [i, d] of [[1, -700], [2, -550], [3, -400], [4, -250]]) { await scrollTo(p, pt + d); await p.waitForTimeout(900); await shot(p, `problem-desktop-${i}`); }
// 3. Constellation assembling (frames after entering view).
const st = await top(p, '.constellation');
await scrollTo(p, st - 200);
for (const [i, t] of [[1, 150], [2, 450], [3, 900], [4, 1600]]) { await p.waitForTimeout(i === 1 ? t : t - [0, 150, 450, 900][i - 1]); await shot(p, `systems-desktop-${i}-t${t}ms`); }
await p.hover('[data-sys="S2"]'); await p.waitForTimeout(400); await shot(p, 'systems-desktop-5-hover-S2');
// 4. Spiral per stage.
const ht = await top(p, '[data-how]');
for (const [i, d] of [[1, -300], [2, 100], [3, 450], [4, 800], [5, 1150]]) { await scrollTo(p, ht + d); await p.waitForTimeout(1100); await shot(p, `spiral-desktop-${i}`); }
await p.close();
// 5. Phone hero (2D SVG fallback) + press.
p = await page({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
for (const [i, t] of [[1, 400], [2, 1500]]) { await p.waitForTimeout(i === 1 ? t : 1100); await shot(p, `hero-phone-${i}-t${t}ms`); }
for (const [i, y] of [[3, 250], [4, 600]]) { await scrollTo(p, y); await p.waitForTimeout(900); await shot(p, `hero-phone-${i}-scroll${y}`); }
await p.close();
// 6. Reduced motion: final states, no 3D.
p = await page({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
await p.waitForTimeout(1500); await shot(p, 'reduced-desktop-1-hero');
await scrollTo(p, await top(p, '.problem-diagram') - 300); await p.waitForTimeout(500); await shot(p, 'reduced-desktop-2-problem');
await scrollTo(p, await top(p, '[data-how]') - 100); await p.waitForTimeout(500); await shot(p, 'reduced-desktop-3-spiral');
await p.close();
await b.close();
console.log('ok');
