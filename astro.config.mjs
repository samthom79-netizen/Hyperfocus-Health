// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import prelaunchHeaders from './src/integrations/prelaunch-headers.mjs';
import { site } from './src/config/site.ts';

// Static output: every page is pre-rendered to HTML at build time.
// React is used only for interactive islands (eligibility checker).
export default defineConfig({
  // TODO: replace with the real domain once registered (needed for sitemap + canonical URLs)
  site: site.url,
  output: 'static',
  // One URL per page: /pricing, never /pricing/ (canonical tags and sitemap match).
  trailingSlash: 'never',
  // pricing.html rather than pricing/index.html: Cloudflare Pages then serves /pricing with no redirect to /pricing/.
  build: { format: 'file' },
  integrations: [
    react(),
    mdx(),
    // Internal pages (e.g. /styleguide) stay out of the sitemap.
    sitemap({ filter: (page) => !/\/(styleguide|booking-confirmed|demo)\b/.test(page) }),
    // While site.launched is false, every response carries X-Robots-Tag: noindex.
    prelaunchHeaders({ launched: site.launched }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
