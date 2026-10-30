import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { findBanned } from '../../src/lib/banned';
import { buildKnowledgeBase, NOT_SUITABLE_HEADING } from '../../src/lib/knowledge-base';
import { site } from '../../src/config/site';

const FILE = 'docs/receptionist/knowledge-base.md';
const withoutDate = (s: string) => s.replace(/^Generated: .*$/m, 'Generated: <date>');

describe('receptionist knowledge base', () => {
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Australia/Brisbane' });
  const fresh = buildKnowledgeBase(today);

  // `npm run kb` sets UPDATE_KB=1 to rewrite the file.
  if (process.env.UPDATE_KB) writeFileSync(FILE, fresh);

  it('matches the website (run `npm run kb` after changing site copy)', () => {
    expect(existsSync(FILE), `${FILE} is missing: run npm run kb`).toBe(true);
    expect(withoutDate(readFileSync(FILE, 'utf8'))).toBe(withoutDate(fresh));
  });

  it('follows the advertising rules outside the not-suitable list', () => {
    const before = fresh.split(NOT_SUITABLE_HEADING)[0];
    const after = fresh.split(NOT_SUITABLE_HEADING)[1].split('\n## ').slice(1).join('\n## ');
    expect(findBanned(before + after)).toEqual([]);
  });

  it('has no unfilled tokens, raw TODO text or markdown links', () => {
    expect(fresh).not.toMatch(/\{[a-zA-Z][\w.]*\}/);
    expect(fresh).not.toMatch(/TODO:/);
    expect(fresh).not.toMatch(/\]\(/);
    expect(fresh).not.toMatch(/\.\./);
  });

  it('carries the prices, the not-suitable list word for word and the crisis numbers', () => {
    expect(fresh).toContain('$745');
    expect(fresh).toContain('$89');
    for (const line of site.notSuitable) expect(fresh).toContain(`- ${line}`);
    expect(fresh).toContain('13 11 14');
    expect(fresh).toContain('1300 642 255');
    expect(fresh).toContain('000');
  });
});
