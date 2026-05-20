import * as React from 'react';
import type { PeopleResponse } from '@backend/types/people';
import type { SurveyDefinitionResponse } from '@backend/types/survey';

export type PeoplePageState =
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | {
      kind: 'ready';
      members: PeopleResponse['members'];
      domains: SurveyDefinitionResponse['definition']['domains'];
    };

function isPeopleResponse(value: unknown): value is PeopleResponse {
  if (value === null || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  if (!Array.isArray(v.members)) return false;
  if (v.members.length === 0) return true;
  const first = v.members[0];
  if (first === null || typeof first !== 'object') return false;
  const m = first as Record<string, unknown>;
  return (
    typeof m.id === 'string' &&
    typeof m.name === 'string' &&
    typeof m.economicAxis === 'number' &&
    typeof m.socialAxis === 'number' &&
    Array.isArray(m.domainScores)
  );
}

function isSurveyDefinitionResponse(value: unknown): value is SurveyDefinitionResponse {
  if (value === null || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  if (v.definition === null || typeof v.definition !== 'object') return false;
  const d = v.definition as Record<string, unknown>;
  if (!Array.isArray(d.domains)) return false;
  if (d.domains.length === 0) return true;
  const first = d.domains[0];
  if (first === null || typeof first !== 'object') return false;
  const dom = first as Record<string, unknown>;
  return (
    typeof dom.id === 'string' && typeof dom.name === 'string' && Array.isArray(dom.items)
  );
}

export function usePeoplePage(): readonly [PeoplePageState, () => void] {
  const [state, setState] = React.useState<PeoplePageState>({ kind: 'loading' });
  const [nonce, setNonce] = React.useState(0);

  React.useEffect(() => {
    let cancelled = false;
    setState({ kind: 'loading' });

    async function load() {
      try {
        const [peopleRes, surveyRes] = await Promise.all([
          fetch('/api/people'),
          fetch('/api/survey'),
        ]);
        if (cancelled) return;
        if (!peopleRes.ok || !surveyRes.ok) {
          setState({ kind: 'error', message: 'Unable to load the team right now.' });
          return;
        }
        const peopleRaw: unknown = await peopleRes.json();
        const surveyRaw: unknown = await surveyRes.json();
        if (cancelled) return;
        if (!isPeopleResponse(peopleRaw) || !isSurveyDefinitionResponse(surveyRaw)) {
          setState({ kind: 'error', message: 'Unexpected response from server.' });
          return;
        }
        setState({
          kind: 'ready',
          members: peopleRaw.members,
          domains: surveyRaw.definition.domains,
        });
      } catch {
        if (cancelled) return;
        setState({ kind: 'error', message: 'Unable to load the team right now.' });
      }
    }
    void load();

    return () => {
      cancelled = true;
    };
  }, [nonce]);

  const retry = React.useCallback(() => {
    setNonce((n) => n + 1);
  }, []);

  return [state, retry] as const;
}
