/**
 * Words and claims that must never appear in public copy (CLAUDE.md,
 * advertising rules). One list, three users:
 * - unit tests (all checker copy, knowledge base, articles)
 * - browser tests (every public page)
 * - scripts/compliance-check.ts, which fails the build on any hit
 *
 * Whole words only, case-insensitive. The only exception anywhere is the
 * exact 'not suitable for' wording in site.notSuitable, which the compliance
 * check removes before scanning.
 */
export type Category = 'medicine' | 'superlative' | 'speed' | 'title' | 'testimonial' | 'urgency';

export interface Rule {
  re: RegExp;
  category: Category;
  why: string;
  /** Plain-English suggestion printed with each hit. */
  fix: string;
}

export const RULES: Rule[] = [
  {
    re: /\b(dexa?mf?ph?etamine|lisdexamfetamine|methylphenidate|atomoxetine|guanfacine)\b/i,
    category: 'medicine',
    why: 'medicine name',
    fix: "Don't name any medicine. Describe the consultation and 'a treatment plan'.",
  },
  {
    re: /\b(vyvanse|ritalin|concerta|strattera|intuniv)\b/i,
    category: 'medicine',
    why: 'medicine brand',
    fix: "Don't name any brand. Describe the consultation and 'a treatment plan'.",
  },
  {
    re: /\bstimulants?\b|\badhd medications?\b|\bmeds\b|\bscripts?\b|\bprescriptions?\b/i,
    category: 'medicine',
    why: 'medicine class or prescription',
    fix: "Say 'treatment' or 'a treatment plan'. Never present a prescription as the expected outcome.",
  },
  {
    re: /\bbest\b|\bleading\b|\bthe only\b|\bguaranteed?\b|\blife[- ]changing\b|\bexperts?\b/i,
    category: 'superlative',
    why: 'superlative or promise',
    fix: "Remove it. 'best' -> 'a good'; 'the only' -> 'one'; 'expert' -> 'specialist GP'.",
  },
  {
    re: /\bsame[- ]day\b|\bfast(er)? diagnosis\b|\bquick(er)? diagnosis\b|\bwithin \d+ (days?|weeks?)\b|\bwait(ing)? (list|time)s? of\b/i,
    category: 'speed',
    why: 'speed or wait-time claim',
    fix: "Give no wait times. The only timing we state: the first appointment is at least 10 days after booking.",
  },
  {
    re: /\badhd specialists?\b|\badhd experts?\b/i,
    category: 'title',
    why: 'specialist title',
    fix: "Use 'specialist GP with a special interest in adult ADHD'.",
  },
  {
    re: /\btestimonials?\b|\bpatients say\b|\breviews? from\b|\bstar ratings?\b|\b\d[- ]stars?\b|[★⭐]/i,
    category: 'testimonial',
    why: 'testimonial or rating',
    fix: 'Remove it. No testimonials, reviews or ratings about clinical care anywhere.',
  },
  {
    re: /\bspots? left\b|\bbook before\b|\blimited (time|places|spots)\b/i,
    category: 'urgency',
    why: 'urgency or scarcity',
    fix: 'Remove it. No countdowns, scarcity or pressure to book.',
  },
];

/** The older shape some tests use: [pattern, reason]. */
export const BANNED: [RegExp, string][] = RULES.map((r) => [r.re, r.why]);

/** Returns a description of each banned match found in `text`, or [] if clean. */
export function findBanned(text: string): string[] {
  return RULES.flatMap(({ re, why }) => {
    const m = text.match(re);
    return m ? [`${why}: "${m[0]}"`] : [];
  });
}
