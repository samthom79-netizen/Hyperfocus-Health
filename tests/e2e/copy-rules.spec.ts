import { expect, test } from '@playwright/test';

/**
 * Checks the visible text and metadata of every public page against the
 * advertising rules in CLAUDE.md. Prompt 11 turns this into a full build gate.
 */
const PAGES = ['/', '/other-options'];

const BANNED: [RegExp, string][] = [
  [/\b(dexa?mf?ph?etamine|lisdexamfetamine|methylphenidate|atomoxetine|guanfacine)\b/i, 'medicine name'],
  [/\b(vyvanse|ritalin|concerta|strattera|intuniv)\b/i, 'medicine brand'],
  [/\bstimulants?\b|\badhd medications?\b|\bmeds\b|\bscripts?\b|\bprescriptions?\b/i, 'medicine class or prescription'],
  [/\bbest\b|\bleading\b|\bthe only\b|\bguaranteed?\b|\blife[- ]changing\b|\bexperts?\b/i, 'superlative or promise'],
  [/\bsame[- ]day\b|\bfast diagnosis\b|\bquick diagnosis\b|\bwithin \d+ (days?|weeks?)\b|\bwait(ing)? (list|time)s? of\b/i, 'speed or wait-time claim'],
  [/\badhd specialist\b|\badhd expert\b/i, 'specialist title'],
  [/\btestimonials?\b|\breviews? from\b|★/i, 'testimonial'],
  [/\bspots? left\b|\bbook before\b|\blimited (time|places)\b/i, 'urgency'],
];

for (const path of PAGES) {
  test(`${path} follows the advertising rules`, async ({ page }) => {
    await page.goto(path);
    const text = await page.evaluate(() => {
      const meta = [...document.querySelectorAll('title, meta[name="description"], img[alt]')]
        .map((el) => el.getAttribute('content') ?? el.getAttribute('alt') ?? el.textContent ?? '')
        .join(' ');
      return `${document.body.innerText} ${meta}`;
    });
    const hits = BANNED.flatMap(([re, why]) => {
      const m = text.match(re);
      return m ? [`${why}: "${m[0]}"`] : [];
    });
    expect(hits).toEqual([]);
  });
}
