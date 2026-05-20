import type {
  DomainResponses,
  LikertResponse,
  SurveyDefinition,
  SurveyDomain,
} from '../types/survey.js';
import type { DomainScore } from '../types/people.js';

function isScored(value: LikertResponse | undefined): value is -2 | -1 | 0 | 1 | 2 {
  return value !== null && value !== undefined;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// Domain score: mean of scored items (excluding null and mixed-direction items),
// sign-flipped on negative-direction items, scaled by 50 to map -2..+2 -> -100..+100.
// Also returns the per-axis decomposition via scoreDomainAxes.
export function scoreDomain(
  domain: SurveyDomain,
  responses: DomainResponses,
): DomainScore | null {
  let total = 0;
  let count = 0;
  for (const item of domain.items) {
    if (item.direction === 'mixed') continue;
    const raw = responses.responses[item.code];
    if (!isScored(raw)) continue;
    const sign = item.direction === 'negative' ? -1 : 1;
    total += raw * sign;
    count += 1;
  }
  if (count === 0) return null;
  const axes = scoreDomainAxes(domain, responses);
  return {
    domainId: domain.id,
    score: clamp((total / count) * 50, -100, 100),
    expertise: responses.expertise,
    economicComponent: axes.economic,
    socialComponent: axes.social,
  };
}

// Per-domain decomposition into economic / social components. Same per-axis formula
// as scoreSummaryAxis but restricted to a single domain. Expertise is constant within
// a domain so the weighted mean collapses to an unweighted one. Returns null on an
// axis when no items in this domain contributed to it.
export function scoreDomainAxes(
  domain: SurveyDomain,
  responses: DomainResponses,
): { economic: number | null; social: number | null } {
  return {
    economic: computeAxis(domain, responses, 'economic'),
    social: computeAxis(domain, responses, 'social'),
  };
}

function computeAxis(
  domain: SurveyDomain,
  responses: DomainResponses,
  axis: 'economic' | 'social',
): number | null {
  let total = 0;
  let count = 0;
  for (const item of domain.items) {
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
  submission: { domains: Record<string, DomainResponses> },
  axis: 'economic' | 'social',
): number {
  let total = 0;
  let weight = 0;
  for (const domain of definition.domains) {
    const domainSub = submission.domains[domain.id];
    if (!domainSub) continue;
    const expertise = domainSub.expertise;
    for (const item of domain.items) {
      if (item.summaryAxis !== axis) continue;
      const raw = domainSub.responses[item.code];
      if (!isScored(raw)) continue;
      const sign = item.direction === 'negative' ? -1 : 1;
      total += raw * sign * expertise;
      weight += expertise;
    }
  }
  if (weight === 0) return 0;
  return clamp((total / weight) * 50, -100, 100);
}
