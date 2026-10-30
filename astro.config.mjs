// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Static output: every page is pre-rendered to HTML at build time.
// React is used only for interactive islands (eligibility checker, accordions).
export default defineConfig({
  // TODO: replace with the real domain once registered (needed for sitemap + canonical URLs)
  site: 'https://hyperfocushealth.example',
  output: 'static',
  integrations: [
    react(),
    mdx(),
    // Internal pages (e.g. /styleguide) stay out of the sitemap.
    sitemap({ filter: (page) => !page.includes('/styleguide') }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
