import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Page copy lives in src/content as Markdown/MDX so Sam can edit words
 * without touching code. Each file needs a title and description in its
 * frontmatter; pages import the matching entry and render it.
 */
const pages = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(155, 'Meta descriptions must be 155 characters or fewer'),
    /** Optional reading-time label shown near the heading, e.g. '2 min read'. */
    readingTime: z.string().optional(),
    /** 'Short version' bullets shown at the top of long pages. */
    shortVersion: z.array(z.string()).max(3).optional(),
  }),
});

export const collections = { pages };
