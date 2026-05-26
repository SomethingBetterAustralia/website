import { useReducedMotion } from 'motion/react';
import { Caveat } from '@/components/prose';
import { usePeoplePage } from '@/hooks/usePeoplePage';
import { PeopleBand } from './PeopleBand';
import { PeopleFinalCta } from './PeopleFinalCta';
import { PeopleSurveyCta } from './PeopleSurveyCta';

export function People() {
  const reduce = useReducedMotion() ?? false;
  const [state, retry] = usePeoplePage();
  return (
    <div className="flex flex-col gap-16 px-6 pb-24 pt-6 min-[880px]:gap-24 min-[880px]:px-12 min-[880px]:pt-10">
      <PeopleBand state={state} retry={retry} reduce={reduce} />
      <Caveat reduce={reduce}>
        Chart axes are derived from the policy portfolios in the Leadership Leanings Survey, aggregated
        by the economic and social mapping recorded against each item in the survey definition.
        Member profiles are placeholders until enough real submissions exist; the visible spread
        demonstrates how the chart will look once the team has filled it in.
      </Caveat>
      <PeopleSurveyCta reduce={reduce} />
      <PeopleFinalCta reduce={reduce} />
    </div>
  );
}
