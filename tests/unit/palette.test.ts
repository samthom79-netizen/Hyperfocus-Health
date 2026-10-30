import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { AA, contrastRatio } from '../../src/lib/contrast';
import { colourOf, palette, pairings } from '../../src/config/palette';

const css = readFileSync(new URL('../../src/styles/global.css', import.meta.url), 'utf8');

/** palette.ts key -> Tailwind token name in global.css */
const tokenName = (key: string) => `--color-${key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`;

describe('contrast maths', () => {
  it('matches known WCAG values', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 1);
    expect(contrastRatio('#FFFFFF', '#FFFFFF')).toBeCloseTo(1, 5);
    expect(contrastRatio('#767676', '#FFFFFF')).toBeCloseTo(4.54, 1);
  });
});

describe('palette', () => {
  it('uses the teal and mint sampled from the logo', () => {
    expect(palette.primary).toBe('#08343F');
    expect(palette.accent).toBe('#13C999');
  });

  it.each(pairings.map((p) => [`${p.fg} on ${p.bg} (${p.where})`, p] as const))('%s', (_label, p) => {
    const ratio = contrastRatio(colourOf(p.fg), colourOf(p.bg));
    if (p.expectFail) {
      // Documented as banned for text: make sure it really does fail.
      expect(ratio).toBeLessThan(AA[p.use]);
    } else {
      expect(ratio).toBeGreaterThanOrEqual(AA[p.use]);
    }
  });

  it('mirrors every palette colour in the CSS theme', () => {
    for (const [key, hex] of Object.entries(palette)) {
      const pattern = new RegExp(`${tokenName(key)}:\\s*${hex}\\s*;`, 'i');
      expect(css, `${tokenName(key)} should be ${hex} in global.css`).toMatch(pattern);
    }
  });
});
