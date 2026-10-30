import { expect, test } from '@playwright/test';
import { findBanned } from '../../src/lib/banned';

/**
 * Checks the visible text and metadata of every public page against the
 * advertising rules in CLAUDE.md. Prompt 11 turns this into a full build gate.
 */
const PAGES = ['/', '/other-options', '/check', '/book', '/booking-confirmed', '/cancellations'];


for (const path of PAGES) {
  test(`${path} follows the advertising rules`, async ({ page }) => {
    await page.goto(path);
    const text = await page.evaluate(() => {
      const meta = [...document.querySelectorAll('title, meta[name="description"], img[alt]')]
        .map((el) => el.getAttribute('content') ?? el.getAttribute('alt') ?? el.textContent ?? '')
        .join(' ');
      return `${document.body.innerText} ${meta}`;
    });
    const hits = findBanned(text);
    expect(hits).toEqual([]);
  });
}
