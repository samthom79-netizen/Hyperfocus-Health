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
  loader: glob({ pattern: ['**/*.{md,mdx}', '!home.md', '!README.md'], base: './src/content' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(155, 'Meta descriptions must be 155 characters or fewer'),
    heading: z.string().optional(),
    /** Optional reading-time label shown near the heading, e.g. '2 min read'. */
    readingTime: z.string().optional(),
    /** 'Short version' bullets shown at the top of long pages. */
    shortVersion: z.array(z.string()).min(1).max(3).optional(),
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

export const collections = { pages, home };
