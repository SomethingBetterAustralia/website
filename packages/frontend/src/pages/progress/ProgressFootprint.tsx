import { Flag } from 'lucide-react';
import { motion } from 'motion/react';
import { revealUp, staggerContainer, viewportOnce } from '@/lib/motion';
import { SectionHeader, type ReduceMotion } from './ProgressShared';

interface FootprintBlock {
  readonly number: string;
  readonly label: string;
  readonly body: string;
}

// MOCK: political footprint figures.
const FOOTPRINT: readonly FootprintBlock[] = [
  {
    number: '0',
    label: 'Elected officials',
    body: 'No SBA candidates currently hold elected office.',
  },
  {
    number: '0',
    label: 'Candidates running',
    body: 'No candidates currently in selection. First selection opens once membership reaches the threshold for federal party registration.',
  },
  {
    number: '89 / 151',
    label: 'Electorate coverage',
    body: 'Electorates with at least one signed-up member. Coverage is the precondition for fielding candidates federally.',
  },
];

export function ProgressFootprint({ reduce }: { reduce: ReduceMotion }) {
  return (
    <section className="mx-auto w-full max-w-5xl">
      <SectionHeader
        reduce={reduce}
        icon={Flag}
        eyebrow="Political footprint"
        title="The honest count."
      />
      <motion.ul
        role="list"
        initial={reduce ? false : 'hidden'}
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="grid list-none grid-cols-1 gap-6 p-0 min-[880px]:grid-cols-3 min-[880px]:gap-8"
      >
        {FOOTPRINT.map((b) => (
          <motion.li
            key={b.label}
            variants={revealUp}
            className="flex h-full flex-col gap-3 rounded-2xl bg-sb-white p-6 ring-1 ring-sb-cream-warm"
          >
            <span className="font-display text-[clamp(2.5rem,5vw,3.5rem)] font-medium leading-none text-sb-accent">
              {b.number}
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-sb-navy">
              {b.label}
            </span>
            <p className="text-[0.95rem] leading-[1.55] text-sb-text-muted">{b.body}</p>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
