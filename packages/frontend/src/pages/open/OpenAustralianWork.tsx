import { Flag } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Link } from '@/lib/router';
import { revealUp, staggerContainer, viewportOnce } from '@/lib/motion';
import { type ReduceMotion } from './OpenShared';

export function OpenAustralianWork({ reduce }: { reduce: ReduceMotion }) {
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
            <Flag aria-hidden className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em]">
              Where the work is
            </span>
          </motion.span>
          <motion.h2
            variants={revealUp}
            className="font-display text-[clamp(1.8rem,3.5vw,2.6rem)] font-medium italic leading-[1.1] tracking-[-0.04em] text-sb-accent"
          >
            Start here.
          </motion.h2>
          <motion.p
            variants={revealUp}
            className="max-w-[58ch] text-[1.05rem] leading-[1.6] text-sb-cream/90"
          >
            Everything above only exists because of the work happening in Australia right
            now. If you&rsquo;d like to be part of it &mdash; as a member, a candidate, a
            contributor, or a sceptical critic &mdash; start here.
          </motion.p>
          <motion.div variants={revealUp}>
            <Button
              asChild
              className="rounded-full bg-sb-accent text-sb-navy hover:bg-sb-accent-hot focus-visible:ring-sb-accent"
            >
              <Link to="/">
                <Flag aria-hidden className="size-4" />
                Join the Australian movement
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
