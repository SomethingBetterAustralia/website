import { AtSign } from 'lucide-react';
import { motion } from 'motion/react';
import { revealUp, staggerContainer, viewportOnce } from '@/lib/motion';

type ReduceMotion = boolean | null;

export function RecognitionSocials({ reduce }: { reduce: ReduceMotion }) {
  return (
    <motion.section
      initial={reduce ? false : 'hidden'}
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer}
      className="mx-auto w-full max-w-5xl"
    >
      <div className="relative overflow-hidden rounded-3xl bg-sb-navy p-6 text-sb-cream shadow-[0_18px_40px_rgba(8,31,52,0.18)] ring-1 ring-sb-navy min-[880px]:p-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-sb-accent/15 mix-blend-soft-light blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-16 size-64 rounded-full bg-sb-accent-hot/15 mix-blend-soft-light blur-3xl"
        />
        <div className="relative flex flex-col gap-5">
          <motion.span
            variants={revealUp}
            className="inline-flex items-center gap-2 text-sb-accent"
          >
            <AtSign aria-hidden className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em]">
              Social channels
            </span>
          </motion.span>
          <motion.h2
            variants={revealUp}
            className="font-display text-[clamp(1.8rem,3.5vw,2.6rem)] font-medium italic leading-[1.1] tracking-[-0.04em] text-sb-accent"
          >
            We post in public, too.
          </motion.h2>
          <motion.p
            variants={revealUp}
            className="max-w-[58ch] text-[1.05rem] leading-[1.6] text-sb-cream/90"
          >
            Live social channels aren&rsquo;t up yet &mdash; we&rsquo;re building the work
            first and broadcasting it second. When the accounts go live, every handle will
            land here. Until then, the press coverage and supporter voices above are the
            public-facing record.
          </motion.p>
        </div>
      </div>
    </motion.section>
  );
}
