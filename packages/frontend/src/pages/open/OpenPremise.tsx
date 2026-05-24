import { Compass } from 'lucide-react';
import { motion } from 'motion/react';
import { revealUp, staggerContainer, viewportOnce } from '@/lib/motion';
import { type ReduceMotion } from './OpenShared';

export function OpenPremise({ reduce }: { reduce: ReduceMotion }) {
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
          <Compass aria-hidden className="size-4" />
          <span className="text-xs font-semibold uppercase tracking-[0.22em]">Why open</span>
        </motion.span>
        <motion.h2
          variants={revealUp}
          className="font-display text-[clamp(1.7rem,3.2vw,2.4rem)] font-medium leading-[1.15] tracking-[-0.03em] text-sb-navy"
        >
          It&rsquo;s not just an Australian problem.
        </motion.h2>
      </motion.div>
      <motion.div
        initial={reduce ? false : 'hidden'}
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="flex flex-col gap-5"
      >
        <motion.p variants={revealUp} className="text-[1.05rem] leading-[1.65] text-sb-text">
          The political dysfunction Something Better Australia is responding to &mdash;
          short-termism, factional capture, performance over policy &mdash; isn&rsquo;t an
          Australian peculiarity. It shows up in similar shapes across the UK, the US, Canada,
          New Zealand, and parts of Europe.
        </motion.p>
        <motion.p variants={revealUp} className="text-[1.05rem] leading-[1.65] text-sb-text">
          Our response isn&rsquo;t to &lsquo;export&rsquo; anything. The problems are global;
          the solutions are local. What can travel is the methodology &mdash; how a party of
          cross-spectrum portfolio experts actually works in practice &mdash; and the tools we
          build to support it.
        </motion.p>
        <motion.p variants={revealUp} className="text-[1.05rem] leading-[1.65] text-sb-text">
          That&rsquo;s why everything we build is in the open from day one. It&rsquo;s not a
          marketing move. It&rsquo;s that a methodology only travels if others can see it,
          audit it, adapt it, and improve it.
        </motion.p>
      </motion.div>
    </section>
  );
}
