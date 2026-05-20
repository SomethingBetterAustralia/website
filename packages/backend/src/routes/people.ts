import { Router } from 'express';
import type { PeopleResponse } from '../types/people.js';
import { MOCK_MEMBERS } from '../logic/mock-members.js';

export const peopleRouter: Router = Router();

// MOCK: returns the procedurally-generated mock member set. Replace once
// real survey submissions are persisted and projected into MemberProfile shape.
peopleRouter.get('/', (_req, res) => {
  const body: PeopleResponse = { members: MOCK_MEMBERS, _isMock: true };
  res.status(200).json(body);
});
