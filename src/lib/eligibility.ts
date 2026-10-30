/**
 * The 60-second eligibility checker: questions, outcome copy and the decision
 * logic, all in one place with no browser code. The React island
 * (src/components/Checker.tsx) only displays what this module returns.
 *
 * Design decisions:
 * - Every question is asked, whatever the earlier answers, so that someone
 *   under 18 or outside Queensland still reaches the safety question and,
 *   if needed, the support screen.
 * - The safety answer overrides every other outcome.
 * - Nothing here is stored or sent anywhere. Answers live in React state only.
 */

export type YesNo = 'yes' | 'no';

export interface Answers {
  adult?: YesNo;
  queensland?: YesNo;
  /** Option ids ticked on the history question (empty = 'None of these'). */
  history: string[];
  /** Option ids ticked on the 'right now' question (empty = 'None of these'). */
  current: string[];
  safety?: YesNo;
}

export const emptyAnswers = (): Answers => ({ history: [], current: [] });

export type Outcome = 'fit' | 'not-eligible' | 'exclusion' | 'safety';

export interface Option {
  id: string;
  label: string;
}

export type Question =
  | { id: 'adult' | 'queensland' | 'safety'; kind: 'yesno'; title: string; note?: string }
  | { id: 'history' | 'current'; kind: 'multi'; title: string; options: Option[]; noneLabel: string }
  | { id: 'unsure'; kind: 'info'; title: string; body: string[]; continueLabel: string };

export const questions: readonly Question[] = [
  {
    id: 'adult',
    kind: 'yesno',
    title: 'Are you 18 or over?',
    note: 'Nothing you tick is saved or sent anywhere.',
  },
  {
    id: 'queensland',
    kind: 'yesno',
    title: 'Do you live in Queensland, and will you be in Queensland for your appointments?',
  },
  {
    id: 'history',
    kind: 'multi',
    title: 'Have you ever been diagnosed with or treated for any of these?',
    options: [
      { id: 'bipolar', label: 'Bipolar disorder' },
      { id: 'psychosis', label: 'Psychosis or schizophrenia' },
      { id: 'eating', label: 'An eating disorder' },
      { id: 'dependence', label: 'Drug or alcohol dependence, now or in the past' },
      { id: 'heart', label: "Heart problems, high blood pressure that isn't controlled, or fainting without a clear cause" },
    ],
    noneLabel: 'None of these',
  },
  {
    id: 'current',
    kind: 'multi',
    title: 'Right now, does any of this apply?',
    options: [
      { id: 'pregnancy', label: 'Pregnant or breastfeeding' },
      { id: 's8', label: 'Taking a prescribed controlled (Schedule 8) medicine for pain, sleep or anxiety' },
      { id: 'untreated', label: "Severe depression or anxiety that isn't being treated" },
      { id: 'support', label: 'Autism or intellectual disability needing significant daily support' },
    ],
    noneLabel: 'None of these',
  },
  {
    id: 'safety',
    kind: 'yesno',
    title: 'In the past month, have you had thoughts of ending your life?',
  },
  {
    id: 'unsure',
    kind: 'info',
    title: "Anything else you're unsure about?",
    body: ["That's fine. Dr Sam confirms whether this service suits you at your first appointment."],
    continueLabel: 'See my result',
  },
] as const;

export const TOTAL_QUESTIONS = questions.length;

/** Is the answer to question `index` complete enough to move on? */
export function isAnswered(index: number, a: Answers): boolean {
  const q = questions[index];
  if (!q) return false;
  switch (q.kind) {
    case 'yesno':
      return a[q.id] !== undefined;
    case 'multi':
    case 'info':
      return true;
  }
}

/** The outcome, once every question has been seen. */
export function evaluate(a: Answers): Outcome {
  if (a.safety === 'yes') return 'safety';
  if (a.adult === 'no' || a.queensland === 'no') return 'not-eligible';
  if (a.history.length > 0 || a.current.length > 0) return 'exclusion';
  return 'fit';
}

/** Which analytics event, if any, an outcome may send. The safety screen sends none. */
export function analyticsEventFor(outcome: Outcome): 'check_result_fit' | 'check_result_not_fit' | null {
  if (outcome === 'safety') return null;
  return outcome === 'fit' ? 'check_result_fit' : 'check_result_not_fit';
}

/** Copy for each outcome screen. Kept here so the banned-word test covers it. */
export const outcomes = {
  fit: {
    heading: 'This service looks like a good fit.',
    nextHeading: 'What happens next',
    next: [
      'Book your first appointment and pay.',
      'You get a link by text and email to do the intake on your phone. About 30 minutes, in short blocks if you like.',
      'Your first appointment is at least {minLeadDays} days after booking, so there is time for the intake and your baseline checks.',
    ],
    refundHeading: 'If Dr Sam finds this service is not right for you after reading your intake',
    cta: 'Book an appointment',
    restart: 'Start again',
  },
  'not-eligible': {
    heading: "This service isn't available to you yet.",
    adult: 'This service is for adults, so you need to be 18 or over.',
    queensland: 'This service is only for people who live in Queensland and will be in Queensland for their appointments.',
    body: 'Your own GP is the right place to start. They can assess you, or refer you to someone who can.',
    link: 'How to ask your GP for a referral',
    restart: 'Start again',
  },
  exclusion: {
    heading: "This service isn't the safest place to start for you.",
    body: [
      'Some health histories need a doctor who can see the whole picture, often in person. That means your own GP or a psychiatrist.',
      "This isn't a judgement about you. It's about making sure you get care that is safe and complete.",
    ],
    link: 'Your other options, and how to ask for a referral',
    restart: 'Start again',
  },
  safety: {
    heading: "If you're in danger now, call 000.",
    body: [
      'Thank you for answering honestly. That took courage.',
      'You can talk to someone right now, any time of day or night. These calls are free.',
    ],
    gp: 'It would also help to talk to your GP this week. You can say exactly what you told us here.',
    note: 'The ADHD check stops here. Looking after you comes first.',
    restart: 'Back to the homepage',
  },
} as const;

/** Every piece of text the checker can show, for the banned-word test. */
export function allCheckerCopy(): string[] {
  const out: string[] = [];
  for (const q of questions) {
    out.push(q.title);
    if (q.kind === 'yesno' && q.note) out.push(q.note);
    if (q.kind === 'multi') out.push(...q.options.map((o) => o.label), q.noneLabel);
    if (q.kind === 'info') out.push(...q.body, q.continueLabel);
  }
  const walk = (v: unknown) => {
    if (typeof v === 'string') out.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === 'object') Object.values(v).forEach(walk);
  };
  walk(outcomes);
  return out;
}
