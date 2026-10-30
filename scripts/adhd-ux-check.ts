/**
 * ADHD-friendly design check (CLAUDE.md design rules). Warnings only: it
 * never fails the build, it tells a human where the reading load is high.
 *
 *   npm run ux        (needs a build first; starts its own server on port 4398)
 *
 * Checks every built page:
 *   1. Paragraphs and list items over 3 sentences or 60 words.
 *   2. Long pages (300+ words of main text) with no 'Short version' box.
 *   3. Readability of the main text above Year 8 (Flesch-Kincaid grade).
 *   4. More than one primary action visible on one phone screen (390px wide):
 *      primary buttons are counted by where they lead, so the sticky header
 *      CTA and a page CTA to the same place count once.
 * Writes docs/adhd-ux-report.md.
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { chromium } from 'playwright';
import { h1Text, mainParagraphs, mainText } from './lib/html.ts';
import { serveDist } from './serve-dist.mjs';

const root = new URL('..', import.meta.url).pathname;
const dist = join(root, 'dist');
const PORT = 4398;
const SKIP = /^(styleguide|booking-confirmed|404)\.html$/;

function pages(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return name === 'demo' ? [] : pages(p);
    return name.endsWith('.html') ? [p] : [];
  });
}

const urlOf = (file: string) => {
  const rel = relative(dist, file).replace(/\.html$/, '');
  return rel === 'index' ? '/' : `/${rel}`;
};

export function sentences(text: string): string[] {
  return text
    .replace(/\b(e\.g|i\.e|etc|vs|Dr|Mr|Mrs|Ms|St)\./g, '$1')
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"'(‘“])/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function words(text: string): string[] {
  return text.split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w));
}

/** Rough English syllable count. */
export function syllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return 0;
  if (w.length <= 3) return 1;
  const groups = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '').match(/[aeiouy]{1,2}/g);
  return Math.max(1, groups ? groups.length : 1);
}

/** Flesch-Kincaid grade level. Year 8 is about 8. */
export function fleschKincaid(text: string): { grade: number; words: number; sentences: number } {
  const clean = text.replace(/https?:\/\/\S+/g, ' ').replace(/\b[A-Z]{3}\d{6,}\b/g, ' ').replace(/\[TODO[^\]]*\]/g, ' ');
  const s = sentences(clean);
  const w = words(clean);
  if (!w.length || !s.length) return { grade: 0, words: 0, sentences: 0 };
  const syl = w.reduce((n, x) => n + syllables(x), 0);
  const grade = 0.39 * (w.length / s.length) + 11.8 * (syl / w.length) - 15.59;
  return { grade: Math.round(grade * 10) / 10, words: w.length, sentences: s.length };
}

interface Warning {
  page: string;
  rule: 'paragraph' | 'short-version' | 'readability' | 'primary-actions';
  detail: string;
}

const warnings: Warning[] = [];
const summary: { page: string; words: number; grade: number; shortVersion: boolean; longParagraphs: number; maxActions: number }[] = [];

const files = pages(dist).filter((f) => !SKIP.test(relative(dist, f)));

// 1-3: static checks.
for (const file of files) {
  const html = readFileSync(file, 'utf8');
  const page = urlOf(file);
  const main = mainText(html);
  const fk = fleschKincaid(main);
  const hasShort = /id="short-version"|>Short version</.test(html);
  let longParagraphs = 0;

  for (const p of mainParagraphs(html)) {
    const n = sentences(p.text).length;
    const w = words(p.text).length;
    if (n > 3 || w > 60) {
      longParagraphs++;
      warnings.push({ page, rule: 'paragraph', detail: `<${p.tag}> has ${n} sentences / ${w} words: "${p.text.slice(0, 70)}…"` });
    }
  }
  if (fk.words >= 300 && !hasShort && page !== '/check') {
    warnings.push({ page, rule: 'short-version', detail: `${fk.words} words of main text and no 'Short version' box` });
  }
  if (fk.grade > 8) {
    warnings.push({ page, rule: 'readability', detail: `Flesch-Kincaid grade ${fk.grade} (target 8 or under): ${fk.words} words, ${(fk.words / fk.sentences).toFixed(1)} words per sentence` });
  }
  summary.push({ page, words: fk.words, grade: fk.grade, shortVersion: hasShort, longParagraphs, maxActions: 0 });
}

// 4: primary actions per phone screen.
const server = await serveDist(PORT);
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
const tab = await ctx.newPage();
for (const file of files) {
  const page = urlOf(file);
  await tab.goto(`http://localhost:${PORT}${page}`, { waitUntil: 'load' });
  await tab.evaluate(() => document.fonts.ready);
  const height = await tab.evaluate(() => document.documentElement.scrollHeight);
  let worst = 0;
  for (let y = 0; y < height; y += 844) {
    await tab.evaluate((top) => window.scrollTo(0, top), y);
    await tab.waitForTimeout(30);
    const actions = await tab.evaluate(() => {
      const out: { action: string; label: string }[] = [];
      for (const el of document.querySelectorAll<HTMLElement>('a, button')) {
        if (!/\bbg-primary\b/.test(el.className)) continue;
        const r = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden' || r.width === 0) continue;
        if (r.bottom < 0 || r.top > window.innerHeight) continue;
        const action = (el as HTMLAnchorElement).href?.replace(location.origin, '') || `button:${el.textContent?.trim()}`;
        out.push({ action, label: el.textContent?.trim().replace(/\s+/g, ' ') ?? '' });
      }
      return out;
    });
    const distinct = new Map(actions.map((a) => [a.action, a.label]));
    worst = Math.max(worst, distinct.size);
    if (distinct.size > 1) {
      warnings.push({
        page,
        rule: 'primary-actions',
        detail: `${distinct.size} primary actions on one screen (scrolled ${y}px): ${[...distinct].map(([a, l]) => `"${l}" → ${a}`).join('; ')}`,
      });
    }
  }
  summary.find((s) => s.page === page)!.maxActions = worst;
}
await browser.close();
server.close();

// Report.
const byPage = new Map<string, Warning[]>();
for (const w of warnings) byPage.set(w.page, [...(byPage.get(w.page) ?? []), w]);

const lines: string[] = [
  '# ADHD-friendly design check',
  '',
  `Generated ${new Date().toLocaleDateString('en-AU', { timeZone: 'Australia/Brisbane' })} by \`npm run ux\`. Warnings only: nothing here fails the build.`,
  '',
  'Rules (CLAUDE.md): paragraphs 3 sentences / 60 words max; a Short version box on long pages; about Year 8 reading level; one primary action per phone screen.',
  '',
  '| Page | Words | Reading grade | Short version | Long paragraphs | Most primary actions on one screen |',
  '| --- | --- | --- | --- | --- | --- |',
  ...summary.map((s) => `| ${s.page} | ${s.words} | ${s.grade} | ${s.shortVersion ? 'yes' : s.words >= 300 && s.page !== '/check' ? '**missing**' : 'n/a'} | ${s.longParagraphs} | ${s.maxActions} |`),
  '',
  `## ${warnings.length} warning${warnings.length === 1 ? '' : 's'}`,
  '',
];
for (const [page, list] of byPage) {
  lines.push(`### ${page}`, '');
  for (const w of list) lines.push(`- **${w.rule}**: ${w.detail}`);
  lines.push('');
}
writeFileSync(join(root, 'docs', 'adhd-ux-report.md'), lines.join('\n'));

console.log(`ADHD-UX check: ${files.length} pages, ${warnings.length} warning${warnings.length === 1 ? '' : 's'}. Full table: docs/adhd-ux-report.md\n`);
for (const [page, list] of byPage) {
  console.log(page);
  for (const w of list) console.log(`  ! ${w.rule}: ${w.detail}`);
}
