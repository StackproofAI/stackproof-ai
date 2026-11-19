// Renders favicon PNGs, apple-touch-icon, logo.png and og.png from the approved mark.
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname, '..');
const mark = readFileSync(`${root}/brand/stackproof-mark.svg`, 'utf8').replace('<svg ', '<svg style="width:100%;height:100%" ');
const font = (f) => `url(data:font/woff2;base64,${readFileSync(`${root}/public/fonts/${f}`).toString('base64')})`;
const css = `@font-face{font-family:G;src:${font('geist-latin-wght-normal.woff2')};font-weight:100 900}
@font-face{font-family:M;src:${font('geist-mono-latin-wght-normal.woff2')};font-weight:100 900}
html,body{margin:0;background:#040508}`;
const b = await chromium.launch();
async function shot(w, h, body, out, bg = '#040508') {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await p.setContent(`<style>${css} body{background:${bg}}</style>${body}`, { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: `${root}/public/${out}`, omitBackground: bg === 'transparent' });
  await p.close();
}
const icon = (s, pad) => `<div style="width:${s}px;height:${s}px;display:grid;place-items:center"><div style="width:${s - pad * 2}px;height:${(s - pad * 2) * 656 / 780}px">${mark}</div></div>`;
await shot(32, 32, icon(32, 1), 'favicon-32.png');
await shot(180, 180, icon(180, 26), 'apple-touch-icon.png');
await shot(512, 512, icon(512, 56), 'logo.png');
const og = `<div style="position:relative;width:1200px;height:630px;overflow:hidden;font-family:G;color:#E8ECEF">
<svg width="1200" height="630" style="position:absolute;inset:0" fill="none">
 <circle cx="930" cy="315" r="250" stroke="#75879A" stroke-width="2" stroke-dasharray="0.1 12" stroke-linecap="round"/>
 <circle cx="930" cy="315" r="290" stroke="#75879A" stroke-opacity=".35"/>
 <path d="M60 40h12M66 34v12M1128 40h12M1134 34v12M60 590h12M66 584v12M1128 590h12M1134 584v12" stroke="#75879A"/>
 <path d="M930 0v40M930 590v40" stroke="#75879A" stroke-opacity=".5"/>
</svg>
<div style="position:absolute;left:770px;top:180px;width:320px;height:269px">${mark}</div>
<div style="position:absolute;left:80px;top:96px;width:640px">
 <div style="font-family:M;font-size:20px;letter-spacing:.14em;color:#CEF949;text-transform:uppercase">Stackproof AI</div>
 <div style="font-size:62px;font-weight:600;line-height:1.04;letter-spacing:-.035em;margin-top:28px">Find the work your business should stop doing by hand.</div>
 <div style="font-family:M;font-size:20px;color:#9AA8B6;margin-top:36px;letter-spacing:.04em">Free written Automation Opportunity Assessment</div>
</div></div>`;
await shot(1200, 630, og, 'og.png');
await b.close();
console.log('images written');
