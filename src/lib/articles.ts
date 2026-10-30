/**
 * HTML clean-up for resource articles (src/content/resources/*.md):
 * - [TODO: ...] notes become visible highlighted boxes (they block launch).
 * - [1], [2] citations become links to the numbered reference list.
 */
export function articleHtml(html: string, referenceCount: number): string {
  return html
    .replace(/\[TODO:([^\]]*)\]/g, (_m, t: string) => `<span class="todo">[TODO:${t}]</span>`)
    .replace(/\[(\d{1,2})\]/g, (m, n: string) => {
      const i = Number(n);
      if (i < 1 || i > referenceCount) return m;
      return `<sup><a href="#ref-${i}" aria-label="Reference ${i}" class="inline-block px-1 py-2 -my-2 no-underline font-bold">[${i}]</a></sup>`;
    });
}

/** True once Dr Sam has reviewed: `reviewed` holds a YYYY-MM-DD date. */
export const isReviewDate = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s);
