import { expect, test } from '@playwright/test';
import { isTodo, site } from '../../src/config/site';

test.describe('/contact', () => {
  test('phone card carries the AI receptionist label', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.locator('[data-receptionist-label]')).toHaveText(site.receptionist.label);
    await expect(page.locator('[data-receptionist-label]')).toContainText("It can't give medical advice.");
  });

  test('phone and email are TODO boxes until set, then click-to-call and mailto links', async ({ page }) => {
    await page.goto('/contact');
    const phone = page.locator('[data-contact-phone]');
    const email = page.locator('[data-contact-email]');
    if (isTodo(site.contact.phone)) await expect(phone.locator('.todo')).toBeVisible();
    else await expect(phone.locator('a[href^="tel:"]')).toBeVisible();
    if (isTodo(site.contact.email)) await expect(email.locator('.todo')).toBeVisible();
    else await expect(email.locator('a[href^="mailto:"]')).toBeVisible();
    await expect(email).toContainText(`A person replies within ${site.contact.humanReplyWithin}.`);
  });

  test('full crisis numbers, in-person booking line and no health details by email', async ({ page }) => {
    await page.goto('/contact');
    const main = page.locator('main');
    await expect(main.locator('[aria-label="Emergency and crisis support"]')).toContainText('13 92 76');
    await expect(main).toContainText(`Call ${site.clinic.phone}`);
    await expect(main).toContainText(/Please don.t put health details or your Medicare number in an email/);
  });

  test('no third-party requests and no assistant button until a vendor widget is set', async ({ page }) => {
    const outside: string[] = [];
    page.on('request', (r) => {
      const host = new URL(r.url()).hostname;
      if (!['localhost', '127.0.0.1'].includes(host)) outside.push(r.url());
    });
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
    expect(outside).toEqual([]);
    const set = Boolean(site.receptionist.webWidget.scriptUrl && site.receptionist.webWidget.agentId);
    await expect(page.locator('[data-assistant-open]')).toHaveCount(set ? 1 : 0);
  });

  test('footer links to the contact page', async ({ page }) => {
    await page.goto('/');
    await page.locator('footer').getByRole('link', { name: 'Contact' }).click();
    await expect(page).toHaveURL(/\/contact/);
  });
});

test('assistant script loads only after the visitor clicks (styleguide demo)', async ({ page }) => {
  const scripts: string[] = [];
  page.on('request', (r) => {
    if (r.url().includes('assistant-demo.js')) scripts.push(r.url());
  });
  await page.goto('/styleguide#assistant');
  await page.waitForLoadState('networkidle');
  expect(scripts).toEqual([]);
  await page.locator('[data-assistant-open]').click();
  await expect(page.locator('hf-demo-assistant')).toHaveText(/Demo assistant loaded/);
  expect(scripts).toHaveLength(1);
  await expect(page.locator('[data-assistant-open]')).toBeHidden();
});
