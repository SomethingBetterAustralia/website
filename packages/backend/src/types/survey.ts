export type LikertResponse = -2 | -1 | 0 | 1 | 2 | null;

export type ExpertiseLevel = 1 | 2 | 3 | 4 | 5;

export type ScoringDirection = 'positive' | 'negative' | 'mixed';

export type SummaryAxis = 'economic' | 'social' | 'none';

export interface SurveyItem {
  readonly code: string;
  readonly text: string;
  readonly direction: ScoringDirection;
  readonly summaryAxis: SummaryAxis;
}

export interface SurveyDomain {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly blurb: string;
  readonly items: readonly SurveyItem[];
}

export type CrossCuttingIndicator =
  | 'time-horizon'
  | 'evidence-orientation'
  | 'reform-orientation'
  | 'pragmatism'
  | 'communitarian'
  | 'equality';

export interface CrossCuttingItem {
  readonly code: string;
  readonly text: string;
  readonly indicator: CrossCuttingIndicator;
}

export interface SurveyDefinition {
  readonly domains: readonly SurveyDomain[];
  readonly crossCutting: readonly CrossCuttingItem[];
}

export interface SurveyDefinitionResponse {
  readonly definition: SurveyDefinition;
  readonly _isMock: true;
}

export interface DomainResponses {
  readonly expertise: ExpertiseLevel;
  readonly responses: Record<string, LikertResponse>;
}

export interface SurveySubmission {
  readonly memberName?: string;
  readonly background: string;
  readonly expertiseAreas: readonly string[];
  readonly crossCutting: Record<string, LikertResponse>;
  readonly domains: Record<string, DomainResponses>;
  readonly openResponse?: string;
}

export interface SurveySubmissionSuccess {
  readonly ok: true;
  readonly _isMock: true;
}

export interface SurveySubmissionError {
  readonly ok: false;
  readonly error: string;
  readonly _isMock: true;
}

export type SurveySubmissionResponse = SurveySubmissionSuccess | SurveySubmissionError;
