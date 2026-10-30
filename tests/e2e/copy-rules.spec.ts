import { expect, test } from '@playwright/test';
import { PUBLIC_PAGES } from './public-pages';
import { findBanned } from '../../src/lib/banned';

/**
 * Checks the visible text and metadata of every public page against the
 * advertising rules in CLAUDE.md. Prompt 11 turns this into a full build gate.
 */
const PAGES = [...PUBLIC_PAGES, ...['/booking-confirmed']];


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
    // A {token} that wasn't filled in, or a [label](url) link that wasn't turned into a link.
    expect(text.match(/\{[a-zA-Z][\w.]*\}|\]\(\/?[\w/#.-]*\)/g) ?? []).toEqual([]);
  });
}
