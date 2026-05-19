import { Router } from 'express';
import type {
  SignupError,
  SignupIntent,
  SignupRequest,
  SignupSuccess,
} from '../types/signup.js';

const VALID_INTENTS: ReadonlySet<SignupIntent> = new Set([
  'join_as_member',
  'come_to_events',
  'work_for_party',
]);

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isIntentArray(value: unknown): value is SignupIntent[] {
  return (
    Array.isArray(value) &&
    value.every((v): v is SignupIntent => isString(v) && VALID_INTENTS.has(v as SignupIntent))
  );
}

function parseSignupRequest(body: unknown): SignupRequest | { error: string } {
  if (body === null || typeof body !== 'object') return { error: 'invalid payload' };
  const b = body as Record<string, unknown>;

  if (!isString(b.firstName) || b.firstName.trim() === '') return { error: 'firstName required' };
  if (!isString(b.lastName) || b.lastName.trim() === '') return { error: 'lastName required' };
  if (!isString(b.email) || b.email.trim() === '') return { error: 'email required' };
  if (!isString(b.postcode) || b.postcode.trim() === '') return { error: 'postcode required' };
  if (!isIntentArray(b.intents)) return { error: 'invalid payload' };
  if (b.feedback !== undefined && !isString(b.feedback)) return { error: 'invalid payload' };

  return {
    firstName: b.firstName,
    lastName: b.lastName,
    email: b.email,
    postcode: b.postcode,
    intents: b.intents,
    ...(isString(b.feedback) ? { feedback: b.feedback } : {}),
  };
}

export const signupRouter: Router = Router();

// MOCK: stand-in for a real signup integration (CRM / mailing list / DB).
// Validates the contract shape and echoes a success envelope. No persistence,
// no email, no captcha. `_isMock: true` on every response so callers (and grep)
// can detect the mock surface.
signupRouter.post('/', (req, res) => {
  const parsed = parseSignupRequest(req.body as unknown);
  if ('error' in parsed) {
    const errorResponse: SignupError = { ok: false, error: parsed.error, _isMock: true };
    res.status(400).json(errorResponse);
    return;
  }
  console.log('[MOCK /api/signup]', parsed);
  const successResponse: SignupSuccess = { ok: true, _isMock: true };
  res.status(200).json(successResponse);
});
