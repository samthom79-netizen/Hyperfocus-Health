/**
 * Brand palette. Teal and mint were sampled from public/images/logo.png
 * with scripts/sample-logo-colours.mjs (wordmark fills: #08343F, #13C999).
 *
 * These hex values are mirrored in the @theme block of src/styles/global.css.
 * tests/unit/palette.test.ts fails if the two drift apart, or if any pairing
 * below drops under its WCAG AA threshold.
 */
import type { Use } from '../lib/contrast';

export const palette = {
  /** Dark teal from the "Hyperfocus" wordmark. Headings, primary buttons, links. */
  primary: '#08343F',
  /** Hover state for primary buttons (slightly lighter so the change is visible). */
  primaryHover: '#155463',
  /** Mint from the "Health" wordmark. Shapes, icons, step circles, large text on teal only. */
  accent: '#13C999',
  /** Darker mint that passes AA for normal-size text on light backgrounds. */
  accentInk: '#06765A',
  /** Very light mint for info boxes, badges and the Short version box. */
  accentSoft: '#E3F6EF',
  /** Page background: soft off-white with a hint of mint. */
  bg: '#F7FAF8',
  /** Cards and raised panels. */
  surface: '#FFFFFF',
  /** Body text. */
  ink: '#16262C',
  /** Secondary text (captions, small print). */
  inkMuted: '#4A5C63',
  /** Borders and dividers (decorative). */
  line: '#D3DFDB',
  /** Warm highlight: badges and shapes, with dark teal text on top. */
  highlight: '#F5B04A',
  /** Light warm tint for warning boxes. */
  highlightSoft: '#FDF1DC',
  /** Border for warning boxes (non-text, needs 3:1 on its tint). */
  highlightEdge: '#B06A00',
} as const;

export type PaletteKey = keyof typeof palette;

export interface Pairing {
  fg: PaletteKey | 'white';
  bg: PaletteKey;
  use: Use;
  where: string;
  /** Pairs listed only to document that they FAIL and must not be used for text. */
  expectFail?: boolean;
}

/** Every text/background combination the site uses, plus the banned ones for the record. */
export const pairings: Pairing[] = [
  { fg: 'ink', bg: 'bg', use: 'text', where: 'Body text on page' },
  { fg: 'ink', bg: 'surface', use: 'text', where: 'Body text on cards' },
  { fg: 'ink', bg: 'accentSoft', use: 'text', where: 'Info boxes, Short version box' },
  { fg: 'ink', bg: 'highlightSoft', use: 'text', where: 'Warning boxes' },
  { fg: 'inkMuted', bg: 'bg', use: 'text', where: 'Small print on page' },
  { fg: 'inkMuted', bg: 'surface', use: 'text', where: 'Small print on cards' },
  { fg: 'primary', bg: 'bg', use: 'text', where: 'Headings, links on page' },
  { fg: 'primary', bg: 'surface', use: 'text', where: 'Headings, links on cards' },
  { fg: 'primary', bg: 'accentSoft', use: 'text', where: 'Time badges, info box titles' },
  { fg: 'primary', bg: 'highlightSoft', use: 'text', where: 'Warning box titles' },
  { fg: 'primary', bg: 'accent', use: 'text', where: 'Numbers inside mint step circles' },
  { fg: 'primary', bg: 'highlight', use: 'text', where: 'Text on warm badges' },
  { fg: 'white', bg: 'primary', use: 'text', where: 'Primary buttons, crisis strip' },
  { fg: 'white', bg: 'primaryHover', use: 'text', where: 'Primary button on hover' },
  { fg: 'accent', bg: 'primary', use: 'text', where: 'Mint text on teal (footer headings, wordmark)' },
  { fg: 'accentInk', bg: 'bg', use: 'text', where: 'Mint-coloured text on page' },
  { fg: 'accentInk', bg: 'surface', use: 'text', where: 'Mint-coloured text on cards' },
  { fg: 'accentInk', bg: 'accentSoft', use: 'text', where: 'Mint text in info boxes' },
  { fg: 'primary', bg: 'bg', use: 'nonText', where: 'Focus ring, secondary button border' },
  { fg: 'highlightEdge', bg: 'highlightSoft', use: 'nonText', where: 'Warning box border and icon' },
  { fg: 'accentInk', bg: 'accentSoft', use: 'nonText', where: 'Info box border and icon' },
  { fg: 'accent', bg: 'bg', use: 'text', where: 'Mint on light: NOT for text (shapes only)', expectFail: true },
  { fg: 'accent', bg: 'surface', use: 'largeText', where: 'Mint on white: NOT even for large text', expectFail: true },
];

export function colourOf(key: PaletteKey | 'white'): string {
  return key === 'white' ? '#FFFFFF' : palette[key];
}
