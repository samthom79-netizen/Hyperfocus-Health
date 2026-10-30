/**
 * Makes the share images (Open Graph / Twitter, 1200x630) for every public page
 * into public/og/<slug>.png, plus public/og/default.png.
 * Reads page titles from the built site, so run after a build:
 *
 *   npm run build && npm run og && npm run build
 *
 * (The second build copies the new images into dist.) Commit public/og/.
 */
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const root = new URL('..', import.meta.url).pathname;
const dist = join(root, 'dist');
const out = join(root, 'public', 'og');
const tmp = join(root, 'node_modules', '.og-tmp');
mkdirSync(out, { recursive: true });
mkdirSync(tmp, { recursive: true });

const SKIP = /^(styleguide|booking-confirmed|demo)/;
const BRAND = ' | Hyperfocus Health';

function pages(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return pages(p);
    return name.endsWith('.html') && !name.startsWith('404') ? [p] : [];
  });
}

const slugOf = (file) => {
  const rel = relative(dist, file).replace(/\.html$/, '').replace(/\/?index$/, '');
  return rel ? rel.replace(/\//g, '-') : 'home';
};

const decode = (s) =>
  s.replace(/&amp;/g, '&').replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

const font = (f) => pathToFileURL(join(root, 'node_modules', '@fontsource', f)).href;
const logo = pathToFileURL(join(root, 'src', 'assets', 'brand', 'logo-icon.png')).href;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const html = (title) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:J;font-weight:800;src:url(${font('plus-jakarta-sans/files/plus-jakarta-sans-latin-800-normal.woff2')})}
@font-face{font-family:J;font-weight:700;src:url(${font('plus-jakarta-sans/files/plus-jakarta-sans-latin-700-normal.woff2')})}
@font-face{font-family:A;font-weight:400;src:url(${font('atkinson-hyperlegible/files/atkinson-hyperlegible-latin-400-normal.woff2')})}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#08343F;color:#fff;font-family:A;padding:64px 72px;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden}
.ring{position:absolute;right:-250px;top:-250px;width:560px;height:560px;border-radius:50%;border:60px solid #13C999;opacity:.16}
.brand{display:flex;align-items:center;gap:18px;font-family:J;font-weight:800;font-size:40px}
.brand img{width:64px;height:64px}
.brand span{color:#13C999}
h1{font-family:J;font-weight:800;font-size:${title.length > 42 ? 62 : 72}px;line-height:1.1;max-width:1000px;letter-spacing:-.01em}
.foot{font-size:30px;color:#E3F6EF}
.foot b{color:#13C999;font-weight:400}
</style></head><body><div class="ring"></div>
<div class="brand"><img src="${logo}" alt="">Hyperfocus&nbsp;<span>Health</span></div>
<h1>${esc(title)}</h1>
<div class="foot">Adult ADHD assessment by video <b>·</b> Queensland adults 18+</div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });

async function shoot(title, slug) {
  const file = join(tmp, `${slug}.html`);
  writeFileSync(file, html(title));
  await page.goto(pathToFileURL(file).href);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: join(out, `${slug}.png`) });
}

await shoot('Adult ADHD assessment, start to finish with one specialist GP', 'default');
let n = 1;
for (const file of pages(dist)) {
  const slug = slugOf(file);
  if (SKIP.test(slug)) continue;
  const m = readFileSync(file, 'utf8').match(/<title>([^<]*)<\/title>/);
  if (!m) continue;
  const title = decode(m[1]).replace(BRAND, '');
  await shoot(slug === 'home' ? 'Adult ADHD assessment, start to finish with one specialist GP' : title, slug);
  n++;
}
await browser.close();
console.log(`Made ${n} share images in public/og/`);
