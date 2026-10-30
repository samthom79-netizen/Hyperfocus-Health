/**
 * Astro integration: while the site isn't launched, adds an
 * `X-Robots-Tag: noindex, nofollow` header to every response on Cloudflare
 * Pages by writing (or prepending to) dist/_headers after the build.
 *
 * It reads the same switch as the pages: `launched` in src/config/site.ts.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

/** @param {{ launched: boolean }} options */
export default function prelaunchHeaders({ launched }) {
  return {
    name: 'prelaunch-headers',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        if (launched) return;
        const file = new URL('_headers', dir);
        const existing = existsSync(file) ? await readFile(file, 'utf8') : '';
        const block = '# Pre-launch: keep the public preview out of search engines.\n/*\n  X-Robots-Tag: noindex, nofollow\n\n';
        await writeFile(file, block + existing);
        logger.info('Pre-launch: added X-Robots-Tag noindex to _headers');
      },
    },
  };
}
