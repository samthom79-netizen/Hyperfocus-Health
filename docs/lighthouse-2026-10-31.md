# Lighthouse, mobile (31 Oct 2026, Prompt 9)

Lighthouse 12, mobile form factor, local production build (`astro preview`).

| Page | Performance | Accessibility | Best practices | SEO (pre-launch) | SEO (as if launched) |
| --- | --- | --- | --- | --- | --- |
| / | 100 | 100 | 100 | 69 | 100 |
| /pricing | 100 | 100 | 100 | 69 | |
| /check | 99 | 100 | 100 | 69 | |
| /adhd-assessment/mackay | 100 | 100 | 100 | 69 | |
| /resources/adhd-at-work | 100 | 100 | 100 | 69 | 100 |
| /contact | 100 | 100 | 100 | 69 | |

SEO is 69 before launch only because every page is deliberately `noindex` (`site.launched: false`). A test build with `launched: true` scored 100.

Fixes made to get here: home page heading order (doctor card heading is now h2), checker progress bar has an accessible name, and the header wordmark is drawn as an SVG logotype (WCAG 1.4.3 exempts logotypes; as live text the brand mint "Health" was flagged).

Re-run after big changes: `npm run build`, `scripts/preview-start.sh`, then Lighthouse in Chrome DevTools (Lighthouse tab, Mobile, Analyze page load).
