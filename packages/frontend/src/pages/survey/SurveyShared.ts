import type {
  ExpertiseLevel,
  LikertResponse,
  SurveyDefinition,
  SurveyDefinitionResponse,
  SurveySubmission,
  SurveySubmissionResponse,
} from '@backend/types/survey';

export interface PortfolioFormState {
  expertise: ExpertiseLevel | undefined;
  responses: Record<string, LikertResponse>;
}

export interface SurveyFormData {
  memberName: string;
  background: string;
  expertiseAreas: Set<string>;
  crossCutting: Record<string, LikertResponse>;
  portfolios: Record<string, PortfolioFormState>;
  openResponse: string;
}

export type SurveyPageState =
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'filling'; stepIndex: number; formData: SurveyFormData }
  | { kind: 'submitting'; formData: SurveyFormData }
  | { kind: 'submitted' }
  | { kind: 'submission_error'; message: string; formData: SurveyFormData };

export function initialFormData(definition: SurveyDefinition): SurveyFormData {
  const portfolios: Record<string, PortfolioFormState> = {};
  for (const d of definition.portfolios) {
    portfolios[d.id] = { expertise: undefined, responses: {} };
  }
  return {
    memberName: '',
    background: '',
    expertiseAreas: new Set<string>(),
    crossCutting: {},
    portfolios,
    openResponse: '',
  };
}

export function isSurveyDefinitionResponse(value: unknown): value is SurveyDefinitionResponse {
  if (value === null || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  if (v.definition === null || typeof v.definition !== 'object') return false;
  const d = v.definition as Record<string, unknown>;
  return Array.isArray(d.portfolios) && Array.isArray(d.crossCutting);
}

export function isSurveySubmissionResponse(value: unknown): value is SurveySubmissionResponse {
  if (value === null || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return typeof v.ok === 'boolean';
}

export function toWireSubmission(formData: SurveyFormData): SurveySubmission {
  const trimmedName = formData.memberName.trim();
  const trimmedOpen = formData.openResponse.trim();
  return {
    background: formData.background.trim(),
    expertiseAreas: Array.from(formData.expertiseAreas),
    crossCutting: formData.crossCutting,
    portfolios: Object.fromEntries(
      Object.entries(formData.portfolios).map(([id, d]) => [
        id,
        // canAdvanceFromStep gates expertise being set before submit.
        { expertise: d.expertise as ExpertiseLevel, responses: d.responses },
      ]),
    ),
    ...(trimmedName !== '' ? { memberName: trimmedName } : {}),
    ...(trimmedOpen !== '' ? { openResponse: trimmedOpen } : {}),
  };
}

export function totalStepCount(definition: SurveyDefinition): number {
  return definition.portfolios.length + 3;
}

export function canAdvanceFromStep(
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
  const portfolioStart = 2;
  const portfolioEnd = portfolioStart + definition.portfolios.length - 1;
  if (stepIndex >= portfolioStart && stepIndex <= portfolioEnd) {
    const portfolio = definition.portfolios[stepIndex - portfolioStart];
    if (!portfolio) return false;
    const state = formData.portfolios[portfolio.id];
    if (!state || state.expertise === undefined) return false;
    return portfolio.items.every((item) => item.code in state.responses);
  }
  return true;
}

export function stepTitleAndIntro(
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
  const portfolioStart = 2;
  const portfolioEnd = portfolioStart + definition.portfolios.length - 1;
  if (stepIndex >= portfolioStart && stepIndex <= portfolioEnd) {
    const portfolio = definition.portfolios[stepIndex - portfolioStart];
    if (!portfolio) return { title: 'Portfolio' };
    return { title: portfolio.name, intro: portfolio.blurb };
  }
  return { title: 'Anything else', intro: 'Anything you want the team to consider. Optional.' };
}
