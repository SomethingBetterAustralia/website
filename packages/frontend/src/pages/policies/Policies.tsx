import { Filter } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { PolicyFunnel } from '@/components/policies';
import { Caveat } from '@/components/prose';
import { revealUp, staggerContainer, viewportOnce } from '@/lib/motion';
import { PoliciesAdopted } from './PoliciesAdopted';
import { PoliciesContribute } from './PoliciesContribute';
import { PoliciesDrafts } from './PoliciesDrafts';
import { PoliciesFinalCta } from './PoliciesFinalCta';
import { PoliciesHero } from './PoliciesHero';
import { PoliciesIdeas } from './PoliciesIdeas';
import { type ReduceMotion } from './PoliciesShared';
import { PoliciesThemes } from './PoliciesThemes';

export function Policies() {
  const reduce = useReducedMotion();
  return (
    <div className="flex flex-col gap-16 px-6 pb-24 pt-6 min-[880px]:gap-24 min-[880px]:px-12 min-[880px]:pt-10">
      <PoliciesHero reduce={reduce} />
      <PoliciesFunnelSection reduce={reduce} />
      <PoliciesIdeas reduce={reduce} />
      <PoliciesThemes reduce={reduce} />
      <PoliciesDrafts reduce={reduce} />
      <PoliciesAdopted reduce={reduce} />
      <PoliciesHowThisWorks reduce={reduce} />
      <PoliciesContribute reduce={reduce} />
      <PoliciesFinalCta reduce={reduce} />
    </div>
  );
}

function PoliciesFunnelSection({ reduce }: { reduce: ReduceMotion }) {
  return (
    <section
      id="policy-funnel"
      className="mx-auto w-full max-w-5xl scroll-mt-24 min-[880px]:scroll-mt-28"
    >
      <motion.div
        initial={reduce ? false : 'hidden'}
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="mb-8 flex flex-col gap-2"
      >
        <motion.span
          variants={revealUp}
          className="inline-flex items-center gap-2 text-sb-accent-hot"
        >
          <Filter aria-hidden className="size-4" />
          <span className="text-xs font-semibold uppercase tracking-[0.22em]">The funnel</span>
        </motion.span>
        <motion.h2
          variants={revealUp}
          className="font-display text-[clamp(1.7rem,3.2vw,2.4rem)] font-medium leading-[1.15] tracking-[-0.03em] text-sb-navy"
        >
          Four stages, deliberately narrow.
        </motion.h2>
      </motion.div>
      <PolicyFunnel />
    </section>
  );
}

function PoliciesHowThisWorks({ reduce }: { reduce: ReduceMotion }) {
  return (
    <Caveat reduce={reduce}>
      This page describes the model. The platform that runs it doesn&rsquo;t exist yet
      &mdash; what you&rsquo;re seeing are illustrative examples. We are building it openly:
      the consensus voting will use established open-source tooling, the working-group
      software will be ours, and every draft will be published under permissive licenses for
      other chapters (and other countries) to adapt. None of the people listed in the mock
      working groups are real. Real people will join real working groups once the platform
      opens; everyone whose idea contributes to a draft is credited by name (or by anonymous
      handle if they prefer).
    </Caveat>
  );
}
