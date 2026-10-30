# HYPERFOCUS HEALTH – MASTER BUILD BRIEF FOR CLAUDE CODE
Version: 30 Oct 2026. Owner: Dr Sam Thomas.

This one file holds everything needed to build the Hyperfocus Health website: the service brief, decisions made so far, the doctor bio and photos, and the 12 build prompts in order.

**Precedence rule for Claude Code:** if anything in this file conflicts, Part 4 (the build prompts, including the CLAUDE.md rules in Prompt 1) wins. Never invent clinical facts, credentials, prices, wait times or reviews: use [TODO: ...] and list them for Sam.

---

## PART 0 – How to use this file

1. Put this file in the root of the empty GitHub repo, next to logo.png, dr-sam-headshot.png, dr-sam-desk.png and dr-sam-consult.png.
2. Open Claude Code on the repo.
3. Set the model and effort (see below).
4. First message: `Read HYPERFOCUS-BUILD-BRIEF.md in full. Do not build anything yet. Summarise the service, the rules and the 12 prompts in 15 lines, and list every [TODO] you can see.`
5. Then: `Run Prompt 1 from Part 4 of HYPERFOCUS-BUILD-BRIEF.md.` Check the preview on your phone, commit, then do Prompt 2, and so on. One prompt at a time.

### Model and effort settings

| Prompt | Model | Effort | Why |
| --- | --- | --- | --- |
| 1 (setup + CLAUDE.md rulebook) | Fable (`/model fable`) | high | Sets the architecture and rules everything else inherits |
| 2–3, 5–10, 12 | Opus (`/model opus`) | high (`/effort high`) | Clear-scope page building; Opus 5.5 defaults to medium, so raise it |
| 4 (eligibility checker) | Fable | high | Safety logic and tests must be right |
| 11 (compliance + UX audit) | Fable | xhigh | Verification work where missing a hit is costly |

Don't use `max`: Claude Code's own docs say it shows diminishing returns and can overthink. Fable may bill to usage credits; Claude Code asks before it does.

---

## PART 1 – Service brief

### Clinician
- Dr Sam Thomas, BMBS (University of Limerick, 2011), FRACGP. Specialist general practitioner, AHPRA registration MED0002290862.
- Law degree: Bachelor of Laws (LLB), King's College London.
- Hospital medicine in Ireland and New Zealand; GP training in the UK; Australian general practice since 2019 (Gold Coast, now the Whitsundays).
- Practises at Cannonvale Medical Centre, Unit 7/230 Shute Harbour Road, Cannonvale QLD 4802 (MMM4).
- Diagnosed with ADHD as an adult: core to the positioning.
- ADHD training: BeyondGP Medical Education adult ADHD units [TODO: which units completed, and year].

### Brand
- Name: Hyperfocus Health (shortlist alternative: Refocus ADHD). [TODO: IP Australia trademark search; .com.au domain needs the operating entity's ABN.]
- Logo: two chunky curved arrows forming a circle around a solid mint centre dot (upper-left arrow dark teal, lower-right arrow mint), wordmark "Hyperfocus Health" in bold geometric sans: "Hyperfocus" dark teal (approx #0D3640), "Health" mint (approx #1CC99B).

### Service scope
- Queensland residents only, adults 18+, uncomplicated adult ADHD. Patients must be in Queensland for their consults.
- Legal basis: since 1 December 2025, Queensland specialist GPs can diagnose adult ADHD and prescribe (qld.gov.au/health/conditions/all/adhd).
- Exclusions: substance use disorder (current or past), bipolar, psychosis, significant suicidality, eating disorder, significant untreated depression/anxiety, cardiac disease or uncontrolled hypertension or unexplained syncope, pregnancy/breastfeeding, current S8 opioid/benzodiazepine use, complex ASD/intellectual disability.
- Holistic care: psychology partner, GP chronic condition management plan where eligible (dietitian, psychologist, other allied health), sleep, routines, workplace strategies.

### Pathway
1. 60-second eligibility checker (website CTA)
2. Book and pay
3. Online intake: all-in-one or short blocks; voice, tick boxes or typing; collateral form for partner/parent
4. Baseline checks: BP, pulse, weight; bloods/ECG only if history indicates
5. Consult 1 (video, about 60 min): assessment, no treatment started
6. Consult 2 (video, 30–45 min): diagnosis, written plan, treatment start if appropriate
7. Reviews every 2–4 weeks while treatment is adjusted, each with a pre-review check-in form
8. Stable: continue with Sam every 3–6 months, or hand over to the patient's own GP who agrees in writing. With consent, the patient's regular GP receives a summary.

### Billing
- Telehealth: private, no Medicare rebate (new patients fail the MBS telehealth rule).
- In person at Cannonvale: Medicare rebate available.
- Proposed price (not final): $695–$745 to diagnosis, plus an optional diagnosis + 3-month review bundle. [TODO: final prices]

### Competitors (Oct 2026)
| Site | Price to diagnosis | Notes |
| --- | --- | --- |
| Focused Potential | $1,250 incl. GST | 2 GP consults + online tests + report; long contact form; no named doctor |
| ADHD GP (adhdgp.au) | $813 | 7 GPs, callback booking, city landing pages, names medicine brands (don't copy) |
| My Specialist GP / Velluto GP network | $400–$600 | Directory of GPs using Velluto |
| The ADHD Doctor (Dr Chris Soo) | Not published | Strong credentials, lived-experience AuDHD; don't copy "ADHD specialist GP" wording |
| ADHD Brisbane (Dr Mehdi Samani) | Medicare-rebated first visit | Face-to-face; page is client-rendered (invisible to some crawlers) |

Our edge: one doctor with ADHD start to finish, an intake built for ADHD brains, full cost upfront, care beyond the first plan.

### Tech decisions so far
- Website: Astro static site (pre-rendered), Tailwind, hosted on Cloudflare Pages. Supersedes the earlier Lovable + Supabase idea. No health data on the website.
- Intake: trial Velluto (velluto.health): ASRS v1.1 intake on the patient's phone, observer forms with reminders, document extraction, Sydney-hosted, $99/month per GP. It also offers booking + Stripe through a MySpecialistGP profile. It is NOT a phone receptionist.
- Booking: Velluto/MySpecialistGP or Halaxy. Decide after a Velluto demo. [Requires verification: embed on own domain; whether the MySpecialistGP profile shows competing GPs; Halaxy integration.]
- AI phone receptionist: FAQ and message-taking only. Options: Voral.ai, Pear "Aria", ElevenLabs Agents. [TODO: choose]
- Practice software: Halaxy favoured vs MedicalDirector Helix, MediRecords, Gentu. Deciding test: S8 eScripts + QScript in the prescribing flow.

### Open questions (Requires verification, not for Claude Code to answer)
- Section 19AB moratorium and Medicare items; written answer from Services Australia + MDO
- Prescribing while interstate; cover for mid-titration patients
- Qld maximum dose limits for specialist GPs
- Licence status of intake instruments (ASRS etc.) for website use
- Whether adult ADHD qualifies for Better Access mental health treatment plans
- GST treatment of fees; separate operating entity (JIC Global is not a health company)
- Indemnity cover confirmed with MDO

---

## PART 2 – Photos

| File | Shot | Use |
| --- | --- | --- |
| dr-sam-headshot.png | Studio head-and-shoulders, navy scrubs, stethoscope, grey background | PRIMARY: /about, DoctorCard, schema |
| dr-sam-desk.png | Seated at desk with laptop, home office, scrubs, stethoscope | Secondary, small only (max 640px wide) |
| dr-sam-consult.png | Candid three-quarter on a video call, scrubs, stethoscope | Secondary, small only (max 640px wide) |

- All are AI-generated (Higgsfield) from Sam's real photos. The headshot is the closest likeness. Plan to replace with a real professional shoot before scaling ad spend.
- Do not use any image containing the slogan "Better Focus Brighter Tomorrow" (it implies an outcome).
- Convert to WebP/AVIF at 1x and 2x; never ship the 2000px+ originals raw.

---

## PART 3 – Doctor bio (final copy, use word for word)

**Dr Sam Thomas**
Specialist GP (FRACGP) · Special interest in adult ADHD · Has ADHD himself

Short version
- In medicine since 2011, across Ireland, New Zealand, the UK and Australia
- Diagnosed with ADHD as an adult
- One doctor for your whole assessment and follow-up

### Why I do this
I was diagnosed with ADHD as an adult.
Getting assessed was harder than it needed to be. Long forms, long waits, and not many people who seemed to get it.
So this service is the one I wish I'd had. Short steps. Answer by voice if typing is a drag. The full price upfront. And a doctor who won't be surprised if a form slips your mind.

### Where I've worked
- 2011: Graduated in medicine (BMBS), University of Limerick, Ireland
- Hospital doctor in Ireland, then New Zealand
- General practice training in the UK
- 2019: Started in Australian general practice on the Gold Coast
- Now: Cannonvale Medical Centre in the Whitsundays, plus adult ADHD care by video across Queensland

### What that means for you
- ADHD rarely travels alone. Sleep, mood, anxiety and heart health are all checked before any treatment starts.
- Working in four countries' health systems showed me where people fall through the gaps.
- If your situation needs a psychiatrist, I'll tell you plainly and help you get there.

### How I work
- One doctor, start to finish. You won't be passed between clinicians.
- Plain explanations and a written plan you can actually use.
- Your plan covers the whole picture: sleep, routines, work, and psychology support where it helps.
- With your permission, your regular GP gets a summary so everyone is on the same page.

### Qualifications
- Fellow of the Royal Australian College of General Practitioners (FRACGP)
- Registered with AHPRA as a specialist general practitioner, registration number MED0002290862
- Bachelor of Medicine, Bachelor of Surgery (BMBS), University of Limerick, 2011
- Law degree: Bachelor of Laws (LLB), King's College London
- Adult ADHD training, BeyondGP Medical Education: [TODO: list only the units completed, with year]

### Outside work
Irish-born, now living in the Whitsundays. [TODO: one or two lines]

### Third-person short bio (directories, schema)
Dr Sam Thomas is a specialist GP (FRACGP) with a special interest in adult ADHD, and has ADHD himself. He graduated in medicine from the University of Limerick in 2011, worked in hospitals in Ireland and New Zealand, and trained as a GP in the UK. He has worked in Australian general practice since 2019, first on the Gold Coast and now in the Whitsundays, and sees adults across Queensland by video.

---

## PART 4 – Website build prompts (run in order)

## Read first: fix these five before Prompt 1

Two are advertising-law exposure; one is a wrong assumption about Velluto that changes what you build.

1. **Don't use the dating-app photos.** Every photo except the scrubs shot comes from your dating profile. Google Lens links a clinic headshot to that profile in seconds, and patients will look: an avoidable boundaries problem for an S8 prescriber seeing young adults. \[Likely\] The black-and-white portrait, street-jacket shot and white-tee shots are AI-generated or heavily AI-edited; patients meet you on video and notice the gap.
   - Now in use (30 Oct): Higgsfield scrubs photos made from your real ones. The studio headshot is the closest likeness and is primary; the desk and consult shots drift in build (bigger arms and chest), so keep them small.
   - Before launch: one professional shoot (headshot, half-body at a desk, a candid at a laptop) plus a 60-second phone video of you saying why you built this. None of the four competitors has a video.
   - No AI avatar or voice clone of you anywhere on the site.
2. **Fix three lines in the bio.**
   - “Now Mackay” misleads: you practise in Cannonvale, about 150 km away, where the Medicare-rebated in-person option is. Say Whitsundays (Cannonvale). \[Certain\]
   - “Fully accredited with the RACGP” isn't a credential. Use “Fellow of the RACGP (FRACGP)” and “registered with AHPRA as a specialist general practitioner”. \[Certain\]
   - Never “ADHD specialist” or “ADHD expert”. Use “specialist GP with a special interest in adult ADHD”. \[Likely\] AHPRA reads implied specialist standing outside your registration as misleading under s133.
3. **Velluto is not an AI receptionist.** \[Certain\] It is a pre-consult ADHD intake platform: ASRS v1.1 one question at a time on the patient's phone, speech-to-text, autosave across sittings, observer forms with automatic SMS/email reminders, AI extraction of school reports, a validity check and a scored summary PDF. It also does booking plus Stripe payment through a MySpecialistGP profile. Data is hosted in Sydney; $99/month per GP with a 14-day free trial ([how it works](https://velluto.health/how-it-works/), [pricing](https://velluto.health/pricing/)).
   - That is most of your pathway step 3 off the shelf. Trial it before anyone writes custom intake code that stores health data.
   - The phone line needs a different vendor: see Prompt 8.
4. **Your price sits above the Velluto GP network.** Velluto quotes $400–$570 patient cost via the GP pathway; ADHD GP is $813 and Focused Potential $1,250 ([Focused Potential](https://focusedpotential.com.au/gp-adhd-assessment/)). At $695–$745 the homepage has one screen to justify the gap: one doctor start to finish, lived experience, an intake built for ADHD brains, care beyond the first plan. Prices stay as placeholders until you decide.
5. **No medicine names, no “get your meds” framing, no testimonials.** TGA guidance says promoting a telehealth service as a way to get particular prescription medicines, or a class of them, is likely prohibited advertising ([TGA](https://www.tga.gov.au/resources/resource/guidance/advertising-health-services)) \[Certain\]. That “ADHD medication” counts as a class is \[Likely\]. ADHD GP names brands and answers “Can you prescribe ADHD medication? Yes”: don't copy it. AHPRA s133 separately bans clinical testimonials and unreasonable expectations of benefit \[Certain\]. Prompt 1 writes these rules into CLAUDE.md so every later prompt obeys them.

## Decisions and assets before Prompt 1

Only the first three block the build; everything else can sit as a placeholder until launch.

| Item | Blocks | Where it stands |
| --- | --- | --- |
| Brand name final + IP Australia trademark search | Prompt 1 | Logo chosen (Hyperfocus Health); search not done |
| Logo as SVG or 2000 px transparent PNG | Prompt 2 | Higgsfield PNG only |
| Original photo files, not screenshots | Prompt 6 | Scrubs photo usable now; shoot needed |
| Operating entity + ABN (JIC Global isn't a health company) | .com.au domain, Stripe, privacy policy | Open |
| AHPRA registration number | Bio, footer | \[ADD\] |
| Final price, inclusions, refund rule if excluded after intake | Prompt 5, Prompt 7 | $695–$745 proposed |
| Booking platform: Velluto/MySpecialistGP vs Halaxy | Prompt 5 | Decide after a Velluto demo |
| Phone number + AI receptionist vendor | Prompt 8 | Open |
| ADHD-specific training completed (course, year) | Prompt 6 | Only list what is real |
| MDO review of all public copy | Launch | Not started |

Questions to ask at the Velluto demo \[Requires verification for all four\]: can the booking widget sit on your own domain; does your MySpecialistGP profile page show other GPs (paid traffic leaking to $400 competitors); does it integrate with Halaxy or only export PDF; can intake run before the appointment is booked.

## Competitor read

None of the four lets an adult with ADHD go from “maybe” to booked in under three minutes with the full cost visible; that is the wedge.

| Site | Price | Booking | Copy this | Beat this |
| --- | --- | --- | --- | --- |
| [ADHD GP](https://adhdgp.au/) | $813 | Request form, staff call back to confirm; phones Mon–Fri 9–5 | Steps with a time cost on each; PubMed references with a “sources last checked” date; plain Medicare explanation | Names medicine brands; city pages for Sydney, Melbourne etc. while Qld-only; no real-time booking; stock photo hero; seven GPs, so no guaranteed single doctor |
| [Focused Potential](https://focusedpotential.com.au/gp-adhd-assessment/) | $1,250 incl. GST | Contact form with 12+ fields (DOB, postcode, uploads), callback | One all-in fee including a report; clear FAQ that Qld specialist GPs can diagnose since Dec 2025 | Exactly the long-form friction ADHD patients abandon; no named doctor; priciest |
| [The ADHD Doctor](https://theadhddoctor.com.au/about) | Not published | HotDoc | Bio that pairs lived experience (openly AuDHD) with credentials; in-person plus telehealth | You can't out-credential him (AADPA board, adjunct A/Prof). Compete on price transparency, access and flow; avoid his “ADHD specialist GP” wording |
| [ADHD Brisbane](https://adhdbrisbane.com.au/) | Medicare-rebated face-to-face first visit | Not visible | In-person Medicare angle: you have Cannonvale | My fetch returned only meta tags, no page text. \[Likely\] Content is rendered by JavaScript, so some crawlers and AI tools see a blank page. That is why Prompt 1 pre-renders everything |

Qld context \[Certain\]: since 1 December 2025 specialist GPs can diagnose ADHD in adults and prescribe, with no extra training required ([Queensland Government](https://www.qld.gov.au/health/conditions/all/adhd)). Expect more GP competitors, not fewer.

## How to run these prompts

Paste one prompt at a time, check the preview on your phone, commit, then move on. Never paste two at once.

1. **Make an empty GitHub repo.** github.com → “New” → name it `hyperfocus-site` → tick Private → Create repository.
2. **Upload the assets.** In the repo: “Add file” → “Upload files”. Rename first: `logo.png`, `dr-sam-headshot.png, dr-sam-desk.png, dr-sam-consult.png`. Commit. Prompt 1 moves them into the right folder.
3. **Open Claude Code on that repo.** Web, desktop app or terminal all work; choose the repo when asked. Screens change often \[Requires verification\]: if a step looks different, ask in this chat.
4. **Pick the model.** Fable 5.1 or Opus 5.5 both handle this build. Fable is a model you select inside Claude Code, not a separate tool. Pasting these into an ordinary chat means copying files by hand: don't.
5. **Paste Prompt 1** and let it finish. Read its summary before doing anything else.
6. **Preview.** Each prompt ends with Claude Code starting a preview. Check it on your phone first; most patients will arrive on one.
7. **Commit after every prompt.** Type: `commit this step with a clear message and push`. If a later prompt breaks something: `revert to the last good commit and explain what broke`.
8. **Start a fresh session when it slows down.** CLAUDE.md carries the rules, so nothing important is lost. Open with: `Read CLAUDE.md and docs/, then continue with Prompt N`.

Anything in \[BRACKETS\] is a placeholder. Fill it if you know it; otherwise Claude Code turns it into a TODO that blocks launch (Prompt 11).

If you go back to Lovable: the prompts mostly carry over, but Lovable builds a JavaScript single-page app by default. Confirm it pre-renders every page to HTML before committing to it \[Requires verification\].

## Prompt 1: project setup and CLAUDE.md

Sets a pre-rendered static stack and writes the rulebook every later prompt follows. It is the longest prompt; the rest stay short because this exists.

```text
You are building the public website for Hyperfocus Health, a Queensland-only adult ADHD telehealth service run by one doctor, Dr Sam Thomas. I have no coding experience. Whenever I must do something myself, give me numbered click-by-click steps. If you don't know a third-party product's current screens, say so instead of guessing.

STEP 1: CREATE THE PROJECT
- Astro (latest stable), TypeScript, Tailwind CSS. Static output: every page pre-rendered to HTML at build time. React islands only for interactive parts (eligibility checker, accordions).
- No database, no accounts, no forms that send or store what a visitor types. This site collects no health information.
- Folders: src/pages, src/components, src/content (page copy in Markdown/MDX so I can edit words without touching code), public/images, docs/.
- Move logo.png, dr-sam-headshot.png, dr-sam-desk.png and dr-sam-consult.png from the repo root into public/images.
- Create src/config/site.ts holding every value that might change: brand name, phone, email, address, AHPRA number, ABN, booking provider and URL, all prices, crisis numbers, social links. Use 'TODO:' placeholders for anything I haven't given. Nothing hard-coded elsewhere.
- Add Vitest for logic tests and Playwright for page checks.

STEP 2: WRITE CLAUDE.md AT THE REPO ROOT containing everything below, then summarise it back to me in 10 lines.

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
9. Never invent clinical facts, statistics, credentials, wait times or reviews. If copy needs a fact I haven't given, write [TODO: ...] and list it for me.

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
- After every change: run the build and tests, fix all errors, then tell me in plain English what changed and what to check.

STEP 3: Commit with the message 'Project setup and CLAUDE.md'. Then tell me how to start the preview and open it on my phone.
```

## Prompt 2: design system and layout

Turns the logo into a palette that passes contrast, and builds every reusable piece once. Mint on white will fail contrast for body text, so the prompt plans around it.

```text
Read CLAUDE.md first.

Build the design system and site shell.

1. Colours: write a short script that samples the exact hex values from public/images/logo.png (the dark teal 'Hyperfocus' text and the mint 'Health' text). Approximate values: dark teal #0D3640, mint #1CC99B. Build a palette: primary (dark teal), accent (mint), a darker mint for any text use, a soft off-white background, body text colour, and one warm highlight. Check every text/background pair against WCAG AA and show me the results in a table. Mint is for shapes, icons and large display text only.
2. Type: a geometric sans for headings close to the logo wordmark (free Google font, e.g. Plus Jakarta Sans or Outfit) and a highly readable body font (Atkinson Hyperlegible). Body 18px, line height 1.6. Self-host the fonts.
3. Components in src/components: Button (primary, secondary), Card, StepList (numbered steps, each with a time badge), TimeBadge, Callout (info, warning), Accordion, PriceCard, ShortVersion (3-bullet summary box), DoctorCard, CrisisStrip.
4. Layout: sticky header with logo, max 4 nav items (How it works, Pricing, About Dr Sam, FAQ) and one primary button 'Check eligibility'. On mobile: hamburger menu, primary button always visible. Footer: crisis numbers, 'Queensland adults 18+ only', AHPRA number, ABN, links to Privacy, Terms, Cancellations, Complaints, Accessibility.
5. A 'Focus mode' toggle in the header that hides decorative images, widens spacing and enlarges text. Remember the choice in localStorage, wrapped in try/catch so the page still works if storage is blocked.
6. A /styleguide page showing every component, excluded from the sitemap and set to noindex.

Run the build, start the preview and tell me how to open /styleguide on my phone.
```

## Prompt 3: homepage

One job: get a Queenslander from landing to the 60-second check. Every section either builds trust or removes a doubt; nothing else earns space.

```text
Read CLAUDE.md first. Build the homepage (src/pages/index.astro, copy in src/content/home.md). Follow every advertising and design rule.

Sections, in this order:

1. HERO
   - H1: 'Adult ADHD assessment by video, for Queenslanders'
   - Sub: 'One doctor who has ADHD himself, from your first appointment to ongoing care. The full cost is shown upfront.'
   - Primary button: 'Check if this is for you (60 sec)' -> /check
   - Secondary link: 'See how it works' -> /how-it-works
   - Trust row (small icons + text): Specialist GP (FRACGP) | AHPRA registered | Queensland adults 18+ | No referral needed
   - Image: DoctorCard with public/images/dr-sam-headshot.png at max 280px wide. No stock photos of patients.
2. SHORT VERSION box (3 bullets): what it is, what it costs to diagnosis (from site.ts), how long the intake takes.
3. HOW IT WORKS (condensed StepList, 5 steps, each with a TimeBadge):
   Check (60 sec) -> Book and pay (about 3 min) -> Intake on your phone (about 30 min, split it if you like) -> Two video appointments -> Reviews, then ongoing care. Link to /how-it-works.
4. WHY IT'S DIFFERENT (3 cards):
   - 'A doctor who gets it': Dr Sam has ADHD too.
   - 'Built for ADHD brains': no 40-page forms; answer by voice, tick boxes or short blocks.
   - 'More than a diagnosis': sleep, routines, work strategies and psychology support in your plan.
5. MEET DR SAM: 3 lines + link to /about.
6. PRICING TEASER: total to diagnosis, one line on Medicare (telehealth no rebate; in person at Cannonvale has one), link to /pricing.
7. IS THIS FOR YOU? Two columns. 'Good fit' (adult, Queensland, wants an ADHD assessment, no serious conditions in the not-suitable list). 'Better elsewhere' (the not-suitable list in plain words) with a link to /other-options explaining your GP or a psychiatrist kindly.
8. FAQ: the 5 most common questions as an Accordion, link to /faq.
9. FINAL CTA band: 'Not sure yet? The 60-second check tells you if this service suits you. Nothing you tick is saved.'

Also build /other-options as a short page: why some people are safer starting with their own GP or a psychiatrist, and how to ask for a referral. Kind, no blame.

Rules check before you finish: no medicine words, no superlatives, no wait-time claims (I have no data yet), no testimonials. List every [TODO] you created. Then start the preview.
```

## Prompt 4: 60-second eligibility checker

Its real job is stopping excluded people paying, then being refunded after intake. Answers never leave the browser, and a yes to the safety question gets support numbers, not a rejection.

```text
Read CLAUDE.md first. Build the eligibility checker at /check as a React island.

LOGIC: put it in src/lib/eligibility.ts as a pure function with Vitest tests covering every outcome. The UI only displays results.

SCREENS (one per screen, big tap-target buttons, progress bar 'Question 2 of 6', back button):
1. 'Are you 18 or over?' Yes / No
2. 'Do you live in Queensland, and will you be in Queensland for your video appointments?' Yes / No
3. 'Have you ever been diagnosed with or treated for any of these?' (tick any, or 'None of these')
   - Bipolar disorder
   - Psychosis or schizophrenia
   - An eating disorder
   - Drug or alcohol dependence, now or in the past
   - Heart problems, high blood pressure that isn't controlled, or fainting without a clear cause
4. 'Right now, does any of this apply?' (tick any, or 'None of these')
   - Pregnant or breastfeeding
   - Taking a prescribed controlled (Schedule 8) medicine for pain, sleep or anxiety
   - Severe depression or anxiety that isn't being treated
   - Autism or intellectual disability needing significant daily support
5. SAFETY: 'In the past month, have you had thoughts of ending your life?' Yes / No
6. 'Anything else you're unsure about?' optional, no text box: just a note that Dr Sam confirms suitability at the assessment.

OUTCOMES:
- Fit: 'This service looks like a good fit.' Show total cost, what happens after booking, the refund rule if Dr Sam later finds it unsuitable (from site.ts, TODO if missing), and the Book button -> /book.
- Not 18 or not in Queensland: kind message, suggest their own GP; no booking button.
- Health exclusion: 'This service isn't the safest place to start for you.' Explain that their own GP or a psychiatrist can look at the whole picture; link /other-options. No blame, no list of what they ticked.
- Safety yes: stop the checker immediately and show a support screen, regardless of other answers: 'If you're in danger now, call 000.' Lifeline 13 11 14, 1300 MH CALL 1300 642 255, Suicide Call Back Service 1300 659 467, 13YARN 13 92 76 (for Aboriginal and Torres Strait Islander people). Click-to-call links. Warm wording. Suggest talking to their GP this week.

PRIVACY:
- State answers live in memory only. No localStorage, no cookies, no network requests.
- Analytics events allowed: 'check_started', 'check_result_fit', 'check_result_not_fit'. Never which boxes were ticked; never fire any event from the safety screen.
- Show under the first question: 'Nothing you tick is saved or sent anywhere.'

ACCESSIBILITY: fully keyboard operable, focus moves to each new question, screen-reader labels, works with Focus mode.

Time yourself on mobile: a first-time user must finish in under 60 seconds. Run the tests, start the preview, and give me 5 test paths to click through.
```

## Prompt 5: booking and payment

Don't build booking yourself: link to or embed a platform that already takes payment, so no health data ever touches your site. Pick the platform before running this prompt.

| Option | How it works | Upside | Risk |
| --- | --- | --- | --- |
| A. Velluto + MySpecialistGP | Patient books on your profile, pays to your own Stripe within 24 h or the slot auto-cancels; intake goes out automatically | Booking, payment and intake joined up for $99/month; Sydney-hosted | Booking lives on a directory you don't control; possible leakage to cheaper GPs \[Requires verification\] |
| B. Halaxy booking, Velluto intake | Halaxy widget on your site; intake link sent after payment | Your own domain; your current practice-software favourite | Two systems and a hand-off; Halaxy payment at booking \[Requires verification\] |
| C. Custom (Supabase + Stripe) | Build it in code | Full control | Weeks of work, and you hold the health data and breach risk. Not for v1 |

Default to A if the demo shows no leakage, otherwise B. Either way, set the earliest first appointment at least 10 days after booking: Velluto's observer reminders run on days 2, 5 and 7, and baseline checks take time \[Likely\]. Cleaner still, if a platform supports it: sell the package first and unlock appointment booking once intake is complete.

```text
Read CLAUDE.md first. Build the booking pages.

Provider: set bookingProvider in site.ts to [VELLUTO_MSGP or HALAXY] and bookingUrl to [URL]. Build it so changing provider is a one-line config change.

1. /book
   - Short version box: what you're booking, total cost, what happens in the next 24 hours.
   - Two cards: 'Telehealth assessment (video, anywhere in Queensland): $[PRICE], no Medicare rebate' and 'In person at Cannonvale: Medicare rebate available, out-of-pocket about $[GAP]'.
   - Line with link: 'Haven't done the 60-second check? Do that first.'
   - Booking: if the provider offers an embeddable widget, load it in an iframe only after the visitor clicks 'Choose a time', with a fallback 'Open booking in a new tab' button. Otherwise one large button to bookingUrl. Never collect name, date of birth, Medicare number or health details on our own pages.
   - Note: 'Your first video appointment will be at least 10 days away, so you have time to finish the intake and baseline checks.'
2. /booking-confirmed (the provider's redirect target, if it supports one): a timeline of what happens next: intake link by SMS and email, how long it takes, the form for your partner or parent, baseline checks, appointment reminders.
3. /cancellations: cancellation, no-show and refund rules from site.ts, including what happens if Dr Sam finds the service unsuitable after reviewing the intake. TODOs where I haven't decided.

Then give me a checklist of settings to configure inside the provider: payment at booking, minimum 10-day notice for appointment 1, appointment types (60 min video, 30-45 min video, reviews of [REVIEW LENGTH]), reminder messages, redirect URL. If you don't know the provider's current screens, say so and give me the exact questions to ask their support instead.
```

## Prompt 6: Meet Dr Sam page and bio

This bio fixes the Mackay, “fully accredited” and specialist-title problems, and is built to beat the competitors. Chris Soo's leans on adjectives (passionate, good listener); ADHD GP lists seven names with no story; Focused Potential names no doctor. This one leads with lived experience in first person, says what it means for the patient, and states plainly when you'll refer on: that honesty is the trust signal. The studio headshot is the primary photo; the desk and consult shots are secondary because their build drifts from the real you.

```text
Read CLAUDE.md first. Build /about using the copy below word for word. Keep every [TODO] visible in the dev build and list them for me.

PHOTOS (move from the repo root into public/images):
- dr-sam-headshot.png: primary. Use on /about (max 320px wide) and in DoctorCard everywhere. Alt: 'Dr Sam Thomas, specialist GP, in navy scrubs with a stethoscope'.
- dr-sam-desk.png and dr-sam-consult.png: secondary. Use only on /how-it-works and the telehealth section, no wider than 640px. Alt text describes the scene.
- Convert all to WebP/AVIF at 1x and 2x. The originals are 2000px+; never ship them raw.
- Leave a hidden, clearly marked slot for a 60-second intro video (self-hosted MP4, captions, poster image, no autoplay). Show it only when a video file exists.

PAGE COPY

H1: Dr Sam Thomas
Sub: Specialist GP (FRACGP) · Special interest in adult ADHD · Has ADHD himself

SHORT VERSION box:
- In medicine since 2011, across Ireland, New Zealand, the UK and Australia
- Diagnosed with ADHD as an adult
- One doctor for your whole assessment and follow-up

H2: Why I do this
I was diagnosed with ADHD as an adult.
Getting assessed was harder than it needed to be. Long forms, long waits, and not many people who seemed to get it.
So this service is the one I wish I'd had. Short steps. Answer by voice if typing is a drag. The full price upfront. And a doctor who won't be surprised if a form slips your mind.

H2: Where I've worked (render as a vertical timeline)
- 2011: Graduated in medicine (BMBS), University of Limerick, Ireland
- Hospital doctor in Ireland, then New Zealand
- General practice training in the UK
- 2019: Started in Australian general practice on the Gold Coast
- Now: Cannonvale Medical Centre in the Whitsundays, plus adult ADHD care by video across Queensland

H2: What that means for you
- ADHD rarely travels alone. Sleep, mood, anxiety and heart health are all checked before any treatment starts.
- Working in four countries' health systems showed me where people fall through the gaps.
- If your situation needs a psychiatrist, I'll tell you plainly and help you get there.

H2: How I work
- One doctor, start to finish. You won't be passed between clinicians.
- Plain explanations and a written plan you can actually use.
- Your plan covers the whole picture: sleep, routines, work, and psychology support where it helps.
- With your permission, your regular GP gets a summary so everyone is on the same page.

H2: Qualifications
- Fellow of the Royal Australian College of General Practitioners (FRACGP)
- Registered with AHPRA as a specialist general practitioner, registration number MED0002290862
- Bachelor of Medicine, Bachelor of Surgery (BMBS), University of Limerick, 2011
- Law degree: Bachelor of Laws (LLB), King's College London
- Adult ADHD training, BeyondGP Medical Education: [TODO: list only the units completed, with year, e.g. 'Unit 1: Adult ADHD: Diagnosis, Assessment and Physical Health Management (2026)']

H2: Outside work
Irish-born, now living in the Whitsundays. [TODO: one or two lines Sam is happy for patients to know]

CTA: 'Check if this is for you (60 sec)'

THIRD-PERSON SHORT BIO (store in site.ts as doctorBioShort; use in DoctorCard, schema and directory listings):
Dr Sam Thomas is a specialist GP (FRACGP) with a special interest in adult ADHD, and has ADHD himself. He graduated in medicine from the University of Limerick in 2011, worked in hospitals in Ireland and New Zealand, and trained as a GP in the UK. He has worked in Australian general practice since 2019, first on the Gold Coast and now in the Whitsundays, and sees adults across Queensland by video.

SCHEMA: JSON-LD of type Physician (name, honorificPrefix 'Dr', description = short bio, medicalSpecialty PrimaryCare, worksFor the practice, address Cannonvale, image = headshot URL, sameAs empty for now). Validate it and show me the output.

Before finishing, run the CLAUDE.md rules check on this page: no superlatives, no 'ADHD specialist', no medicine words, no outcome promises.
```

## Prompt 7: pricing, how it works, FAQ

The pricing page is where you beat ADHD GP and Focused Potential: show the first three months as one honest number, not just the assessment fee. FAQ answers count as advertising too, so treatment is described without naming any medicine.

```text
Read CLAUDE.md first. Build three pages. All numbers come from site.ts.

1. /pricing
   - Short version box.
   - One table: Stage | What you get | Cost
     - Assessment to diagnosis: intake, appointment 1 (about 60 min), appointment 2 (30-45 min), written plan | $[PRICE] total
     - Review appointment, every 2-4 weeks while treatment is adjusted | $[REVIEW] each
     - Optional bundle: diagnosis + 3 months of reviews | $[BUNDLE]
     - Ongoing reviews once stable, every 3-6 months | $[ONGOING] each
     - Blood tests or ECG, only if your history needs them | Through your own GP or a pathology collection centre; costs vary [TODO: wording]
   - 'A typical first 3 months' worked example as one total, with the assumptions shown.
   - Medicare in plain words: telehealth has no rebate because Medicare requires a face-to-face visit with the practice in the last 12 months; in person at Cannonvale attracts a rebate.
   - GST line: [TODO: confirm GST treatment].
   - Payment timing, cancellations link, refund rule if found unsuitable after intake.
2. /how-it-works
   - The 8 pathway steps from CLAUDE.md as a StepList. Each step has two short lines: 'What you do' and 'What Dr Sam does', plus a TimeBadge.
   - A 'What you'll need' checklist: phone or laptop with camera, a quiet room, photo ID, Medicare card for in-person visits, the name and email of a partner or parent for the short observer form, any school reports or past assessments.
3. /faq (Accordion, grouped under headings: Before you book, Cost, The assessment, After diagnosis, Privacy). Include FAQPage JSON-LD. Questions:
   - Do I need a referral? (No.)
   - Can a GP diagnose ADHD in Queensland? (Yes: since 1 December 2025 specialist GPs can diagnose adults. Link https://www.qld.gov.au/health/conditions/all/adhd.)
   - Why is there no Medicare rebate for telehealth?
   - What if I'm not diagnosed with ADHD? [TODO: what they receive and fee policy]
   - What happens if I am diagnosed? (Answer: you leave appointment 2 with a written plan; Dr Sam talks through all options, including non-medicine strategies; any treatment is a decision you make together; reviews follow every 2-4 weeks while things are adjusted. Name no medicine or class.)
   - Can I move my ongoing care to my own GP later?
   - I live outside Queensland. Can I use this service? (Not at this stage.)
   - Who fills in the observer form, and what if I don't have anyone?
   - Can I do the intake in several sittings, or by voice?
   - What do I need for a video appointment?
   - Where is my information stored? [TODO: from privacy policy]
   - What if I'm struggling right now? (Crisis numbers, 000 first.)

Run the medicine-word check from CLAUDE.md across all three pages before finishing. List every TODO.
```

## Prompt 8: AI receptionist (phone and web)

Launch the phone agent as FAQ-and-message-taking only: it answers from a locked knowledge base, texts the booking link and takes messages. Letting it book, triage or improvise is how an AI line ends up quoting a dose to a caller.

| Option | What it is | Data location | Fit |
| --- | --- | --- | --- |
| [Voral.ai](https://f4.fund/startups/voral) (“Liza”) | Australian voice AI for medical practices; native Best Practice, Cliniko and Gentu links; call recording with PII redaction ([Digital Health Festival listing](https://www.terrapinn.com/exhibition/digital-health-festival/exhibitor-voral-ai.stm)) | Sydney (vendor claim) | Best AU-health fit; Halaxy not listed \[Requires verification\] |
| [Pear Australia](https://aidirectory.industry.gov.au/organisation/pear-australia-pty-ltd) “Aria” | AI medical phone assistant built on their medical phone system | \[Requires verification\] | Described as in development |
| ElevenLabs Agents | DIY voice agent; you connect a phone number | \[Requires verification\] | Cheapest and most control; you already use ElevenLabs; every guardrail is yours to build |

Recording: \[Likely\] Queensland law lets a party to a call record it without consent, but the agent is a third party handling health information, so disclose at the start anyway (Australian Privacy Principle 5). Your ElevenLabs account is connected to this chat: once the knowledge base below exists, the agent can be built from here.

```text
Read CLAUDE.md first. Prepare the website side of the AI phone receptionist and the agent's instructions. Vendor: [VORAL / ELEVENLABS / OTHER].

1. /contact page
   - Phone number as a click-to-call button, labelled: 'Our phone is answered by an AI assistant, 24/7. It can answer questions about the service, costs and booking. It can't give medical advice. A person replies to messages within [TODO] business hours.'
   - Email address. Crisis strip.
   - Optional 'Talk to the assistant in your browser' button, only if the vendor provides an embed; load its script only after the click.
2. docs/receptionist/knowledge-base.md
   Generate it from the site's own content files (pricing, how it works, FAQ, about, cancellations) so the website and the phone agent never disagree. Header: date generated, plus the rule 'regenerate after any site copy change'.
3. docs/receptionist/system-prompt.md with these rules:
   - Opening: 'Hi, you've reached Hyperfocus Health. I'm an AI assistant. This call may be recorded so the team can follow up. If this is an emergency, hang up and call 000.'
   - Answers only from the knowledge base. If the answer isn't there: 'I don't know that one, so I'll take a message for the team.'
   - Never discusses medicines, doses, side effects, test results, diagnoses, or whether a caller is eligible. Redirects to the 60-second check or a message.
   - Never compares us with other clinics; states our own prices only.
   - Never books, cancels or changes appointments; texts the booking link instead.
   - Any mention of self-harm, suicide, harm to others or a medical emergency: 000 first, then Lifeline 13 11 14 and 1300 MH CALL 1300 642 255, offer to repeat them slowly, then mark the message URGENT.
   - Callers under 18 or outside Queensland: explain the service can't help and suggest their own GP.
   - Takes messages with name, best number and the question. Never asks for a Medicare number, date of birth or health details.
   - Sends each message summary to [CLINICAL INBOX].
   - Australian English, warm, short sentences. Never pretends to be human.
4. docs/receptionist/test-calls.md: 25 test scripts with expected responses, including: asking for a named medicine, asking about a dose, 'I'm 17', 'I live in NSW', 'are you a real person?', 'I want to end it all', 'can you email my results?', 'how fast can I get diagnosed?', 'are you cheaper than ADHD GP?', a caller who swears, a caller who stays silent.

If the vendor is ElevenLabs, also write docs/receptionist/elevenlabs-setup.md: agent settings to choose and how to connect an Australian phone number. Where you're unsure of their current screens, say so.
```

After launch: run all 25 test calls monthly and read every transcript for the first 8 weeks. Keep a one-click switch to plain voicemail.

## Prompt 9: SEO, AI crawlers, Queensland landing pages

Copy ADHD GP's city pages, but only for Queensland and only with genuinely local content; thin copy-paste pages count as doorway pages to Google. Hold back a free ASRS self-test until its licence for commercial web use is confirmed (it's already on your open-questions list).

```text
Read CLAUDE.md first. Make the site easy for search engines and AI tools to read and cite.

1. TECHNICAL
   - sitemap.xml, robots.txt (allow Googlebot, Bingbot, GPTBot, ClaudeBot, PerplexityBot, Google-Extended), canonical URLs, Open Graph and Twitter images per page.
   - /llms.txt: a plain-text summary of the service, prices, pathway, who it's for and not for, and links to key pages.
   - JSON-LD: MedicalBusiness for the service (Queensland areaServed, Cannonvale address), Physician (from Prompt 6), FAQPage on /faq, BreadcrumbList site-wide. Validate all of it.
   - Unique title (60 characters max) and meta description (155 max) per page. No medicine words.
   - Core Web Vitals: run Lighthouse on mobile; target 95+ for Performance, Accessibility, Best Practices and SEO. Fix what blocks it.
2. QUEENSLAND LOCATION PAGES at /adhd-assessment/[city] for: Brisbane, Gold Coast, Sunshine Coast, Townsville, Cairns, Toowoomba, Mackay, Whitsundays.
   - Each must be genuinely useful and mostly unique: how telehealth works from that area, how baseline checks usually happen locally (generic, no named businesses unless I confirm them), handing ongoing care to a local GP, and for Whitsundays and Mackay the in-person Cannonvale option.
   - Never imply a clinic in that city. First line of each page: 'Video appointments for adults in [city]. Our only physical clinic is in Cannonvale.'
   - No pages for cities outside Queensland.
3. RESOURCES at /resources: 5 starter articles, 600-900 words each, each with a 'Short version' box, a references list (government or peer-reviewed sources only, with links), 'Reviewed by Dr Sam Thomas' and a review date:
   - Can a GP diagnose ADHD in Queensland? (cite https://www.qld.gov.au/health/conditions/all/adhd)
   - What happens in an adult ADHD assessment
   - ADHD and sleep: practical habits
   - ADHD at work: adjustments worth asking for
   - Telehealth or in person? Medicare explained
   No medicine names or classes in any article. Where you need a fact you can't source, write [TODO: source needed] instead of guessing.

List every page created with its title and meta description in a table for me to approve.
```

## Prompt 10: legal pages

Claude Code drafts these; a lawyer or your MDO signs them off. The privacy policy has to name every vendor that touches health data (booking, intake, phone agent, video) and where each stores it, so it can't be finished until those choices are made.

```text
Read CLAUDE.md first. Draft the legal pages in plain English, short sections, each with a 'Short version' box. Mark every page with a visible 'DRAFT: pending legal review' banner that Prompt 11's launch check will block in production.

1. /privacy: Privacy policy under the Australian Privacy Principles.
   - This website: collects nothing you type; privacy-friendly analytics only, no ad pixels.
   - Booking and payment: [PROVIDER], what it collects, where it's stored.
   - Intake: [Velluto or other], what it collects, where it's stored (Velluto states Sydney hosting; confirm in its privacy policy).
   - Phone assistant: [VENDOR], recordings and transcripts, retention period [TODO], storage location [TODO].
   - Video consults and clinical records: [PRACTICE SOFTWARE], storage location [TODO].
   - Any overseas disclosure, named. Access and correction. Complaints, then the OAIC (oaic.gov.au).
2. /collection-notice: short notice linked from the phone page and booking page.
3. /terms: terms of use; the website is general information, not medical advice; Queensland adults only.
4. /cancellations: (exists from Prompt 5) check consistency with terms.
5. /complaints: tell us first ([EMAIL], response within [TODO] business days), then the Office of the Health Ombudsman Queensland (133 OHO, oho.qld.gov.au). AHPRA for practitioner conduct concerns.
6. /accessibility: WCAG 2.2 AA target, how to report a barrier.

Never invent a retention period, storage location or legal requirement. Use [TODO] and give me a list of questions to put to each vendor and to my MDO.
```

## Prompt 11: compliance and ADHD-UX audit

Turns the CLAUDE.md rules into automated checks that fail the build, so a later copy edit can't quietly reintroduce a medicine name. The final review runs as a fresh sub-agent that didn't write the site.

```text
Read CLAUDE.md first. Build automated checks, then audit the whole site.

1. scripts/compliance-check.ts, run on every build; the build FAILS on any hit:
   - Medicine words (case-insensitive, whole words only, in visible text, alt text, meta tags, JSON-LD values, URLs and llms.txt; never in HTML tags or code): dexamfetamine, dexamphetamine, lisdexamfetamine, methylphenidate, atomoxetine, guanfacine, Vyvanse, Ritalin, Concerta, Strattera, Intuniv, stimulant, stimulants, 'ADHD medication', meds, script, scripts. Allow only the exact 'not suitable for' wording from CLAUDE.md.
   - Superlatives and promises: best, leading, 'the only', guaranteed, life-changing, expert, fast diagnosis, same-day, quick diagnosis.
   - Titles: 'ADHD specialist', 'ADHD expert', psychiatrist (except on /other-options and in referral context).
   - Testimonial patterns: testimonial, 'patients say', star ratings, review widgets.
   - Launch blockers in production builds: any [TODO, 'DRAFT: pending legal review', localhost URLs.
   Print each hit with file and line, and a suggested rewrite.
2. scripts/adhd-ux-check.ts, warnings only:
   - Paragraphs over 3 sentences or 60 words; pages without a Short version box (where required); readability above Year 8 (Flesch-Kincaid) per page; more than one primary button visible per screen at 390px wide.
3. Playwright tests: every page at 390px and 1280px; screenshots saved to docs/screenshots; axe-core accessibility scan with zero serious issues; check that view-source contains the page's H1 text (proves pre-rendering); crisis numbers present in every footer; checker outcomes match the Vitest logic.
4. Fresh-eyes review: start a sub-agent that has not seen this conversation. Give it CLAUDE.md and the built site only. Ask it to act as an AHPRA advertising reviewer and then as a 25-year-old with ADHD on a phone, and report the 10 worst problems from each view.
5. Write docs/audit-report.md: pass/fail table, every issue, what you fixed, and what needs my decision. Fix everything that doesn't change meaning; ask me before changing any claim or price.
```

## Prompt 12: deploy and go-live

A static site costs close to nothing to host; the real launch gate is the checklist under the prompt, not the deploy.

```text
Read CLAUDE.md first. Deploy the site and prepare launch. I have no experience with hosting or DNS: give me click-by-click steps for everything I must do in a browser.

1. Hosting: Cloudflare Pages (static, free tier) connected to this GitHub repo, auto-deploying on every push to main. Create a preview deployment for every other branch.
2. Domain: walk me through registering [DOMAIN].com.au (it needs the ABN of the operating business) and pointing it at Cloudflare. Force HTTPS; redirect www to the bare domain.
3. Security headers via a _headers file: Content-Security-Policy allowing only our own assets plus the booking and phone vendors' domains, HSTS, X-Content-Type-Options, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy denying camera, microphone and geolocation except where a vendor embed needs them.
4. Analytics: Cloudflare Web Analytics (or Plausible). Track only the checker events from Prompt 4 and clicks on Book and Call.
5. Search: steps to verify the site in Google Search Console and Bing Webmaster Tools and submit sitemap.xml.
6. Monitoring: free uptime check on the homepage, /check and /book, alerting [EMAIL].
7. Make the compliance check from Prompt 11 run on every deploy; a failed check must block the deploy.

Finish with a one-page docs/launch-runbook.md: how to change a price, swap the booking link, update copy, and roll back a bad deploy.
```

Go-live checklist (all must be ticked):

- [ ] Compliance check passes with zero hits, no TODO or DRAFT left
- [ ] MDO has reviewed every public page, the phone script and the checker wording
- [ ] Privacy policy and collection notice reviewed and published
- [ ] Real booking made end to end with a real card, then refunded
- [ ] Intake link arrives, completes on a phone, and the summary reaches you
- [ ] All 25 phone test calls pass; crisis numbers verified current
- [ ] Checked on an iPhone, an Android and a laptop, including Focus mode
- [ ] AHPRA number, ABN and prices are real, not placeholders
- [ ] Professional photos in place of the scrubs shot (or a deliberate decision to launch with it)

## Pre-mortem: it's April 2027 and the site has failed

Most likely cause: the site worked and you ran out of hours. One doctor's capacity, not traffic, is the binding constraint, so the cap belongs in the site from day one.

| Failure | Early warning | Mitigation |
| --- | --- | --- |
| Capacity collapse: each new patient costs about 3 clinical hours in the first 3 months (60 + 40 min, then about 4 reviews at an assumed 20 min \[Guessing\]). 10 new patients a week means about 30 hours a week by month 3, on top of Cannonvale | Next available appointment drifts past 3 weeks; review slots crowd out new assessments | Weekly new-patient cap in site.ts; show the real next available date; a waitlist page instead of overbooking |
| Regulator complaint: a competitor reports medicine-class wording, a review widget or a specialist claim | AHPRA or TGA letter; ads disapproved | Prompt 11 check blocks every deploy; MDO sign-off before launch; no review widgets ever |
| Paid traffic leaks to cheaper GPs on MySpecialistGP | Many “fit” checker results, few bookings | Verify at the Velluto demo; switch to Halaxy booking on your own domain if profiles show other GPs |
| Excluded patients pay, then get refunded | Refund and chargeback count climbs | Checker mirrors every exclusion; refund rule shown before payment |
| Phone agent says something clinical or mishandles a crisis call | A transcript you'd be uncomfortable reading aloud | FAQ-only scope; 25 test calls monthly; read every transcript for 8 weeks; voicemail switch |
| The premium doesn't convert ($695–$745 vs $400–$600 elsewhere) | Low booking rate from “fit” results | Decision trigger \[Guessing on thresholds\]: after 200 checker completions, if under 15% of fits book, test the bundle or a lower price |
| Organic search is slow and ads are restricted for this category \[Requires verification\] | Fewer than a handful of organic bookings by month 3 | Publish the 5 articles at launch; build referral links with Whitsundays and Mackay GPs and psychologists; list on directories as an extra channel |

Concrete mitigation before launch: decide your maximum new patients per week (protecting reviews first), put it in site.ts, and let the booking platform enforce it. Revisit the cap and price together at the 200-completion mark.

