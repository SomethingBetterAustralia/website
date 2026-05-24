import { FileEdit } from 'lucide-react';
import { motion } from 'motion/react';
import { DraftCard, type DraftCardProps } from '@/components/policies';
import { CardFan } from '@/components/ui/CardFan';
import { revealUp, staggerContainer, viewportOnce } from '@/lib/motion';
import { type ReduceMotion } from './PoliciesShared';

// MOCK: draft-card examples until the policy platform is live.
const DRAFTS: readonly DraftCardProps[] = [
  {
    title: 'Federal housing approval pathway',
    problem:
      'Missing-middle density is structurally undersupplied because state and local planning systems are not designed to enable it at scale.',
    workingGroup: ['Sasha O.', 'Patrick W.', 'Dr. Naomi L.'],
    expertName: 'Dr. Naomi L.',
    expertBackground: 'Urban economist, 14 years at three Australian universities',
    status: 'drafting',
    openedDaysAgo: 12,
  },
  {
    title: 'Regional connectivity bill',
    problem:
      'Regional Australia bears disproportionate costs from centralisation. A coordinated rail / digital / services strategy could change the underlying economic geometry.',
    workingGroup: ['Anonymous member #117', 'Margot K.', 'Tom A.', 'Dr. Cameron R.'],
    expertName: 'Dr. Cameron R.',
    expertBackground: 'Former Infrastructure Australia senior analyst',
    status: 'forming',
    openedDaysAgo: 4,
  },
];

export function PoliciesDrafts({ reduce }: { reduce: ReduceMotion }) {
  return (
    <section className="mx-auto w-full max-w-5xl">
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
          <FileEdit aria-hidden className="size-4" />
          <span className="text-xs font-semibold uppercase tracking-[0.22em]">
            Stage 3 &mdash; Drafts
          </span>
        </motion.span>
        <motion.h2
          variants={revealUp}
          className="font-display text-[clamp(1.7rem,3.2vw,2.4rem)] font-medium leading-[1.15] tracking-[-0.03em] text-sb-navy"
        >
          Experts shape the proposal.
        </motion.h2>
      </motion.div>
      <motion.p
        initial={reduce ? false : 'hidden'}
        whileInView="visible"
        viewport={viewportOnce}
        variants={revealUp}
        className="mb-8 max-w-[64ch] text-[1.05rem] leading-[1.6] text-sb-text"
      >
        Themes that survive consensus voting get handed to a working group. Every group includes
        at least one portfolio expert (often more), at least one community contributor from the
        originating ideas, and at least one person from a different political leaning than the
        bulk of the support. They produce a structured draft: the problem, the proposal, the
        evidence, the tradeoffs, the estimated cost, and the dissents.
      </motion.p>
      <CardFan
        items={DRAFTS}
        getKey={(draft) => draft.title}
        getLabel={(draft) => draft.title}
        renderCard={(draft) => <DraftCard {...draft} />}
        ariaLabel="Stage 3 drafts"
        mobileFallback={
          <motion.ul
            role="list"
            initial={reduce ? false : 'hidden'}
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer}
            className="mx-auto flex max-w-[64ch] list-none flex-col gap-6 p-0"
          >
            {DRAFTS.map((draft) => (
              <motion.li key={draft.title} variants={revealUp}>
                <DraftCard {...draft} />
              </motion.li>
            ))}
          </motion.ul>
        }
      />
    </section>
  );
}
