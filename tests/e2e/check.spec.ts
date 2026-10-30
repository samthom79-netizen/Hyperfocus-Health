import { expect, test, type Page } from '@playwright/test';

const yes = (page: Page) => page.locator('[data-answer="yes"]').click();
const no = (page: Page) => page.locator('[data-answer="no"]').click();
const none = (page: Page) => page.locator('[data-none]').click();
const cont = (page: Page) => page.locator('[data-continue]').click();
const heading = (page: Page) => page.locator('h2').first();

async function open(page: Page) {
  await page.goto('/check');
  await expect(page.locator('[data-answer="yes"]')).toBeEnabled();
}

test.describe('eligibility checker: paths', () => {
  test('fit: Queensland adult, nothing ticked, no safety concern', async ({ page }) => {
    await open(page);
    await expect(heading(page)).toHaveText('Are you 18 or over?');
    await expect(page.getByText('Nothing you tick is saved or sent anywhere.').first()).toBeVisible();
    await yes(page);
    await expect(heading(page)).toContainText('Do you live in Queensland');
    await yes(page);
    await expect(heading(page)).toContainText('diagnosed with or treated for');
    await none(page);
    await expect(heading(page)).toContainText('Right now');
    await none(page);
    await expect(heading(page)).toContainText('thoughts of ending your life');
    await no(page);
    await expect(heading(page)).toContainText('Not sure about something?');
    await cont(page);
    const outcome = page.locator('[data-outcome="fit"]');
    await expect(outcome).toBeVisible();
    await expect(outcome).toContainText('This service looks like a good fit.');
    await expect(outcome).toContainText('total to reach a diagnosis');
    await expect(outcome).toContainText('at least 10 days after booking');
    await expect(outcome.locator('[data-cta="book"]')).toHaveAttribute('href', '/book');
  });

  test('under 18: kind message, own GP, no booking button', async ({ page }) => {
    await open(page);
    await no(page);
    await yes(page);
    await none(page);
    await none(page);
    await no(page);
    await cont(page);
    const outcome = page.locator('[data-outcome="not-eligible"]');
    await expect(outcome).toContainText('you need to be 18 or over');
    await expect(outcome).toContainText('Your own GP is the right place to start');
    await expect(outcome.locator('a[href="/book"]')).toHaveCount(0);
    await expect(outcome.locator('a[href="/other-options"]')).toBeVisible();
  });

  test('outside Queensland: kind message, no booking button', async ({ page }) => {
    await open(page);
    await yes(page);
    await no(page);
    await none(page);
    await none(page);
    await no(page);
    await cont(page);
    const outcome = page.locator('[data-outcome="not-eligible"]');
    await expect(outcome).toContainText('only for people who live in Queensland');
    await expect(outcome.locator('a[href="/book"]')).toHaveCount(0);
  });

  test('health exclusion: no blame, no list of what was ticked, link to other options', async ({ page }) => {
    await open(page);
    await yes(page);
    await yes(page);
    await page.locator('[data-option="bipolar"]').click();
    await page.locator('[data-option="heart"]').click();
    await cont(page);
    await page.locator('[data-option="s8"]').click();
    await cont(page);
    await no(page);
    await cont(page);
    const outcome = page.locator('[data-outcome="exclusion"]');
    await expect(outcome).toContainText("This service isn't the safest place to start for you.");
    await expect(outcome).toContainText("isn't a judgement about you");
    await expect(outcome).not.toContainText(/bipolar|heart|schedule 8/i);
    await expect(outcome.locator('a[href="/other-options"]')).toBeVisible();
    await expect(outcome.locator('a[href="/book"]')).toHaveCount(0);
  });

  test('safety yes: stops at once, shows support with tap-to-call numbers', async ({ page }) => {
    await open(page);
    await yes(page);
    await yes(page);
    await none(page);
    await none(page);
    await yes(page);
    const outcome = page.locator('[data-outcome="safety"]');
    await expect(outcome).toBeVisible();
    await expect(outcome).toContainText("If you're in danger now, call 000.");
    await expect(outcome.locator('a[href="tel:000"]')).toBeVisible();
    for (const tel of ['tel:131114', 'tel:1300642255', 'tel:1300659467', 'tel:139276']) {
      await expect(outcome.locator(`a[href="${tel}"]`)).toBeVisible();
    }
    await expect(outcome).toContainText('talk to your GP this week');
    await expect(outcome.locator('a[href="/book"]')).toHaveCount(0);
    await expect(outcome).not.toContainText('Kids Helpline');
    // Question 6 was never shown.
    await expect(page.locator('[data-continue]')).toHaveCount(0);
  });

  test('safety yes overrides an exclusion and not-eligible, and adds Kids Helpline for under 18s', async ({ page }) => {
    await open(page);
    await no(page);
    await no(page);
    await page.locator('[data-option="bipolar"]').click();
    await cont(page);
    await none(page);
    await yes(page);
    const outcome = page.locator('[data-outcome="safety"]');
    await expect(outcome).toBeVisible();
    await expect(outcome.locator('a[href="tel:1800551800"]')).toContainText('Kids Helpline');
  });
});

test.describe('eligibility checker: behaviour', () => {
  test('progress bar counts up and back keeps earlier answers', async ({ page }) => {
    await open(page);
    const bar = page.getByRole('progressbar');
    await expect(bar).toHaveAttribute('aria-valuenow', '1');
    await expect(page.getByText('Question 1 of 6')).toBeVisible();
    await yes(page);
    await expect(bar).toHaveAttribute('aria-valuenow', '2');
    await yes(page);
    await page.locator('[data-option="eating"]').click();
    await cont(page);
    await expect(bar).toHaveAttribute('aria-valuenow', '4');
    await page.locator('[data-back]').click();
    await expect(bar).toHaveAttribute('aria-valuenow', '3');
    await expect(page.locator('[data-option="eating"]')).toHaveAttribute('aria-checked', 'true');
  });

  test('Continue is disabled until a box is ticked; None of these moves on', async ({ page }) => {
    await open(page);
    await yes(page);
    await yes(page);
    await expect(page.locator('[data-continue]')).toBeDisabled();
    await page.locator('[data-option="eating"]').click();
    await expect(page.locator('[data-continue]')).toBeEnabled();
    await page.locator('[data-option="eating"]').click();
    await expect(page.locator('[data-continue]')).toBeDisabled();
    await none(page);
    await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '4');
  });

  test('focus moves to each new question heading', async ({ page }) => {
    await open(page);
    await yes(page);
    await expect(page.locator('h2:focus')).toContainText('Do you live in Queensland');
    await yes(page);
    await expect(page.locator('h2:focus')).toContainText('diagnosed with or treated for');
    await none(page);
    await none(page);
    await yes(page);
    await expect(page.locator('h2:focus')).toContainText("If you're in danger now");
  });

  test('can be completed with the keyboard alone', async ({ page }, info) => {
    test.skip(info.project.name !== 'desktop', 'keyboard flow once');
    await open(page);
    // Tab forward until the wanted control has focus (max 15 presses), then press a key.
    const tabTo = async (selector: string, key: 'Enter' | 'Space') => {
      for (let i = 0; i < 15; i++) {
        if (await page.locator(`${selector}:focus`).count()) break;
        await page.keyboard.press('Tab');
      }
      await expect(page.locator(selector)).toBeFocused();
      await page.keyboard.press(key);
    };
    await tabTo('[data-answer="yes"]', 'Enter'); // 18+: yes
    await expect(page.locator('h2:focus')).toContainText('Queensland');
    await tabTo('[data-answer="yes"]', 'Space'); // Queensland: yes
    await expect(page.locator('h2:focus')).toContainText('diagnosed');
    await tabTo('[data-none]', 'Enter');
    await expect(page.locator('h2:focus')).toContainText('Right now');
    await tabTo('[data-none]', 'Enter');
    await expect(page.locator('h2:focus')).toContainText('thoughts of ending your life');
    await tabTo('[data-answer="no"]', 'Enter'); // safety: no
    await tabTo('[data-continue]', 'Enter'); // See my result
    await expect(page.locator('[data-outcome="fit"] h2:focus')).toBeVisible();
    await tabTo('[data-cta="book"]', 'Enter'); // links activate with Enter
    await expect(page).toHaveURL(/\/book/);
  });

  test('restart clears everything', async ({ page }) => {
    await open(page);
    await yes(page);
    await yes(page);
    await page.locator('[data-option="bipolar"]').click();
    await cont(page);
    await none(page);
    await no(page);
    await cont(page);
    await page.locator('[data-restart]').click();
    await expect(heading(page)).toHaveText('Are you 18 or over?');
    await yes(page);
    await yes(page);
    await expect(page.locator('[data-option="bipolar"]')).toHaveAttribute('aria-checked', 'false');
  });

  test('every choice is at least 44px tall', async ({ page }) => {
    await open(page);
    await yes(page);
    await yes(page);
    for (const el of await page.locator('[data-option], [data-continue], [data-none], [data-back]').all()) {
      const box = await el.boundingBox();
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }
  });
});

test.describe('eligibility checker: privacy', () => {
  test('answering sends no requests and stores nothing', async ({ page }) => {
    await open(page);
    const requests: string[] = [];
    page.on('request', (r) => requests.push(r.url()));
    await yes(page);
    await yes(page);
    await page.locator('[data-option="bipolar"]').click();
    await cont(page);
    await page.locator('[data-option="s8"]').click();
    await cont(page);
    await yes(page);
    await expect(page.locator('[data-outcome="safety"]')).toBeVisible();
    expect(requests).toEqual([]);
    const storage = await page.evaluate(() => ({
      local: Object.keys(localStorage),
      session: Object.keys(sessionStorage),
      cookie: document.cookie,
    }));
    expect(storage).toEqual({ local: [], session: [], cookie: '' });
  });

  test('analytics: only event names, never answers; nothing from the safety screen', async ({ page }) => {
    await page.addInitScript(() => {
      (window as unknown as { __events: string[] }).__events = [];
      (window as unknown as { plausible: (e: string, o?: unknown) => void }).plausible = (e, o) => {
        (window as unknown as { __events: string[] }).__events.push(JSON.stringify([e, o ?? null]));
      };
    });
    const events = () => page.evaluate(() => (window as unknown as { __events: string[] }).__events);

    await open(page);
    await yes(page);
    await yes(page);
    await none(page);
    await none(page);
    await yes(page);
    await expect(page.locator('[data-outcome="safety"]')).toBeVisible();
    expect(await events()).toEqual(['["check_started",null]']);

    await page.goto('/check');
    await expect(page.locator('[data-answer="yes"]')).toBeEnabled();
    await yes(page);
    await yes(page);
    await none(page);
    await none(page);
    await no(page);
    await cont(page);
    await expect(page.locator('[data-outcome="fit"]')).toBeVisible();
    expect(await events()).toEqual(['["check_started",null]', '["check_result_fit",null]']);
  });
});
