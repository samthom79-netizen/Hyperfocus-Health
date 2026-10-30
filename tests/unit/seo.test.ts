import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { robotsTxt, CRAWLERS } from '../../src/pages/robots.txt';
import { ogSlug } from '../../src/lib/seo';
import { articleHtml, isReviewDate } from '../../src/lib/articles';
import { findBanned } from '../../src/lib/banned';
import { site } from '../../src/config/site';

const base = new URL('https://example.com.au');

describe('robots.txt', () => {
  it('blocks everything before launch', () => {
    expect(robotsTxt(false, base)).toContain('User-agent: *\nDisallow: /');
    expect(robotsTxt(false, base)).not.toContain('Allow');
  });

  it('after launch welcomes search and AI crawlers, keeps internal pages out, points to the sitemap', () => {
    const txt = robotsTxt(true, base);
    for (const bot of CRAWLERS) expect(txt).toContain(`User-agent: ${bot}\nAllow: /\nDisallow: /styleguide`);
    expect(txt).toContain('Disallow: /booking-confirmed');
    expect(txt).toContain('Sitemap: https://example.com.au/sitemap-index.xml');
    expect(txt).not.toMatch(/Disallow: \/\n/);
  });
});

describe('share image names', () => {
  it('maps paths to file names', () => {
    expect(ogSlug('/')).toBe('home');
    expect(ogSlug('/pricing')).toBe('pricing');
    expect(ogSlug('/adhd-assessment/gold-coast/')).toBe('adhd-assessment-gold-coast');
  });
});

const frontmatter = (file: string) => parse(readFileSync(file, 'utf8').split(/^---$/m)[1]);
const body = (file: string) => readFileSync(file, 'utf8').split(/^---$/m).slice(2).join('---');

describe('resource articles', () => {
  const dir = 'src/content/resources';
  const files = readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => `${dir}/${f}`);
  const ALLOWED = /(^|\.)(gov\.au|nice\.org\.uk|ncbi\.nlm\.nih\.gov|aadpa\.com\.au|doi\.org)$/;

  it('there are 5', () => expect(files).toHaveLength(5));

  for (const f of files) {
    const d = frontmatter(f);
    const text = body(f);

    it(`${f}: references are government or peer-reviewed only`, () => {
      for (const r of d.references) expect(new URL(r.url).hostname, r.url).toMatch(ALLOWED);
    });

    it(`${f}: every citation points to a reference that exists`, () => {
      const cited = [...text.matchAll(/\[(\d{1,2})\]/g)].map((m) => Number(m[1]));
      expect(cited.length).toBeGreaterThan(0);
      for (const n of cited) expect(n).toBeLessThanOrEqual(d.references.length);
    });

    it(`${f}: 600-900 words, follows the advertising rules`, () => {
      const words = text.replace(/\[\d+\]/g, '').split(/\s+/).filter(Boolean).length;
      expect(words).toBeGreaterThanOrEqual(600);
      expect(words).toBeLessThanOrEqual(920);
      expect(findBanned(`${d.title} ${d.description} ${d.heading} ${d.shortVersion.join(' ')} ${text}`)).toEqual([]);
      expect(text).not.toMatch(/\bmedications?\b|\bmedicines?\b|\bdoses?\b|\btablets?\b/i);
    });

    it(`${f}: launch is blocked until Dr Sam has reviewed it`, () => {
      if (site.launched) expect(isReviewDate(d.reviewed)).toBe(true);
      if (site.launched) expect(text).not.toContain('[TODO');
    });
  }

  it('citations and TODO notes are turned into links and boxes', () => {
    const html = articleHtml('<p>A fact [1]. Another [3]. Unknown [TODO: source needed]</p>', 2);
    expect(html).toMatch(/<a href="#ref-1" aria-label="Reference 1"[^>]*>\[1\]<\/a>/);
    expect(html).toContain('Another [3].');
    expect(html).toContain('<span class="todo">[TODO: source needed]</span>');
  });
});

describe('location pages', () => {
  const dir = 'src/content/locations';
  const files = readdirSync(dir).filter((f) => f.endsWith('.md'));
  const QLD = ['brisbane', 'gold-coast', 'sunshine-coast', 'townsville', 'cairns', 'toowoomba', 'mackay', 'whitsundays'];

  it('exactly the 8 Queensland areas', () => expect(files.map((f) => f.replace('.md', '')).sort()).toEqual([...QLD].sort()));

  for (const f of files) {
    const d = frontmatter(`${dir}/${f}`);
    const text = body(`${dir}/${f}`);
    it(`${f}: never implies a clinic in the city`, () => {
      expect(text).not.toMatch(/our (clinic|rooms|practice) in (?!Cannonvale)/i);
      expect(text).not.toMatch(new RegExp(`visit us in ${d.city}|our ${d.city} clinic`, 'i'));
      expect(findBanned(`${d.title} ${d.description} ${d.shortVersion.join(' ')} ${text}`)).toEqual([]);
    });
    it(`${f}: in-person box only for Mackay and the Whitsundays`, () => {
      expect(Boolean(d.inPerson)).toBe(['mackay.md', 'whitsundays.md'].includes(f));
    });
  }

  it('pages are mostly unique (doorway-page guard): no two share more than 60% of their sentences', () => {
    const sentences = (f: string) => new Set(body(`${dir}/${f}`).split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter((s) => s.length > 20));
    for (let i = 0; i < files.length; i++)
      for (let j = i + 1; j < files.length; j++) {
        const a = sentences(files[i]);
        const b = sentences(files[j]);
        const shared = [...a].filter((s) => b.has(s)).length;
        expect(shared / Math.min(a.size, b.size), `${files[i]} vs ${files[j]}`).toBeLessThanOrEqual(0.6);
      }
  });
});

describe('page paths', () => {
  it('drops index.html, .html and trailing slashes', async () => {
    const { cleanPath } = await import('../../src/lib/seo');
    expect(cleanPath('/index.html')).toBe('/');
    expect(cleanPath('/')).toBe('/');
    expect(cleanPath('/pricing.html')).toBe('/pricing');
    expect(cleanPath('/adhd-assessment/mackay/')).toBe('/adhd-assessment/mackay');
  });
});
