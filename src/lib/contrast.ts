/**
 * WCAG 2.x contrast ratio between two hex colours.
 * https://www.w3.org/TR/WCAG22/#dfn-contrast-ratio
 */

function channel(value: number): number {
  const c = value / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(hex: string): number {
  const clean = hex.replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) throw new Error(`Not a 6-digit hex colour: ${hex}`);
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(foreground: string, background: string): number {
  const a = relativeLuminance(foreground);
  const b = relativeLuminance(background);
  const [light, dark] = a > b ? [a, b] : [b, a];
  return (light + 0.05) / (dark + 0.05);
}

/** WCAG AA thresholds. */
export const AA = {
  /** Body text and anything under 24px (or 18.66px bold). */
  text: 4.5,
  /** Text 24px+ or 18.66px+ bold. */
  largeText: 3,
  /** Icons, borders of controls, focus indicators. */
  nonText: 3,
} as const;

export type Use = keyof typeof AA;
