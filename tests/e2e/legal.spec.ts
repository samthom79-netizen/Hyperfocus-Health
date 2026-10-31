import { expect, test } from '@playwright/test';
import { site } from '../../src/config/site';

const LEGAL = ['/privacy', '/collection-notice', '/terms', '/complaints', '/accessibility'];

for (const path of LEGAL) {
  test(`${path}: draft banner, short version, every footer policy link works`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('[data-draft-banner]')).toContainText(site.legal.draftBanner);
    await expect(page.locator('main').getByRole('heading', { name: 'Short version' })).toBeVisible();
  });
}

test('every footer policy link resolves', async ({ page, request }) => {
  await page.goto('/');
  const hrefs = await page.getByRole('navigation', { name: 'Policies' }).getByRole('link').evaluateAll((as) => as.map((a) => a.getAttribute('href')!));
  for (const h of hrefs) expect((await request.get(h)).status(), h).toBe(200);
});

test('privacy names every vendor slot and the OAIC route', async ({ page }) => {
  await page.goto('/privacy');
  const main = page.locator('main');
  for (const h of ['Booking and payment', 'Online pre-assessment form', 'Phone assistant', 'Appointments and your health record', 'Note-taking during appointments', 'Email']) {
    await expect(main.getByRole('heading', { name: h })).toBeVisible();
  }
  await expect(main).toContainText('Information sent overseas');
  await expect(main.getByRole('link', { name: 'Office of the Australian Information Commissioner' })).toHaveAttribute('href', site.links.oaicComplaint);
  await expect(main).toContainText(site.legal.oaicPhone);
  // Undecided vendors show as visible TODO boxes, never as guesses.
  expect(await main.locator('.todo').count()).toBeGreaterThan(5);
});

test('complaints: us first, then OHO, with Ahpra and the OAIC', async ({ page }) => {
  await page.goto('/complaints');
  const main = page.locator('main');
  await expect(main).toContainText(`We reply within ${site.contact.complaintsReplyWithin}.`);
  await expect(main).toContainText('133 OHO (133 646)');
  await expect(main.getByRole('link', { name: 'make a complaint to the OHO' })).toHaveAttribute('href', site.links.ohoComplaint);
  await expect(main.getByRole('link', { name: 'Ahpra' })).toHaveAttribute('href', site.links.ahpra);
});

test('collection notice is linked from the contact and booking pages', async ({ page }) => {
  for (const p of ['/contact', '/book']) {
    await page.goto(p);
    await expect(page.locator('main a[href="/collection-notice"]')).toHaveCount(1);
  }
});

test('terms and cancellations agree on the money', async ({ page }) => {
  await page.goto('/terms');
  await expect(page.locator('main a[href="/cancellations"]')).toHaveCount(1);
  await page.goto('/cancellations');
  const main = page.locator('main');
  await expect(main).toContainText(site.policies.cancellation);
  await expect(main).toContainText(site.policies.noShow);
  await expect(main).toContainText('48 hours');
});
