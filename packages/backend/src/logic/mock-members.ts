// MOCK: controller for the mock member set. Flip USE_HARDCODED_RESPONSES to
// swap between the procedurally-generated cohort and hand-typed anonymous
// responses collected from real people.

import type { MemberProfile } from '../types/people.js';
import { GENERATED_MEMBERS } from './mock-members-generated.js';
import { HARDCODED_MEMBERS } from './mock-members-hardcoded.js';

const USE_HARDCODED_RESPONSES = false;

export const MOCK_MEMBERS: readonly MemberProfile[] = USE_HARDCODED_RESPONSES
  ? HARDCODED_MEMBERS
  : GENERATED_MEMBERS;
