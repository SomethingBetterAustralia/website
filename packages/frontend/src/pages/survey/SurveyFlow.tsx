import { AlertTriangle } from 'lucide-react';
import * as React from 'react';
import type { SurveyDefinition } from '@backend/types/survey';
import { AboutYouStep } from '@/components/survey/AboutYouStep';
import { CrossCuttingStep } from '@/components/survey/CrossCuttingStep';
import { OpenResponseStep } from '@/components/survey/OpenResponseStep';
import { PortfolioStep } from '@/components/survey/PortfolioStep';
import { StepShell } from '@/components/survey/StepShell';
import {
  canAdvanceFromStep,
  stepTitleAndIntro,
  totalStepCount,
  type SurveyFormData,
  type SurveyPageState,
} from './SurveyShared';

export function SurveyFlow({
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
        portfolios={definition.portfolios}
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
  const portfolioStart = 2;
  const portfolioEnd = portfolioStart + definition.portfolios.length - 1;
  if (stepIndex >= portfolioStart && stepIndex <= portfolioEnd) {
    const portfolio = definition.portfolios[stepIndex - portfolioStart];
    if (!portfolio) return null;
    const ds = formData.portfolios[portfolio.id] ?? { expertise: undefined, responses: {} };
    return (
      <PortfolioStep
        portfolio={portfolio}
        expertise={ds.expertise}
        responses={ds.responses}
        onExpertiseChange={(next) =>
          patch({
            ...formData,
            portfolios: { ...formData.portfolios, [portfolio.id]: { ...ds, expertise: next } },
          })
        }
        onResponseChange={(code, value) =>
          patch({
            ...formData,
            portfolios: {
              ...formData.portfolios,
              [portfolio.id]: { ...ds, responses: { ...ds.responses, [code]: value } },
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
