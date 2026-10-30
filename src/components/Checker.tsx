/**
 * The 60-second eligibility checker (React island).
 *
 * - One question per screen, progress bar, back button.
 * - Answers live in component state only: no storage, no cookies, no requests.
 * - Focus moves to each new question's heading so keyboard and screen-reader
 *   users always know where they are.
 * - All questions, logic and outcome copy come from src/lib/eligibility.ts.
 */
import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  TOTAL_QUESTIONS,
  analyticsEventFor,
  emptyAnswers,
  evaluate,
  outcomes,
  questions,
  type Answers,
  type Outcome,
  type YesNo,
  MULTI_HINT,
} from '../lib/eligibility';
import { track } from '../lib/analytics';
import { formatPrice, isTodo, site } from '../config/site';

type Stage = { kind: 'question'; index: number } | { kind: 'outcome'; outcome: Outcome };

const BUTTON = 'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 py-2 font-display font-bold text-center no-underline transition-colors duration-150';
const PRIMARY = `${BUTTON} bg-primary text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40`;
const SECONDARY = `${BUTTON} bg-surface text-primary border-2 border-primary hover:bg-accent-soft`;
const CHOICE = 'flex min-h-14 w-full items-center gap-3 rounded-xl border-2 border-line bg-surface px-4 py-3 text-left font-display text-[1.05rem] font-bold text-primary hover:border-primary focus-visible:border-primary';

const Arrow = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);
const Phone = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6.5 3.5h3l1.8 4.6-2.3 1.4a11.5 11.5 0 0 0 5.5 5.5l1.4-2.3 4.6 1.8v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2z" />
  </svg>
);
const Tick = ({ on }: { on: boolean }) => (
  <span
    aria-hidden="true"
    className={`inline-flex size-7 shrink-0 items-center justify-center rounded-md border-2 ${on ? 'border-primary bg-primary text-white' : 'border-ink-muted bg-surface'}`}
  >
    {on && (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="m5 12.5 4.5 4.5L19 7.5" />
      </svg>
    )}
  </span>
);

/** Shows a site value, or a highlighted [TODO] box if it's still a placeholder. */
function Val({ value, price = false }: { value: string | number; price?: boolean }) {
  if (isTodo(value)) return <span className="todo">[{value}]</span>;
  return <>{price ? formatPrice(value) : value}</>;
}

export default function Checker() {
  const [answers, setAnswers] = useState<Answers>(emptyAnswers);
  const [stage, setStage] = useState<Stage>({ kind: 'question', index: 0 });
  const [started, setStarted] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  // Move keyboard focus to the new heading after every screen change
  // (but not on first load, where the page's own h1 should keep its place).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [stage]);

  const goTo = (index: number) => setStage({ kind: 'question', index });

  const finish = (final: Answers) => {
    const outcome = evaluate(final);
    const event = analyticsEventFor(outcome);
    if (event) track(event);
    setStage({ kind: 'outcome', outcome });
  };

  const advance = (final: Answers, fromIndex: number) => {
    if (!started) {
      setStarted(true);
      track('check_started');
    }
    // Safety: stop at once, whatever else was answered.
    if (final.safety === 'yes') return finish(final);
    if (fromIndex + 1 < TOTAL_QUESTIONS) goTo(fromIndex + 1);
    else finish(final);
  };

  const restart = () => {
    setAnswers(emptyAnswers());
    setStage({ kind: 'question', index: 0 });
  };

  if (stage.kind === 'outcome') {
    return <OutcomeScreen outcome={stage.outcome} answers={answers} headingRef={headingRef} onRestart={restart} />;
  }

  const index = stage.index;
  const q = questions[index]!;
  const number = index + 1;

  const answerYesNo = (id: 'adult' | 'queensland' | 'safety', value: YesNo) => {
    const next = { ...answers, [id]: value };
    setAnswers(next);
    advance(next, index);
  };

  const toggle = (id: 'history' | 'current', optionId: string) => {
    const list = answers[id];
    const nextList = list.includes(optionId) ? list.filter((x) => x !== optionId) : [...list, optionId];
    setAnswers({ ...answers, [id]: nextList });
  };

  const none = (id: 'history' | 'current') => {
    const next = { ...answers, [id]: [] };
    setAnswers(next);
    advance(next, index);
  };

  return (
    <div className="rounded-card border border-line bg-surface p-5 sm:p-8">
      <div className="mb-5">
        <p className="mb-2 flex items-center justify-between text-[0.9rem] font-bold text-ink-muted">
          <span>
            Question {number} of {TOTAL_QUESTIONS}
          </span>
          <span aria-hidden="true">60 sec</span>
        </p>
        <div
          role="progressbar"
          aria-label="Progress"
          aria-valuemin={1}
          aria-valuemax={TOTAL_QUESTIONS}
          aria-valuenow={number}
          aria-valuetext={`Question ${number} of ${TOTAL_QUESTIONS}`}
          className="h-2.5 w-full overflow-hidden rounded-full bg-accent-soft"
        >
          <div className="h-full rounded-full bg-accent transition-[width] duration-300" style={{ width: `${(number / TOTAL_QUESTIONS) * 100}%` }} />
        </div>
      </div>

      <h2 ref={headingRef} tabIndex={-1} className="text-[1.35rem] outline-none sm:text-[1.6rem]">
        {q.title}
      </h2>

      {q.kind === 'yesno' && (
        <>
          {q.note && <p className="mt-2 text-[0.95rem] text-ink-muted">{q.note}</p>}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button type="button" className={CHOICE} onClick={() => answerYesNo(q.id, 'yes')} data-answer="yes">
              Yes
            </button>
            <button type="button" className={CHOICE} onClick={() => answerYesNo(q.id, 'no')} data-answer="no">
              No
            </button>
          </div>
        </>
      )}

      {q.kind === 'multi' && (
        <>
          <p className="mt-2 text-[0.95rem] text-ink-muted">Tick any that apply.</p>
          <div className="mt-6 flex flex-col gap-3" role="group" aria-labelledby={`q-${q.id}`}>
            <span id={`q-${q.id}`} className="sr-only">
              {q.title}
            </span>
            {q.options.map((o) => {
              const on = answers[q.id].includes(o.id);
              return (
                <button
                  key={o.id}
                  type="button"
                  role="checkbox"
                  aria-checked={on}
                  className={`${CHOICE} ${on ? 'border-primary bg-accent-soft' : ''}`}
                  onClick={() => toggle(q.id, o.id)}
                  data-option={o.id}
                >
                  <Tick on={on} />
                  <span>{o.label}</span>
                </button>
              );
            })}
          </div>
          <p id={`${q.id}-hint`} className="mt-4 text-ink-muted">
            {answers[q.id].length === 0 ? MULTI_HINT : ''}
          </p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className={PRIMARY}
              onClick={() => advance(answers, index)}
              disabled={answers[q.id].length === 0}
              aria-describedby={answers[q.id].length === 0 ? `${q.id}-hint` : undefined}
              data-continue
            >
              Continue <Arrow />
            </button>
            <button type="button" className={SECONDARY} onClick={() => none(q.id)} data-none>
              {q.noneLabel}
            </button>
          </div>
        </>
      )}

      {q.kind === 'info' && (
        <>
          <div className="mt-3 space-y-2">
            {q.body.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <div className="mt-6">
            <button type="button" className={PRIMARY} onClick={() => advance(answers, index)} data-continue>
              {q.continueLabel} <Arrow />
            </button>
          </div>
        </>
      )}

      <div className="mt-6 border-t border-line pt-4">
        {index > 0 ? (
          <button type="button" className="inline-flex min-h-11 items-center gap-1.5 font-bold text-primary underline" onClick={() => goTo(index - 1)} data-back>
            <span aria-hidden="true">←</span> Back
          </button>
        ) : (
          <a href="/" className="inline-flex min-h-11 items-center gap-1.5 font-bold">
            <span aria-hidden="true">←</span> Back to the homepage
          </a>
        )}
      </div>
    </div>
  );
}

function OutcomeScreen({
  outcome,
  answers,
  headingRef,
  onRestart,
}: {
  outcome: Outcome;
  answers: Answers;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  onRestart: () => void;
}) {
  const Heading = ({ children }: { children: ReactNode }) => (
    <h2 ref={headingRef} tabIndex={-1} className="text-[1.5rem] outline-none sm:text-[1.8rem]">
      {children}
    </h2>
  );

  if (outcome === 'safety') {
    const c = outcomes.safety;
    const lines = answers.adult === 'no' ? [site.crisis.youth, ...site.crisis.lines] : site.crisis.lines;
    return (
      <div className="rounded-card border-2 border-primary bg-surface p-5 sm:p-8" data-outcome="safety">
        <Heading>{c.heading}</Heading>
        <p className="mt-2">
          <a href={site.crisis.emergency.tel} className={`${PRIMARY} mt-2`} data-call="000">
            <Phone /> Call 000
          </a>
        </p>
        <div className="mt-6 space-y-2">
          {c.body.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <ul className="mt-5 space-y-3">
          {lines.map((line) => (
            <li key={line.number}>
              <a href={line.tel} className={`${SECONDARY} w-full justify-start sm:w-auto`}>
                <Phone />
                <span>
                  {line.label}: <span className="whitespace-nowrap">{line.number}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-6">{c.gp}</p>
        <p className="mt-3 text-ink-muted">{c.note}</p>
        <p className="mt-6">
          <a href="/" className="inline-flex min-h-11 items-center font-bold">
            {c.restart}
          </a>
        </p>
      </div>
    );
  }

  if (outcome === 'fit') {
    const c = outcomes.fit;
    return (
      <div className="rounded-card border-2 border-primary bg-surface p-5 sm:p-8" data-outcome="fit">
        <Heading>{c.heading}</Heading>
        <p className="mt-4 flex flex-wrap items-baseline gap-x-2">
          <span className="font-display text-[1.8rem] leading-none font-extrabold text-primary">
            <Val value={site.prices.assessmentTotal} price />
          </span>
          <span className="text-ink-muted">total to reach a diagnosis</span>
        </p>
        <p className="mt-1 text-ink-muted" data-split>
          Paid in 2 parts: <Val value={site.prices.payAtBooking} price /> when you book, then <Val value={site.prices.payAppointment2} price /> when you book
          appointment 2.
        </p>
        <h3 className="mt-6 text-[1.15rem] font-bold">{c.nextHeading}</h3>
        <ol className="mt-3 space-y-3">
          {c.next.map((line, i) => (
            <li key={line} className="flex gap-3">
              <span aria-hidden="true" className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-accent font-display text-[0.95rem] font-extrabold text-primary">
                {i + 1}
              </span>
              <span>{line.replace('{minLeadDays}', String(site.booking.minLeadDays))}</span>
            </li>
          ))}
        </ol>
        <h3 className="mt-6 text-[1.15rem] font-bold">{c.refundHeading}</h3>
        <p className="mt-2">{c.refundIntro}</p>
        <p className="mt-2">
          <Val value={site.policies.refundIfUnsuitable} />
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a href="/book" className={PRIMARY} data-cta="book" onClick={() => track('cta_book')}>
            {c.cta} <Arrow />
          </a>
          <button type="button" className="inline-flex min-h-11 items-center font-bold text-primary underline" onClick={onRestart} data-restart>
            {c.restart}
          </button>
        </div>
      </div>
    );
  }

  if (outcome === 'not-eligible') {
    const c = outcomes['not-eligible'];
    return (
      <div className="rounded-card border border-line bg-surface p-5 sm:p-8" data-outcome="not-eligible">
        <Heading>{c.heading}</Heading>
        <div className="mt-4 space-y-2">
          {answers.adult === 'no' && <p>{c.adult}</p>}
          {answers.queensland === 'no' && <p>{c.queensland}</p>}
          <p>{c.body}</p>
        </div>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a href="/other-options" className={SECONDARY}>
            {c.link} <Arrow />
          </a>
          <button type="button" className="inline-flex min-h-11 items-center font-bold text-primary underline" onClick={onRestart} data-restart>
            {c.restart}
          </button>
        </div>
      </div>
    );
  }

  const c = outcomes.exclusion;
  return (
    <div className="rounded-card border border-line bg-surface p-5 sm:p-8" data-outcome="exclusion">
      <Heading>{c.heading}</Heading>
      <div className="mt-4 space-y-2">
        {c.body.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
        <a href="/other-options" className={SECONDARY}>
          {c.link} <Arrow />
        </a>
        <button type="button" className="inline-flex min-h-11 items-center font-bold text-primary underline" onClick={onRestart} data-restart>
          {c.restart}
        </button>
      </div>
    </div>
  );
}
