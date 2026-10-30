import { expect, test } from '@playwright/test';

test.describe('homepage', () => {
  test('is pre-rendered with its real text in the HTML source', async ({ request }) => {
    const res = await request.get('/');
    expect(res.ok()).toBeTruthy();
    const html = await res.text();
    expect(html).toContain('<h1');
    expect(html).toContain('Adult ADHD assessment by video');
  });

  test('shows the primary call to action', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /check if this is for you/i })).toBeVisible();
  });

  test('footer carries the emergency and crisis numbers', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    await expect(footer).toContainText('In an emergency call 000');
    await expect(footer).toContainText('13 11 14');
    await expect(footer).toContainText('1300 642 255');
  });

  test('has no horizontal scroll on a phone', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'mobile only');
    await page.goto('/');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);
  });
});
