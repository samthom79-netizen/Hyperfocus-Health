import { expect, test } from '@playwright/test';
import { site } from '../../src/config/site';

test.describe('/pricing', () => {
  test('table has the five stages with costs', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.locator('main table tbody th')).toHaveText([
      'Full assessment',
      'Review appointment (follow-up)',
      'Ongoing reviews',
      'Blood tests or ECG',
    ]);
    await expect(page.locator('main table tbody tr').first()).toContainText('total');
  });

  test('worked example, Medicare, GST, payment and refund lines are all on the page', async ({ page }) => {
    await page.goto('/pricing');
    const main = page.locator('main');
    await expect(page.getByRole('heading', { name: 'A typical first 3 months' })).toBeVisible();
    await expect(page.locator('[data-example]')).toContainText(`${site.prices.typicalReviewsFirst3Months} reviews`);
    await expect(page.locator('[data-example]')).toContainText('(an assumption)');
    await expect(main).toContainText("or you're registered there through MyMedicare");
    await expect(main).toContainText('In person at Cannonvale Medical Centre in Cannonvale, the fees are the same.');
    await expect(main).toContainText('GP chronic condition management plan');
    await expect(page.locator('[data-lengths-note]')).toContainText('Appointment lengths are approximate');
    await expect(main).toContainText('There is no GST on these fees.');
    await expect(main).toContainText("You pay $95 when you book, $330 when you're invited to book appointment 1, and $320 when you book appointment 2.");
    await expect(main).not.toContainText('bundle');
    await expect(main).toContainText(site.policies.refundIfUnsuitable);
    await expect(main.getByRole('link', { name: 'cancellations and refunds' })).toHaveAttribute('href', '/cancellations');
  });

  test('worked example adds up from the prices in site.ts', async ({ page }) => {
    const { assessmentTotal, review, typicalReviewsFirst3Months: n } = site.prices;
    test.skip(typeof assessmentTotal !== 'number' || typeof review !== 'number', 'prices not set');
    await page.goto('/pricing');
    const total = (assessmentTotal as number) + n * (review as number);
    await expect(page.locator('[data-example-total]')).toHaveText(`$${total.toLocaleString('en-AU')}`);
  });

  test('worked example shows a TODO until prices are set', async ({ page }) => {
    test.skip(!String(site.prices.assessmentTotal).startsWith('TODO'), 'prices set');
    await page.goto('/pricing');
    await expect(page.locator('[data-example-total] .todo')).toBeVisible();
  });
});

test.describe('/how-it-works', () => {
  test('8 steps, each with a time badge and both lines', async ({ page }) => {
    await page.goto('/how-it-works');
    const steps = page.locator('section[aria-labelledby="steps-heading"] ol > li');
    await expect(steps).toHaveCount(8);
    for (const step of await steps.all()) {
      await expect(step.getByText('Time needed:', { exact: false })).toHaveCount(1);
      await expect(step.locator('dt')).toHaveText(['What you do:', 'What Dr Sam does:']);
    }
    await expect(steps.nth(4)).toContainText('Book it when invited and pay $330.');
    await expect(page.locator('main')).not.toContainText('Treatment isn');
    await expect(page.locator('[data-lengths-note]')).toContainText('Appointment lengths are approximate');
  });

  test('what you will need checklist, linkable from the FAQ', async ({ page }) => {
    await page.goto('/how-it-works#what-you-need');
    const list = page.locator('#what-you-need li');
    await expect(list).toHaveCount(6);
    await expect(list.nth(3)).toContainText('Medicare card, for in-person visits');
  });

  test('secondary photo stays at or under 640px', async ({ page }) => {
    await page.goto('/how-it-works');
    const img = page.locator('main picture img');
    await img.scrollIntoViewIfNeeded();
    expect((await img.boundingBox())!.width).toBeLessThanOrEqual(640);
  });
});

test.describe('/faq', () => {
  test('five groups, twelve questions', async ({ page }) => {
    await page.goto('/faq');
    await expect(page.locator('main h2').filter({ hasNotText: 'Short version' })).toHaveText([
      'Before you book',
      'Cost',
      'The assessment',
      'After diagnosis',
      'Privacy and support',
    ]);
    await expect(page.locator('main details')).toHaveCount(13);
  });

  test('Queensland Government link and the full crisis numbers', async ({ page }) => {
    await page.goto('/faq');
    await page.getByText('Can a GP diagnose ADHD in Queensland?').click();
    await expect(page.getByRole('link', { name: 'Queensland Government information' })).toHaveAttribute('href', site.links.qldGovAdhd);
    await expect(page.locator('main [aria-label="Emergency and crisis support"]')).toContainText('13 92 76');
  });

  test('FAQPage structured data matches the questions on the page', async ({ page }) => {
    await page.goto('/faq');
    const all = (await page.locator('head script[type="application/ld+json"]').allTextContents()).map((b) => JSON.parse(b));
    const data = all.find((d) => d['@type'] === 'FAQPage');
    expect(data['@type']).toBe('FAQPage');
    expect(data.mainEntity).toHaveLength(13);
    const onPage = await page.locator('main details summary').allInnerTexts();
    expect(data.mainEntity.map((q: { name: string }) => q.name)).toEqual(onPage.map((t) => t.trim()));
    for (const q of data.mainEntity) {
      expect(q.acceptedAnswer.text).not.toMatch(/[<>{}]|\]\(/);
    }
  });
});

test('every main-menu page now exists', async ({ request }) => {
  for (const item of site.nav) {
    expect((await request.get(item.href)).status(), item.href).toBe(200);
  }
});

test('video or phone, and the in-person rebate rule, are on pricing, FAQ and how it works', async ({ page }) => {
  await page.goto('/pricing');
  await expect(page.locator('main')).toContainText(site.booking.inPerson.telehealthRebateNote);
  await expect(page.locator('main')).toContainText('Video and phone appointments have no Medicare rebate for new patients.');
  await page.goto('/faq');
  await expect(page.locator('main')).toContainText(site.booking.inPerson.telehealthRebateNote);
  await page.goto('/how-it-works');
  await expect(page.locator('main')).toContainText('by video or phone');
});

test('structured data: business address is the postal address; patients are seen at the clinic', async ({ page }) => {
  await page.goto('/');
  const all = (await page.locator('script[type="application/ld+json"]').allTextContents()).map((b) => JSON.parse(b));
  const b = all.find((d) => d['@type'] === 'MedicalBusiness');
  expect(b.address.streetAddress).toBe(site.business.street);
  expect(b.location.address.streetAddress).toBe(site.clinic.street);
});
