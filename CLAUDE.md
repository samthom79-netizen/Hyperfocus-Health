# CLAUDE.md – Hyperfocus Health website

Read this before touching any file. The owner (Dr Sam Thomas) has no coding experience: whenever he must do something himself, give numbered click-by-click steps. If you don't know a third-party product's current screens, say so instead of guessing.

This is the public website for **Hyperfocus Health**, a Queensland-only adult ADHD telehealth service run by one doctor. The site collects no health information. Booking, payment and intake happen on a third-party provider's own pages.

## The service

- Adults 18+ who live in Queensland and will be in Queensland for their appointments. Uncomplicated adult ADHD only.
- One doctor, start to finish: Dr Sam Thomas, specialist GP (FRACGP), Cannonvale Medical Centre, Unit 7/230 Shute Harbour Road, Cannonvale QLD 4802. Diagnosed with ADHD himself.
- Telehealth by video: private fees, no Medicare rebate (new patients don't meet Medicare's telehealth rule). In person at Cannonvale: Medicare rebate available.
- Pathway (the site must match this exactly):
  1. 60-second eligibility check
  2. Book and pay
  3. Online intake on your phone: all at once or in short blocks; answer by voice, tick boxes or typing; plus a short form for someone who knew you growing up (partner or parent)
  4. Baseline checks: blood pressure, pulse, weight; blood tests or ECG only if your history needs them
  5. Video appointment 1 (about 60 min): assessment
  6. Video appointment 2 (30-45 min): diagnosis and a written plan
  7. Reviews every 2-4 weeks while treatment is adjusted, each with a short check-in form
  8. Once stable: keep seeing Dr Sam every 3-6 months, or move ongoing care to a GP of your choice who agrees in writing
- Not suitable for (always worded kindly, always with a next step): drug or alcohol dependence now or in the past; bipolar disorder; psychosis; current significant suicidal thoughts; an eating disorder; severe depression or anxiety that isn't being treated; heart disease, uncontrolled high blood pressure or unexplained fainting; pregnancy or breastfeeding; currently taking a prescribed controlled (Schedule 8) medicine for pain, sleep or anxiety; autism or intellectual disability needing significant daily support.
- Care beyond diagnosis: psychology partner, GP chronic condition management plan where eligible (dietitian, psychologist, other allied health), sleep, routines, workplace strategies.

## Advertising rules: non-negotiable (AHPRA National Law s133, TGA, Australian Consumer Law)

1. Never name a medicine, brand, active ingredient or class (for example 'stimulants', 'ADHD medication', 'meds', 'scripts') in copy, titles, meta descriptions, URLs, alt text, schema or ad text. Describe the consultation and 'a treatment plan'. Never present a prescription as the expected outcome. Only exception: the 'not suitable for' list above, worded exactly as written.
2. No testimonials or reviews about clinical care anywhere, including embedded Google review widgets.
3. No outcome promises or superlatives: best, leading, 'the only', guaranteed, life-changing, expert, fast or same-day diagnosis.
4. Titles: 'specialist GP' or 'specialist general practitioner' only. Never 'ADHD specialist', 'ADHD expert' or anything implying psychiatry.
5. Prices: one clear total to reach a diagnosis, with every other likely cost (reviews, tests) on the same page. No hidden fees. Any discount states its terms.
6. No urgency or scarcity tactics: no countdowns, 'spots left' or 'book before'.
7. Every page footer: 'In an emergency call 000' plus 1300 MH CALL (1300 642 255) and Lifeline (13 11 14).
8. Never imply a physical clinic anywhere except Cannonvale, or that we see under-18s or people outside Queensland.
9. Never invent clinical facts, statistics, credentials, wait times or reviews. If copy needs a fact Sam hasn't given, write `[TODO: ...]` and list it for him.

## ADHD-friendly design rules (our main edge: competitors use text walls and long forms)

- Paragraphs: 3 short sentences max. No more than about 60 words before a heading, list, card or visual break.
- One primary action per screen. Primary CTA site-wide: 'Check if this is for you (60 sec)'.
- Show the time cost of everything: '60 sec', '2 min read', 'about 30 min, can be split'.
- Plain English, around Year 8 reading level; explain any jargon in one line.
- Progress bars on every multi-step flow. Tap targets 44px or larger. No autoplay; respect prefers-reduced-motion.
- Body text 18px or larger, lines 70 characters max, generous white space.
- A 3-bullet 'Short version' box at the top of every long page.
- WCAG 2.2 AA minimum.

## Technical rules

- Every page shows its real text in view-source (pre-rendered).
- Nothing a visitor types leaves the browser except inside the booking provider's own page or widget.
- Analytics: Plausible or Cloudflare Web Analytics only. No Meta, TikTok or Google remarketing pixels; health browsing must not reach ad networks.
- Third-party scripts (booking widget, voice widget) load only after the visitor clicks to open them.
- Images: WebP/AVIF, descriptive alt text, width and height set.
- Australian English.
- After every change: run the build and tests, fix all errors, then tell Sam in plain English what changed and what to check.

## How this repo is laid out

| Path | What lives there |
| --- | --- |
| `HYPERFOCUS-BUILD-BRIEF.md` | The full brief and the 12 build prompts. Part 4 wins on any conflict. |
| `src/config/site.ts` | Every value that might change (brand, contact, prices, booking, crisis numbers, nav, footer links, CTA). Import it; never hard-code these elsewhere. `TODO:` values are placeholders that block production. |
| `src/config/palette.ts` | Brand colours and every approved text/background pairing (contrast-tested). |
| `src/config/images.ts` | Photos and logo icon with their alt text. Always import images from here. |
| `src/lib/contrast.ts` | WCAG contrast maths used by the palette test and script. |
| `src/pages/` | One file per URL. Astro pages, pre-rendered to static HTML. `/styleguide` is internal (noindex, not in sitemap). |
| `src/layouts/Base.astro` | Page shell: metadata, Focus mode pre-paint script, Header, main, Footer. Every page uses it. |
| `src/components/` | Reusable pieces. `.astro` by default; `.tsx` React only for interactive islands. See Design system below. |
| `src/content/` | Page copy in Markdown/MDX so Sam can edit words without touching code. |
| `src/styles/global.css` | Fonts, Tailwind theme tokens (mirror palette.ts), base reading rules, Focus mode, `.todo` style. |
| `src/assets/photos/` | Photos of Sam (optimised to AVIF/WebP at build). `dr-sam-headshot.png` is the primary photo. |
| `src/assets/brand/logo-icon.png` | Icon cut from the logo (transparent). Made by `scripts/make-logo-assets.mjs`. |
| `public/images/logo.png` | Original full logo. `public/favicon.png`, `public/apple-touch-icon.png` are generated from it. |
| `scripts/` | `sample-logo-colours.mjs`, `make-logo-assets.mjs`, `check-contrast.ts`, `screenshots.mjs`, `preview-start.sh` / `preview-stop.sh`. |
| `tests/unit/` | Vitest logic tests (eligibility rules, config checks). |
| `tests/e2e/` | Playwright page checks against the built site. |
| `docs/` | Audit reports, vendor notes, screenshots, runbooks. |

## Design system (Prompt 2)

Look at `/styleguide` before building any page. Use these components; don't restyle one-offs.

- **Colours** (Tailwind names): `primary` #08343F (dark teal, headings, links, primary buttons), `accent` #13C999 (mint: shapes, icons, step circles, text on teal only), `accent-ink` #06765A (mint-coloured text on light), `accent-soft`, `bg`, `surface`, `ink`, `ink-muted`, `line`, `highlight`, `highlight-soft`, `highlight-edge`. Plain mint on a light background fails contrast (2.0:1): never use it for text. The only exception is the "Health" wordmark, which is a logotype.
- New colour pairing? Add it to `pairings` in `src/config/palette.ts` and run `npm run test:unit`. Changing a hex means changing it in both palette.ts and global.css (the test checks they match).
- **Fonts**: Plus Jakarta Sans 700/800 (`font-display`, headings, buttons), Atkinson Hyperlegible 400/700 (`font-body`, everything else). Self-hosted via @fontsource. Root size 18px, so `1rem` = 18px.
- **Components**: `Button` (primary/secondary; `size="header"` for the header only), `CtaLabel` (the site CTA text, keeps "(60 sec)" together), `Card`, `StepList`, `TimeBadge`, `Callout` (info/warning), `Accordion` (native `<details>`, works without JS), `PriceCard`, `ShortVersion` (1-3 bullets; build fails otherwise), `DoctorCard`, `CrisisStrip` (compact/full, light/dark), `Container`, `Icon`, `Val` (renders a site.ts value, showing TODOs as highlighted `[TODO]` boxes).
- **Header** controls use fixed px sizes so Focus mode can't push them off a phone screen. Don't change them to rem.
- **Focus mode** adds `.focus-mode` to `<html>`: root font 20px, looser lines, and hides anything marked `data-decorative`. Mark decorative images with `data-decorative`; never mark the doctor photo or anything informative.
- **Images**: `<Picture>` from `astro:assets` with `formats={['avif','webp']}`, a `width`, `widths` and `sizes`. Photos of Sam other than the headshot stay at most 640px wide.
- **Tap targets**: interactive elements use `min-h-11` (44px+) or `min-h-12`.

## Stack

- Astro (static output), TypeScript strict, Tailwind CSS v4 via `@tailwindcss/vite`, `@astrojs/react` for islands, `@astrojs/mdx` for content, `@astrojs/sitemap`.
- Tests: Vitest (`npm run test:unit`), Playwright (`npm run test:e2e`, runs against `astro preview` on port 4321). Playwright is pinned to the browser version installed on the build machine; don't run `playwright install`.
- Hosting target: Cloudflare Pages, static. No server, no database, no accounts.

## Commands

```bash
npm install        # once
npm run dev        # local preview with live reload (http://localhost:4321)
npm run build      # build to dist/ (must pass before every commit)
npm run test       # unit + e2e
npm run contrast   # print the colour contrast table, update docs/contrast-report.md
npm run shots      # screenshots of / and /styleguide into docs/screenshots (needs scripts/preview-start.sh first)
```

Astro 7's `astro preview` can detach into the background; use `scripts/preview-start.sh` / `scripts/preview-stop.sh` rather than `pkill` (a `pkill -f "astro preview"` inside a shell command can kill that shell).

## Working rules for Claude Code

- Work one prompt at a time from `HYPERFOCUS-BUILD-BRIEF.md` Part 4, in order. Stop after each and report.
- Before finishing any prompt: `npm run build`, `npm run test`, then a manual read of every new page against the advertising rules above. List every `[TODO]` you created or found.
- Never change a price, claim or credential on your own. Ask.
- Keep commits small, one per prompt, with a plain-English message.
