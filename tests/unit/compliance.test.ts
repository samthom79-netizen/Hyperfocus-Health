import { describe, expect, it } from 'vitest';
import { checkHtml, checkText, fails, stripNotSuitable } from '../../scripts/lib/compliance';
import { extractChunks, h1Text, mainParagraphs } from '../../scripts/lib/html';
import { site } from '../../src/config/site';

const page = (body: string, head = '') => `<!doctype html><html><head><title>Test | Hyperfocus Health</title>${head}</head><body><header>h</header><main>${body}</main><footer>In an emergency call 000</footer></body></html>`;
const cats = (hits: ReturnType<typeof checkHtml>) => hits.filter((h) => h.severity === 'error').map((h) => h.category);

describe('compliance rules', () => {
  it('passes clean copy', () => {
    const hits = checkHtml('clean.html', page('<p>An adult ADHD assessment with a specialist GP. You leave with a written plan.</p>'));
    expect(hits.filter((h) => h.severity === 'error')).toEqual([]);
  });

  it('catches medicine names, brands and classes, whole words only, any case', () => {
    expect(cats(checkHtml('a.html', page('<p>We prescribe Vyvanse.</p>')))).toContain('medicine');
    expect(cats(checkHtml('b.html', page('<p>STIMULANT treatment</p>')))).toContain('medicine');
    expect(cats(checkHtml('c.html', page('<p>Repeat scripts by phone</p>')))).toContain('medicine');
    // 'JavaScript' and 'descriptive' are not 'script'; 'bestow' is not 'best'.
    expect(cats(checkHtml('d.html', page('<p>Works with JavaScript off. A descriptive bestow.</p>')))).toEqual([]);
  });

  it('allows the exact not-suitable wording and nothing more', () => {
    const list = site.notSuitable.map((x) => `<li>${x}</li>`).join('');
    expect(cats(checkHtml('fit.html', page(`<ul>${list}</ul>`)))).toEqual([]);
    expect(stripNotSuitable(site.notSuitable[8])).toBe(' ');
    expect(cats(checkHtml('x.html', page('<p>Taking a prescribed Schedule 8 script for pain.</p>')))).toContain('medicine');
  });

  it('catches superlatives, speed claims, titles, testimonials and urgency', () => {
    expect(cats(checkHtml('a.html', page('<p>The best ADHD clinic</p>')))).toContain('superlative');
    expect(cats(checkHtml('b.html', page('<p>Same-day diagnosis</p>')))).toContain('speed');
    expect(cats(checkHtml('c.html', page('<p>Dr Sam, ADHD specialist</p>')))).toContain('title');
    expect(cats(checkHtml('d.html', page('<p>What patients say: ★★★★★</p>')))).toContain('testimonial');
    expect(cats(checkHtml('e.html', page('<p>Only 3 spots left</p>')))).toContain('urgency');
  });

  it("'psychiatrist' needs a referral context, except on /other-options or in a citation", () => {
    expect(cats(checkHtml('a.html', page('<p>Dr Sam works as a psychiatrist.</p>')))).toContain('referral');
    expect(cats(checkHtml('b.html', page('<p>If your situation needs a psychiatrist, your GP can refer you.</p>')))).toEqual([]);
    expect(cats(checkHtml('other-options.html', page('<p>A psychiatrist is a specialist in mental health.</p>')))).toEqual([]);
    expect(cats(checkHtml('r.html', page('<ol data-references><li>healthdirect. <a href="https://www.healthdirect.gov.au/psychiatrists-and-psychologists">Psychiatrists and psychologists</a></li></ol>')))).toEqual([]);
  });

  it('scans alt text, meta descriptions, JSON-LD values and URLs, but never tags or code', () => {
    expect(cats(checkHtml('a.html', page('<img alt="Vyvanse packet">')))).toContain('medicine');
    expect(cats(checkHtml('b.html', page('', '<meta name="description" content="fast diagnosis">')))).toContain('speed');
    expect(cats(checkHtml('c.html', page('', '<script type="application/ld+json">{"@type":"MedicalBusiness","description":"the only clinic"}</script>')))).toContain('superlative');
    expect(cats(checkHtml('d.html', page('<a href="/adhd-medication">x</a>')))).toContain('medicine');
    expect(cats(checkHtml('e.html', page('<div class="stimulant-grid" data-best="1"><script>const scripts = "vyvanse";</script></div>')))).toEqual([]);
  });

  it('launch blockers fail only a launched build', () => {
    const html = page('<p><span class="todo">[TODO: phone number]</span> DRAFT: pending legal review</p>', '<link rel="canonical" href="https://hyperfocushealth.example/x">');
    const hits = checkHtml('p.html', html);
    expect(hits.filter((h) => h.severity === 'blocker').length).toBe(3);
    expect(fails(hits, false)).toBe(false);
    expect(fails(hits, true)).toBe(true);
    expect(fails(checkHtml('styleguide.html', html), true)).toBe(false);
    expect(fails(checkText('llms.txt', 'See http://localhost:4321/x'), true)).toBe(true);
  });

  it('plain-text outputs are checked too', () => {
    expect(cats(checkText('llms.txt', '# Hyperfocus Health\nLeading ADHD experts.'))).toContain('superlative');
  });
});

describe('html extraction', () => {
  it('finds the H1, paragraphs and list items, decoding entities', () => {
    const html = page('<h1>Prices &amp; fees</h1><p>One. Two.</p><ul><li>Item &#39;a&#39;</li></ul>');
    expect(h1Text(html)).toBe('Prices & fees');
    expect(mainParagraphs(html).map((p) => p.text)).toEqual(['One. Two.', "Item 'a'"]);
    expect(extractChunks(html).find((c) => c.kind === 'title')?.text).toBe('Test | Hyperfocus Health');
  });
});
