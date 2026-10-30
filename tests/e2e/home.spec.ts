import { expect, test } from '@playwright/test';
import { site } from '../../src/config/site';

test.describe('homepage', () => {
  test('sections appear in the agreed order', async ({ page }) => {
    await page.goto('/');
    const headings = await page.locator('main h1, main h2').allInnerTexts();
    expect(headings).toEqual([
      'Adult ADHD assessment by video or phone, for Queenslanders',
      'Dr Sam Thomas',
      'Short version',
      'How it works',
      "Why it's different",
      'Meet Dr Sam',
      'What it costs',
      'Is this for you?',
      'Common questions',
      'Not sure yet?',
    ]);
  });

  test('hero: sub-heading, CTA, secondary link, trust row and doctor photo', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('One doctor who has ADHD himself, from your first appointment to ongoing care.')).toBeVisible();
    const cta = page.locator('[data-cta="hero"]');
    await expect(cta).toHaveText(/Check if this is for you \(60 sec\)/);
    await expect(cta).toHaveAttribute('href', '/check');
    await expect(page.getByRole('link', { name: 'See how it works' })).toHaveAttribute('href', '/how-it-works');
    await expect(page.getByRole('list', { name: 'At a glance' }).getByRole('listitem')).toHaveText([
      'Specialist GP (FRACGP)',
      'Ahpra registered',
      'Queensland adults 18+',
      'No referral needed',
    ]);
    const photo = page.locator('section[aria-labelledby="hero-heading"] picture img');
    await expect(photo).toBeVisible();
    expect((await photo.boundingBox())!.width).toBeLessThanOrEqual(280);
  });

  test('short version has 3 bullets', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#short-version + ul li, section[aria-labelledby="short-version"] li')).toHaveCount(3);
  });

  test('how it works: 5 steps, each with a time badge', async ({ page }) => {
    await page.goto('/');
    const steps = page.locator('section[aria-labelledby="how-heading"] ol > li');
    await expect(steps).toHaveCount(5);
    for (const step of await steps.all()) {
      await expect(step.getByText('Time needed:', { exact: false })).toHaveCount(1);
    }
  });

  test('why it is different: 3 cards', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('section[aria-labelledby="different-heading"] h3')).toHaveText([
      'A doctor who gets it',
      'Built for ADHD brains',
      'More than a diagnosis',
    ]);
  });

  test('links go to the right pages', async ({ page }) => {
    await page.goto('/');
    for (const [name, href] of [
      ['See every step in detail', '/how-it-works'],
      ['See all prices, including follow-up reviews', '/pricing'],
      ['Your other options, and how to ask for a referral', '/other-options'],
      ['All questions', '/faq'],
    ]) {
      await expect(page.getByRole('link', { name })).toHaveAttribute('href', href);
    }
    await expect(page.locator('main a[href="/about"]').first()).toBeVisible();
    await expect(page.locator('[data-cta="final"]')).toHaveAttribute('href', '/check');
  });

  test('the not-suitable list is word-for-word from the rules', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-not-suitable] li')).toHaveText([...site.notSuitable]);
  });

  test('FAQ has 5 questions and works', async ({ page }) => {
    await page.goto('/');
    const items = page.locator('section[aria-labelledby="faq-heading"] details');
    await expect(items).toHaveCount(5);
    await items.first().locator('summary').click();
    await expect(items.first()).toContainText('No. You can book directly.');
  });

  test('final band says nothing ticked is saved', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('section[aria-labelledby="final-heading"]')).toContainText('Nothing you tick is saved.');
  });
});

test.describe('other options page', () => {
  test('is kind, explains referrals and shows full crisis support', async ({ page }) => {
    await page.goto('/other-options');
    await expect(page.locator('h1')).toHaveText('Other ways to get help');
    await expect(page.getByRole('heading', { name: 'How to ask your GP for a referral' })).toBeVisible();
    // Markdown turns ' into a curly apostrophe.
    await expect(page.locator('main')).toContainText(/isn.t a judgement about you/);
    const crisis = page.locator('main [aria-label="Emergency and crisis support"]');
    await expect(crisis).toContainText('13 92 76');
    // No booking push on this page.
    await expect(page.locator('main a[href="/check"]')).toHaveCount(0);
  });
});
