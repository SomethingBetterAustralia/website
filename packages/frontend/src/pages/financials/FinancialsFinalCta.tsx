import { Bell, HandHeart } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Link } from '@/lib/router';
import { revealUp, staggerContainer, viewportOnce } from '@/lib/motion';
import { type ReduceMotion } from './FinancialsShared';

export function FinancialsFinalCta({ reduce }: { reduce: ReduceMotion }) {
  return (
    <section className="mx-auto w-full max-w-3xl text-center">
      <motion.div
        initial={reduce ? false : 'hidden'}
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="flex flex-col items-center gap-4"
      >
        <motion.span
          variants={revealUp}
          className="inline-flex items-center gap-2 text-sb-accent-hot"
        >
          <Bell aria-hidden className="size-4" />
          <span className="text-xs font-semibold uppercase tracking-[0.22em]">
            Add to the ledger
          </span>
        </motion.span>
        <motion.h2
          variants={revealUp}
          className="font-display text-[clamp(1.7rem,3.2vw,2.4rem)] font-medium leading-[1.15] tracking-[-0.03em] text-sb-navy"
        >
          Donate.
        </motion.h2>
        <motion.p
          variants={revealUp}
          className="max-w-[58ch] text-[1.05rem] leading-[1.6] text-sb-text"
        >
          If you&rsquo;d like to add a row to this ledger, the donate page is open.
        </motion.p>
        <motion.div variants={revealUp}>
          <Button
            asChild
            className="rounded-full bg-sb-navy text-sb-cream hover:bg-sb-navy-hot focus-visible:ring-sb-accent"
          >
            <Link to="/donate">
              <HandHeart aria-hidden className="size-4" />
              Donate
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
