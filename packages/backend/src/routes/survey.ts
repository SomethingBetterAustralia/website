import { Router } from 'express';
import type {
  PortfolioResponses,
  LikertResponse,
  SurveyDefinitionResponse,
  SurveySubmission,
  SurveySubmissionError,
  SurveySubmissionSuccess,
} from '../types/survey.js';
import { SURVEY_DEFINITION } from '../logic/survey-definition.js';

function isLikertResponse(value: unknown): value is LikertResponse {
  return (
    value === null ||
    value === -2 ||
    value === -1 ||
    value === 0 ||
    value === 1 ||
    value === 2
  );
}

function isExpertiseLevel(value: unknown): value is 1 | 2 | 3 | 4 | 5 {
  return value === 1 || value === 2 || value === 3 || value === 4 || value === 5;
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString);
}

function isLikertRecord(value: unknown): value is Record<string, LikertResponse> {
  if (value === null || typeof value !== 'object') return false;
  return Object.values(value as Record<string, unknown>).every(isLikertResponse);
}

const VALID_CROSS_CUTTING_CODES = new Set(SURVEY_DEFINITION.crossCutting.map((c) => c.code));
const VALID_PORTFOLIO_IDS = new Set(SURVEY_DEFINITION.portfolios.map((d) => d.id));
const VALID_ITEM_CODES_BY_PORTFOLIO = new Map(
  SURVEY_DEFINITION.portfolios.map((d) => [d.id, new Set(d.items.map((i) => i.code))]),
);

function parsePortfolioResponses(
  value: unknown,
  portfolioId: string,
): PortfolioResponses | { error: string } {
  if (value === null || typeof value !== 'object') {
    return { error: `invalid portfolio payload: ${portfolioId}` };
  }
  const v = value as Record<string, unknown>;
  if (!isExpertiseLevel(v.expertise)) return { error: `invalid expertise for ${portfolioId}` };
  if (!isLikertRecord(v.responses)) return { error: `invalid responses for ${portfolioId}` };
  const allowedCodes = VALID_ITEM_CODES_BY_PORTFOLIO.get(portfolioId);
  if (!allowedCodes) return { error: `unknown portfolio id: ${portfolioId}` };
  for (const code of Object.keys(v.responses)) {
    if (!allowedCodes.has(code)) {
      return { error: `unknown item code ${code} in portfolio ${portfolioId}` };
    }
  }
  return { expertise: v.expertise, responses: v.responses };
}

function parseSubmission(body: unknown): SurveySubmission | { error: string } {
  if (body === null || typeof body !== 'object') return { error: 'invalid payload' };
  const b = body as Record<string, unknown>;
  if (b.memberName !== undefined && !isString(b.memberName)) return { error: 'invalid memberName' };
  if (!isString(b.background)) return { error: 'background required' };
  if (!isStringArray(b.expertiseAreas)) return { error: 'invalid expertiseAreas' };
  if (b.openResponse !== undefined && !isString(b.openResponse)) {
    return { error: 'invalid openResponse' };
  }
  if (!isLikertRecord(b.crossCutting)) return { error: 'invalid crossCutting' };
  for (const code of Object.keys(b.crossCutting)) {
    if (!VALID_CROSS_CUTTING_CODES.has(code)) {
      return { error: `unknown crossCutting code: ${code}` };
    }
  }
  if (b.portfolios === null || typeof b.portfolios !== 'object') return { error: 'invalid portfolios' };
  const portfoliosRaw = b.portfolios as Record<string, unknown>;
  const portfolios: Record<string, PortfolioResponses> = {};
  for (const [portfolioId, raw] of Object.entries(portfoliosRaw)) {
    if (!VALID_PORTFOLIO_IDS.has(portfolioId)) return { error: `unknown portfolio id: ${portfolioId}` };
    const parsed = parsePortfolioResponses(raw, portfolioId);
    if ('error' in parsed) return parsed;
    portfolios[portfolioId] = parsed;
  }
  return {
    background: b.background,
    expertiseAreas: b.expertiseAreas,
    crossCutting: b.crossCutting,
    portfolios,
    ...(isString(b.memberName) ? { memberName: b.memberName } : {}),
    ...(isString(b.openResponse) ? { openResponse: b.openResponse } : {}),
  };
}

export const surveyRouter: Router = Router();

// MOCK: log-and-ack only; no persistence, no email, no captcha.
// _isMock: true on every response envelope so callers (and grep) can detect
// the mock surface.
surveyRouter.get('/', (_req, res) => {
  const body: SurveyDefinitionResponse = {
    definition: SURVEY_DEFINITION,
    _isMock: true,
  };
  res.status(200).json(body);
});

surveyRouter.post('/submit', (req, res) => {
  const parsed = parseSubmission(req.body as unknown);
  if ('error' in parsed) {
    const errorResponse: SurveySubmissionError = {
      ok: false,
      error: parsed.error,
      _isMock: true,
    };
    res.status(400).json(errorResponse);
    return;
  }
  console.log('[MOCK /api/survey/submit]', parsed.memberName ?? '(anonymous)');
  const successResponse: SurveySubmissionSuccess = { ok: true, _isMock: true };
  res.status(200).json(successResponse);
});
