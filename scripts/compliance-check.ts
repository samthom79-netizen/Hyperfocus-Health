/**
 * Compliance check: runs after every build (npm run build) over dist/ and
 * FAILS the build on any hit against the advertising rules in CLAUDE.md:
 *
 *   - medicine names, brands and classes (visible text, alt text, meta tags,
 *     JSON-LD values, URLs and llms.txt; never inside HTML tags or code)
 *   - superlatives, promises and wait-time claims
 *   - titles that imply psychiatry ('ADHD specialist', 'psychiatrist' outside
 *     a referral context or /other-options)
 *   - testimonial patterns, star ratings, review widgets
 *   - launch blockers, which fail only a production build (site.launched):
 *     [TODO ...], 'DRAFT: pending legal review', localhost and placeholder URLs
 *
 * The one exception is the exact 'not suitable for' wording (site.notSuitable).
 * Each hit prints the built file, its line, the source file and line where the
 * words live, and a suggested rewrite.
 *
 *   node scripts/compliance-check.ts            # checks dist/
 *   COMPLIANCE_LAUNCHED=1 node scripts/...       # treat as a production build
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { site } from '../src/config/site.ts';
import { checkHtml, checkText, fails, type Hit } from './lib/compliance.ts';

const root = new URL('..', import.meta.url).pathname;
const dist = join(root, 'dist');
const launched = process.env.COMPLIANCE_LAUNCHED === '1' || site.launched;

function walk(dir: string, keep: (f: string) => boolean): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return name === 'node_modules' || name.startsWith('.') ? [] : walk(p, keep);
    return keep(p) ? [p] : [];
  });
}

/** Line number of the first case-insensitive occurrence of `phrase` in `content`. */
function lineOf(content: string, phrase: string): number | undefined {
  const i = content.toLowerCase().indexOf(phrase.toLowerCase());
  if (i < 0) return undefined;
  return content.slice(0, i).split('\n').length;
}

/** Where the words live in src/ (so the fix goes in the right file). */
const sourceFiles = walk(join(root, 'src'), (f) => /\.(md|mdx|ts|tsx|astro|mjs)$/.test(f)).map((f) => ({
  path: relative(root, f),
  content: readFileSync(f, 'utf8'),
}));

function sourceHits(phrase: string): string[] {
  const needle = phrase.toLowerCase();
  return sourceFiles
    .filter((f) => f.content.toLowerCase().includes(needle))
    .slice(0, 3)
    .map((f) => `${f.path}:${lineOf(f.content, phrase)}`);
}

let files: string[];
try {
  files = walk(dist, (f) => /\.(html|txt|xml)$/.test(f));
} catch {
  console.error('dist/ not found: run `astro build` first.');
  process.exit(2);
}

const hits: Hit[] = [];
for (const file of files) {
  const rel = relative(dist, file);
  const content = readFileSync(file, 'utf8');
  const found = rel.endsWith('.html') ? checkHtml(rel, content) : checkText(rel, content);
  for (const h of found) hits.push({ ...h, file: `dist/${rel}:${lineOf(content, h.match) ?? '?'}` });
}

const errors = hits.filter((h) => h.severity === 'error');
const warnings = hits.filter((h) => h.severity === 'warning');
const blockers = hits.filter((h) => h.severity === 'blocker');

function print(h: Hit, mark: string) {
  console.log(`${mark} ${h.file}  [${h.category}, in ${h.where}]  "${h.match}"`);
  console.log(`      ${h.context}`);
  console.log(`      Rewrite: ${h.fix}`);
  const src = sourceHits(h.match);
  if (src.length) console.log(`      Source: ${src.join(', ')}`);
}

console.log(`Compliance check: ${files.length} built files, ${launched ? 'PRODUCTION (launched)' : 'pre-launch'} rules.\n`);

if (errors.length) {
  console.log(`✗ ${errors.length} rule violation${errors.length === 1 ? '' : 's'} (the build fails on these):\n`);
  errors.forEach((h) => print(h, '✗'));
  console.log('');
}

if (blockers.length) {
  const byFix = new Map<string, Hit[]>();
  for (const b of blockers) byFix.set(b.fix, [...(byFix.get(b.fix) ?? []), b]);
  console.log(`${launched ? '✗' : '○'} ${blockers.length} launch blocker${blockers.length === 1 ? '' : 's'} ${launched ? '(production build: these fail it)' : '(allowed before launch; they block go-live)'}:`);
  for (const [fix, list] of byFix) {
    const pages = [...new Set(list.map((h) => h.file.replace(/:\d+$|:\?$/, '')))];
    const distinct = [...new Set(list.map((h) => (h.match.length > 60 ? `${h.match.slice(0, 60)}…` : h.match)))];
    console.log(`   ${list.length}× on ${pages.length} file${pages.length === 1 ? '' : 's'}: ${pages.slice(0, 5).join(', ')}${pages.length > 5 ? ', …' : ''}`);
    for (const d of distinct.slice(0, 8)) console.log(`      "${d}"`);
    if (distinct.length > 8) console.log(`      … and ${distinct.length - 8} more`);
    console.log(`      Fix: ${fix}`);
    if (launched) list.forEach((h) => print(h, '   ✗'));
  }
  console.log('');
}

if (warnings.length) {
  console.log(`! ${warnings.length} warning${warnings.length === 1 ? '' : 's'} (a human should read these; they don't fail the build):\n`);
  warnings.forEach((h) => print(h, '!'));
  console.log('');
}

if (fails(hits, launched)) {
  console.error('COMPLIANCE CHECK FAILED. Fix the hits above, then build again.');
  process.exit(1);
}
console.log(`✓ Compliance check passed${warnings.length ? ` with ${warnings.length} warning${warnings.length === 1 ? '' : 's'}` : ''}.`);
