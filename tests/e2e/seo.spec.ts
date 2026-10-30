import { expect, test } from '@playwright/test';
import { site } from '../../src/config/site';
import { findBanned } from '../../src/lib/banned';
import { LOCATIONS, PUBLIC_PAGES, RESOURCES } from './public-pages';

type Meta = { path: string; title: string; description: string };

test.describe('every public page', () => {
  test.describe.configure({ mode: 'serial' });
  const seen: Meta[] = [];

  for (const path of PUBLIC_PAGES) {
    test(`${path}: title, description, canonical, share image, structured data`, async ({ page, request }) => {
      await page.goto(path);
      const title = await page.title();
      const description = (await page.locator('meta[name="description"]').getAttribute('content')) ?? '';
      expect(title.length, title).toBeLessThanOrEqual(60);
      expect(description.length, description).toBeGreaterThan(50);
      expect(description.length, description).toBeLessThanOrEqual(155);
      expect(findBanned(`${title} ${description}`)).toEqual([]);
      seen.push({ path, title, description });

      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonical).toBe(new URL(path, site.url).href);
      if (!site.launched) await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);

      const og = (await page.locator('meta[property="og:image"]').getAttribute('content'))!;
      expect(og).not.toContain('default.png');
      expect((await request.get(new URL(og).pathname)).status()).toBe(200);
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', canonical!);

      const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
      const data = blocks.map((b) => JSON.parse(b));
      const types = data.map((d) => d['@type']);
      expect(types).toContain('MedicalBusiness');
      const business = data.find((d) => d['@type'] === 'MedicalBusiness');
      expect(business.areaServed).toEqual({ '@type': 'State', name: 'Queensland' });
      expect(business.address.addressLocality).toBe('Cannonvale');
      if (path !== '/') {
        const crumbs = data.find((d) => d['@type'] === 'BreadcrumbList');
        expect(crumbs.itemListElement[0]).toMatchObject({ position: 1, name: 'Home' });
        expect(crumbs.itemListElement.at(-1).item).toBe(new URL(path, site.url).href);
      }
      for (const d of data) expect(JSON.stringify(d)).not.toMatch(/TODO/);
    });
  }

  test('titles and descriptions are unique across the site', () => {
    expect(seen.length).toBe(PUBLIC_PAGES.length);
    expect(new Set(seen.map((m) => m.title)).size).toBe(seen.length);
    expect(new Set(seen.map((m) => m.description)).size).toBe(seen.length);
  });
});

test('structured data: Physician on /about, FAQPage on /faq', async ({ page }) => {
  await page.goto('/about');
  const about = (await page.locator('script[type="application/ld+json"]').allTextContents()).map((b) => JSON.parse(b));
  expect(about.map((d) => d['@type'])).toContain('IndividualPhysician');
  await page.goto('/faq');
  const faq = (await page.locator('script[type="application/ld+json"]').allTextContents()).map((b) => JSON.parse(b));
  expect(faq.map((d) => d['@type'])).toContain('FAQPage');
});

test('robots.txt matches the launch switch', async ({ request }) => {
  const txt = await (await request.get('/robots.txt')).text();
  if (site.launched) expect(txt).toContain('User-agent: ClaudeBot');
  else expect(txt).toContain('Disallow: /');
});

test('sitemap lists every public page and no internal ones', async ({ request }) => {
  const index = await (await request.get('/sitemap-index.xml')).text();
  const file = new URL(index.match(/<loc>([^<]+)<\/loc>/)![1]).pathname;
  const xml = await (await request.get(file)).text();
  for (const path of PUBLIC_PAGES) expect(xml, path).toContain(`<loc>${new URL(path, site.url).href}`);
  expect(xml).not.toMatch(/styleguide|booking-confirmed|\/demo\//);
});

test('/llms.txt summarises the service, follows the rules and links every area and article', async ({ request }) => {
  const res = await request.get('/llms.txt');
  expect(res.headers()['content-type']).toContain('text/plain');
  const txt = await res.text();
  expect(txt).toMatch(/^# Hyperfocus Health/);
  expect(txt).toContain('$745');
  expect(txt).toContain('$89');
  expect(txt).toContain('In an emergency call 000');
  for (const line of site.notSuitable) expect(txt).toContain(`- ${line}`);
  for (const c of LOCATIONS) expect(txt).toContain(new URL(`/adhd-assessment/${c}`, site.url).href);
  for (const r of RESOURCES) expect(txt).toContain(new URL(`/resources/${r}`, site.url).href);
  const outsideList = txt.replace(/## Not suitable for[\s\S]*?\n## /, '## ');
  expect(findBanned(outsideList)).toEqual([]);
  expect(txt).not.toMatch(/\{[a-z][\w.]*\}/);
});

test.describe('location pages', () => {
  for (const c of LOCATIONS) {
    test(`${c}: first line says video or phone, and that the only clinic is Cannonvale`, async ({ page }) => {
      await page.goto(`/adhd-assessment/${c}`);
      const first = page.locator('[data-first-line]');
      await expect(first).toHaveText(/^Video or phone appointments for adults (in|on) .+\. Our only physical clinic is in Cannonvale\.$/);
      await expect(page.locator('main h1 + p')).toHaveAttribute('data-first-line', '');
      await expect(page.locator('[data-in-person]')).toHaveCount(['mackay', 'whitsundays'].includes(c) ? 1 : 0);
      await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toContainText('Areas we cover');
    });
  }

  test('hub lists all 8 areas', async ({ page }) => {
    await page.goto('/adhd-assessment');
    for (const c of LOCATIONS) await expect(page.locator(`main a[href="/adhd-assessment/${c}"]`)).toHaveCount(1);
  });
});

test.describe('resources', () => {
  test('index lists all 5 articles', async ({ page }) => {
    await page.goto('/resources');
    for (const r of RESOURCES) await expect(page.locator(`main a[href="/resources/${r}"]`)).toHaveCount(1);
  });

  for (const r of RESOURCES) {
    test(`${r}: short version, reviewer line, numbered references that work`, async ({ page }) => {
      await page.goto(`/resources/${r}`);
      await expect(page.locator('main').getByRole('heading', { name: 'Short version' })).toBeVisible();
      // Until Dr Sam has reviewed an article, the page must say so plainly (never claim a review that hasn't happened).
      await expect(page.locator('[data-reviewed]')).toContainText(/Reviewed by Dr Sam Thomas, specialist GP, on \d|Draft: not yet reviewed by Dr Sam Thomas/);
      const refs = page.locator('[data-references] li');
      const count = await refs.count();
      expect(count).toBeGreaterThanOrEqual(3);
      const firstCite = page.locator('main sup a').first();
      const target = (await firstCite.getAttribute('href'))!;
      await expect(page.locator(target)).toHaveCount(1);
      for (const href of await refs.locator('a').evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).href))) {
        expect(href).toMatch(/^https:\/\//);
      }
    });
  }

  test('the GP article cites the Queensland Government page first', async ({ page }) => {
    await page.goto('/resources/can-a-gp-diagnose-adhd-in-queensland');
    await expect(page.locator('#ref-1 a')).toHaveAttribute('href', site.links.qldGovAdhd);
  });
});

test('footer links to areas and resources', async ({ page }) => {
  await page.goto('/');
  const footer = page.locator('footer');
  await expect(footer.getByRole('link', { name: 'Areas we cover' })).toHaveAttribute('href', '/adhd-assessment');
  await expect(footer.getByRole('link', { name: 'Resources' })).toHaveAttribute('href', '/resources');
});
