import { describe, expect, it } from 'vitest';
import { firstThreeMonths, priceNumber } from '../../src/lib/pricing';
import { site } from '../../src/config/site';

describe('typical first 3 months', () => {
  it('adds the assessment to the assumed number of reviews', () => {
    expect(firstThreeMonths(695, 120, 3)).toBe(1055);
    expect(firstThreeMonths('745', '150', 3)).toBe(1195);
    expect(firstThreeMonths(695, 120, 0)).toBe(695);
  });

  it('returns null while either price is a placeholder', () => {
    expect(firstThreeMonths('TODO: e.g. 695', 120, 3)).toBeNull();
    expect(firstThreeMonths(695, 'TODO', 3)).toBeNull();
    expect(priceNumber('not a number')).toBeNull();
  });

  it('uses a sensible review-count assumption', () => {
    const n = site.prices.typicalReviewsFirst3Months;
    expect(Number.isInteger(n) && n >= 1 && n <= 6).toBe(true);
  });
});
