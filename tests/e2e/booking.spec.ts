import { expect, test } from '@playwright/test';
import { site } from '../../src/config/site';

test.describe('/book', () => {
  test('short version, two options, check link and 10-day note', async ({ page }) => {
    await page.goto('/book');
    await expect(page.locator('h1')).toHaveText('Book your assessment');
    await expect(page.locator('section[aria-labelledby="short-version"] li')).toHaveCount(3);
    await expect(page.getByRole('heading', { name: 'Telehealth assessment' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'In person at Cannonvale' })).toBeVisible();
    await expect(page.locator('main')).toContainText('No Medicare rebate for video appointments.');
    await expect(page.locator('main')).toContainText('Medicare rebate may apply');
    await expect(page.getByRole('link', { name: /Do that first/ })).toHaveAttribute('href', '/check');
    await expect(page.locator('main')).toContainText(`at least ${site.booking.minLeadDays} days away`);
  });

  test('collects nothing: no form fields anywhere on the page', async ({ page }) => {
    await page.goto('/book');
    await expect(page.locator('main input, main select, main textarea, main form')).toHaveCount(0);
  });

  test('shows a TODO instead of a booking button while the provider is not set', async ({ page }) => {
    test.skip(site.booking.provider !== 'TODO', 'provider is set');
    await page.goto('/book');
    await expect(page.locator('[data-booking-todo]')).toBeVisible();
    await expect(page.locator('[data-cta^="booking"]')).toHaveCount(0);
  });

  test('loads no third-party content', async ({ page }) => {
    const external: string[] = [];
    page.on('request', (r) => {
      if (!r.url().startsWith('http://localhost:4321')) external.push(r.url());
    });
    await page.goto('/book', { waitUntil: 'networkidle' });
    expect(external).toEqual([]);
    await expect(page.locator('iframe')).toHaveCount(0);
  });
});

test.describe('booking panel modes (style guide demos)', () => {
  test('link mode: one large button to the provider', async ({ page }) => {
    await page.goto('/styleguide');
    const panel = page.getByRole('region', { name: 'Booking panel demo: link' });
    const button = panel.locator('[data-cta="booking-open"]');
    await expect(button).toHaveAttribute('href', '/booking-confirmed');
    expect((await button.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  });

  test('embedded mode: nothing loads until "Choose a time" is clicked', async ({ page }) => {
    await page.goto('/styleguide');
    const panel = page.getByRole('region', { name: 'Booking panel demo: embedded' });
    await expect(panel.locator('iframe')).toHaveCount(0);
    await expect(panel.locator('[data-booking-fallback]')).toHaveAttribute('target', '_blank');
    await panel.locator('[data-cta="booking-embed"]').click();
    const frame = panel.locator('iframe');
    await expect(frame).toHaveCount(1);
    await expect(frame).toHaveAttribute('src', '/booking-confirmed');
    await expect(frame).toHaveAttribute('title', /Book an appointment/);
    await expect(panel.locator('[data-cta="booking-embed"]')).toBeHidden();
  });
});

test.describe('/booking-confirmed', () => {
  test('timeline of next steps, hidden from search engines and the sitemap', async ({ page, request }) => {
    await page.goto('/booking-confirmed');
    await expect(page.locator('main ol > li')).toHaveCount(5);
    await expect(page.locator('main')).toContainText('Do the online intake on your phone.');
    await expect(page.locator('main')).toContainText('someone who knew you growing up');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    const sitemap = await (await request.get('/sitemap-0.xml')).text();
    expect(sitemap).not.toContain('booking-confirmed');
  });
});

test.describe('/cancellations', () => {
  test('covers changes, no-shows, unsuitable, not diagnosed and consumer rights', async ({ page }) => {
    await page.goto('/cancellations');
    for (const heading of [
      'Changing or cancelling an appointment',
      'Missed appointments',
      /If this service isn.t right for you/,
      /If ADHD isn.t diagnosed/,
      'Your rights',
    ]) {
      await expect(page.getByRole('heading', { level: 2, name: heading })).toBeVisible();
    }
    await expect(page.locator('main')).toContainText('Australian Consumer Law');
  });

  test('every undecided policy shows as a visible TODO', async ({ page }) => {
    await page.goto('/cancellations');
    const todos = await page.locator('main .todo').count();
    expect(todos).toBeGreaterThanOrEqual(4);
  });

  test('the footer Cancellations link now works', async ({ page }) => {
    await page.goto('/');
    await page.locator('footer').getByRole('link', { name: 'Cancellations' }).click();
    await expect(page).toHaveURL(/\/cancellations/);
    await expect(page.locator('h1')).toHaveText('Cancellations and refunds');
  });
});
