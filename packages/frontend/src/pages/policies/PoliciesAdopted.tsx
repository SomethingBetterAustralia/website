import { Stamp } from 'lucide-react';
import { motion } from 'motion/react';
import { revealUp, staggerContainer, viewportOnce } from '@/lib/motion';
import { type ReduceMotion } from './PoliciesShared';

export function PoliciesAdopted({ reduce }: { reduce: ReduceMotion }) {
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
          <Stamp aria-hidden className="size-4" />
          <span className="text-xs font-semibold uppercase tracking-[0.22em]">
            Stage 4 &mdash; Policies
          </span>
        </motion.span>
        <motion.h2
          variants={revealUp}
          className="font-display text-[clamp(1.7rem,3.2vw,2.4rem)] font-medium leading-[1.15] tracking-[-0.03em] text-sb-navy"
        >
          Adopted, dissents and all.
        </motion.h2>
      </motion.div>
      <motion.p
        initial={reduce ? false : 'hidden'}
        whileInView="visible"
        viewport={viewportOnce}
        variants={revealUp}
        className="mb-8 max-w-[64ch] text-[1.05rem] leading-[1.6] text-sb-text"
      >
        Drafts that complete review become party policy. When a draft is adopted, the full
        record is published with it &mdash; the working group, the evidence base, and the
        dissenting views from members who didn&rsquo;t sign on. Policies stay open to revision
        as new evidence comes in. Adoption is the start of a position, not the end of the
        conversation.
      </motion.p>
      <motion.div
        initial={reduce ? false : 'hidden'}
        whileInView="visible"
        viewport={viewportOnce}
        variants={revealUp}
        className="mx-auto flex max-w-[58ch] flex-col items-center gap-4 rounded-3xl bg-sb-cream-warm/40 p-8 text-center ring-1 ring-sb-cream-warm"
      >
        <Stamp aria-hidden className="size-10 text-sb-accent-hot" />
        <h3 className="font-display text-xl font-medium leading-tight text-sb-navy">
          No policies adopted yet.
        </h3>
        <p className="text-[0.95rem] leading-[1.6] text-sb-text-muted">
          The funnel is new and so are we. First adopted policies are expected once the platform
          launches and the first drafts complete the cycle. They&rsquo;ll appear here, with the
          working group, the supporting evidence, and the dissents attached.
        </p>
      </motion.div>
    </section>
  );
}
