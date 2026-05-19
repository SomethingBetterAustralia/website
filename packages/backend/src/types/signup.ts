export type SignupIntent =
  | 'join_as_member'
  | 'come_to_events'
  | 'work_for_party';

export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  postcode: string;
  intents: SignupIntent[];
  feedback?: string;
}

export interface SignupSuccess {
  ok: true;
  _isMock: true;
}

export interface SignupError {
  ok: false;
  error: string;
  _isMock: true;
}

export type SignupResponse = SignupSuccess | SignupError;
