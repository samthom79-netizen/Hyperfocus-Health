/**
 * Takes review screenshots of the built site into docs/screenshots/.
 * Needs a preview server running on http://localhost:4321 (npm run preview).
 *
 * Run: node scripts/screenshots.mjs [path ...]   (defaults to / and /styleguide)
 */
import { mkdirSync } from 'node:fs';
import { chromium, devices } from 'playwright';

const BASE = process.env.BASE_URL ?? 'http://localhost:4321';
const paths = process.argv.slice(2).length ? process.argv.slice(2) : ['/', '/styleguide'];
const out = new URL('../docs/screenshots/', import.meta.url).pathname;
mkdirSync(out, { recursive: true });

const slug = (p) => (p === '/' ? 'home' : p.replace(/^\/|\/$/g, '').replace(/\//g, '-'));

/** Scroll through the page so lazy-loaded images load, then wait for them. */
async function loadLazyImages(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight / 2) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForLoadState('networkidle');
  // Hidden images (e.g. decorative ones in Focus mode) never load: skip them.
  await page.waitForFunction(() => [...document.images].filter((img) => img.checkVisibility()).every((img) => img.complete));
}

const browser = await chromium.launch();
const shots = [
  { name: 'phone-360', options: { viewport: { width: 360, height: 760 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true } },
  { name: 'phone-412', options: { ...devices['Pixel 7'] } },
  { name: 'desktop', options: { viewport: { width: 1280, height: 800 } } },
];

for (const path of paths) {
  for (const { name, options } of shots) {
    const ctx = await browser.newContext(options);
    const page = await ctx.newPage();
    await page.goto(BASE + path, { waitUntil: 'networkidle' });
    await loadLazyImages(page);
    await page.screenshot({ path: `${out}${slug(path)}-${name}.png`, fullPage: true });
    await ctx.close();
  }
}

// Mobile menu open, and Focus mode on, for the first path.
{
  const ctx = await browser.newContext({ ...devices['Pixel 7'] });
  const page = await ctx.newPage();
  await page.goto(BASE + paths[0], { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /open menu/i }).click();
  await page.screenshot({ path: `${out}${slug(paths[0])}-menu-open.png` });
  await page.locator('#mobile-menu [data-focus-toggle]').click();
  await page.getByRole('button', { name: /close menu/i }).click();
  await loadLazyImages(page);
  await page.screenshot({ path: `${out}${slug(paths[0])}-focus-mode.png`, fullPage: true });
  await ctx.close();
}

await browser.close();
console.log(`Screenshots written to docs/screenshots/`);
