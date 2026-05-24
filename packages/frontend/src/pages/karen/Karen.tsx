import { Radio } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { AnnotatedTranscript } from '@/components/karen';
import { Caveat } from '@/components/prose';
import { revealUp, staggerContainer, viewportOnce } from '@/lib/motion';
import { KarenContribute } from './KarenContribute';
import { KarenFinalCta } from './KarenFinalCta';
import { KarenHero } from './KarenHero';
import { type ReduceMotion } from './KarenShared';
import { KarenWhatAndHow } from './KarenWhatAndHow';

export function Karen() {
  const reduce = useReducedMotion();
  return (
    <div className="flex flex-col gap-16 px-6 pb-24 pt-6 min-[880px]:gap-24 min-[880px]:px-12 min-[880px]:pt-10">
      <KarenHero reduce={reduce} />
      <KarenTranscriptSection reduce={reduce} />
      <KarenWhatAndHow reduce={reduce} />
      <KarenNotThis reduce={reduce} />
      <KarenContribute reduce={reduce} />
      <KarenFinalCta reduce={reduce} />
    </div>
  );
}

function KarenTranscriptSection({ reduce }: { reduce: ReduceMotion }) {
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
          <Radio aria-hidden className="size-4" />
          <span className="text-xs font-semibold uppercase tracking-[0.22em]">Live demo</span>
        </motion.span>
        <motion.h2
          variants={revealUp}
          className="font-display text-[clamp(1.7rem,3.2vw,2.4rem)] font-medium leading-[1.15] tracking-[-0.03em] text-sb-navy"
        >
          What Karen does in practice
        </motion.h2>
      </motion.div>
      <AnnotatedTranscript />
    </section>
  );
}

function KarenNotThis({ reduce }: { reduce: ReduceMotion }) {
  return (
    <Caveat reduce={reduce}>
      Karen is not a judge, not a partisan tool, not a replacement for journalism, and not
      always right. She is a research assistant — fast, sourced, plural, transparent — and she
      is only as good as the prompts, sources, and people behind her. All of which you can
      see.
    </Caveat>
  );
}
