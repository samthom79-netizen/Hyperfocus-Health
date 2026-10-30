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
| `src/config/site.ts` | Every value that might change (brand, contact, prices, booking, crisis numbers). Import it; never hard-code these elsewhere. `TODO:` values are placeholders that block production. |
| `src/pages/` | One file per URL. Astro pages, pre-rendered to static HTML. |
| `src/layouts/` | Page shells (header, footer with crisis strip). |
| `src/components/` | Reusable pieces. `.astro` by default; `.tsx` React only for interactive islands. |
| `src/content/` | Page copy in Markdown/MDX so Sam can edit words without touching code. |
| `src/styles/global.css` | Tailwind import and base reading rules. |
| `public/images/` | Logo and photos. `dr-sam-headshot.png` is the primary photo of Sam. |
| `tests/unit/` | Vitest logic tests (eligibility rules, config checks). |
| `tests/e2e/` | Playwright page checks against the built site. |
| `docs/` | Audit reports, vendor notes, screenshots, runbooks. |

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
```

## Working rules for Claude Code

- Work one prompt at a time from `HYPERFOCUS-BUILD-BRIEF.md` Part 4, in order. Stop after each and report.
- Before finishing any prompt: `npm run build`, `npm run test`, then a manual read of every new page against the advertising rules above. List every `[TODO]` you created or found.
- Never change a price, claim or credential on your own. Ask.
- Keep commits small, one per prompt, with a plain-English message.
