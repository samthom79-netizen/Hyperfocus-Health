/**
 * The 'typical first 3 months' example on /pricing:
 * assessment total + (assumed number of reviews x review fee).
 * Returns null while either price is still a TODO, so the page shows a TODO box.
 */
import { isTodo } from '../config/site';

function toNumber(v: string | number): number | null {
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  if (isTodo(v)) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export function firstThreeMonths(assessment: string | number, review: string | number, reviews: number): number | null {
  const a = toNumber(assessment);
  const r = toNumber(review);
  if (a === null || r === null) return null;
  return a + reviews * r;
}

export { toNumber as priceNumber };
