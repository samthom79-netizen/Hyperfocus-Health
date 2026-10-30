import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Page copy lives in src/content as Markdown so Sam can edit words without
 * touching code. Text may use {tokens} for values in src/config/site.ts,
 * e.g. {prices.assessmentTotal} (see src/lib/tokens.ts).
 */

/** Simple pages: frontmatter + Markdown body (e.g. other-options.md). */
const pages = defineCollection({
  loader: glob({
    pattern: ['**/*.{md,mdx}', '!home.md', '!about.md', '!pricing.md', '!how-it-works.md', '!faq.md', '!README.md'],
    base: './src/content',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(155, 'Meta descriptions must be 155 characters or fewer'),
    heading: z.string().optional(),
    /** Optional reading-time label shown near the heading, e.g. '2 min read'. */
    readingTime: z.string().optional(),
    /** 'Short version' bullets shown at the top of long pages. */
    shortVersion: z.array(z.string()).min(1).max(3).optional(),
    /** Keep out of search engines and the sitemap (e.g. /booking-confirmed). */
    noindex: z.boolean().optional(),
  }),
});

const link = z.object({ label: z.string(), href: z.string() });

/** The homepage: every section's words, in page order. */
const home = defineCollection({
  loader: glob({ pattern: 'home.md', base: './src/content' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(155, 'Meta descriptions must be 155 characters or fewer'),
    hero: z.object({
      heading: z.string(),
      sub: z.string(),
      secondaryLink: link,
      trust: z.array(z.string()).length(4),
    }),
    shortVersion: z.array(z.string()).length(3),
    howItWorks: z.object({
      heading: z.string(),
      steps: z.array(z.object({ title: z.string(), time: z.string(), body: z.string().optional() })).length(5),
      link,
    }),
    different: z.object({
      heading: z.string(),
      cards: z.array(z.object({ title: z.string(), body: z.string() })).length(3),
    }),
    meetDrSam: z.object({
      heading: z.string(),
      lines: z.array(z.string()).length(3),
      link,
    }),
    pricing: z.object({
      heading: z.string(),
      totalLabel: z.string(),
      includes: z.string(),
      medicare: z.string(),
      link,
    }),
    fit: z.object({
      heading: z.string(),
      goodHeading: z.string(),
      good: z.array(z.string()).min(2),
      elsewhereHeading: z.string(),
      elsewhereIntro: z.string(),
      elsewhereLink: link,
    }),
    faq: z.object({
      heading: z.string(),
      items: z.array(z.object({ question: z.string(), answer: z.string() })).length(5),
      link,
    }),
    finalCta: z.object({
      heading: z.string(),
      body: z.string(),
    }),
  }),
});

/** The Meet Dr Sam page (/about). */
const about = defineCollection({
  loader: glob({ pattern: 'about.md', base: './src/content' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(155, 'Meta descriptions must be 155 characters or fewer'),
    heading: z.string(),
    sub: z.array(z.string()).min(1),
    readingTime: z.string(),
    shortVersion: z.array(z.string()).length(3),
    why: z.object({ heading: z.string(), paragraphs: z.array(z.string()).min(1) }),
    timeline: z.object({
      heading: z.string(),
      items: z.array(z.object({ when: z.string().optional(), text: z.string() })).min(2),
    }),
    sections: z.array(z.object({ heading: z.string(), points: z.array(z.string()).min(1) })),
    outsideWork: z.object({ heading: z.string(), text: z.string() }),
  }),
});

const basePage = {
  title: z.string(),
  description: z.string().max(155, 'Meta descriptions must be 155 characters or fewer'),
  heading: z.string(),
  readingTime: z.string(),
  shortVersion: z.array(z.string()).length(3),
};

/** /pricing */
const pricing = defineCollection({
  loader: glob({ pattern: 'pricing.md', base: './src/content' }),
  schema: z.object({
    ...basePage,
    tableHeading: z.string(),
    tableNote: z.string().optional(),
    rows: z.array(
      z.object({ stage: z.string(), whatYouGet: z.string(), cost: z.string(), note: z.string().optional() }),
    ).min(1),
    example: z.object({ heading: z.string(), intro: z.string(), notIncluded: z.string() }),
    medicare: z.object({ heading: z.string(), paragraphs: z.array(z.string()).min(1) }),
    payment: z.object({ heading: z.string(), points: z.array(z.string()).min(1) }),
  }),
});

/** /how-it-works */
const howItWorks = defineCollection({
  loader: glob({ pattern: 'how-it-works.md', base: './src/content' }),
  schema: z.object({
    ...basePage,
    stepsHeading: z.string(),
    stepsNote: z.string().optional(),
    steps: z.array(z.object({ title: z.string(), time: z.string(), you: z.string(), doctor: z.string() })).length(8),
    needHeading: z.string(),
    need: z.array(z.string()).min(1),
  }),
});

/** /faq */
const faq = defineCollection({
  loader: glob({ pattern: 'faq.md', base: './src/content' }),
  schema: z.object({
    ...basePage,
    groups: z.array(
      z.object({
        heading: z.string(),
        items: z.array(z.object({ question: z.string(), answer: z.string() })).min(1),
      }),
    ).min(1),
  }),
});

export const collections = { pages, home, about, pricing, howItWorks, faq };
