import type { APIRoute } from 'astro';
import { getCollection, getEntry } from 'astro:content';
import { formatPrice, isTodo, site } from '../config/site';
import { plainText } from '../lib/tokens';
import { firstThreeMonths } from '../lib/pricing';

/**
 * /llms.txt: a plain-text summary for AI tools (llmstxt.org format), built
 * from the same values and words as the website so they never disagree.
 * Advertising rules apply: the browser tests scan it for banned words.
 */
export const GET: APIRoute = async ({ site: siteUrl }) => {
  const base = siteUrl ?? new URL(site.url);
  const abs = (p: string) => new URL(p, base).href;
  const how = (await getEntry('howItWorks', 'how-it-works'))!.data;
  const pricing = (await getEntry('pricing', 'pricing'))!.data;
  const locations = (await getCollection('locations')).sort((a, b) => a.data.order - b.data.order);
  const resources = (await getCollection('resources')).sort((a, b) => a.data.order - b.data.order);
  const { prices, doctor, clinic, contact } = site;
  const total = firstThreeMonths(prices.assessmentTotal, prices.review, prices.typicalReviewsFirst3Months);

  const lines = [
    `# ${site.name}`,
    '',
    `> ${site.tagline}. Run by one doctor, ${doctor.name}, ${doctor.title}, who has ADHD himself. Video or phone appointments for adults 18+ who live in Queensland and will be in Queensland for their appointments. Its one physical clinic is ${clinic.name}, ${clinic.street}, ${clinic.suburb} ${clinic.state} ${clinic.postcode}.`,
    '',
    'This is general information about the service, not medical advice. In an emergency call 000. Lifeline 13 11 14. 1300 MH CALL 1300 642 255.',
    '',
    '## Prices (AUD, no GST)',
    '',
    `- Assessment to diagnosis: ${formatPrice(prices.assessmentTotal)} total (online intake, appointment 1 of about ${site.appointments.assessment} min, appointment 2 of about ${site.appointments.diagnosis.min}-${site.appointments.diagnosis.max} min, written plan). Paid as ${formatPrice(prices.payAtBooking)} at booking and ${formatPrice(prices.payAppointment2)} when booking appointment 2.`,
    `- Review appointments: ${formatPrice(prices.review)} each, about ${site.appointments.reviewMinutes} min, every 2-4 weeks while treatment is adjusted, then every 3-6 months once stable.`,
    ...(total !== null ? [`- Typical first 3 months: ${formatPrice(total)} (assessment plus ${prices.typicalReviewsFirst3Months} reviews; an example, not a quote).`] : []),
    `- Blood tests or ECG, only if needed: ${plainText('{prices.testsNote}')}`,
    `- ${plainText(pricing.medicare.paragraphs[0])}`,
    `- ${site.booking.inPerson.feeNote.replace('Same fees as video or phone.', `In person at ${clinic.name}: same fees as video or phone.`)}`,
    `- ${site.booking.inPerson.telehealthRebateNote}`,
    `- Full details: ${abs('/pricing')}`,
    '',
    '## How it works',
    '',
    ...how.steps.map((s, i) => `${i + 1}. ${s.title} (${plainText(s.time)})`),
    `- Full details: ${abs('/how-it-works')}`,
    '',
    '## Who it is for',
    '',
    '- Adults 18 and over who live in Queensland and will be in Queensland for their appointments.',
    '- Uncomplicated adult ADHD. No referral needed.',
    `- Start with the 60-second check: ${abs(site.cta.href)}`,
    '',
    '## Not suitable for',
    '',
    ...site.notSuitable.map((x) => `- ${x}`),
    `- Other options for an assessment: ${abs('/other-options')}`,
    '',
    '## Key pages',
    '',
    `- [About ${doctor.name}](${abs('/about')}): qualifications and background`,
    `- [Prices](${abs('/pricing')})`,
    `- [How it works](${abs('/how-it-works')})`,
    `- [Common questions](${abs('/faq')})`,
    `- [Book](${abs('/book')})`,
    `- [Cancellations and refunds](${abs('/cancellations')})`,
    `- [Contact](${abs('/contact')})${isTodo(contact.email) ? '' : `: ${contact.email}`}`,
    '',
    '## Areas (video or phone appointments; no clinics in these cities)',
    '',
    ...locations.map((l) => `- [${l.data.city}](${abs(`/adhd-assessment/${l.id}`)})`),
    '',
    '## Resources',
    '',
    ...resources.map((r) => `- [${r.data.heading}](${abs(`/resources/${r.id}`)}): ${r.data.description}`),
    '',
  ];

  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
