# CLAUDE.md – Hyperfocus Health website

Read this before touching any file. The owner (Dr Sam Thomas) has no coding experience: whenever he must do something himself, give numbered click-by-click steps. If you don't know a third-party product's current screens, say so instead of guessing.

This is the public website for **Hyperfocus Health**, a Queensland-only adult ADHD telehealth service run by one doctor. The site collects no health information. Booking, payment and intake happen on a third-party provider's own pages.

## The service

- Adults 18+ who live in Queensland and will be in Queensland for their appointments. Uncomplicated adult ADHD only.
- One doctor, start to finish: Dr Sam Thomas, specialist GP (FRACGP), Cannonvale Medical Centre, Unit 7/230 Shute Harbour Road, Cannonvale QLD 4802. Diagnosed with ADHD himself.
- Telehealth by video or phone, whichever the patient prefers (Sam, 31 Oct 2026): private fees, no Medicare rebate for new patients (they don't meet Medicare's 12-month telehealth rule). In person at Cannonvale: same fees, Medicare rebate may apply, and for 12 months after an in-person visit, video and phone appointments may attract a rebate too (`booking.inPerson.telehealthRebateNote`; billed through the practice).
- Business (postal) address: 13 Begley Street, Cannonvale QLD 4802 (`site.business`). Not a clinic; used as the MedicalBusiness address in structured data, with Cannonvale Medical Centre as its `location`.
- Pathway (the site must match this exactly):
  1. 60-second eligibility check
  2. Book and pay the $95 intake review, then the online intake on your phone: all at once or in short blocks; answer by voice, tick boxes or typing; plus a short form for someone who knew you growing up (partner or parent)
  3. Dr Sam reviews the intake and emails one of three things: an invitation to book appointment 1, a request for more information first (e.g. bloods, ECG), or an explanation of why the service isn't suitable and where to go instead
  4. Baseline checks: blood pressure, pulse, weight; blood tests or ECG only if your history needs them
  5. Appointment 1, video or phone (about 60 min): assessment
  6. Appointment 2, video or phone (about 30-45 min): diagnosis and a written plan
  7. Reviews every 2-4 weeks while treatment is adjusted, each with a short check-in form
  8. Once stable: keep seeing Dr Sam every 3-6 months, or move ongoing care to a GP of your choice who agrees in writing
- Not suitable for (always worded kindly, always with a next step): drug or alcohol dependence now or in the past; bipolar disorder; psychosis; current significant suicidal thoughts; an eating disorder; severe depression or anxiety that isn't being treated; heart disease, uncontrolled high blood pressure or unexplained fainting; pregnancy or breastfeeding; currently taking a prescribed controlled (Schedule 8) medicine for pain, sleep or anxiety; autism or intellectual disability needing significant daily support.
- Care beyond diagnosis: psychology partner, GP chronic condition management plan where eligible (dietitian, psychologist, other allied health), sleep, routines, workplace strategies.

## Advertising rules: non-negotiable (AHPRA National Law s133, TGA, Australian Consumer Law)

1. Never name a medicine, brand, active ingredient or class (for example 'stimulants', 'ADHD medication', 'meds', 'scripts') in copy, titles, meta descriptions, URLs, alt text, schema or ad text. Describe the consultation and 'a treatment plan'. Never present a prescription as the expected outcome. Only exception: the 'not suitable for' list above, worded exactly as written.
2. No testimonials or reviews about clinical care anywhere, including embedded Google review widgets.
3. No outcome promises or superlatives: best, leading, 'the only', guaranteed, life-changing, expert, fast or same-day diagnosis.
4. Titles: 'specialist GP' or 'specialist general practitioner' only. Never 'ADHD specialist', 'ADHD expert' or anything implying psychiatry.
5. Prices: one clear total for the full assessment (Sam, 31 Oct 2026: never 'to reach a diagnosis', which reads as a promised outcome), with every other likely cost (reviews, tests) on the same page. No hidden fees. Any discount states its terms.
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
| `src/layouts/Base.astro` | Page shell: metadata, Header, main, Footer. Every page uses it. |
| `src/components/` | Reusable pieces. `.astro` by default; `.tsx` React only for interactive islands. See Design system below. |
| `src/content/` | Page copy in Markdown/MDX so Sam can edit words without touching code. |
| `src/styles/global.css` | Fonts, Tailwind theme tokens (mirror palette.ts), base reading rules, `.todo` style. |
| `src/assets/photos/` | Photos of Sam (optimised to AVIF/WebP at build). `dr-sam-headshot.png` is the primary photo. |
| `src/assets/brand/logo-icon.png` | Icon cut from the logo (transparent). Made by `scripts/make-logo-assets.mjs`. |
| `public/images/logo.png` | Original full logo. `public/favicon.png`, `public/apple-touch-icon.png` are generated from it. |
| `scripts/` | `compliance-check.ts` (build gate) and `adhd-ux-check.ts` with their logic in `scripts/lib/`, `serve-dist.mjs`, `make-og-images.mjs`, `sample-logo-colours.mjs`, `make-logo-assets.mjs`, `check-contrast.ts`, `screenshots.mjs`, `preview-start.sh` / `preview-stop.sh`. |
| `tests/unit/` | Vitest logic tests (eligibility rules, config checks). |
| `tests/e2e/` | Playwright page checks against the built site. |
| `docs/` | Audit reports, vendor notes, screenshots, runbooks, `receptionist/`, Lighthouse results. |
| `src/content/locations/`, `src/content/resources/` | Queensland location pages and resource articles (Prompt 9). |
| `public/og/` | Share images per page (`npm run og`). |

## Design system (Prompt 2)

Look at `/styleguide` before building any page. Use these components; don't restyle one-offs.

- **Colours** (Tailwind names): `primary` #08343F (dark teal, headings, links, primary buttons), `accent` #13C999 (mint: shapes, icons, step circles, text on teal only), `accent-ink` #06765A (mint-coloured text on light), `accent-soft`, `bg`, `surface`, `ink`, `ink-muted`, `line`, `highlight`, `highlight-soft`, `highlight-edge`. Plain mint on a light background fails contrast (2.0:1): never use it for text. The only exception is the "Health" wordmark, which is a logotype.
- New colour pairing? Add it to `pairings` in `src/config/palette.ts` and run `npm run test:unit`. Changing a hex means changing it in both palette.ts and global.css (the test checks they match).
- **Fonts**: Plus Jakarta Sans 700/800 (`font-display`, headings, buttons), Atkinson Hyperlegible 400/700 (`font-body`, everything else). Self-hosted via @fontsource. Root size 18px, so `1rem` = 18px.
- **Components**: `Button` (primary/secondary; `size="header"` for the header only), `CtaLabel` (the site CTA text, keeps "(60 sec)" together), `Card`, `StepList`, `TimeBadge`, `Callout` (info/warning), `Accordion` (native `<details>`, works without JS), `PriceCard`, `ShortVersion` (1-3 bullets; build fails otherwise), `DoctorCard`, `CrisisStrip` (compact/full, light/dark), `Container`, `Icon`, `Val` (renders a site.ts value, showing TODOs as highlighted `[TODO]` boxes).
- **Page copy** lives in `src/content/`: `home.md` (structured frontmatter, schema in `src/content.config.ts`) and simple Markdown pages (`pages` collection, rendered inside `.prose-hf`). Copy can pull site values with `{tokens}`, e.g. `{prices.assessmentTotal}` (`src/lib/tokens.ts`); unknown tokens fail the build.
- The **'not suitable for' list** is `site.notSuitable` in `src/config/site.ts`, word for word from this file. Use it; never retype it.
- `Button variant="inverse"` = white button for dark teal bands. `DoctorCard layout="hero"` = tall card with a 280px photo. `Base flushFooter` joins a final dark band to the footer.
- **Eligibility checker** (`/check`): questions, outcomes and the decision live in `src/lib/eligibility.ts` (pure, fully unit-tested); `src/components/Checker.tsx` only displays them. Every question is asked regardless of earlier answers so everyone reaches the safety question; a safety 'yes' stops at once and overrides everything. No storage, no cookies, no requests. Analytics (`src/lib/analytics.ts`) sends event names only, never from the safety screen. Under-18s who answer the safety question 'yes' also see Kids Helpline.
- **Booking** (`/book`, `/booking-confirmed`, `/cancellations`): one-line switch `booking.provider` in `src/config/site.ts`; provider capabilities in `bookingProviders` (`embed` stays false until the vendor confirms in writing). `BookingPanel` loads an embedded provider page only after a click, else links out; shows a TODO while unset. No form fields on our pages. Settings checklist and vendor questions: `docs/booking-setup.md`. Simple Markdown pages use `src/layouts/MarkdownPage.astro`; `{tokens}` work in their body too.
- **About** (`/about`): words in `src/content/about.md` (own schema); credentials and the two open bio lines (`doctor.adhdTraining`, `doctor.outsideWork`) in `site.ts`. JSON-LD via `src/lib/schema.ts` as `IndividualPhysician` + `practicesAt` the clinic (schema.org v24+; plain Physician can mean a practice). Pages add head content with `<script slot="head">`. Intro video: set `doctor.introVideo.src` (files in `public/video/`); hidden until then.
- **Pricing, How it works, FAQ** (`/pricing`, `/how-it-works`, `/faq`): words in `src/content/pricing.md`, `how-it-works.md`, `faq.md` (own schemas in `src/content.config.ts`). Every number comes from `site.prices` / `site.policies` via `{tokens}`. The 'typical first 3 months' example is `src/lib/pricing.ts` (assessment + `typicalReviewsFirst3Months` x review), shown as a TODO until both prices are numbers. Tables use `.stack-table` (cards on phones; put the column name in `data-label`). `StepList` steps can take `you` / `doctor` lines. FAQ answers support `[label](url)` links and feed the FAQPage JSON-LD as plain text.
- **Prices set by Sam (31 Oct 2026)**: $745 total for the full assessment, paid in 3 parts (Sam, 31 Oct 2026 11:42): $95 intake review at booking, $330 when invited to book appointment 1, $320 for appointment 2 (a unit test checks they add up); $89 per 15-minute review, the same while adjusting and once stable. No bundle (dropped). The care plan is included in the fee; the patient may claim a rebate if eligible. All fees live in `FEES` at the top of site.ts; policy wording is built from them. No GST. Cancel free up to 48 hours before; under 48 hours 50%; no-show 100%. If unsuitable from the intake, only the $95 is kept and Sam emails why; if not diagnosed at appointment 1, no appointment 2 ($95 + $330 kept). In-person appointments follow Cannonvale Medical Centre's own cancellation terms. Outcome wording: '$745 total for the full assessment'; never 'treatment isn't started' or 'strategies that don't involve medicine'. Replies and complaints within 1 business day. ABN not shown (footer hides an empty `abn`). 'Outside work' line left out for now. In person at Cannonvale the fees are the same, and a Medicare rebate may apply (`booking.inPerson.feeNote`); a GP chronic condition management plan can be done in appointment 2 for in-person regular patients (`booking.inPerson.carePlanNote`). Every appointment length is "about" (`appointments.lengthsNote`). Don't change these without Sam.
- **Contact and AI receptionist** (`/contact`, Prompt 8): words in `src/content/contact.md`; phone, email, reply times in `site.contact`; receptionist settings in `site.receptionist` (vendor not chosen; `label` must stay true). `AssistantLauncher` shows a 'Talk to the assistant' button only when `receptionist.webWidget` is fully set, and loads the vendor script only after a click (demo on /styleguide). Agent files live in `docs/receptionist/`: `knowledge-base.md` is generated from the site by `npm run kb` (`src/lib/knowledge-base.ts`); a unit test fails if it's out of date, so **run `npm run kb` after any copy or site.ts change** and re-upload it to the vendor. `system-prompt.md` and `test-calls.md` change only with Sam's approval. Vendor must store data in Australia (ElevenLabs ruled out 31 Oct 2026); shortlist in `docs/receptionist/README.md`.
- **SEO (Prompt 9)**: `Base.astro` does every page's title (`<title> | Hyperfocus Health`, or the title alone if that passes 60 characters), description (max 155, enforced in content schemas), canonical URL, Open Graph/Twitter tags and JSON-LD (`MedicalBusiness` for the service + `BreadcrumbList`; helpers in `src/lib/schema.ts`). Pages pass `crumbs` for nested trails. URLs never end in a slash (`trailingSlash: 'never'`, `build.format: 'file'` so Cloudflare serves `/pricing` without a redirect); use `cleanPath()` from `src/lib/seo.ts` instead of reading `Astro.url.pathname` raw.
- **Share images**: `public/og/<slug>.png`, made from page titles by `npm run og` (needs a build first). After adding a page or changing a title: `npm run build && npm run og && npm run build`, and commit `public/og/`. A test fails if any public page falls back to `default.png`.
- **robots.txt / llms.txt**: robots blocks everything until launch, then allows Googlebot, Bingbot, GPTBot, ClaudeBot, PerplexityBot and Google-Extended (internal pages excluded). `/llms.txt` (`src/pages/llms.txt.ts`) is a plain-text summary built from site.ts and the content files; it says "one physical clinic", never "the only".
- **Location pages** (`/adhd-assessment` hub + `/adhd-assessment/<city>`, Queensland only): words in `src/content/locations/<city>.md`, local content only. Shared basics (baseline checks, ongoing care, face to face) are one short block in `src/pages/adhd-assessment/[city].astro`; don't copy them back into the Markdown. The first line on every page is fixed in the template ('Video or phone appointments for adults in/on <place>. Our only physical clinic is in Cannonvale.'). A unit test fails if two pages share more than 60% of their sentences (doorway-page guard) or if any page implies a clinic outside Cannonvale. `inPerson: true` (Mackay, Whitsundays only) shows the Cannonvale booking box.
- **Resources** (`/resources`, `/resources/<slug>`): `src/content/resources/<slug>.md`, 600-900 words, cite as [1], [2] matching `references` (government or peer-reviewed domains only; a test checks). `reviewed` stays `TODO: Dr Sam to read and approve` until Sam has read it, then becomes the date (YYYY-MM-DD); the page says 'Draft: not yet reviewed by Dr Sam Thomas' until then, and only then is `MedicalWebPage` JSON-LD with `reviewedBy` output. Visible breadcrumbs show parents only (the H1 names the page); the JSON-LD trail is complete. Unsourced facts are `[TODO: source needed]` (shown as a highlighted box). Launch is blocked while any article is unreviewed.
- **Public page list**: `tests/e2e/public-pages.ts`. Add every new public page there; copy-rules, layout and SEO tests all use it.
- **Header wordmark** is SVG text (a logotype): keeps the brand mint "Health" without failing contrast checks. Lighthouse mobile: 99-100 on Performance, Accessibility and Best Practices; SEO 100 once launched (`docs/lighthouse-2026-10-31.md`).
- **Legal pages (Prompt 10)**: `/privacy`, `/collection-notice`, `/terms`, `/complaints`, `/accessibility` are Markdown pages with `draft: true`, which shows the `DraftBanner` ('DRAFT: pending legal review'). A unit test blocks launch while any page is a draft or any Markdown `[TODO: ...]` remains (MarkdownPage shows those as highlighted boxes). Every vendor that touches personal information is in `site.vendors` (name, where, retention); never guess a location, retention period or legal requirement. Questions for vendors and the MDO: `docs/legal-questions.md`. Markdown links can use site values: `[OAIC]({links.oaicComplaint})`. The collection notice is linked from /contact and /book. Avoid 'within 30 days' and 'best' in copy (banned-word list); write 'after 30 days'.
- **Compliance gate (Prompt 11)**: `npm run build` = `astro build && node scripts/compliance-check.ts`. The check scans every built file (visible text, alt, meta, JSON-LD values, URLs, llms.txt; never tags or code) against `RULES` in `src/lib/banned.ts` plus the 'psychiatrist only in referral context or on /other-options' rule, and FAILS the build on any hit. The only exception is the exact `site.notSuitable` wording. Launch blockers (`[TODO`, 'DRAFT: pending legal review', localhost, the `.example` domain) fail only a launched build (`site.launched` or `COMPLIANCE_LAUNCHED=1`). Warnings (generic 'medication/dose', 'psychiatric') print but don't fail. Logic lives in `scripts/lib/compliance.ts` + `scripts/lib/html.ts` (unit-tested in `tests/unit/compliance.test.ts`). Add a banned pattern to `RULES`, never a second list.
- **ADHD-UX check**: `npm run ux` (after a build) writes `docs/adhd-ux-report.md`: paragraphs over 3 sentences/60 words, long pages without a Short version box, Flesch-Kincaid grade over 8, more than one primary action per 390px screen (counted by destination). Warnings only.
- **Site-wide audit tests**: `npx playwright test --project=audit` (`tests/e2e/audit.spec.ts`): every page at 390px and 1280px, full-page screenshots into `docs/screenshots/` (gitignored), axe-core scan with zero serious/critical issues (style-guide contrast demos excluded via `data-contrast-demo`), raw HTML contains the H1 (pre-rendering), crisis numbers in every footer, no sideways scroll, and checker outcomes vs `evaluate()` for 19 answer combinations. `npm run audit` runs build + ux + audit. `scripts/serve-dist.mjs` serves dist/ on its own port so audits never fight the shared preview. Latest results: `docs/audit-report.md`.
- **Header wordmark** uses one SVG `<text>` with two `<tspan>`s and a space between them, so its visible text is 'Hyperfocus Health' (axe's label-content-name-mismatch rule needs the link's visible text inside its aria-label). It shows from 360px wide (stacked) and the header CTA is hidden on /check.
- **Audit decisions (31 Oct 2026)**: `docs/audit-report.md` lists 15 open decisions for Sam (D1-D15: refund policy, clinic cancellation terms, GST wording, structured-data address, unverified operational claims, outcome framing of 'to reach a diagnosis', menu items, appointment times). Don't resolve them without him. Fixed in that audit: articles say 'Draft: not yet reviewed' until a review date is set; the Medicare rule mentions MyMedicare; 'reviews' are introduced as follow-up appointments; /book shows the booking box before the in-person option; 'Ahpra' styling everywhere; Book is in every footer.
- **Queensland GP fact**: the 1 Dec 2025 Queensland change was about specialist GPs treating ADHD, not diagnosing it. Say "specialist GPs can assess, diagnose and manage ADHD in adults, though not every GP chooses to" and link `site.links.qldGovAdhd`. Don't mention the date or what changed (it names treatment).
- **In-person bookings** go through Cannonvale Medical Centre (HotDoc link or 07 4948 0041, verified on Healthdirect 31 Oct 2026); patients must say it's for an ADHD assessment. Values in `site.booking.inPerson` and `site.clinic`.
- Banned words live in `src/lib/banned.ts`, used by both the unit tests (all checker copy) and the browser tests (every public page).
- `tests/e2e/copy-rules.spec.ts` scans every public page for banned words; add each new page to its `PAGES` list.
- **Header** controls use fixed px sizes so they always fit a phone screen. Don't change them to rem.
- **Images**: `<Picture>` from `astro:assets` with `formats={['avif','webp']}`, a `width`, `widths` and `sizes`. Photos of Sam other than the headshot stay at most 640px wide.
- **Focus mode** was removed at Sam's request (30 Oct 2026). Don't re-add it.
- **Tap targets**: interactive elements use `min-h-11` (44px+) or `min-h-12`.

## Preview and pre-launch protection

- Every push to `main` deploys to Cloudflare Pages: **https://hyperfocus-health.pages.dev** (public link; Cloudflare project `hyperfocus-health`, build `npm run build`, output `dist`). Give Sam this link, plus the path of any new page, at the end of every prompt.
- The cloud build machine can't reach pages.dev (proxy 403), so check deployed pages on Sam's phone or via screenshots of the local preview.
- `launched: false` in `src/config/site.ts` hides the whole site from search engines in three ways: `<meta name="robots" content="noindex">` on every page, `robots.txt` disallowing everything (`src/pages/robots.txt.ts`), and `X-Robots-Tag: noindex` in `dist/_headers` (`src/integrations/prelaunch-headers.mjs`).
- Only Prompt 12 (go-live) flips `launched` to `true`. A unit test fails if it's true while any TODO remains.
- `.node-version` pins Node 22.23.4 for Cloudflare's build (Astro 7 needs at least that).

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
npm run og         # share images into public/og from the built page titles (run after a build)
npm run kb         # rebuild the AI receptionist knowledge base after any copy change
npm run compliance # the build gate on its own (needs a build): advertising rules over dist/
npm run ux         # ADHD-friendly design warnings into docs/adhd-ux-report.md (needs a build)
npm run audit      # build + ux + site-wide Playwright audit (screenshots, axe, pre-render, checker parity)
```

Astro 7's `astro preview` can detach into the background; use `scripts/preview-start.sh` / `scripts/preview-stop.sh` rather than `pkill` (a `pkill -f "astro preview"` inside a shell command can kill that shell).

## Working rules for Claude Code

- Work one prompt at a time from `HYPERFOCUS-BUILD-BRIEF.md` Part 4, in order. Stop after each and report.
- Before finishing any prompt: `npm run build`, `npm run test`, then a manual read of every new page against the advertising rules above. List every `[TODO]` you created or found.
- Never change a price, claim or credential on your own. Ask.
- Keep commits small, one per prompt, with a plain-English message.
