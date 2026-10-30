/**
 * The compliance rules from CLAUDE.md as code. Pure functions so the unit
 * tests can feed them sample pages; scripts/compliance-check.ts runs them
 * over dist/ after every build and fails the build on any error.
 */
import { RULES, type Category } from '../../src/lib/banned.ts';
import { site } from '../../src/config/site.ts';
import { extractChunks, type Chunk, type ChunkKind } from './html.ts';

export type Severity = 'error' | 'warning' | 'blocker';

export interface Hit {
  severity: Severity;
  category: Category | 'referral' | 'blocker' | 'generic-medicine' | 'psychiatry';
  file: string;
  where: ChunkKind;
  match: string;
  context: string;
  fix: string;
}

export interface Options {
  /** Production build: launch blockers become errors. */
  launched: boolean;
  /** Pages where 'psychiatrist' is always allowed (CLAUDE.md: /other-options). */
  psychiatristAllowedOn?: RegExp;
  /** Internal pages that never ship as public pages: launch blockers are not counted there. */
  internal?: RegExp;
}

const DEFAULTS: Required<Options> = {
  launched: false,
  psychiatristAllowedOn: /(^|\/)other-options\.html$/,
  internal: /(^|\/)(styleguide\.html|demo\/)/,
};

/** Words that aren't banned but deserve a human look. */
const WARN: { re: RegExp; category: Hit['category']; fix: string }[] = [
  {
    re: /\bmedications?\b|\b(?:adhd|prescribed|take|taking|start|starting|on|your|the) medicines?\b|\bdoses?\b|\bdosage\b|\btablets?\b/i,
    category: 'generic-medicine',
    fix: "Generic word, not banned. Check it doesn't present medicine as the expected outcome; prefer 'treatment'.",
  },
  {
    re: /(?<!journal of )\bpsychiatr(y|ic)\b/i,
    category: 'psychiatry',
    fix: "Check the sentence doesn't imply Dr Sam offers psychiatry. Quoting a law or guideline is fine.",
  },
];

/** 'psychiatrist' is allowed only when the surrounding text is about a referral. */
const REFERRAL_CONTEXT = /\brefer(ral|red|s)?\b|\bsee (a|one)\b|\bneeds? a psychiatrist\b|\byour (own )?GP\b|\bspecialist in mental health\b|\bmedical doctor with\b|\bpsychiatrist is a\b/i;

const BLOCKERS: { re: RegExp; fix: string; kinds?: ChunkKind[] }[] = [
  { re: /\[TODO\b[^\]]*\]?/i, fix: 'Set the value in src/config/site.ts or the content file.' },
  { re: /DRAFT: pending legal review/i, fix: 'Get the page signed off, then remove `draft: true` from its content file.' },
  { re: /\blocalhost\b|127\.0\.0\.1/i, fix: 'Use the real site URL (site.url).', kinds: ['url', 'text', 'meta', 'jsonld'] },
  { re: /hyperfocushealth\.example/i, fix: 'Set site.url to the registered domain.', kinds: ['url', 'meta', 'jsonld', 'text'] },
];

/** Remove the exact 'not suitable for' wording: the one allowed exception. */
export function stripNotSuitable(text: string): string {
  let out = text;
  for (const line of site.notSuitable) out = out.split(line).join(' ');
  return out;
}

function snippet(text: string, index: number, length: number, pad = 70): string {
  const start = Math.max(0, index - pad);
  const end = Math.min(text.length, index + length + pad);
  return `${start > 0 ? '…' : ''}${text.slice(start, end).replace(/\s+/g, ' ')}${end < text.length ? '…' : ''}`;
}

function allMatches(re: RegExp, text: string): RegExpExecArray[] {
  const g = new RegExp(re.source, re.flags.includes('g') ? re.flags : `${re.flags}g`);
  const out: RegExpExecArray[] = [];
  let m: RegExpExecArray | null;
  while ((m = g.exec(text))) {
    out.push(m);
    if (m[0] === '') g.lastIndex++;
  }
  return out;
}

export function checkChunks(file: string, chunks: Chunk[], opts: Partial<Options> = {}): Hit[] {
  const o = { ...DEFAULTS, ...opts };
  const hits: Hit[] = [];
  const isInternal = o.internal.test(file);

  for (const chunk of chunks) {
    // URLs: words are joined with hyphens, slashes and dots, so split them for whole-word matching.
    const text = stripNotSuitable(chunk.kind === 'url' ? chunk.text.replace(/[-_/.+%?=&#]+/g, ' ') : chunk.text);

    for (const rule of RULES) {
      for (const m of allMatches(rule.re, text)) {
        hits.push({
          severity: 'error',
          category: rule.category,
          file,
          where: chunk.kind,
          match: m[0],
          context: snippet(text, m.index, m[0].length),
          fix: rule.fix,
        });
      }
    }

    // Citations and links to outside sources (e.g. a healthdirect page about psychiatrists) are referral resources.
    const citation = chunk.kind === 'citation' || (chunk.kind === 'url' && /^https?:\/\//i.test(chunk.text) && !chunk.text.includes(site.url));
    if (!o.psychiatristAllowedOn.test(file) && !citation) {
      for (const m of allMatches(/\bpsychiatrists?\b/i, text)) {
        const window = text.slice(Math.max(0, m.index - 250), m.index + m[0].length + 250);
        if (REFERRAL_CONTEXT.test(window)) continue;
        hits.push({
          severity: 'error',
          category: 'referral',
          file,
          where: chunk.kind,
          match: m[0],
          context: snippet(text, m.index, m[0].length),
          fix: "'psychiatrist' is allowed only in a referral context, e.g. 'your GP can refer you to a psychiatrist', or on /other-options.",
        });
      }
    }

    for (const w of WARN) {
      if (citation) continue;
      for (const m of allMatches(w.re, text)) {
        hits.push({ severity: 'warning', category: w.category, file, where: chunk.kind, match: m[0], context: snippet(text, m.index, m[0].length), fix: w.fix });
      }
    }

    if (!isInternal) {
      for (const b of BLOCKERS) {
        if (b.kinds && !b.kinds.includes(chunk.kind)) continue;
        for (const m of allMatches(b.re, chunk.text)) {
          hits.push({
            severity: 'blocker',
            category: 'blocker',
            file,
            where: chunk.kind,
            match: m[0],
            context: snippet(chunk.text, m.index, m[0].length),
            fix: b.fix,
          });
        }
      }
    }
  }
  return dedupe(hits);
}

/** The same phrase in the same place reported once (e.g. a word in both the title and og:title). */
function dedupe(hits: Hit[]): Hit[] {
  const seen = new Set<string>();
  return hits.filter((h) => {
    const key = `${h.file}|${h.severity}|${h.category}|${h.where}|${h.match.toLowerCase()}|${h.context}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function checkHtml(file: string, html: string, opts: Partial<Options> = {}): Hit[] {
  return checkChunks(file, extractChunks(html), opts);
}

/** Plain-text outputs (llms.txt, robots.txt, sitemaps). */
export function checkText(file: string, text: string, opts: Partial<Options> = {}): Hit[] {
  const kind: ChunkKind = /\.xml$/.test(file) ? 'url' : 'text';
  return checkChunks(file, [{ kind, text }], opts);
}

/** Blockers only fail a launched build; everything else fails always. */
export function fails(hits: Hit[], launched: boolean): boolean {
  return hits.some((h) => h.severity === 'error' || (launched && h.severity === 'blocker'));
}
