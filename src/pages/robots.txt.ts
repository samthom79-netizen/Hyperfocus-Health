import type { APIRoute } from 'astro';
import { site } from '../config/site';

/**
 * robots.txt, generated at build time.
 * Before launch (site.launched === false) it blocks all crawlers, because the
 * preview link is public. After launch it welcomes search engines and the AI
 * crawlers that cite sources (Prompt 9), and keeps internal pages out.
 */
export const CRAWLERS = ['Googlebot', 'Bingbot', 'GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended'] as const;
const PRIVATE = ['/styleguide', '/booking-confirmed', '/demo/'];

export function robotsTxt(launched: boolean, siteUrl: URL): string {
  if (!launched) return ['# Pre-launch preview: not for search engines.', 'User-agent: *', 'Disallow: /', ''].join('\n');
  const rules = ['Allow: /', ...PRIVATE.map((p) => `Disallow: ${p}`)];
  const groups = ['*', ...CRAWLERS].flatMap((agent) => [`User-agent: ${agent}`, ...rules, '']);
  return [...groups, `Sitemap: ${new URL('/sitemap-index.xml', siteUrl).href}`, ''].join('\n');
}

export const GET: APIRoute = ({ site: siteUrl }) =>
  new Response(robotsTxt(site.launched, siteUrl ?? new URL(site.url)), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
