import { Trophy } from 'lucide-react';
import { motion } from 'motion/react';
import { Leaderboard } from '@/components/bacon';
import { revealUp, staggerContainer, viewportOnce } from '@/lib/motion';
import { type ReduceMotion } from './BaconBoardShared';

export function BaconBoardLeaderboard({ reduce }: { reduce: ReduceMotion }) {
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
          <Trophy aria-hidden className="size-4" />
          <span className="text-xs font-semibold uppercase tracking-[0.22em]">
            Top connectors
          </span>
        </motion.span>
        <motion.h2
          variants={revealUp}
          className="font-display text-[clamp(1.7rem,3.2vw,2.4rem)] font-medium leading-[1.15] tracking-[-0.03em] text-sb-navy"
        >
          The Bacon Factor
        </motion.h2>
      </motion.div>
      <p className="mb-6 mt-2 text-sm leading-[1.6] text-sb-text-muted">
        Named, with thanks, for Kevin Bacon — the shortest path from any forwarder to a
        destination, counted in warm introductions.
      </p>
      <Leaderboard />
    </section>
  );
}
