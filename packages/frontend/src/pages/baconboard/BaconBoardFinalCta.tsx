import { Bell } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from '@/lib/router';
import { revealUp, staggerContainer, viewportOnce } from '@/lib/motion';
import { type ReduceMotion } from './BaconBoardShared';

export function BaconBoardFinalCta({ reduce }: { reduce: ReduceMotion }) {
  return (
    <section className="mx-auto w-full max-w-3xl text-center">
      <motion.div
        initial={reduce ? false : 'hidden'}
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="flex flex-col items-center gap-3"
      >
        <motion.span
          variants={revealUp}
          className="inline-flex items-center gap-2 text-sb-accent-hot"
        >
          <Bell aria-hidden className="size-4" />
          <span className="text-xs font-semibold uppercase tracking-[0.22em]">
            Stay in the loop
          </span>
        </motion.span>
        <motion.p variants={revealUp} className="text-[1.05rem] leading-[1.6] text-sb-text">
          Want to play when this launches?{' '}
          <Link to="/" className="font-medium text-sb-accent-hot hover:underline">
            Subscribe on the home page.
          </Link>
        </motion.p>
      </motion.div>
    </section>
  );
}
