/**
 * Words and claims that must never appear in public copy (CLAUDE.md,
 * advertising rules). Shared by the unit tests and the browser tests.
 * Prompt 11 turns this into a build gate.
 */
export const BANNED: [RegExp, string][] = [
  [/\b(dexa?mf?ph?etamine|lisdexamfetamine|methylphenidate|atomoxetine|guanfacine)\b/i, 'medicine name'],
  [/\b(vyvanse|ritalin|concerta|strattera|intuniv)\b/i, 'medicine brand'],
  [/\bstimulants?\b|\badhd medications?\b|\bmeds\b|\bscripts?\b|\bprescriptions?\b/i, 'medicine class or prescription'],
  [/\bbest\b|\bleading\b|\bthe only\b|\bguaranteed?\b|\blife[- ]changing\b|\bexperts?\b/i, 'superlative or promise'],
  [/\bsame[- ]day\b|\bfast diagnosis\b|\bquick diagnosis\b|\bwithin \d+ (days?|weeks?)\b|\bwait(ing)? (list|time)s? of\b/i, 'speed or wait-time claim'],
  [/\badhd specialist\b|\badhd expert\b/i, 'specialist title'],
  [/\btestimonials?\b|\breviews? from\b|★/i, 'testimonial'],
  [/\bspots? left\b|\bbook before\b|\blimited (time|places)\b/i, 'urgency'],
];

/** Returns a description of each banned match found in `text`, or [] if clean. */
export function findBanned(text: string): string[] {
  return BANNED.flatMap(([re, why]) => {
    const m = text.match(re);
    return m ? [`${why}: "${m[0]}"`] : [];
  });
}
