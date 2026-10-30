/**
 * Builds docs/receptionist/knowledge-base.md for the AI phone receptionist
 * from the website's own words (src/content/*.md) and values (src/config/site.ts),
 * so the website and the phone agent can never disagree.
 *
 * Not used by any page. Run `npm run kb` to rewrite the file; the unit test
 * (tests/unit/knowledge-base.test.ts) fails if the saved file is out of date.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';
import { formatPrice, isTodo, site } from '../config/site';
import { firstThreeMonths } from './pricing';

export const NOT_DECIDED = '[NOT DECIDED YET]';
export const NOT_SUITABLE_HEADING = '## Who the service is not suitable for';

const CONTENT = join(process.cwd(), 'src', 'content');

type Data = Record<string, any>;

function read(file: string): { data: Data; body: string } {
  const raw = readFileSync(join(CONTENT, file), 'utf8');
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) throw new Error(`${file} has no frontmatter`);
  return { data: parse(m[1]) as Data, body: m[2] };
}

function lookup(path: string): unknown {
  return path.split('.').reduce<unknown>((obj, key) => {
    if (obj && typeof obj === 'object' && key in obj) return (obj as Record<string, unknown>)[key];
    throw new Error(`Unknown token {${path}} in page copy.`);
  }, site);
}

/** Fills {tokens} and reduces [label](url) links to their label. Records undecided values. */
function makeFill(undecided: Set<string>) {
  return (text: string): string =>
    text
      .replace(/\{([a-zA-Z][\w.]*)\}/g, (_m, path: string) => {
        const value = lookup(path);
        if (typeof value !== 'string' && typeof value !== 'number') throw new Error(`Token {${path}} is not a single value.`);
        if (isTodo(value)) {
          undecided.add(path);
          return NOT_DECIDED;
        }
        return path.startsWith('prices.') ? formatPrice(value) : String(value);
      })
      .replace(/\[([^\]]+)\]\([^)\s]+\)/g, '$1 (on the website)')
      .replace('at the bottom of this page', 'on the website')
      .replace(/\*\*([^*]+)\*\*/g, '$1');
}

/** A site.ts value for the knowledge base: the value, or NOT_DECIDED (recorded). */
function makeVal(undecided: Set<string>) {
  return (path: string): string => {
    const value = lookup(path);
    if (typeof value !== 'string' && typeof value !== 'number') throw new Error(`${path} is not a single value.`);
    if (isTodo(value)) {
      undecided.add(path);
      return NOT_DECIDED;
    }
    return path.startsWith('prices.') ? formatPrice(value) : String(value);
  };
}

/** Ends a fragment with exactly one full stop. */
const sentence = (s: string) => s.trim().replace(/[.\s]+$/, '') + '.';

export function buildKnowledgeBase(generatedOn: string): string {
  const undecided = new Set<string>();
  const fill = makeFill(undecided);
  const val = makeVal(undecided);

  const pricing = read('pricing.md').data;
  const how = read('how-it-works.md').data;
  const faq = read('faq.md').data;
  const about = read('about.md').data;
  const cancellations = read('cancellations.md');

  const { clinic, doctor, booking, contact, crisis } = site;
  const out: string[] = [];
  const add = (...lines: string[]) => out.push(...lines);

  // The basics
  add(
    '## The basics',
    '',
    `- Name: ${site.name}. ${site.tagline}.`,
    '- Who it is for: adults 18 and over who live in Queensland and will be in Queensland for their appointments. Uncomplicated adult ADHD only.',
    `- Doctor: ${doctor.name}, ${doctor.title}. ${doctor.focus}. He has ADHD himself. One doctor from start to finish.`,
    `- Appointments: by video or phone (the patient chooses) anywhere in Queensland, or in person at ${clinic.name}, ${clinic.street}, ${clinic.suburb} ${clinic.state} ${clinic.postcode}. There is no other clinic.`,
    `- First step for anyone interested: the 60-second check on the website, called "${site.cta.label}".`,
    `- Online booking link (text this to callers who ask how to book): ${val('booking.url')}`,
    `- In-person bookings: through ${clinic.name}, phone ${clinic.phone}, or HotDoc. The caller must ${booking.inPerson.sayWhenBooking}.`,
    `- ${booking.inPerson.feeNote}`,
    `- ${booking.inPerson.telehealthRebateNote}`,
    `- Our phone number: ${val('contact.phone')}. Our email: ${val('contact.email')}.`,
    `- A person replies to messages within ${contact.humanReplyWithin}. Complaints get a reply within ${contact.complaintsReplyWithin}.`,
    `- The first appointment is at least ${booking.minLeadDays} days after booking, to allow time for the intake and baseline checks. There are no other wait times to give.`,
    '',
  );

  // Not suitable for
  add(
    NOT_SUITABLE_HEADING,
    '',
    'Read this only as general information if a caller asks who the service is not for. Never apply it to the caller or say whether they are eligible: point them to the 60-second check.',
    '',
    ...site.notSuitable.map((x) => `- ${x}`),
    '',
  );

  // Prices
  add('## Prices', '');
  for (const b of pricing.shortVersion as string[]) add(`- ${fill(b)}`);
  add('', `### ${pricing.tableHeading}`, '');
  if (pricing.tableNote) add(fill(pricing.tableNote), '');
  for (const r of pricing.rows as Data[]) {
    add(`- ${r.stage}: ${sentence(fill(r.whatYouGet))} Cost: ${sentence(fill(r.cost))}${r.note ? ` ${sentence(fill(r.note))}` : ''}`);
  }
  const n = site.prices.typicalReviewsFirst3Months;
  const total = firstThreeMonths(site.prices.assessmentTotal, site.prices.review, n);
  add(
    '',
    `### ${pricing.example.heading}`,
    '',
    `${fill(pricing.example.intro)} Assessment to diagnosis ${val('prices.assessmentTotal')}, plus ${n} reviews at ${val('prices.review')} each (the number of reviews is an assumption, not a quote). Typical total: ${total === null ? NOT_DECIDED : formatPrice(total)}.`,
    fill(pricing.example.notIncluded),
    '',
    `### ${pricing.medicare.heading}`,
    '',
    ...(pricing.medicare.paragraphs as string[]).map((p) => `- ${fill(p)}`),
    '',
    `### ${pricing.payment.heading}`,
    '',
    ...(pricing.payment.points as string[]).map((p) => `- ${fill(p)}`),
    '',
  );

  // How it works
  add('## How it works', '');
  if (how.stepsNote) add(fill(how.stepsNote), '');
  (how.steps as Data[]).forEach((s, i) => {
    add(`${i + 1}. ${s.title} (${fill(s.time)}). What the patient does: ${fill(s.you)} What Dr Sam does: ${fill(s.doctor)}`);
  });
  add('', `### ${how.needHeading}`, '', ...(how.need as string[]).map((x) => `- ${fill(x)}`), '');

  // Cancellations
  add('## Cancellations and refunds', '');
  const body = fill(cancellations.body)
    .replace(/^## /gm, '### ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  add(body, '');

  // About
  add('## About Dr Sam', '', doctor.bioShort, '');
  for (const section of about.sections as Data[]) {
    add(`### ${section.heading}${section.heading === 'Qualifications' ? '' : ' (in his words)'}`, '');
    add(...(section.points as string[]).map((p) => `- ${fill(p)}`), '');
  }

  // FAQ
  add('## Common questions', '');
  for (const g of faq.groups as Data[]) {
    for (const item of g.items as Data[]) add(`Q: ${item.question}`, `A: ${fill(item.answer)}`, '');
  }

  // Crisis
  add(
    '## Crisis numbers',
    '',
    `- ${crisis.emergency.label}.`,
    ...crisis.lines.map((l) => `- ${l.label}: ${l.number}`),
    `- ${crisis.youth.label}: ${crisis.youth.number}`,
    '',
  );

  const header = [
    '# Hyperfocus Health: receptionist knowledge base',
    '',
    `Generated: ${generatedOn}`,
    '',
    'Built automatically from the website (src/content/*.md and src/config/site.ts) by `npm run kb`.',
    'Rule: regenerate after any site copy change. Never edit this file by hand: the tests fail if it and the website disagree.',
    '',
    `Anything marked ${NOT_DECIDED} is unknown. The agent says: "I don't know that one, so I'll take a message for the team."`,
    '',
  ];
  if (undecided.size) {
    header.push('## Not decided yet (Sam: fix in src/config/site.ts before go-live)', '', ...[...undecided].sort().map((k) => `- ${k}`), '');
  }

  return [...header, ...out].join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
}
