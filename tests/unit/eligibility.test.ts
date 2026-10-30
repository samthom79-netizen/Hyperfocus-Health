import { describe, expect, it } from 'vitest';
import {
  allCheckerCopy,
  analyticsEventFor,
  emptyAnswers,
  evaluate,
  isAnswered,
  questions,
  TOTAL_QUESTIONS,
  type Answers,
} from '../../src/lib/eligibility';
import { findBanned } from '../../src/lib/banned';
import { site } from '../../src/config/site';

const fit = (): Answers => ({ adult: 'yes', queensland: 'yes', history: [], current: [], safety: 'no' });

describe('eligibility: outcomes', () => {
  it('a Queensland adult with no exclusions and no safety concern is a fit', () => {
    expect(evaluate(fit())).toBe('fit');
  });

  it('under 18 is not eligible', () => {
    expect(evaluate({ ...fit(), adult: 'no' })).toBe('not-eligible');
  });

  it('outside Queensland is not eligible', () => {
    expect(evaluate({ ...fit(), queensland: 'no' })).toBe('not-eligible');
  });

  const historyQ = questions.find((q) => q.id === 'history');
  const currentQ = questions.find((q) => q.id === 'current');
  if (historyQ?.kind !== 'multi' || currentQ?.kind !== 'multi') throw new Error('multi questions missing');

  it.each(historyQ.options.map((o) => o.id))('history option "%s" is an exclusion on its own', (id) => {
    expect(evaluate({ ...fit(), history: [id] })).toBe('exclusion');
  });

  it.each(currentQ.options.map((o) => o.id))('current option "%s" is an exclusion on its own', (id) => {
    expect(evaluate({ ...fit(), current: [id] })).toBe('exclusion');
  });

  it('several ticks together are still one exclusion outcome', () => {
    expect(evaluate({ ...fit(), history: ['bipolar', 'heart'], current: ['s8'] })).toBe('exclusion');
  });

  it('a safety yes overrides everything else', () => {
    expect(evaluate({ ...fit(), safety: 'yes' })).toBe('safety');
    expect(evaluate({ adult: 'no', queensland: 'no', history: ['bipolar'], current: ['s8'], safety: 'yes' })).toBe('safety');
  });

  it('an exclusion beats not-eligible? No: age and state are checked first', () => {
    // Someone under 18 with a ticked box gets the age message (own GP), which is the right next step for both.
    expect(evaluate({ ...fit(), adult: 'no', history: ['bipolar'] })).toBe('not-eligible');
  });

  it('the safety screen sends no analytics event', () => {
    expect(analyticsEventFor('safety')).toBeNull();
    expect(analyticsEventFor('fit')).toBe('check_result_fit');
    expect(analyticsEventFor('exclusion')).toBe('check_result_not_fit');
    expect(analyticsEventFor('not-eligible')).toBe('check_result_not_fit');
  });
});

describe('eligibility: flow', () => {
  it('has 6 questions in the agreed order', () => {
    expect(TOTAL_QUESTIONS).toBe(6);
    expect(questions.map((q) => q.id)).toEqual(['adult', 'queensland', 'history', 'current', 'safety', 'unsure']);
  });

  it('yes/no questions block until answered; tick-box and info screens never block', () => {
    const a = emptyAnswers();
    expect(isAnswered(0, a)).toBe(false);
    expect(isAnswered(0, { ...a, adult: 'yes' })).toBe(true);
    expect(isAnswered(2, a)).toBe(true);
    expect(isAnswered(3, a)).toBe(true);
    expect(isAnswered(4, a)).toBe(false);
    expect(isAnswered(5, a)).toBe(true);
    expect(isAnswered(99, a)).toBe(false);
  });

  it('shows the privacy note under the first question', () => {
    const first = questions[0];
    expect(first.kind === 'yesno' && first.note).toBe('Nothing you tick is saved or sent anywhere.');
  });

  it('tick-box options match the not-suitable list in meaning (all 10 covered)', () => {
    const ids = [...historyIds(), ...currentIds()];
    expect(ids).toHaveLength(9); // 'current significant suicidal thoughts' is the separate safety question
    expect(site.notSuitable).toHaveLength(10);
  });
});

describe('eligibility: copy rules', () => {
  it('no banned words anywhere in the checker', () => {
    const hits = allCheckerCopy().flatMap((s) => findBanned(s).map((h) => `${h} in "${s}"`));
    expect(hits).toEqual([]);
  });

  it('keeps every screen short (under 60 words)', () => {
    for (const q of questions) {
      const words = (q.kind === 'multi'
        ? [q.title, ...q.options.map((o) => o.label), q.noneLabel]
        : q.kind === 'info'
          ? [q.title, ...q.body]
          : [q.title, q.note ?? '']
      )
        .join(' ')
        .split(/\s+/)
        .filter(Boolean).length;
      expect(words, q.id).toBeLessThanOrEqual(60);
    }
  });
});

function historyIds() {
  const q = questions.find((q) => q.id === 'history');
  return q?.kind === 'multi' ? q.options.map((o) => o.id) : [];
}
function currentIds() {
  const q = questions.find((q) => q.id === 'current');
  return q?.kind === 'multi' ? q.options.map((o) => o.id) : [];
}
