# Compliance and ADHD-UX audit (Prompt 11)

Date: 31 October 2026. Site state: pre-launch (`launched: false`), commit after Prompt 10 plus the fixes listed here.

Three layers were used:

1. **Automated checks, now part of the build.** `npm run build` fails on any advertising-rule hit (`scripts/compliance-check.ts`). `npm run ux` prints ADHD-friendly design warnings. `npx playwright test --project=audit` screenshots every page at 390px and 1280px, runs an axe-core accessibility scan, proves pre-rendering, checks the crisis footer and compares the checker's screens with its decision logic.
2. **A fresh-eyes review** by a separate reviewer that had never seen the project: only CLAUDE.md and the built site. Once as an AHPRA advertising and consumer-law reviewer, once as a 25-year-old in Townsville with ADHD on a phone at 11pm. Its full report is reproduced below.
3. **Fixes and decisions.** Everything that didn't change a claim, price or policy was fixed. Everything that would has a recommendation and waits for Sam.

## Pass / fail

| Check | Result | Notes |
| --- | --- | --- |
| Medicine names, brands, classes (text, alt, meta, JSON-LD, URLs, llms.txt) | PASS | 0 hits across 36 built files. Only the exact 'not suitable for' wording is exempt. |
| Superlatives, promises, wait-time claims | PASS | 0 hits |
| Titles ('ADHD specialist', 'psychiatrist' outside referral context) | PASS | 0 hits. 'psychiatrist' appears only in referral sentences, on /other-options and in citations. |
| Testimonials, ratings, review widgets | PASS | 0 hits |
| Launch blockers (`[TODO`, draft banners, placeholder domain) | 467 found, allowed pre-launch | Fail the build the moment `launched` is true. See "Still blocking launch". |
| Compliance warnings (generic words) | 1 | 'psychiatric disabilities' quoting the Disability Discrimination Act on /resources/adhd-at-work. Fine. |
| axe-core accessibility, every page, 390px and 1280px | PASS | 0 serious or critical issues on 31 pages × 2 sizes (style-guide contrast demos excluded by design). |
| Pre-rendering (raw HTML carries the H1) | PASS | 31/31 pages |
| Crisis numbers in every footer | PASS | 31/31 pages |
| No sideways scroll at 390px | PASS | 31/31 pages |
| Checker screens match `evaluate()` | PASS | 19 answer combinations, including safety overriding everything |
| Lighthouse (mobile) | PASS | 99–100 Performance, Accessibility, Best practices; SEO 69 only because the site is deliberately noindex before launch (100 when launched). `docs/lighthouse-2026-10-31.md` |
| Paragraphs ≤ 3 sentences / 60 words | 11 warnings | Listed below; 2 fixed, 9 left deliberately (see UX warnings). |
| Short version box on every long page | PASS | All 27 long pages have one |
| Reading level ≤ Year 8 (Flesch-Kincaid) | 1 warning | /about scores 9.0 (qualification names and place names). Every other page is 4–8. |
| One primary action per phone screen | PASS | Counted by destination, so the sticky header CTA and a page CTA to /check count once |
| Unit tests / browser tests | PASS | 120 unit, 604 browser, 83 audit |

## What the fresh-eyes reviewer found, and what happened to each

Severity order follows the reviewer's. **Fixed** = done in this commit without changing meaning. **Decision** = changes a claim, price or policy, so it waits for Sam (see the next section). **Known** = pre-launch placeholder already tracked.

### A. AHPRA advertising, TGA and consumer-law view

| # | Finding | Outcome |
| --- | --- | --- |
| A1 | Articles say "Reviewed by Dr Sam Thomas" with a TODO date, asserting a review that hasn't happened | **Fixed.** Until a date is set the line reads "Draft: not yet reviewed by Dr Sam Thomas" with the TODO box. Once reviewed: "Reviewed by Dr Sam Thomas, specialist GP, on <date>." Test updated. |
| A2 | Site says "video or phone" but the physician JSON-LD still said "by video"; a 60-min phone assessment is a clinical-governance question | **Fixed** the JSON-LD/bio text to "by video or phone". The phone-assessment question is already in `docs/legal-questions.md` (MDO Q12) and in the decisions below. |
| A3 | $425 kept when Dr Sam declines after the intake; term not shown where you pay; in-person bookings also fall under Cannonvale Medical Centre's own cancellation terms (HotDoc: $90 within 2 hours) | **Fixed** the disclosure: the refund rule now appears on /book itself and the checker result explains what the check does and doesn't cover. The fee policy and the clinic-terms conflict are **decisions** (D1, D2). |
| A4 | "There is no GST on these fees" stated as fact | **Decision** (D3). Sam said no GST; the reviewer asks for the accountant's confirmation first. |
| A5 | No legal entity, email or phone anywhere | **Known** launch blockers. |
| A6 | Medicare telehealth rule stated as an absolute and incomplete (no MyMedicare registration, no exemptions), contradicting our own article | **Fixed** on /pricing, /faq, home and llms.txt: "Medicare usually only pays… if you've been seen face to face at that practice in the last 12 months, or you're registered there through MyMedicare. New patients of this service won't meet either." Conclusion unchanged. |
| A7 | 13 Begley Street is the `MedicalBusiness` address in structured data on every page; map services would pin it | **Decision** (D4). Already raised with Sam on 31 Oct. |
| A8 | Unverified operational claims: records "stored in Australia"; AI phone "24/7"; "In the next 24 hours you get a confirmation"; 10-day lead time; Defence line on Townsville | **Decisions** (D5–D7). The 10-day minimum is in the build brief and stays. |
| A9 | Outcome framing: "$745 total to reach a diagnosis"; "strategies that don't involve medicine"; "Treatment isn't started at this appointment"; "before any treatment starts" | **Decision** (D8). "Total to reach a diagnosis" is CLAUDE.md rule 5's own wording, so it needs Sam to resolve the tension. |
| A10 | Credentials not in CLAUDE.md: Ahpra number, LLB, Gold Coast, "Yes, many can", BeyondGP TODO visible, "Outside work" line | Ahpra number, LLB and Gold Coast were given by Sam in this project (verified by him, not invented). **Fixed** "Yes, many can" → "Yes." BeyondGP TODO and the Irish-born line are Sam's standing instructions ("leave for now"). **Decision** (D9) whether to hide the BeyondGP line until units are complete. |
| lesser | "Every likely cost is on this page" but baseline checks (GP/pharmacy) have no cost row | **Decision** (D10). |
| lesser | "AHPRA" and "Ahpra" both used | **Fixed**: "Ahpra" (the regulator's own styling) in all visible copy. |
| lesser | FAQ "More support numbers are at the bottom of this page" | Correct as written: the FAQ carries the full crisis strip (4 numbers) above the footer. No change. |

### B. 25-year-old with ADHD, Townsville, phone, 11pm

| # | Finding | Outcome |
| --- | --- | --- |
| B1 | No way to book: the booking box is a TODO, and the only tappable button is HotDoc for Cannonvale, placed above the telehealth option | **Fixed** the order: telehealth card, then the booking box, then the 10-day note, then "Would you rather come in? Only if you can get to Cannonvale". Developer text replaced with "[TODO: online booking opens once the booking platform is set up]". The missing provider is a **known** blocker. |
| B2 | No service name in the header on any normal phone (wordmark hidden below 400px) | **Fixed**: the stacked wordmark now shows from 360px (iPhone SE and most Androids). Icon-only below 360px. |
| B3 | "The full cost is shown upfront" but the price is 2.3 screens down; two Dr Sam cards | **Fixed** the hero: "The full cost is shown upfront: $745 in total." The second doctor section is the agreed home-page structure (Prompt 4); **decision** (D11) if Sam wants it cut. |
| B4 | How it works never says the cost or where baseline checks happen; "10 days away" sits under "What Dr Sam does" | **Fixed**: step 2 now says "pay $425. The other $320 is paid when you book appointment 2 ($745 in total)"; step 4 says "usually by your own GP or a pharmacy"; the 10-day line reads "Keeps your first appointment at least 10 days away…". |
| B5 | Last checker screen isn't a question and contradicts the pricing page; disabled Continue looks live; $745 = $425 + $320 unexplained | **Fixed**: screen 6 is "Not sure about something? … Dr Sam checks that this service suits you when he reads your intake, and you can ask him anything at your first appointment." Disabled Continue is dimmed (opacity 40%) with the hint "Tick anything that applies, or choose None of these." The result screen shows "Paid in 2 parts: $425 when you book, then $320…". Dropping screen 6 entirely is a **decision** (D12): it exists so everyone reaches the safety question with a pause before the result. |
| B6 | The refund rule right after "good fit" is alarming | **Fixed** the context: "This check covers the main reasons the service might not suit someone. Now and then the intake shows something else." The policy itself is D1. |
| B7 | "Reviews" reads as customer reviews | **Fixed**: "follow-up appointments (we call them reviews)" on first use on home, pricing, FAQ and area pages; table row "Review appointment (follow-up)". |
| B8 | FAQ's Cost section has no cost; Short version chip says "4 min read" | **Fixed**: new first question "How much does it cost?" with the split and review fee; chip now reads "Whole page: 4 min read". |
| B9 | "Book" isn't in the menu or footer; Contact, Areas, Resources footer-only | **Fixed**: "Book" added to every footer, and "Already done the check? Book your assessment" under the CTA on /pricing and /how-it-works. The menu stays at 4 items as the brief requires; adding Book/Contact to it is a **decision** (D13). |
| B10 | Townsville short version spends a bullet on Defence members and gives no price; article TODO box, duplicated breadcrumb, 15px citation links; no appointment times anywhere | **Fixed**: price bullet replaces the Defence bullet (Defence stays in the body, see D7); a "Cost" line on every area page; breadcrumbs show parents only (the H1 names the page); citation links padded to a 24px+ target. The TODO box is the launch blocker doing its job. Appointment times are a **decision** (D14). |
| smaller | "Medicare in plain words" is long for someone who can't visit Cannonvale | Left as is (it also explains why there's no rebate); could be collapsed later. |
| smaller | Header CTA shown on /check | **Fixed**: hidden on the check page. |
| smaller | "intake" used on home before it's explained | **Fixed**: "Online intake (questions) on your phone". |

### C. Broken, missing or placeholder

| # | Finding | Outcome |
| --- | --- | --- |
| 1 | Visible `[TODO]` boxes (entity, email, phone, booking, vendors, review dates, BeyondGP) | **Known**: these are the launch blockers; the build fails if any remain when launched. |
| 2 | No booking button | **Known** (provider not chosen). |
| 3 | Wordmark hidden on phones | **Fixed** (B2). |
| 4 | Disabled Continue styled as enabled | **Fixed** (B5). |
| 5 | Placeholder domain in canonicals, share images, JSON-LD, llms.txt | **Known**: swapped in one line (`site.url`) when the domain is registered. |
| 6 | JavaScript off: checker does nothing, no fallback; accessibility page over-claims | **Fixed**: a plain no-JavaScript message with links to the fit lists and other options; accessibility page now says the check and the phone menu need JavaScript. |
| 7 | Tap targets under 44px: footer 000 link, logo link, citation links; inline body links | **Fixed** the first three. Inline text links are a WCAG 2.5.8 exception and stay. |
| 8 | Two sets of cancellation terms for in-person appointments (ours vs the clinic's HotDoc terms) | **Decision** (D2). |
| 9 | noindex and robots Disallow everywhere | Correct pre-launch. |
| 10 | AHPRA/Ahpra; breadcrumb repeats title | **Fixed**. |
| 11 | External links: only 2 of 33 verifiable from the build machine (proxy) | Each article's references were opened and checked by the writer at draft time; Sam re-checks them when reviewing each article. |

## Decisions for Sam

**Decided 31 Oct 2026:** D1 (a $95 intake review paid at booking and taken off the $425; if unsuitable, Dr Sam emails why or asks for more information, and only the $95 is kept), D2 (in-person cancellations follow Cannonvale Medical Centre's terms), D8 ('$745 total for the full assessment'; treatment and medicine lines removed). The rest are still open.

Nothing below has been changed. Each has a recommended wording ready to drop in.

| # | Question | Recommendation |
| --- | --- | --- |
| D1 | Keep the whole $425 when you decide from the intake alone that the service isn't suitable? The reviewer (and I, earlier) see an unfair-contract-terms risk: the patient gets an email and no service. | Refund most of it: e.g. keep $95 for the intake review, refund $330. Or hold appointment 1 as a short explanation call. Put the exact split on /book above the pay button. Ask the MDO (legal-questions Q7). |
| D2 | In-person bookings are made through Cannonvale Medical Centre, whose HotDoc listing shows its own cancellation fee ($90 within 2 hours). Our site promises free up to 48 hours, then 50%. | Add to the in-person box and /cancellations: "Appointments booked through Cannonvale Medical Centre follow the clinic's own booking and cancellation terms." Check with the practice manager. |
| D3 | "There is no GST on these fees" is stated as fact. | Keep only once the accountant confirms in writing. Until then: "All prices are in Australian dollars and are the full amount you pay." |
| D4 | 13 Begley Street as the `MedicalBusiness` address in structured data on every page (map services pin it; is it your home?). | Remove `address` from the structured data and keep Cannonvale Medical Centre as `location`; show the business address only in the privacy policy text, or as "Cannonvale QLD 4802". |
| D5 | FAQ: "Your booking, intake and clinical records are kept in secure practice software, stored in Australia." The vendors aren't chosen and the privacy policy has TODOs for every location. | Until vendors are confirmed in writing: "Your records are kept by the services named in our privacy policy. We're choosing them on the condition that your information stays in Australia." |
| D6 | /book: "In the next 24 hours you get a confirmation, then a link to the online intake by text and email." Depends on the booking and intake platforms. | **Decided (Sam, 31 Oct 2026):** "Within 1 business day". Done. |
| D7 | Townsville: "Serving members of the Australian Defence Force get their health care through Defence. Speak to your Defence health centre before booking." True in general [Likely] but unsourced. | **Decided (Sam, 31 Oct 2026):** deleted. |
| D8 | Outcome framing: "$745 total to reach a diagnosis" (CLAUDE.md rule 5's own words) reads as "pay, get a diagnosis". Also "strategies that don't involve medicine" (FAQ), "Treatment isn't started at this appointment" (step 5), "before any treatment starts" (about). | "$745 total for the full assessment: online intake, two appointments and a written plan." FAQ: "Dr Sam talks you through your options and you decide together. Your plan can cover sleep, routines, work and psychology support." Step 5: delete the treatment sentence. About: "…are all checked as part of the assessment." If you agree, I'll also update CLAUDE.md rule 5. |
| D9 | "Adult ADHD training, BeyondGP Medical Education: [TODO…]" is visible to the public and names a provider next to an instruction to list units. | **Decided (Sam, 31 Oct 2026):** hidden while `doctor.adhdTraining` is a TODO; shows automatically once filled. |
| D10 | /pricing says "Every likely cost is on this page", but the baseline checks (blood pressure, pulse, weight at a GP or pharmacy) have no cost row. | Add a row: "Baseline checks (blood pressure, pulse, weight): not included. Usually done by your own GP or a pharmacy; ask them about any cost." | **Decided (Sam, 31 Oct 2026):** row added; also in the 'Not included' line of the 3-month example. |
| D11 | Home page is about 9 phone screens long and introduces Dr Sam twice (hero card and "Meet Dr Sam"). | Cut the "Meet Dr Sam" section (the hero card and /about cover it). This changes the Prompt 4 structure, so it's yours to call. |
| D12 | Checker screen 6 ("Not sure about something?") is an information screen, not a question. | Keep (it gives a breath before the result and keeps the safety question in the middle), or drop it and say "Five quick questions". |
| D13 | Main menu is capped at 4 items by the brief; Book and Contact are footer-only. | Add "Book" to the menu (5 items) once online booking exists. |
| D14 | Nothing on the site says when appointments are available (evenings? weekends?). | Decide, then one line on /book and /how-it-works: "Appointments are available [days/times], Queensland time." |
| D15 | Phone-only first assessments (patient's choice) are a clinical-governance question for the MDO before they're advertised. | Already in legal-questions Q12. Consider "video by default; phone when video isn't possible" wording. |

## UX warnings left on purpose

`npm run ux` still reports these. None breaks a rule hard enough to be worth the loss of meaning:

- /about: Sam's "Why I do this" paragraph is five deliberately short fragments ("Short steps. Answer by voice if typing is a drag."). Low reading load; kept in his voice. The page's reading grade (9.0) comes from qualification and place names.
- /faq: four answers run to 4–5 sentences (Queensland GP, Medicare rule, what happens if diagnosed, not diagnosed). Each is one answer behind a tap; splitting them would mean more taps.
- /contact: the AI-assistant label (4 sentences) is the wording Sam specified.
- /pricing: the care-plan paragraph (3 sentences, 55 words) sits just under the 60-word line after trimming.
- Articles (sleep, at-work) and the resources index: one 4-sentence paragraph each; they await Sam's review anyway.

## Still blocking launch

The build will refuse a launched site while any of these remain. All are Sam's inputs, not code:

- Business: operating entity name (footer, privacy, terms, collection notice); registered domain (`site.url`).
- Contact: public phone number and email.
- Booking: platform and its link.
- Vendors in the privacy policy: booking, intake, phone assistant, records/video, note-taking tool, email, and the list of overseas recipients.
- Legal: all five legal pages signed off (remove `draft: true`); record-retention period and access-request response time from the MDO.
- Articles: Sam's review date on each of the five.
- Bio: BeyondGP units (or hide the line, D9).

## How to run the audit again

```bash
npm run build      # fails on any advertising-rule hit
npm run ux         # ADHD-friendly design warnings -> docs/adhd-ux-report.md
npm run audit      # build + ux + screenshots, axe, pre-render and checker checks
```

Screenshots land in `docs/screenshots/<page>-390.png` and `-1280.png` (not committed).

---

## Appendix: the fresh-eyes reviewer's report, verbatim

The reviewer was given CLAUDE.md and the built site only, with no access to the source or this conversation.

### REVIEW A: AHPRA advertising, TGA and Australian Consumer Law

Reviewer: health-advertising compliance / consumer-law lawyer. Checked visible copy, titles, meta descriptions, alt text, JSON-LD, llms.txt and link targets against the rules and service facts in CLAUDE.md.

What is clean: no medicine names, brands or classes anywhere (the Schedule 8 wording in the exclusion list is the only exception and matches the brief word for word); no testimonials or review widgets; no superlatives (no "best", "leading", "expert", "fast", "same-day", "guaranteed"); titles are "Specialist GP (FRACGP)" throughout; no urgency or scarcity; the crisis strip (000, 1300 MH CALL, Lifeline) is in every footer; no third-party scripts or ad pixels load on any page; no page implies a clinic outside Cannonvale, in text or in structured data; every public page carries "Queensland adults 18+ only". Good work on the hard rules. The problems are in facts and framing.

#### A1. Five articles say "Reviewed by Dr Sam Thomas" when they have not been reviewed

- Pages: /resources/can-a-gp-diagnose-adhd-in-queensland, /what-happens-in-an-adult-adhd-assessment, /adhd-and-sleep, /adhd-at-work, /telehealth-or-in-person-medicare
- Text: "Reviewed by **Dr Sam Thomas**, specialist GP. Review date: [TODO: Dr Sam to read and approve]"
- Rule: CLAUDE.md rule 9 (never invent a fact or credential); ACL s18/s29 (misleading representation about the service); AHPRA advertising guidelines (advertising must not be false or misleading).
- Why it matters: the line asserts a clinical review by a registered practitioner that has not happened. The TODO box next to it doesn't cure that; a visitor reads "Reviewed by Dr Sam Thomas". The JSON-LD correctly omits `reviewedBy`, so the HTML and the structured data currently contradict each other.
- Rewrite: until a date exists, render "Draft: not yet reviewed by Dr Sam Thomas" (or hide the line entirely). Once reviewed: "Reviewed by Dr Sam Thomas, specialist GP, on 12 November 2026."

#### A2. The site sells "video or phone" appointments; the service facts say video

- Pages: every page. Home h1 "Adult ADHD assessment by video or phone, for Queenslanders"; How it works "Choose a time for your first appointment, by video or phone"; "A phone, or a laptop with a camera if you'd like video"; Townsville "or choose a phone appointment"; Cairns "If the internet drops, a phone appointment still works"; llms.txt; every meta description.
- But the About page JSON-LD says Dr Sam "sees adults across Queensland by video", and CLAUDE.md's pathway is "Video appointment 1", "Video appointment 2", "Telehealth by video".
- Rule: CLAUDE.md service facts (the site must match the pathway exactly); ACL s18 if phone is not actually offered (misdescribing the nature of the service).
- Why it matters: either the site is promising a mode of service that won't be delivered, or the brief is stale and the structured data is wrong. Separately, a ~60-minute first ADHD assessment and the baseline mental-state observation by phone alone is a clinical-governance question Sam's MDO should see before it is advertised.
- Rewrite (if video only): "Adult ADHD assessment by video, for Queenslanders" and remove "or phone" site-wide; keep phone as a fallback only ("if your video drops, Dr Sam will call you"). If phone is genuinely offered, update CLAUDE.md and the physician JSON-LD description so all three agree.

#### A3. $425 is kept when Dr Sam declines to provide the service, and the term isn't shown where you pay

- Pages: /pricing ("If your intake shows this service clearly isn't right for you, Dr Sam emails you to explain why and where to go instead. The $425 isn't refunded, because he has already read your intake and prepared. You won't pay the $320."), /cancellations (same), /faq ("The $425 for appointment 1 isn't refunded"), the checker result screen, /terms ("You become a patient once you book and Dr Sam accepts you after reading your intake").
- /book, where payment starts, says only "Need to change plans later? See cancellations and refunds." The non-refund-if-unsuitable term is not on the page.
- Rule: ACL Part 2-3 unfair contract terms (standard-form consumer contract; a term that lets the trader cancel and keep the full first payment is the textbook example of a term that may be disproportionate to the trader's loss); ACL s18 / disclosure of non-refundable deposits before payment; CLAUDE.md rule 5 (no hidden fees).
- Why it matters: the trader decides suitability after taking $425; the consumer gets an email and no service. Reading an intake is not $425 of loss. If a patient complains to the OHO or QCAT, "he has already read your intake and prepared" is a weak justification. There is also a second, unmentioned conflict: in-person bookings go through Cannonvale Medical Centre via HotDoc, whose own listing states private billing and a $90 fee for cancellations within 2 hours. Your site promises "free up to 48 hours, then 50%". A patient booking in person is told two different cancellation rules for one appointment.
- Rewrite: (1) On /book, directly above the pay button: "Pay $425 now (appointment 1 and intake). If Dr Sam decides from your intake that this service isn't right for you, [$X] is refunded and [$Y] is kept for the intake review." Sam should set X/Y with his MDO; a full non-refund is the highest-risk option. (2) On /book's in-person box: "Cannonvale Medical Centre's own cancellation terms apply to in-person appointments." (3) Keep the sentence "The fee pays for Dr Sam's time and assessment, not a particular result" beside the price, not three screens below.

#### A4. "There is no GST on these fees" is stated as fact while GST treatment is an open question

- Page: /pricing ("There is no GST on these fees."); llms.txt ("Prices (AUD, no GST)").
- Rule: ACL s48 (single-price rule: a displayed price must include all quantifiable charges, GST included); CLAUDE.md rule 9 (unverified fact). The project brief lists "GST treatment of fees" under open questions.
- Why it matters: a private, non-Medicare ADHD assessment by a GP is probably GST-free as a medical service, but "probably" isn't good enough for a price promise. If GST turns out to apply, every "$745" on the site becomes a misleading price.
- Rewrite: until the accountant confirms, "All prices are in Australian dollars and are the full amount you pay." After confirmation, keep the GST line.

#### A5. Nobody can tell which legal entity they are contracting with, or how to reach it

- Pages: every footer "© 2026 [TODO: operating entity name]"; /privacy "The business is [TODO: operating entity name]"; /terms "This website belongs to Hyperfocus Health ([TODO: operating entity name])"; /collection-notice; /contact shows "[TODO: phone number]" and "[TODO: public email]"; /complaints "Email [TODO: public email]".
- Rule: Privacy Act 1988, APP 1.4 (a privacy policy must identify the entity and how to contact it); ACL (identity of the supplier in a consumer contract); CLAUDE.md rule 9.
- Why it matters: this is a launch blocker, not a cosmetic TODO. The site asks for $425 and a full health history while the policy pages literally say the business name is to be decided. The brief says JIC Global is not a health company, so this is also a decision Sam still has to make (separate entity, ABN, indemnity in that entity's name).
- Rewrite: once decided, "© 2026 [Entity] Pty Ltd, ABN XX XXX XXX XXX, trading as Hyperfocus Health", with the same entity named in Privacy, Terms and Collection notice, plus the real email and phone.

#### A6. The Medicare rule is stated as an absolute, and it is wrong as written

- Pages: /pricing "Medicare only pays for a GP video or phone appointment if you've had a face-to-face visit with the same practice in the last 12 months." Same sentence in /faq and llms.txt. Home: "Medicare only pays for these if you've seen the practice in person in the past 12 months."
- Your own article (/resources/telehealth-or-in-person-medicare) says the rule is satisfied by a face-to-face visit **or MyMedicare registration**, and lists exemptions.
- Rule: ACL s18 (a statement of law that is inaccurate); CLAUDE.md rule 9.
- Why it matters: the conclusion (new patients won't get a rebate) is right, but the sentence is wrong, and a patient registered elsewhere through MyMedicare or an exempt patient could rely on it. The site contradicting its own article also undermines the "evidence-based" positioning.
- Rewrite: "Medicare usually only pays for a GP video or phone appointment if you've been seen face to face at that practice in the last 12 months, or you're registered there through MyMedicare. New patients of this service won't meet either, so there's no rebate."

#### A7. Structured data on every page gives a non-clinic street address as the medical business's address

- Pages: all 31 pages, `MedicalBusiness` JSON-LD: `"address": {"streetAddress": "13 Begley Street", "addressLocality": "Cannonvale" ...}` with `"location"` separately set to Cannonvale Medical Centre. /privacy says "Our business address is 13 Begley Street, Cannonvale QLD 4802 (not a clinic)".
- Rule: CLAUDE.md rule 8 (never imply a physical clinic anywhere except Cannonvale) in spirit; practical risk under AHPRA guidance on misleading location claims; personal safety/privacy.
- Why it matters: `address` on a `MedicalBusiness` is exactly what Google and Apple use to pin a business on a map. Search engines cannot read "(not a clinic)" from the privacy page. Patients can and do turn up at the address a knowledge panel shows. If 13 Begley Street is a home, this publishes it in machine-readable form on every page.
- Rewrite: remove `address` from `MedicalBusiness` (keep `location` = Cannonvale Medical Centre), or set `address` to Unit 7/230 Shute Harbour Road. Keep the business address only where the Privacy Act requires it, in text.

#### A8. Operational claims that nobody has verified are stated as fact

- /faq: "Your booking, intake and clinical records are kept in secure practice software, stored in Australia." The privacy policy on the same site says "[TODO: where clinical records and video calls are stored and processed]" for every vendor. The software hasn't been chosen.
- /contact: "Our phone is answered by an AI assistant, 24/7." No vendor chosen (receptionist shortlist still open).
- /book: "In the next 24 hours you get a confirmation, then a link to the online intake by text and email." No intake platform chosen.
- /how-it-works, /book, /booking-confirmed, checker result: "Your first appointment is at least 10 days away." A lead time, not in the service facts.
- Townsville page: "Serving members of the Australian Defence Force get their health care through Defence. Speak to your Defence health centre before booking any outside assessment." Plausible, unsourced.
- Rule: CLAUDE.md rule 9 (never invent wait times or facts; write [TODO]); ACL s18.
- Why it matters: "stored in Australia" is the sort of claim the OAIC tests literally. If the eventual vendor processes overseas, the FAQ is false from day one. The 10-day minimum is fine as a policy but must be Sam's decision, and it needs to actually be enforced in the booking platform.
- Rewrite: FAQ "Your booking, intake and clinical records are kept by the services named in our privacy policy. We're choosing them on the condition that your information stays in Australia; the policy will name each one." Contact: hold the 24/7 line until a vendor is live. Confirmation timing and the 10-day rule: confirm with Sam and the booking platform, then keep.

#### A9. The price and the plan are framed around an outcome, and "medicine" is framed as the default

- "$745 total to reach a diagnosis" (home, /pricing, /book, checker result, llms.txt). "It costs $745 in total to reach a diagnosis and a written plan" (home, /pricing, /book short versions).
- Home FAQ and /faq (and the FAQPage JSON-LD): "Dr Sam talks you through all your options, including strategies that don't involve medicine." /how-it-works step 5: "Treatment isn't started at this appointment." /about: "Sleep, mood, anxiety and heart health are all checked before any treatment starts."
- Rule: CLAUDE.md rule 1 (describe the consultation and a treatment plan; never present a prescription as the expected outcome) and rule 3 (no outcome promises); AHPRA guidelines on creating an unreasonable expectation of beneficial treatment.
- Why it matters: "to reach a diagnosis" reads as "pay $745, get a diagnosis". The FAQ answer says a diagnosis isn't guaranteed, and /pricing says "not a particular result", but the headline price framing says otherwise on four pages. "Strategies that don't involve medicine" tells the reader the main option is medicine; "treatment isn't started at this appointment" tells them it starts at the next one. None of this names a drug, so it is not a s133/TGA breach as such, but it is exactly the framing rule 1 exists to stop, and it is what a complainant would screenshot.
- Rewrite: "$745 total for the full assessment: online intake, two appointments and a written plan." FAQ: "You leave appointment 2 with a written plan. Dr Sam talks you through your options and you decide together. Your plan can cover sleep, routines, work and psychology support." How it works step 5: delete "Treatment isn't started at this appointment." About: "...are all checked as part of the assessment."

#### A10. Credentials and biography details that aren't in the brief: verify before launch

- Home, footer, /about: "AHPRA registration MED0002290862". The brief has "AHPRA number: [ADD]"; CLAUDE.md gives none. [Requires verification] against the Ahpra register by Sam before this appears on 31 pages.
- /about: "Law degree: Bachelor of Laws (LLB), King's College London"; "Started in Australian general practice on the Gold Coast" (2019); "Graduated in medicine (BMBS), University of Limerick, Ireland" (2011). The law degree and Limerick 2011 match the project's own profile notes, but CLAUDE.md does not list them and the exact degree title (LLB vs other) is Sam's to confirm. The Gold Coast detail is in neither.
- /about: "Adult ADHD training, BeyondGP Medical Education: [TODO: list only the units completed, with year, e.g. 'Unit 1: Adult ADHD...']" is visible to the public and names a course provider next to an instruction to list units. It implies training that may not be complete.
- /about: "Outside work: Irish-born, now living in the Whitsundays." CLAUDE.md says the "Outside work" line was left out for now.
- /resources/can-a-gp-diagnose-adhd-in-queensland: "Yes, many can." The cited Queensland Government page says specialist GPs *can* and that not all choose to; "many" is your inference, not theirs.
- Rule: CLAUDE.md rule 9; AHPRA guidelines on qualifications and titles (claims about training must be accurate and not misleading).
- Rewrite: confirm each item with Sam in writing; remove the BeyondGP line until units are completed; drop "many" ("Yes. In Queensland, specialist GPs can...").

Lesser notes, not in the top ten: "Every likely cost is on this page" (/pricing) while the baseline checks (BP, pulse, weight at a GP or pharmacy) have no cost row; "AHPRA" and "Ahpra" both used; the /faq answer "More support numbers are at the bottom of this page" points to a footer with the same two numbers; the articles cite 20+ external sources but only the HotDoc and qld.gov.au links could be verified from this machine (the sleep article's "review of 62 studies" claim was verified against PubMed 28064405 and is correct).

---

### REVIEW B: 25-year-old in Townsville, phone, 11pm

Reviewer: suspects ADHD, wants three answers (is this for me, what does it cost, how do I book) without reading. Path walked: home → 60-second check → pricing → how it works → book → Townsville page → "ADHD and sleep" article.

What worked: the check is genuinely quick (6 screens, big tap targets, progress bar, result in well under a minute), it tells me the price on the result screen, the "Short version" boxes are good, text is big and readable, nothing moved or autoplayed, no cookie banner, no pop-ups, the exclusion list is kind and ends with a next step. The pricing page is the best page on the site. Now the problems.

#### B1. I did everything right and hit a wall: there is no way to book

- Screen: /book, box headed "Choose a time and pay". It contains "Booking and payment happen on the secure page of our booking provider, [TODO: booking platform]" and a second orange box "[TODO: set booking.provider and booking.url in src/config/site.ts]". No button.
- The only thing I *can* tap on this page is "Book online with HotDoc" in the "In person at Cannonvale" box, which sits **above** the telehealth section. Cannonvale is a 3.5-hour drive from Townsville. At 11pm, half-reading, I'd tap it and book the wrong thing.
- /contact has "[TODO: phone number]" and "[TODO: public email]", so there's no fallback either.
- Change: the telehealth "book now" button must be the first and biggest thing on /book; move the Cannonvale box below it and label it "Only if you can get to Cannonvale". Until the provider is live, replace the developer text with one honest sentence ("Online booking opens on [date]. Leave your email and we'll tell you.") or don't link to /book at all.

#### B2. I can't see what the service is called

- Screen: the header on my phone shows a green icon, a "Check eligibility" button and a menu icon. No name. The wordmark is hidden below 400px wide; my phone (and every standard iPhone 12–15, SE, most Androids) is narrower than that. I only learn the name "Hyperfocus Health" from the browser tab or by scrolling to the footer.
- Change: show the stacked wordmark from 360px. If space is the issue, shorten the header button to "Check (60 sec)".

#### B3. "The full cost is shown upfront", but the first screen doesn't show it

- Screen: home hero. "The full cost is shown upfront." The price first appears in the "Short version" box about 2.3 screens down, and the "What it costs" box is 4.5 screens down. The home page is 9.7 phone screens long and introduces Dr Sam twice (photo card near the top, then a "Meet Dr Sam" card lower down saying the same things).
- Change: put "$745 total, no hidden fees" directly under the hero sentence. Delete the second "Meet Dr Sam" card. Aim for a home page under 6 screens.

#### B4. How it works never tells me what it costs or where the baseline checks happen

- Screen: /how-it-works. Eight steps, no dollar figure anywhere. Step 2 "Book and pay" doesn't say pay what. Step 4 "Baseline checks: Get your blood pressure, pulse and weight checked" doesn't say where (the Townsville page says "usually by your own GP or a pharmacy", but I'm not on that page) or whether it costs anything. Step 2's "What Dr Sam does" is "Your first appointment is at least 10 days away", which isn't something he does.
- Change: Step 2: "Pay $425 now; $320 later when you book appointment 2 ($745 total)." Step 4: "At your own GP or a pharmacy. Your intake tells you exactly what to ask for." Move the 10-day line to a plain info box.

#### B5. The checker's last screen isn't a question, and a dead button looks alive

- Screen: Question 6 of 6: "Anything else you're unsure about? That's fine. Dr Sam confirms whether this service suits you at your first appointment." One button: "See my result". I stopped and looked for a text box. It also contradicts the pricing page, which says he decides from the intake *before* the first appointment.
- Screens 3 and 4 (tick-any-that-apply): "Continue" is drawn in full dark teal exactly like a live button but is disabled until you tick something. Tap it with nothing ticked and nothing happens, no message.
- Result screen: "$745 total to reach a diagnosis", then two paragraphs later "The $425 isn't refunded... You won't pay the $320." Nothing in between explains that $745 = $425 + $320.
- Change: drop question 6 (make it "5 quick questions") or turn it into a real one. Grey out disabled Continue (opacity 0.4) and add "Tick an answer, or choose None of these". Add "Paid in 2 parts: $425 now, $320 when you book appointment 2" under the price on the result screen.

#### B6. The refund rule makes me nervous about paying $425 at all

- Screen: checker result and /pricing: "If your intake shows this service clearly isn't right for you, Dr Sam emails you to explain why and where to go instead. The $425 isn't refunded". The check just told me "This service looks like a good fit", and the next thing I read is how I could lose $425 by email. I don't know how likely that is or what would trigger it beyond the list I've already answered "none" to.
- Change: say what the check does and doesn't cover ("The 60-second check covers the main reasons this service might not suit you. The intake sometimes shows something else.") and, as Review A3 says, either refund most of it or show the exact split on /book before I pay.

#### B7. "Reviews" reads as customer reviews

- Screen: home "See all prices, including reviews →"; /pricing "Reviews while treatment is adjusted cost $89 each"; "Review appointment". On first read I expected star ratings. It took the pricing table to work out that a "review" is a 15-minute follow-up appointment.
- Change: "follow-up appointments" first time on each page, "(called reviews)" once, then "reviews".

#### B8. The FAQ's "Cost" section doesn't say the cost

- Screen: /faq, section "Cost", one question: "Why is there no Medicare rebate for telehealth?" There is no "How much does it cost?" and no dollar figure anywhere on the FAQ. The "Short version" box on the FAQ is labelled "4 min read", which rather defeats the point.
- Change: add "How much does it cost?" as the first FAQ: "$745 for the full assessment, paid in two parts, then $89 per 15-minute follow-up. Everything is on the prices page." Relabel the short-version chip to the short version's own reading time.

#### B9. "Book" doesn't exist in the menu or the footer

- Screen: the phone menu has four items (How it works, Pricing, About Dr Sam, FAQ). The footer has nine links. None is "Book". The only link to /book on the whole site is the button at the end of the checker. If I did the check this morning and come back at 11pm to book, I have to redo the six questions.
- Contact, Areas and Resources are footer-only, so from the menu I can't find a phone number either.
- Change: add "Book" (or "Check and book") to the menu and footer once booking exists; add "Contact" to the menu.

#### B10. The Townsville page and the article don't answer "what now"

- Screen: /adhd-assessment/townsville. No price anywhere above the final "See every cost" link. The "Short version" spends one of its three bullets on Defence members, which is relevant to Lavarack Barracks but not to me. The rest ("What matters most is a connection that holds for about an hour") is fine but generic.
- Screen: /resources/adhd-and-sleep. The first thing under the title is an orange dashed "[TODO: Dr Sam to read and approve]" box, which makes the whole site look unfinished. The breadcrumb repeats the full article title in grey above the real title, so I read it twice. The [1] [2] citation links are 15px tap targets. The article itself is good and the "see a GP if" bullet is useful.
- Also, nowhere on the site says *when* appointments are available (evenings? weekends?). At 11pm, working days, that's the next thing I'd want to know after the price. I can't invent the answer; Sam needs to decide and state it.
- Change: Townsville: "$745 total, by video" in the first bullet of the short version; move the Defence line into the body. Articles: hide the review line until reviewed; drop the breadcrumb's last crumb; render citations as a tappable "Sources" pill at the end of each paragraph. Add an "Appointment times" line to /book and /how-it-works once decided.

Smaller irritations: /pricing "Medicare in plain words" is four paragraphs (about 130 words) that don't apply to me unless I can get to Cannonvale; collapse it under "Only relevant if you can visit Cannonvale". The "Check eligibility" header button is still shown on the /check page itself. The word "intake" is used on the home page before it's explained.

---

### Broken, missing or placeholder

1. Visible `[TODO]` placeholders on public pages (counts are per page, from the built HTML): footer "© 2026 [TODO: operating entity name]" on all 31 pages; "[TODO: public email]" on /contact, /cancellations, /booking-confirmed, /privacy (x3), /terms, /complaints, /accessibility, /collection-notice; "[TODO: phone number]" on /contact and /accessibility; /book "[TODO: booking platform]" plus developer text "[TODO: set booking.provider and booking.url in src/config/site.ts]"; /about BeyondGP TODO; review-date TODO on all five articles; /privacy 28 TODOs incl. every vendor, storage location, retention period and overseas disclosure; /collection-notice 4; /terms "lawyer to confirm wording for any limit on liability"; /accessibility "check each platform's accessibility statement".
2. No booking button on /book (see B1). No page other than the checker result links to /book.
3. Header wordmark is wrapped in `<span class="hidden min-[400px]:block">`, so the brand name is absent on phones narrower than 400px (390px iPhone 12–15, 375px SE, 360px most Androids). Only the icon shows.
4. Checker "Continue" button is `disabled` but styled identically to the enabled state (opacity 1, same colour).
5. Placeholder domain `hyperfocushealth.example` is used in every canonical URL, every og:image / twitter:image URL, all JSON-LD `@id`/`url` values, the BreadcrumbList items and every link in /llms.txt. Share previews and canonical tags won't work until the real domain is set.
6. With JavaScript off: the checker renders question 1 but the Yes/No buttons do nothing and there is no fallback message; the phone menu can't open (footer links still work). /accessibility claims "pages show their full text even with JavaScript turned off", which is true of text but not of the checker.
7. Tap targets under 44px: footer "In an emergency call 000" link (231x30), header logo link (36x36), article citation links (15x17), inline body links (22px tall; WCAG allows inline exceptions, but these include "cancellations and refunds" and "privacy policy" on /book).
8. The in-person Cannonvale box promises "fees are the same" and the site's 48-hour cancellation rule, while Cannonvale Medical Centre's own HotDoc listing (verified live) states private billing and a $90 fee for cancellations within 2 hours. Two sets of terms for the same appointment.
9. robots.txt disallows everything and every page carries `noindex, nofollow` (expected pre-launch; just confirming it is in place).
10. Cosmetic: "AHPRA" (home, footer, about) vs "Ahpra" (/complaints); /faq "More support numbers are at the bottom of this page" (the footer has the same two numbers); article breadcrumbs repeat the full title above the h1.
11. External links: 33 distinct targets. Only HotDoc and qld.gov.au/health/conditions/all/adhd could be verified from this machine (outbound proxy blocks the rest); both work. The PubMed and PMC citations behind the sleep article were spot-checked and support the text.

Not broken: all 31 internal pages and all internal links return 200; no console errors, failed requests or third-party requests on any page; no horizontal overflow at 390px; body text 18px; every image has alt text and width/height; the headshot is served as AVIF/WebP with a JPEG fallback; the crisis strip appears on every page.
