// MOCK: controller for hand-typed anonymous survey responses. Each respondent
// lives in their own mock-members-hardcoded-<id>.ts file. To add a new person,
// copy mock-members-hardcoded-anon001.ts, follow the instructions inside, then
// add the new const to HARDCODED_SUBMISSIONS below.

import type {
  ExpertiseLevel,
  LikertResponse,
  PortfolioResponses,
} from '../types/survey.js';
import type { MemberProfile, PortfolioScore } from '../types/people.js';
import { SURVEY_DEFINITION } from './survey-definition.js';
import { scorePortfolio, scoreSummaryAxis } from './survey-scoring.js';
import { ANON_001 } from './mock-members-hardcoded-anon001.js';

export interface HardcodedSubmission {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly background: string;
  readonly isLeadership: boolean;
  // Portfolios the respondent self-declared they feel strongest in (the
  // "Which policy portfolios do you feel strongest in?" multi-select on the
  // About-You step). Optional in the form; pass an empty array if none.
  readonly expertiseAreas: readonly string[];
  // Movement-wide questions (codes B1-B6).
  readonly crossCutting: Record<string, LikertResponse>;
  readonly portfolios: Record<
    string,
    { readonly expertise: ExpertiseLevel; readonly responses: Record<string, LikertResponse> }
  >;
  // Optional free-text response from the end of the survey.
  readonly openResponse?: string;
  // Note: toMemberProfile currently only consumes `portfolios` because that's
  // all the People chart renders. expertiseAreas / crossCutting / openResponse
  // are captured for when the UI surfaces them.
}

const HARDCODED_SUBMISSIONS: readonly HardcodedSubmission[] = [ANON_001];

function toMemberProfile(submission: HardcodedSubmission): MemberProfile {
  const portfolios: Record<string, PortfolioResponses> = {};
  for (const [portfolioId, entry] of Object.entries(submission.portfolios)) {
    portfolios[portfolioId] = { expertise: entry.expertise, responses: entry.responses };
  }

  const portfolioScores: PortfolioScore[] = [];
  for (const portfolio of SURVEY_DEFINITION.portfolios) {
    const entry = portfolios[portfolio.id];
    if (!entry) continue;
    const score = scorePortfolio(portfolio, entry);
    if (score !== null) portfolioScores.push(score);
  }

  const economicAxis = scoreSummaryAxis(SURVEY_DEFINITION, { portfolios }, 'economic');
  const socialAxis = scoreSummaryAxis(SURVEY_DEFINITION, { portfolios }, 'social');

  return {
    id: submission.id,
    name: submission.name,
    role: submission.role,
    background: submission.background,
    isLeadership: submission.isLeadership,
    economicAxis,
    socialAxis,
    portfolioScores,
    bioShort: '',
    bioLong: '',
    location: '',
    focusAreas: [],
    joined: '',
    photoUrl: '',
    _isMock: true,
  };
}

export const HARDCODED_MEMBERS: readonly MemberProfile[] =
  HARDCODED_SUBMISSIONS.map(toMemberProfile);
