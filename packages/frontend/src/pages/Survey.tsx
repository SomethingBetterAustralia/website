import { AlertTriangle, Check, ClipboardList } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import * as React from 'react';
import type {
  ExpertiseLevel,
  LikertResponse,
  SurveyDefinition,
  SurveyDefinitionResponse,
  SurveySubmission,
  SurveySubmissionResponse,
} from '@backend/types/survey';
import { Button } from '@/components/ui/button';
import { AboutYouStep } from '@/components/survey/AboutYouStep';
import { CrossCuttingStep } from '@/components/survey/CrossCuttingStep';
import { DomainStep } from '@/components/survey/DomainStep';
import { OpenResponseStep } from '@/components/survey/OpenResponseStep';
import { StepShell } from '@/components/survey/StepShell';
import { Link } from '@/lib/router';
import { revealUp, staggerContainer } from '@/lib/motion';
import { cn } from '@/lib/utils';

interface DomainFormState {
  expertise: ExpertiseLevel | undefined;
  responses: Record<string, LikertResponse>;
}

interface SurveyFormData {
  memberName: string;
  background: string;
  expertiseAreas: Set<string>;
  crossCutting: Record<string, LikertResponse>;
  domains: Record<string, DomainFormState>;
  openResponse: string;
}

type SurveyPageState =
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'filling'; stepIndex: number; formData: SurveyFormData }
  | { kind: 'submitting'; formData: SurveyFormData }
  | { kind: 'submitted' }
  | { kind: 'submission_error'; message: string; formData: SurveyFormData };

function initialFormData(definition: SurveyDefinition): SurveyFormData {
  const domains: Record<string, DomainFormState> = {};
  for (const d of definition.domains) {
    domains[d.id] = { expertise: undefined, responses: {} };
  }
  return {
    memberName: '',
    background: '',
    expertiseAreas: new Set<string>(),
    crossCutting: {},
    domains,
    openResponse: '',
  };
}

function isSurveyDefinitionResponse(value: unknown): value is SurveyDefinitionResponse {
  if (value === null || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  if (v.definition === null || typeof v.definition !== 'object') return false;
  const d = v.definition as Record<string, unknown>;
  return Array.isArray(d.domains) && Array.isArray(d.crossCutting);
}

function isSurveySubmissionResponse(value: unknown): value is SurveySubmissionResponse {
  if (value === null || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return typeof v.ok === 'boolean';
}

function toWireSubmission(formData: SurveyFormData): SurveySubmission {
  const trimmedName = formData.memberName.trim();
  const trimmedOpen = formData.openResponse.trim();
  return {
    background: formData.background.trim(),
    expertiseAreas: Array.from(formData.expertiseAreas),
    crossCutting: formData.crossCutting,
    domains: Object.fromEntries(
      Object.entries(formData.domains).map(([id, d]) => [
        id,
        // canAdvanceFromStep gates expertise being set before submit.
        { expertise: d.expertise as ExpertiseLevel, responses: d.responses },
      ]),
    ),
    ...(trimmedName !== '' ? { memberName: trimmedName } : {}),
    ...(trimmedOpen !== '' ? { openResponse: trimmedOpen } : {}),
  };
}

function totalStepCount(definition: SurveyDefinition): number {
  return definition.domains.length + 3;
}

function canAdvanceFromStep(
  definition: SurveyDefinition,
  stepIndex: number,
  formData: SurveyFormData,
): boolean {
  if (stepIndex === 0) {
    return formData.background.trim() !== '';
  }
  if (stepIndex === 1) {
    return definition.crossCutting.every((item) => item.code in formData.crossCutting);
  }
  const domainStart = 2;
  const domainEnd = domainStart + definition.domains.length - 1;
  if (stepIndex >= domainStart && stepIndex <= domainEnd) {
    const domain = definition.domains[stepIndex - domainStart];
    if (!domain) return false;
    const state = formData.domains[domain.id];
    if (!state || state.expertise === undefined) return false;
    return domain.items.every((item) => item.code in state.responses);
  }
  return true;
}

function stepTitleAndIntro(
  definition: SurveyDefinition,
  stepIndex: number,
): { title: string; intro?: string } {
  if (stepIndex === 0) {
    return {
      title: 'About you',
      intro:
        'A few details to help us understand who is taking the survey. Your name is optional — leave it blank to be anonymous.',
    };
  }
  if (stepIndex === 1) {
    return {
      title: 'Movement-wide questions',
      intro:
        'How you feel about the movement as a whole. Pick a response for each — "No strong view" is a valid answer.',
    };
  }
  const domainStart = 2;
  const domainEnd = domainStart + definition.domains.length - 1;
  if (stepIndex >= domainStart && stepIndex <= domainEnd) {
    const domain = definition.domains[stepIndex - domainStart];
    if (!domain) return { title: 'Domain' };
    return { title: domain.name, intro: domain.blurb };
  }
  return { title: 'Anything else', intro: 'Anything you want the team to consider. Optional.' };
}

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
        {state.kind === 'loading' && <LoadingCard reduce={reduce} />}
        {state.kind === 'error' && <ErrorCard message={state.message} />}
        {(state.kind === 'filling' ||
          state.kind === 'submitting' ||
          state.kind === 'submission_error') &&
          definition && (
            <FillingFlow
              definition={definition}
              state={state}
              setState={setState}
              onSubmit={handleSubmit}
              reduce={reduce}
            />
          )}
        {state.kind === 'submitted' && <SubmittedCard reduce={reduce} />}
      </section>
    </div>
  );
}

function SurveyHeader({ reduce }: { reduce: boolean }) {
  return (
    <motion.header
      initial={reduce ? false : 'hidden'}
      animate="visible"
      variants={staggerContainer}
      className="mx-auto flex w-full max-w-3xl flex-col items-start gap-4"
    >
      <motion.span
        variants={revealUp}
        className="inline-flex items-center gap-2 text-sb-accent-hot"
      >
        <ClipboardList aria-hidden className="size-4" />
        <span className="text-xs font-semibold uppercase tracking-[0.22em]">Survey</span>
      </motion.span>
      <motion.h1
        variants={revealUp}
        className="font-display text-[clamp(2.4rem,5.5vw,3.8rem)] font-medium italic leading-[1.05] tracking-[-0.05em] text-sb-accent"
      >
        Where do you sit?
      </motion.h1>
      <motion.p
        variants={revealUp}
        className="max-w-[60ch] text-[1.05rem] leading-[1.6] text-sb-text"
      >
        Fifteen short steps. We use it to plot anonymous dots on the People page, so the team
        can see itself honestly. &ldquo;No strong view&rdquo; is a valid answer at any point.
      </motion.p>
    </motion.header>
  );
}

function LoadingCard({ reduce }: { reduce: boolean }) {
  return (
    <motion.div
      animate={reduce ? undefined : { opacity: [0.5, 1, 0.5] }}
      transition={reduce ? undefined : { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      className={cn(
        'flex min-h-[20rem] flex-col items-center justify-center gap-3 rounded-3xl bg-sb-white p-8 shadow-[0_12px_30px_rgba(8,31,52,0.08)] ring-1 ring-sb-cream-warm',
        reduce && 'opacity-70',
      )}
    >
      <ClipboardList aria-hidden className="size-6 text-sb-accent-hot" />
      <p className="text-sm text-sb-text-muted">Loading the survey…</p>
    </motion.div>
  );
}

function ErrorCard({ message }: { message: string }) {
  return (
    <div className="flex min-h-[20rem] flex-col items-center justify-center gap-3 rounded-3xl bg-sb-white p-8 shadow-[0_12px_30px_rgba(8,31,52,0.08)] ring-1 ring-sb-error/30">
      <AlertTriangle aria-hidden className="size-6 text-sb-error" />
      <p className="max-w-[40ch] text-center text-sm text-sb-text">{message}</p>
    </div>
  );
}

function SubmittedCard({ reduce }: { reduce: boolean }) {
  return (
    <motion.div
      initial={reduce ? false : 'hidden'}
      animate="visible"
      variants={staggerContainer}
      className="flex flex-col items-start gap-4 rounded-3xl bg-sb-white p-6 shadow-[0_12px_30px_rgba(8,31,52,0.08)] ring-1 ring-sb-cream-warm min-[880px]:p-10"
    >
      <motion.span
        variants={revealUp}
        className="inline-flex items-center gap-2 text-sb-accent-hot"
      >
        <Check aria-hidden className="size-4" />
        <span className="text-xs font-semibold uppercase tracking-[0.22em]">Done</span>
      </motion.span>
      <motion.h2
        variants={revealUp}
        className="font-display text-[clamp(1.8rem,4vw,2.8rem)] font-medium italic leading-[1.1] tracking-[-0.04em] text-sb-accent"
      >
        Submitted — thank you.
      </motion.h2>
      <motion.p
        variants={revealUp}
        className="max-w-[52ch] text-[1.05rem] leading-[1.6] text-sb-text"
      >
        Your response has been recorded. As more of the team submit, the chart on the People
        page will fill in. You can view it now.
      </motion.p>
      <motion.div variants={revealUp} className="mt-2">
        <Button
          asChild
          className="rounded-full bg-sb-accent text-sb-white shadow-[0_4px_12px_rgba(212,166,73,0.35)] hover:bg-sb-accent-hot focus-visible:ring-sb-accent"
        >
          <Link to="/people">Back to the People page</Link>
        </Button>
      </motion.div>
    </motion.div>
  );
}

function FillingFlow({
  definition,
  state,
  setState,
  onSubmit,
  reduce,
}: {
  definition: SurveyDefinition;
  state:
    | { kind: 'filling'; stepIndex: number; formData: SurveyFormData }
    | { kind: 'submitting'; formData: SurveyFormData }
    | { kind: 'submission_error'; message: string; formData: SurveyFormData };
  setState: React.Dispatch<React.SetStateAction<SurveyPageState>>;
  onSubmit: (formData: SurveyFormData) => void;
  reduce: boolean;
}) {
  const totalSteps = totalStepCount(definition);
  const formData = state.formData;
  const stepIndex = state.kind === 'filling' ? state.stepIndex : totalSteps - 1;
  const isLastStep = stepIndex === totalSteps - 1;
  const submitting = state.kind === 'submitting';
  const errMessage = state.kind === 'submission_error' ? state.message : undefined;
  const canAdvance = canAdvanceFromStep(definition, stepIndex, formData);
  const titleAndIntro = stepTitleAndIntro(definition, stepIndex);

  function patch(next: SurveyFormData) {
    if (state.kind === 'submitting') return;
    setState({ kind: 'filling', stepIndex, formData: next });
  }

  function goBack() {
    if (state.kind === 'submitting') return;
    if (stepIndex === 0) return;
    setState({ kind: 'filling', stepIndex: stepIndex - 1, formData });
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    }
  }

  function goNext() {
    if (state.kind === 'submitting') return;
    if (isLastStep) {
      onSubmit(formData);
      return;
    }
    setState({ kind: 'filling', stepIndex: stepIndex + 1, formData });
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {errMessage && (
        <div className="flex items-start gap-3 rounded-2xl bg-sb-error/10 px-4 py-3 ring-1 ring-sb-error/30">
          <AlertTriangle aria-hidden className="mt-0.5 size-4 shrink-0 text-sb-error" />
          <p className="text-sm leading-[1.5] text-sb-error">{errMessage}</p>
        </div>
      )}
      <StepShell
        stepIndex={stepIndex}
        totalSteps={totalSteps}
        title={titleAndIntro.title}
        intro={titleAndIntro.intro}
        canAdvance={canAdvance}
        isLastStep={isLastStep}
        submitting={submitting}
        onBack={goBack}
        onNext={goNext}
      >
        {renderStepContent(definition, stepIndex, formData, patch)}
      </StepShell>
    </div>
  );
}

function renderStepContent(
  definition: SurveyDefinition,
  stepIndex: number,
  formData: SurveyFormData,
  patch: (next: SurveyFormData) => void,
): React.ReactNode {
  if (stepIndex === 0) {
    return (
      <AboutYouStep
        memberName={formData.memberName}
        background={formData.background}
        expertiseAreas={formData.expertiseAreas}
        domains={definition.domains}
        onMemberNameChange={(next) => patch({ ...formData, memberName: next })}
        onBackgroundChange={(next) => patch({ ...formData, background: next })}
        onExpertiseAreasChange={(next) => patch({ ...formData, expertiseAreas: next })}
      />
    );
  }
  if (stepIndex === 1) {
    return (
      <CrossCuttingStep
        items={definition.crossCutting}
        responses={formData.crossCutting}
        onChange={(code, value) =>
          patch({
            ...formData,
            crossCutting: { ...formData.crossCutting, [code]: value },
          })
        }
      />
    );
  }
  const domainStart = 2;
  const domainEnd = domainStart + definition.domains.length - 1;
  if (stepIndex >= domainStart && stepIndex <= domainEnd) {
    const domain = definition.domains[stepIndex - domainStart];
    if (!domain) return null;
    const ds = formData.domains[domain.id] ?? { expertise: undefined, responses: {} };
    return (
      <DomainStep
        domain={domain}
        expertise={ds.expertise}
        responses={ds.responses}
        onExpertiseChange={(next) =>
          patch({
            ...formData,
            domains: { ...formData.domains, [domain.id]: { ...ds, expertise: next } },
          })
        }
        onResponseChange={(code, value) =>
          patch({
            ...formData,
            domains: {
              ...formData.domains,
              [domain.id]: { ...ds, responses: { ...ds.responses, [code]: value } },
            },
          })
        }
      />
    );
  }
  return (
    <OpenResponseStep
      value={formData.openResponse}
      onChange={(next) => patch({ ...formData, openResponse: next })}
    />
  );
}
