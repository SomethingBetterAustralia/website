import { useReducedMotion } from 'motion/react';
import * as React from 'react';
import type { SurveyDefinition } from '@backend/types/survey';
import {
  SurveyErrorCard,
  SurveyLoadingCard,
  SurveySubmittedCard,
} from './SurveyEndStates';
import { SurveyFlow } from './SurveyFlow';
import { SurveyHeader } from './SurveyHeader';
import {
  initialFormData,
  isSurveyDefinitionResponse,
  isSurveySubmissionResponse,
  toWireSubmission,
  type SurveyFormData,
  type SurveyPageState,
} from './SurveyShared';

export function Survey() {
  const reduce = useReducedMotion() ?? false;
  const [state, setState] = React.useState<SurveyPageState>({ kind: 'loading' });
  const [definition, setDefinition] = React.useState<SurveyDefinition | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch('/api/survey');
        if (cancelled) return;
        if (!res.ok) {
          setState({ kind: 'error', message: 'Unable to load the survey right now.' });
          return;
        }
        const raw: unknown = await res.json();
        if (cancelled) return;
        if (!isSurveyDefinitionResponse(raw)) {
          setState({ kind: 'error', message: 'Unexpected response from server.' });
          return;
        }
        setDefinition(raw.definition);
        setState({ kind: 'filling', stepIndex: 0, formData: initialFormData(raw.definition) });
      } catch {
        if (cancelled) return;
        setState({ kind: 'error', message: 'Unable to load the survey right now.' });
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(formData: SurveyFormData) {
    setState({ kind: 'submitting', formData });
    try {
      const res = await fetch('/api/survey/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toWireSubmission(formData)),
      });
      const raw: unknown = await res.json();
      if (!isSurveySubmissionResponse(raw)) {
        setState({
          kind: 'submission_error',
          message: 'Unexpected response from server.',
          formData,
        });
        return;
      }
      if (raw.ok) {
        setState({ kind: 'submitted' });
      } else {
        setState({ kind: 'submission_error', message: raw.error, formData });
      }
    } catch {
      setState({
        kind: 'submission_error',
        message: 'Unable to submit right now. Please try again.',
        formData,
      });
    }
  }

  return (
    <div className="flex flex-col gap-12 px-6 pb-24 pt-6 min-[880px]:gap-16 min-[880px]:px-12 min-[880px]:pt-10">
      <SurveyHeader reduce={reduce} />
      <section className="mx-auto w-full max-w-3xl">
        {state.kind === 'loading' && <SurveyLoadingCard reduce={reduce} />}
        {state.kind === 'error' && <SurveyErrorCard message={state.message} />}
        {(state.kind === 'filling' ||
          state.kind === 'submitting' ||
          state.kind === 'submission_error') &&
          definition && (
            <SurveyFlow
              definition={definition}
              state={state}
              setState={setState}
              onSubmit={handleSubmit}
              reduce={reduce}
            />
          )}
        {state.kind === 'submitted' && <SurveySubmittedCard reduce={reduce} />}
      </section>
    </div>
  );
}

