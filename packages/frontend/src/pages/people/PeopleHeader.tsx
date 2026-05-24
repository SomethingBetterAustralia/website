import { Users } from 'lucide-react';
import { motion } from 'motion/react';
import { revealUp, staggerContainer } from '@/lib/motion';

export function PeopleHeader({ reduce }: { reduce: boolean }) {
  return (
    <motion.header
      initial={reduce ? false : 'hidden'}
      animate="visible"
      variants={staggerContainer}
      className="flex w-full flex-col items-start gap-5"
    >
      <PeopleEyebrow />
      <PeopleHeaderBody />
    </motion.header>
  );
}

export function PeopleEyebrow() {
  return (
    <motion.span
      variants={revealUp}
      className="inline-flex items-center gap-2 text-sb-accent-hot"
    >
      <Users aria-hidden className="size-4" />
      <span className="text-xs font-semibold uppercase tracking-[0.22em]">People</span>
    </motion.span>
  );
}

export function PeopleHeaderBody() {
  return (
    <>
      <motion.h1
        variants={revealUp}
        className="font-display text-[clamp(2.8rem,6.5vw,4.6rem)] font-medium italic leading-[1.02] tracking-[-0.05em] text-sb-accent"
      >
        A team with range, not a tribe.
      </motion.h1>
      <motion.blockquote
        variants={revealUp}
        className="flex w-full gap-4 border-l-4 border-sb-accent pl-4"
      >
        <p className="font-display text-[clamp(1.6rem,3.5vw,2.4rem)] font-medium italic leading-[1.15] tracking-[-0.03em] text-sb-navy">
          &ldquo;We wouldn&rsquo;t agree on everything.{' '}
          <span className="text-sb-accent-hot">That is exactly the point.</span>&rdquo;
        </p>
      </motion.blockquote>
      <motion.p
        variants={revealUp}
        className="max-w-[60ch] text-[1.05rem] leading-[1.6] text-sb-text"
      >
        Something Better Australia is built by people who would not agree on everything if you sat
        them around a kitchen table, and that is exactly the point. We&rsquo;re transparent in where
        we sit across the major policy portfolios. Click anyone, walk the portfolios, or do both and
        you&rsquo;ll quickly see how no one really fits into a two-party system. Let&rsquo;s all
        improve our Political Literacy together.
      </motion.p>
    </>
  );
}
