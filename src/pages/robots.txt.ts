import type { APIRoute } from 'astro';
import { site } from '../config/site';

/**
 * robots.txt, generated at build time.
 * Before launch (site.launched === false) it blocks all crawlers, because the
 * preview link is public. Prompt 9 extends the launched version (AI crawlers).
 */
export const GET: APIRoute = ({ site: siteUrl }) => {
  const body = site.launched
    ? ['User-agent: *', 'Allow: /', 'Disallow: /styleguide', '', `Sitemap: ${new URL('/sitemap-index.xml', siteUrl ?? site.url).href}`, ''].join('\n')
    : ['# Pre-launch preview: not for search engines.', 'User-agent: *', 'Disallow: /', ''].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
