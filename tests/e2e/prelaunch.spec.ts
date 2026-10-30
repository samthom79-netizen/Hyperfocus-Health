import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { site } from '../../src/config/site';

/**
 * While site.launched is false the public preview must stay out of search
 * engines in three independent ways.
 */
test.describe('pre-launch protection', () => {
  test.skip(site.launched, 'site is launched');

  test('robots.txt blocks all crawlers', async ({ request }) => {
    const body = await (await request.get('/robots.txt')).text();
    expect(body).toMatch(/User-agent: \*\s*\nDisallow: \/\s*$/m);
  });

  for (const path of ['/', '/styleguide']) {
    test(`${path} carries a noindex tag`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    });
  }

  test('the Cloudflare _headers file sends X-Robots-Tag: noindex', () => {
    const headers = readFileSync(new URL('../../dist/_headers', import.meta.url), 'utf8');
    expect(headers).toMatch(/\/\*\s*\n\s+X-Robots-Tag: noindex/);
  });
});
