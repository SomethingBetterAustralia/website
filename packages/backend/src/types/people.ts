import type { ExpertiseLevel } from './survey.js';

export interface DomainScore {
  readonly domainId: string;
  readonly score: number;
  readonly expertise: ExpertiseLevel;
  readonly economicComponent: number | null;
  readonly socialComponent: number | null;
}

export interface MemberProfile {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly background: string;
  readonly isLeadership: boolean;
  readonly economicAxis: number;
  readonly socialAxis: number;
  readonly domainScores: readonly DomainScore[];
  readonly _isMock: true;
}

export interface PeopleResponse {
  readonly members: readonly MemberProfile[];
  readonly _isMock: true;
}
