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

const TOKEN = /\{([a-zA-Z][\w.]*)\}/g;

function tokenHtml(path: string): string {
  const value = lookup(path);
  if (typeof value !== 'string' && typeof value !== 'number') {
    throw new Error(`Token {${path}} is not a single value.`);
  }
  if (isTodo(value)) return `<span class="todo">[${escape(String(value))}]</span>`;
  const shown = path.startsWith('prices.') ? formatPrice(value) : String(value);
  return escape(shown);
}

/** Plain text in, safe HTML out, with {tokens} filled. */
export function renderTokens(text: string): string {
  return escape(text).replace(TOKEN, (_m, path: string) => tokenHtml(path));
}

/**
 * Plain text with {tokens} and simple [label](url) links, as safe HTML.
 * For short answers written in content files (FAQ, how it works).
 */
export function renderInline(text: string): string {
  return renderTokens(text).replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label: string, url: string) => {
    const external = /^https?:\/\//.test(url);
    return `<a href="${url}"${external ? ' rel="noopener"' : ''}>${label}</a>`;
  });
}

/** The same text as plain words: tokens filled, links reduced to their label (for JSON-LD). */
export function plainText(text: string): string {
  return text
    .replace(TOKEN, (_m, path: string) => {
      const value = lookup(path);
      if (typeof value !== 'string' && typeof value !== 'number') throw new Error(`Token {${path}} is not a single value.`);
      return path.startsWith('prices.') && !isTodo(value) ? formatPrice(value) : String(value);
    })
    .replace(/\[([^\]]+)\]\([^)\s]+\)/g, '$1');
}

/**
 * Fills {tokens} inside HTML that Markdown has already rendered (our own
 * trusted copy). Only the token is replaced; the rest of the HTML is untouched.
 */
export function fillTokensInHtml(html: string): string {
  return html.replace(TOKEN, (_m, path: string) => tokenHtml(path));
}
