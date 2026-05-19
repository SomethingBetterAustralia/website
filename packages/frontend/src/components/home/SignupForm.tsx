import { motion, useReducedMotion } from 'motion/react';
import { useState } from 'react';
import type {
  SignupIntent,
  SignupRequest,
  SignupResponse,
} from '@backend/types/signup';
import { revealUp, viewportOnce } from '@/lib/motion';

interface FormFields {
  firstName: string;
  lastName: string;
  email: string;
  newsletterOptIn: boolean;
  postcode: string;
  intents: Set<SignupIntent>;
  feedback: string;
}

type SubmissionState =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success' }
  | { kind: 'error'; message: string };

const INTENT_OPTIONS: ReadonlyArray<{ value: SignupIntent; label: string }> = [
  { value: 'join_as_member', label: 'Potentially join a new Party as a member' },
  { value: 'come_to_events', label: 'Come along to some events and just explore for now' },
  { value: 'work_for_party', label: 'Potentially work for a new Party' },
];

const INITIAL_FIELDS: FormFields = {
  firstName: '',
  lastName: '',
  email: '',
  newsletterOptIn: false,
  postcode: '',
  intents: new Set<SignupIntent>(),
  feedback: '',
};

function isSignupResponse(value: unknown): value is SignupResponse {
  if (value === null || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return typeof v.ok === 'boolean';
}

const cardClasses =
  'rounded-3xl bg-sb-white p-6 shadow-[0_12px_30px_rgba(8,31,52,0.08)] ring-1 ring-sb-cream-warm min-[880px]:p-8';
const inputClasses =
  'w-full rounded-sm border-0 bg-sb-cream/40 px-[0.9rem] py-[0.7rem] text-base text-sb-text transition-shadow duration-100 focus:shadow-[0_0_0_2px_var(--color-sb-accent)] focus:outline-none';
const fieldClasses = 'flex min-w-0 flex-1 flex-col gap-[0.3rem]';
const fieldLabelClasses = 'text-[0.88rem] font-medium text-sb-text';
const fieldReqClasses = 'ml-1 text-[0.78rem] font-normal italic text-sb-text-muted';
const optionLabelClasses =
  'flex cursor-pointer items-start gap-[0.6rem] py-[0.15rem] text-[0.95rem] text-sb-text';
const optionInputClasses = 'mt-1 h-4 w-4 flex-shrink-0 cursor-pointer accent-sb-navy';
const legendClasses =
  'm-0 mb-[0.35rem] p-0 font-sans text-base font-medium leading-[1.35] tracking-[0.01em] text-sb-text';
const fieldsetClasses = 'm-0 flex flex-col gap-[0.6rem] border-0 p-0';

export function SignupForm() {
  const reduce = useReducedMotion();
  const [fields, setFields] = useState<FormFields>(INITIAL_FIELDS);
  const [submission, setSubmission] = useState<SubmissionState>({ kind: 'idle' });

  function setField<K extends keyof FormFields>(key: K, value: FormFields[K]) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  function toggleIntent(intent: SignupIntent, checked: boolean) {
    setFields((prev) => {
      const next = new Set(prev.intents);
      if (checked) next.add(intent);
      else next.delete(intent);
      return { ...prev, intents: next };
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmission({ kind: 'submitting' });

    const payload: SignupRequest = {
      firstName: fields.firstName.trim(),
      lastName: fields.lastName.trim(),
      email: fields.email.trim(),
      postcode: fields.postcode.trim(),
      intents: Array.from(fields.intents),
      ...(fields.feedback.trim() !== '' ? { feedback: fields.feedback.trim() } : {}),
    };

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const raw: unknown = await res.json();
      if (!isSignupResponse(raw)) {
        setSubmission({ kind: 'error', message: 'Unexpected response from server.' });
        return;
      }
      if (raw.ok) {
        setSubmission({ kind: 'success' });
      } else {
        setSubmission({ kind: 'error', message: raw.error });
      }
    } catch {
      setSubmission({
        kind: 'error',
        message: 'Unable to submit right now. Please try again.',
      });
    }
  }

  if (submission.kind === 'success') {
    return (
      <section className="relative">
        <motion.div
          initial={reduce ? false : 'hidden'}
          whileInView="visible"
          viewport={viewportOnce}
          variants={revealUp}
          className={cardClasses}
        >
          <p className="mb-3 font-display text-2xl font-medium italic tracking-[-0.02em] text-sb-accent-hot">
            Thank you for expressing your interest.
          </p>
          <p className="m-0 mb-3 text-[1.05rem] italic text-sb-text">
            An email has now been sent to you with what’s coming next - please check your junk
            folder.
          </p>
        </motion.div>
      </section>
    );
  }

  const submitting = submission.kind === 'submitting';

  return (
    <section className="relative">
      <motion.div
        initial={reduce ? false : 'hidden'}
        whileInView="visible"
        viewport={viewportOnce}
        variants={revealUp}
        className={cardClasses}
      >
        <form className="flex flex-col gap-[1.15rem]" onSubmit={handleSubmit} noValidate={false}>
          <fieldset className={fieldsetClasses}>
            <legend className={legendClasses}>Name</legend>
            <div className="grid grid-cols-1 gap-3 min-[880px]:grid-cols-2">
              <label className={fieldClasses}>
                <span className={fieldLabelClasses}>
                  First Name <span className={fieldReqClasses}>(required)</span>
                </span>
                <input
                  type="text"
                  autoComplete="given-name"
                  required
                  className={inputClasses}
                  value={fields.firstName}
                  onChange={(e) => setField('firstName', e.target.value)}
                />
              </label>
              <label className={fieldClasses}>
                <span className={fieldLabelClasses}>
                  Last Name <span className={fieldReqClasses}>(required)</span>
                </span>
                <input
                  type="text"
                  autoComplete="family-name"
                  required
                  className={inputClasses}
                  value={fields.lastName}
                  onChange={(e) => setField('lastName', e.target.value)}
                />
              </label>
            </div>
          </fieldset>

          <div className="flex flex-col gap-[0.6rem]">
            <label className={fieldClasses}>
              <span className={fieldLabelClasses}>
                Email <span className={fieldReqClasses}>(required)</span>
              </span>
              <input
                type="email"
                autoComplete="email"
                required
                className={inputClasses}
                value={fields.email}
                onChange={(e) => setField('email', e.target.value)}
              />
            </label>
            <label className={optionLabelClasses}>
              <input
                type="checkbox"
                className={optionInputClasses}
                checked={fields.newsletterOptIn}
                onChange={(e) => setField('newsletterOptIn', e.target.checked)}
              />
              <span>Sign up for news and updates</span>
            </label>
          </div>

          <label className={fieldClasses}>
            <span className={fieldLabelClasses}>
              Postcode <span className={fieldReqClasses}>(required)</span>
            </span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              required
              className={inputClasses}
              value={fields.postcode}
              onChange={(e) => setField('postcode', e.target.value)}
            />
          </label>

          <fieldset className={fieldsetClasses}>
            <legend className={legendClasses}>
              By signing up, you'll hear what we're up to, have an opportunity to shape the
              movement and be invited to our upcoming events. Would you like to:
            </legend>
            {INTENT_OPTIONS.map((opt) => (
              <label key={opt.value} className={optionLabelClasses}>
                <input
                  type="checkbox"
                  className={optionInputClasses}
                  checked={fields.intents.has(opt.value)}
                  onChange={(e) => toggleIntent(opt.value, e.target.checked)}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </fieldset>

          <label className={fieldClasses}>
            <span className={fieldLabelClasses}>
              What do you want to see done differently in Australia?
            </span>
            <input
              type="text"
              className={inputClasses}
              value={fields.feedback}
              onChange={(e) => setField('feedback', e.target.value)}
            />
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="cursor-pointer self-start rounded-full border-0 bg-sb-navy px-8 py-[1.2em] font-display text-base font-medium leading-none tracking-[0.04em] text-sb-white capitalize transition-[background-color,transform] duration-100 hover:enabled:-translate-y-px hover:enabled:bg-sb-navy-hot active:enabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Submitting…' : 'Submit'}
          </button>

          {submission.kind === 'error' && (
            <p
              role="alert"
              className="m-0 rounded-r-sm border-l-[3px] border-sb-error bg-sb-error/10 px-[0.65rem] py-[0.4rem] text-[0.92rem] text-sb-error"
            >
              {submission.message}
            </p>
          )}
        </form>
      </motion.div>
    </section>
  );
}
