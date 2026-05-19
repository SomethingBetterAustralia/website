import { useState } from 'react';
import type {
  SignupIntent,
  SignupRequest,
  SignupResponse,
} from '@backend/types/signup';

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

export function SignupForm() {
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
      <section className="sb-form-wrap sb-form-wrap--success">
        <p>Thank you for expressing your interest.</p>
        <p>
          An email has now been sent to you with what’s coming next - please check your junk folder.
        </p>
      </section>
    );
  }

  const submitting = submission.kind === 'submitting';

  return (
    <section className="sb-form-wrap">
      <form className="sb-form" onSubmit={handleSubmit} noValidate={false}>
        <fieldset className="sb-form__group">
          <legend>Name</legend>
          <div className="sb-form__row">
            <label className="sb-form__field">
              <span>First Name <span className="sb-form__req">(required)</span></span>
              <input
                type="text"
                autoComplete="given-name"
                required
                value={fields.firstName}
                onChange={(e) => setField('firstName', e.target.value)}
              />
            </label>
            <label className="sb-form__field">
              <span>Last Name <span className="sb-form__req">(required)</span></span>
              <input
                type="text"
                autoComplete="family-name"
                required
                value={fields.lastName}
                onChange={(e) => setField('lastName', e.target.value)}
              />
            </label>
          </div>
        </fieldset>

        <div className="sb-form__field-group">
          <label className="sb-form__field">
            <span>Email <span className="sb-form__req">(required)</span></span>
            <input
              type="email"
              autoComplete="email"
              required
              value={fields.email}
              onChange={(e) => setField('email', e.target.value)}
            />
          </label>
          <label className="sb-form__option">
            <input
              type="checkbox"
              checked={fields.newsletterOptIn}
              onChange={(e) => setField('newsletterOptIn', e.target.checked)}
            />
            <span>Sign up for news and updates</span>
          </label>
        </div>

        <label className="sb-form__field">
          <span>Postcode <span className="sb-form__req">(required)</span></span>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            required
            value={fields.postcode}
            onChange={(e) => setField('postcode', e.target.value)}
          />
        </label>

        <fieldset className="sb-form__group">
          <legend>
            By signing up, you'll hear what we're up to, have an opportunity to shape the movement
            and be invited to our upcoming events. Would you like to:
          </legend>
          {INTENT_OPTIONS.map((opt) => (
            <label key={opt.value} className="sb-form__option">
              <input
                type="checkbox"
                checked={fields.intents.has(opt.value)}
                onChange={(e) => toggleIntent(opt.value, e.target.checked)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </fieldset>

        <label className="sb-form__field">
          <span>What do you want to see done differently in Australia?</span>
          <input
            type="text"
            value={fields.feedback}
            onChange={(e) => setField('feedback', e.target.value)}
          />
        </label>

        <button type="submit" className="sb-form__submit" disabled={submitting}>
          {submitting ? 'Submitting…' : 'Submit'}
        </button>

        {submission.kind === 'error' && (
          <p className="sb-form__error" role="alert">
            {submission.message}
          </p>
        )}
      </form>
    </section>
  );
}
