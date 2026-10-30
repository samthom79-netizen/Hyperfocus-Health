/**
 * Pulls the parts of a built HTML page that a person, a screen reader, a
 * search engine or an AI tool would read: visible text, alt text, meta tags,
 * the title, aria labels, JSON-LD values and link/image URLs. Tags, scripts,
 * styles and attribute names are never scanned. No dependencies.
 */

export type ChunkKind = 'text' | 'alt' | 'meta' | 'title' | 'aria' | 'jsonld' | 'url' | 'citation';

export interface Chunk {
  kind: ChunkKind;
  text: string;
}

const ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  hellip: '…',
  ndash: '–',
  mdash: '—',
  rsquo: '’',
  lsquo: '‘',
  rdquo: '”',
  ldquo: '“',
  times: '×',
};

export function decodeEntities(s: string): string {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_m, h: string) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_m, d: string) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, name: string) => ENTITIES[name.toLowerCase()] ?? m);
}

const squash = (s: string) => decodeEntities(s).replace(/\s+/g, ' ').trim();

/** Every string value inside a parsed JSON-LD object. */
function jsonStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => jsonStrings(v, out));
  else if (value && typeof value === 'object') Object.values(value).forEach((v) => jsonStrings(v, out));
  return out;
}

const BLOCK_END = /<\/(p|li|h[1-6]|div|section|article|header|footer|nav|td|th|dt|dd|summary|details|figcaption|blockquote|tr|ul|ol|main|aside|label|button)>|<br\s*\/?>/gi;

/** Attribute value from a tag string, or undefined. */
function attr(tag: string, name: string): string | undefined {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
  return m ? (m[2] ?? m[3] ?? m[4]) : undefined;
}

export function extractChunks(html: string): Chunk[] {
  const chunks: Chunk[] = [];
  let s = html.replace(/<!--[\s\S]*?-->/g, ' ');

  // JSON-LD: values only.
  s = s.replace(/<script[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi, (_m, body: string) => {
    try {
      for (const str of jsonStrings(JSON.parse(body))) chunks.push({ kind: 'jsonld', text: str });
    } catch {
      chunks.push({ kind: 'jsonld', text: body });
    }
    return ' ';
  });

  // Code and styles are never copy.
  s = s.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ');

  // Reference lists on articles are citations of published sources.
  s = s.replace(/<ol[^>]*\bdata-references\b[^>]*>([\s\S]*?)<\/ol>/gi, (_m, body: string) => {
    chunks.push({ kind: 'citation', text: squash(body.replace(/<[^>]+>/g, ' ')) });
    return ' ';
  });

  const title = s.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (title) chunks.push({ kind: 'title', text: squash(title[1]) });

  // Attributes a reader meets: alt, aria-label, title, meta content, and URLs.
  for (const tag of s.match(/<[a-zA-Z][^>]*>/g) ?? []) {
    const alt = attr(tag, 'alt');
    if (alt !== undefined && alt.trim()) chunks.push({ kind: 'alt', text: squash(alt) });
    const aria = attr(tag, 'aria-label');
    if (aria) chunks.push({ kind: 'aria', text: squash(aria) });
    const t = attr(tag, 'title');
    if (t && !/^<title/i.test(tag)) chunks.push({ kind: 'aria', text: squash(t) });
    if (/^<meta\b/i.test(tag)) {
      const content = attr(tag, 'content');
      const name = attr(tag, 'name') ?? attr(tag, 'property') ?? '';
      if (content && !/viewport|theme-color|color-scheme|robots|charset/i.test(name)) chunks.push({ kind: 'meta', text: squash(content) });
    }
    for (const a of ['href', 'src', 'srcset', 'content']) {
      const v = attr(tag, a);
      if (!v) continue;
      if (a === 'content' && !/^<meta\b/i.test(tag)) continue;
      if (/^(https?:)?\/\/|^\//.test(v) || a === 'href' || a === 'src') chunks.push({ kind: 'url', text: v });
    }
  }

  // Visible text, one line per block so sentences don't run together.
  const text = squashBlocks(s);
  if (text) chunks.push({ kind: 'text', text });
  return chunks;
}

/** Visible text with a newline at each block boundary. */
export function squashBlocks(htmlWithoutScripts: string): string {
  return decodeEntities(
    htmlWithoutScripts
      .replace(/<title[\s\S]*?<\/title>/gi, ' ')
      .replace(BLOCK_END, '\n')
      .replace(/<[^>]+>/g, ' '),
  )
    .split('\n')
    .map((l) => l.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join('\n');
}

/** Text of every <p> and <li> in the main content, in order (for the UX check). */
export function mainParagraphs(html: string): { tag: string; text: string }[] {
  const main = html.match(/<main[\s\S]*?<\/main>/i)?.[0] ?? html;
  const clean = main.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ');
  const out: { tag: string; text: string }[] = [];
  for (const m of clean.matchAll(/<(p|li|dd)\b[^>]*>([\s\S]*?)<\/\1>/gi)) {
    const text = squash(m[2].replace(/<[^>]+>/g, ' '));
    if (text) out.push({ tag: m[1].toLowerCase(), text });
  }
  return out;
}

/** The <main> element's visible text, or the whole page if there is none. */
export function mainText(html: string): string {
  const main = html.match(/<main[\s\S]*?<\/main>/i)?.[0] ?? html;
  return squashBlocks(main.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' '));
}

/** The H1 text (first one), decoded. */
export function h1Text(html: string): string | undefined {
  const m = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  return m ? squash(m[1].replace(/<[^>]+>/g, ' ')) : undefined;
}
