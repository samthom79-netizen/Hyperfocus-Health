import { expect, test, type Page } from '@playwright/test';

const PAGES = ['/', '/styleguide'];

async function noHorizontalScroll(page: Page) {
  return page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);
}

test.describe('header', () => {
  test('desktop: 4 nav links, Focus mode and Check eligibility; no menu button', async ({ page }, info) => {
    test.skip(info.project.name !== 'desktop', 'desktop only');
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Main', exact: true });
    await expect(nav.getByRole('link')).toHaveText(['How it works', 'Pricing', 'About Dr Sam', 'FAQ']);
    await expect(page.locator('header [data-cta="header"]')).toHaveText('Check eligibility');
    await expect(page.locator('header [data-focus-toggle]').first()).toBeVisible();
    await expect(page.locator('[data-menu-button]')).toBeHidden();
  });

  test('mobile: Check eligibility stays visible and the menu opens and closes', async ({ page }, info) => {
    test.skip(info.project.name !== 'mobile', 'mobile only');
    await page.goto('/');
    await expect(page.locator('header [data-cta="header"]')).toBeVisible();

    const menuButton = page.locator('[data-menu-button]');
    const panel = page.locator('#mobile-menu');
    await expect(panel).toBeHidden();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');

    await menuButton.click();
    await expect(panel).toBeVisible();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    await expect(panel.getByRole('link')).toHaveText(['How it works', 'Pricing', 'About Dr Sam', 'FAQ']);

    await page.keyboard.press('Escape');
    await expect(panel).toBeHidden();
    await expect(menuButton).toBeFocused();
  });

  test('mobile: header controls are at least 44px tall', async ({ page }, info) => {
    test.skip(info.project.name !== 'mobile', 'mobile only');
    await page.goto('/');
    for (const selector of ['header [data-cta="header"]', '[data-menu-button]']) {
      const box = await page.locator(selector).boundingBox();
      expect(box?.height, selector).toBeGreaterThanOrEqual(44);
      expect(box?.width, selector).toBeGreaterThanOrEqual(44);
    }
  });
});

test.describe('focus mode', () => {
  test('toggles, enlarges text, hides decorative images and survives a reload', async ({ page }, info) => {
    await page.goto('/styleguide');
    const html = page.locator('html');
    const toggle = info.project.name === 'mobile' ? page.locator('#mobile-menu [data-focus-toggle]') : page.locator('header [data-focus-toggle]').first();
    if (info.project.name === 'mobile') await page.locator('[data-menu-button]').click();

    await expect(html).not.toHaveClass(/focus-mode/);
    await expect(page.locator('[data-decorative]').first()).toBeVisible();

    await toggle.click();
    await expect(html).toHaveClass(/focus-mode/);
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    expect(await html.evaluate((el) => getComputedStyle(el).fontSize)).toBe('20px');
    await expect(page.locator('[data-decorative]').first()).toBeHidden();

    await page.reload();
    await expect(html).toHaveClass(/focus-mode/);
  });

  test('still works when browser storage is blocked', async ({ page }, info) => {
    test.skip(info.project.name !== 'desktop', 'desktop only');
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', {
        get() {
          throw new Error('storage blocked');
        },
      });
    });
    await page.goto('/');
    await page.locator('header [data-focus-toggle]').first().click();
    await expect(page.locator('html')).toHaveClass(/focus-mode/);
    expect(errors).toEqual([]);
  });
});

test.describe('footer', () => {
  for (const path of PAGES) {
    test(`${path} carries the required footer content`, async ({ page }) => {
      await page.goto(path);
      const footer = page.locator('footer');
      await expect(footer).toContainText('In an emergency call 000');
      await expect(footer).toContainText('13 11 14');
      await expect(footer).toContainText('1300 642 255');
      await expect(footer).toContainText('Queensland adults 18+ only.');
      await expect(footer).toContainText('MED0002290862');
      await expect(footer).toContainText('ABN');
      const policies = footer.getByRole('navigation', { name: 'Policies' }).getByRole('link');
      await expect(policies).toHaveText(['Privacy', 'Terms', 'Cancellations', 'Complaints', 'Accessibility']);
    });
  }
});

test.describe('layout', () => {
  for (const path of PAGES) {
    for (const width of [320, 360, 390, 412]) {
      for (const focus of [false, true]) {
        test(`${path} has no sideways scroll at ${width}px${focus ? ' in Focus mode' : ''}`, async ({ page }, info) => {
          test.skip(info.project.name !== 'mobile', 'run once');
          if (focus) await page.addInitScript(() => localStorage.setItem('hf-focus-mode', '1'));
          await page.setViewportSize({ width, height: 800 });
          await page.goto(path);
          expect(await noHorizontalScroll(page)).toBe(true);
        });
      }
    }
  }

  test('every image has alt text and set dimensions', async ({ page }) => {
    await page.goto('/styleguide');
    const missing = await page.locator('img').evaluateAll((imgs) =>
      imgs
        .filter((img) => !img.hasAttribute('alt') || !img.getAttribute('width') || !img.getAttribute('height'))
        .map((img) => img.getAttribute('src')),
    );
    expect(missing).toEqual([]);
  });

  test('the doctor photo is served as AVIF/WebP', async ({ page }) => {
    await page.goto('/styleguide');
    const types = await page.locator('#doctor picture').first().locator('source').evaluateAll((s) => s.map((el) => el.getAttribute('type')));
    expect(types).toEqual(['image/avif', 'image/webp']);
  });
});

test.describe('style guide', () => {
  test('is hidden from search engines', async ({ page, request }) => {
    await page.goto('/styleguide');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    const sitemap = await (await request.get('/sitemap-0.xml')).text();
    expect(sitemap).toContain('<loc>');
    expect(sitemap).not.toContain('styleguide');
  });

  test('shows every component', async ({ page }) => {
    await page.goto('/styleguide');
    for (const heading of ['Colours', 'Buttons', 'Time badges', 'Cards', 'Step list', 'Callouts', 'Accordion', 'Price cards', 'Short version', 'Doctor card', 'Crisis strip', 'Focus mode']) {
      // .first(): the Short version demo box carries its own 'Short version' heading.
      await expect(page.getByRole('heading', { level: 2, name: heading, exact: true }).first()).toBeVisible();
    }
  });

  test('accordion opens without JavaScript', async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto('/styleguide');
    const first = page.locator('#accordion details').first();
    await first.locator('summary').click();
    await expect(first).toHaveAttribute('open', '');
    await ctx.close();
  });
});
