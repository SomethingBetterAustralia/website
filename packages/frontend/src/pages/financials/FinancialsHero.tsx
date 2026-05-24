import { BookOpenText, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { revealUp, staggerContainer } from '@/lib/motion';
import { LAST_SYNCED, type ReduceMotion } from './FinancialsShared';

export function FinancialsHero({ reduce }: { reduce: ReduceMotion }) {
  return (
    <motion.header
      initial={reduce ? false : 'hidden'}
      animate="visible"
      variants={staggerContainer}
      className="mx-auto flex w-full max-w-5xl flex-col items-start gap-5"
    >
      <motion.span
        variants={revealUp}
        className="inline-flex items-center gap-2 text-sb-accent-hot"
      >
        <BookOpenText aria-hidden className="size-4" />
        <span className="text-xs font-semibold uppercase tracking-[0.22em]">Open books</span>
      </motion.span>
      <motion.h1
        variants={revealUp}
        className="font-display text-[clamp(2.8rem,6.5vw,4.6rem)] font-medium italic leading-[1.02] tracking-[-0.05em] text-sb-accent"
      >
        Financials.
      </motion.h1>
      <motion.blockquote
        variants={revealUp}
        className="flex w-full gap-4 border-l-4 border-sb-accent pl-4"
      >
        <p className="font-display text-[clamp(1.6rem,3.5vw,2.4rem)] font-medium italic leading-[1.15] tracking-[-0.03em] text-sb-navy">
          &ldquo;Every dollar in. Every dollar out.{' '}
          <span className="text-sb-accent-hot">Every transaction visible.</span>&rdquo;
        </p>
      </motion.blockquote>
      <motion.p
        variants={revealUp}
        className="max-w-[64ch] text-[1.05rem] leading-[1.6] text-sb-text"
      >
        Australian political parties are only legally required to disclose donations above a
        threshold, in annual returns to the Australian Electoral Commission. We publish every
        transaction, every week, through an open-source pipeline. The ledger below is the
        actual ledger &mdash; small, real, and not the version sanitised for a year-end report.
      </motion.p>
      <motion.p
        variants={revealUp}
        className="inline-flex items-center gap-2 text-sm text-sb-text-muted"
      >
        <RefreshCw aria-hidden className="size-3.5" />
        <span>Synced from Xero. Last updated: {LAST_SYNCED}.</span>
      </motion.p>
    </motion.header>
  );
}
