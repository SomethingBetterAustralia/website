import type { MemberProfile, PortfolioScore, PeopleResponse } from '@backend/types/people';
import type { SurveyDefinitionResponse, SurveyPortfolio } from '@backend/types/survey';
import { PORTFOLIO_ICONS, expertiseToOpacity, type ScatterPoint } from '@/components/people';

export type ToggleKey = 'leadership' | 'members' | 'all';
export type Members = PeopleResponse['members'];
export type Portfolios = SurveyDefinitionResponse['definition']['portfolios'];

export function meanExpertise(member: MemberProfile): 1 | 2 | 3 | 4 | 5 {
  if (member.portfolioScores.length === 0) return 1;
  const sum = member.portfolioScores.reduce((acc, ds) => acc + ds.expertise, 0);
  const mean = sum / member.portfolioScores.length;
  return Math.max(1, Math.min(5, Math.round(mean))) as 1 | 2 | 3 | 4 | 5;
}

export function memberToPoint(member: MemberProfile): ScatterPoint {
  return {
    id: member.id,
    label: member.name,
    sublabel: member.role,
    economicAxis: member.economicAxis,
    socialAxis: member.socialAxis,
    opacity: expertiseToOpacity(meanExpertise(member)),
    leadership: member.isLeadership,
  };
}

export function portfolioScoreToPoint(
  ds: PortfolioScore,
  portfolio: SurveyPortfolio | undefined,
): ScatterPoint | null {
  if (ds.economicComponent === null && ds.socialComponent === null) return null;
  return {
    id: ds.portfolioId,
    label: portfolio?.name ?? ds.portfolioId,
    sublabel: `Expertise: ${ds.expertise}/5 · Score: ${Math.round(ds.score)}`,
    economicAxis: ds.economicComponent ?? 0,
    socialAxis: ds.socialComponent ?? 0,
    opacity: expertiseToOpacity(ds.expertise),
    icon: PORTFOLIO_ICONS[ds.portfolioId],
  };
}
