import { useReducedMotion } from 'motion/react';
import { Caveat } from '@/components/prose';
import { ProgressContribute } from './ProgressContribute';
import { ProgressEngagement } from './ProgressEngagement';
import { ProgressFinalCta } from './ProgressFinalCta';
import { ProgressFootprint } from './ProgressFootprint';
import { ProgressHero } from './ProgressHero';
import { ProgressKpis } from './ProgressKpis';
import { ProgressMembership } from './ProgressMembership';
import { ProgressOpenSource } from './ProgressOpenSource';
import { ProgressPipeline } from './ProgressPipeline';
import { type ReduceMotion } from './ProgressShared';
import { ProgressSupport } from './ProgressSupport';

export function Progress() {
  const reduce = useReducedMotion();
  return (
    <div className="flex flex-col gap-16 px-6 pb-24 pt-6 min-[880px]:gap-24 min-[880px]:px-12 min-[880px]:pt-10">
      <ProgressHero reduce={reduce} />
      <ProgressKpis reduce={reduce} />
      <ProgressMembership reduce={reduce} />
      <ProgressFootprint reduce={reduce} />
      <ProgressPipeline reduce={reduce} />
      <ProgressSupport reduce={reduce} />
      <ProgressOpenSource reduce={reduce} />
      <ProgressEngagement reduce={reduce} />
      <ProgressCaveat reduce={reduce} />
      <ProgressContribute reduce={reduce} />
      <ProgressFinalCta reduce={reduce} />
    </div>
  );
}

function ProgressCaveat({ reduce }: { reduce: ReduceMotion }) {
  return (
    <Caveat reduce={reduce}>
      Where these numbers come from: most are real but small &mdash; signups,
      volunteer-logged hours, GitHub activity. A few are estimates while the platform
      that will track them precisely is still being built (notably the Bacon Board
      figures and the policy funnel counts). The &lsquo;as of&rsquo; date at the top of
      this page applies to everything. When the platform is live, every number on this
      page will be live too.
    </Caveat>
  );
}
