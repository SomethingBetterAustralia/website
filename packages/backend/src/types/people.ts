import type { ExpertiseLevel, LikertResponse } from './survey.js';

export interface PortfolioScore {
  readonly portfolioId: string;
  readonly score: number;
  readonly expertise: ExpertiseLevel;
  readonly economicComponent: number | null;
  readonly socialComponent: number | null;
  readonly responses: Record<string, LikertResponse>;
}

export interface MemberProfile {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly background: string;
  readonly isLeadership: boolean;
  readonly economicAxis: number;
  readonly socialAxis: number;
  readonly portfolioScores: readonly PortfolioScore[];
  readonly _isMock: true;
}

export interface PeopleResponse {
  readonly members: readonly MemberProfile[];
  readonly _isMock: true;
}
