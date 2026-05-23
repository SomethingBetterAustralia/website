import type {
  PortfolioResponses,
  LikertResponse,
  SurveyDefinition,
  SurveyPortfolio,
} from '../types/survey.js';
import type { PortfolioScore } from '../types/people.js';

function isScored(value: LikertResponse | undefined): value is -2 | -1 | 0 | 1 | 2 {
  return value !== null && value !== undefined;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// Portfolio score: mean of scored items (excluding null and mixed-direction items),
// sign-flipped on negative-direction items, scaled by 50 to map -2..+2 -> -100..+100.
// Also returns the per-axis decomposition via scorePortfolioAxes.
export function scorePortfolio(
  portfolio: SurveyPortfolio,
  responses: PortfolioResponses,
): PortfolioScore | null {
  let total = 0;
  let count = 0;
  for (const item of portfolio.items) {
    if (item.direction === 'mixed') continue;
    const raw = responses.responses[item.code];
    if (!isScored(raw)) continue;
    const sign = item.direction === 'negative' ? -1 : 1;
    total += raw * sign;
    count += 1;
  }
  if (count === 0) return null;
  const axes = scorePortfolioAxes(portfolio, responses);
  return {
    portfolioId: portfolio.id,
    score: clamp((total / count) * 50, -100, 100),
    expertise: responses.expertise,
    economicComponent: axes.economic,
    socialComponent: axes.social,
    responses: responses.responses,
  };
}

// Per-portfolio decomposition into economic / social components. Same per-axis formula
// as scoreSummaryAxis but restricted to a single portfolio. Expertise is constant within
// a portfolio so the weighted mean collapses to an unweighted one. Returns null on an
// axis when no items in this portfolio contributed to it.
export function scorePortfolioAxes(
  portfolio: SurveyPortfolio,
  responses: PortfolioResponses,
): { economic: number | null; social: number | null } {
  return {
    economic: computeAxis(portfolio, responses, 'economic'),
    social: computeAxis(portfolio, responses, 'social'),
  };
}

function computeAxis(
  portfolio: SurveyPortfolio,
  responses: PortfolioResponses,
  axis: 'economic' | 'social',
): number | null {
  let total = 0;
  let count = 0;
  for (const item of portfolio.items) {
    if (item.summaryAxis !== axis) continue;
    const raw = responses.responses[item.code];
    if (!isScored(raw)) continue;
    const sign = item.direction === 'negative' ? -1 : 1;
    total += raw * sign;
    count += 1;
  }
  if (count === 0) return null;
  return clamp((total / count) * 50, -100, 100);
}

// Summary axis: expertise-weighted mean of items where item.summaryAxis === axis,
// sign-flipped for direction === 'negative'. Scaled by 50 to map the weighted mean
// of -2..+2 to -100..+100.
export function scoreSummaryAxis(
  definition: SurveyDefinition,
  submission: { portfolios: Record<string, PortfolioResponses> },
  axis: 'economic' | 'social',
): number {
  let total = 0;
  let weight = 0;
  for (const portfolio of definition.portfolios) {
    const portfolioSub = submission.portfolios[portfolio.id];
    if (!portfolioSub) continue;
    const expertise = portfolioSub.expertise;
    for (const item of portfolio.items) {
      if (item.summaryAxis !== axis) continue;
      const raw = portfolioSub.responses[item.code];
      if (!isScored(raw)) continue;
      const sign = item.direction === 'negative' ? -1 : 1;
      total += raw * sign * expertise;
      weight += expertise;
    }
  }
  if (weight === 0) return 0;
  return clamp((total / weight) * 50, -100, 100);
}
