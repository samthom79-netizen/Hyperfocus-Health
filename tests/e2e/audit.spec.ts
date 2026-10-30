/**
 * Site-wide audit (Prompt 11). Runs in its own Playwright project ('audit'):
 *   npx playwright test --project=audit
 *
 * For every page, at 390px (phone) and 1280px (desktop):
 *   - a full-page screenshot into docs/screenshots/
 *   - an axe-core accessibility scan with zero serious or critical issues
 *   - the raw HTML (view-source) contains the page's H1: proof of pre-rendering
 *   - the footer carries the crisis numbers
 *   - no sideways scroll
 * Plus: the eligibility checker's on-screen outcomes match the pure decision
 * logic in src/lib/eligibility.ts for a spread of answer combinations.
 */
import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdirSync } from 'node:fs';
import { h1Text } from '../../scripts/lib/html';
import { evaluate, type Answers } from '../../src/lib/eligibility';
import { PUBLIC_PAGES } from './public-pages';

const PAGES = [...PUBLIC_PAGES, '/booking-confirmed', '/styleguide'];
const SIZES = [
  { name: '390', width: 390, height: 844 },
  { name: '1280', width: 1280, height: 800 },
];
const OUT = 'docs/screenshots';
mkdirSync(OUT, { recursive: true });

const slug = (p: string) => (p === '/' ? 'home' : p.replace(/^\//, '').replace(/\//g, '-'));

async function settle(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  // Scroll through so lazy images load before the screenshot.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
    window.scrollTo(0, 0);
  });
}

for (const path of PAGES) {
  for (const size of SIZES) {
    test(`${path} at ${size.name}px: screenshot, accessibility, pre-rendered H1, crisis footer, no sideways scroll`, async ({ page, request }) => {
      await page.setViewportSize({ width: size.width, height: size.height });
      await page.goto(path);
      await settle(page);
      await page.screenshot({ path: `${OUT}/${slug(path)}-${size.name}.png`, fullPage: true });

      // Accessibility: nothing serious or critical (WCAG 2.2 AA tags plus best practice).
      // The style guide's contrast table shows failing pairs on purpose (as 'don't' examples).
      const axe = await new AxeBuilder({ page }).exclude('[data-contrast-demo]').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
      const serious = axe.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
      expect(
        serious.map((v) => `${v.id} (${v.impact}): ${v.help}\n  ${v.nodes.slice(0, 3).map((n) => n.html.slice(0, 120)).join('\n  ')}`),
      ).toEqual([]);

      // Pre-rendering: the raw HTML, as a crawler sees it, holds the H1 text.
      const raw = await (await request.get(path)).text();
      const h1 = (await page.locator('h1').first().innerText()).replace(/\s+/g, ' ').trim();
      expect(h1.length).toBeGreaterThan(0);
      expect(h1Text(raw)?.replace(/\s+/g, ' ')).toBe(h1);

      // Crisis numbers in every footer.
      const footer = page.locator('footer');
      await expect(footer).toContainText('In an emergency call 000');
      await expect(footer).toContainText('13 11 14');
      await expect(footer).toContainText('1300 642 255');

      // No sideways scroll.
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
}

test.describe('checker outcomes match the decision logic', () => {
  const yesNo = ['yes', 'no'] as const;
  const combos: Answers[] = [];
  for (const adult of yesNo)
    for (const queensland of yesNo)
      for (const history of [[], ['bipolar']])
        for (const safety of yesNo) combos.push({ adult, queensland, history, current: [], safety });
  combos.push({ adult: 'yes', queensland: 'yes', history: [], current: ['s8'], safety: 'no' });
  combos.push({ adult: 'yes', queensland: 'yes', history: ['heart', 'eating'], current: ['pregnancy', 'untreated'], safety: 'no' });
  combos.push({ adult: 'yes', queensland: 'yes', history: [], current: ['support'], safety: 'yes' });

  for (const a of combos) {
    const label = `adult=${a.adult} qld=${a.queensland} history=[${a.history}] current=[${a.current}] safety=${a.safety}`;
    test(`${label} → ${evaluate(a)}`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('/check');
      await page.locator(`[data-answer="${a.adult}"]`).click();
      await page.locator(`[data-answer="${a.queensland}"]`).click();
      for (const group of [a.history, a.current]) {
        if (group.length === 0) await page.locator('[data-none]').click();
        else {
          for (const id of group) await page.locator(`[data-option="${id}"]`).click();
          await page.locator('[data-continue]').click();
        }
      }
      // The safety 'yes' stops at once; otherwise the info screen follows.
      await page.locator(`[data-answer="${a.safety}"]`).click();
      if (a.safety === 'no') await page.locator('[data-continue]').click();
      await expect(page.locator(`[data-outcome="${evaluate(a)}"]`)).toBeVisible();
      await expect(page.locator('[data-outcome]')).toHaveCount(1);
    });
  }
});
