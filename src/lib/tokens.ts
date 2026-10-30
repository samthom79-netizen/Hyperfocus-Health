/**
 * Lets page copy in src/content/*.md refer to values in src/config/site.ts,
 * e.g. "It costs {prices.assessmentTotal} to reach a diagnosis."
 *
 * - Prices (prices.*) are formatted as dollars.
 * - A value still marked TODO renders as a highlighted [TODO: ...] box.
 * - Everything else is HTML-escaped, so the result is safe for set:html.
 *
 * Unknown tokens throw at build time, so a typo can't ship.
 */
import { formatPrice, isTodo, site } from '../config/site';

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function lookup(path: string): unknown {
  return path.split('.').reduce<unknown>((obj, key) => {
    if (obj && typeof obj === 'object' && key in (obj as Record<string, unknown>)) {
      return (obj as Record<string, unknown>)[key];
    }
    throw new Error(`Unknown token {${path}} in page copy. Check src/config/site.ts.`);
  }, site);
}

export function renderTokens(text: string): string {
  return escape(text).replace(/\{([a-zA-Z][\w.]*)\}/g, (_match, path: string) => {
    const value = lookup(path);
    if (typeof value !== 'string' && typeof value !== 'number') {
      throw new Error(`Token {${path}} is not a single value.`);
    }
    if (isTodo(value)) return `<span class="todo">[${escape(String(value))}]</span>`;
    const shown = path.startsWith('prices.') ? formatPrice(value) : String(value);
    return escape(shown);
  });
}
