import { ClipboardList } from 'lucide-react';
import { motion } from 'motion/react';
import { revealUp, staggerContainer } from '@/lib/motion';

export function SurveyHeader({ reduce }: { reduce: boolean }) {
  return (
    <motion.header
      initial={reduce ? false : 'hidden'}
      animate="visible"
      variants={staggerContainer}
      className="mx-auto flex w-full max-w-3xl flex-col items-start gap-4"
    >
      <motion.span
        variants={revealUp}
        className="inline-flex items-center gap-2 text-sb-accent-hot"
      >
        <ClipboardList aria-hidden className="size-4" />
        <span className="text-xs font-semibold uppercase tracking-[0.22em]">Survey</span>
      </motion.span>
      <motion.h1
        variants={revealUp}
        className="font-display text-[clamp(2.4rem,5.5vw,3.8rem)] font-medium italic leading-[1.05] tracking-[-0.05em] text-sb-accent"
      >
        Where do you sit?
      </motion.h1>
      <motion.p
        variants={revealUp}
        className="max-w-[60ch] text-[1.05rem] leading-[1.6] text-sb-text"
      >
        Eighteen short steps. We use it to plot anonymous dots on the People page, so the team
        can see itself honestly. &ldquo;No strong view&rdquo; is a valid answer at any point.
      </motion.p>
    </motion.header>
  );
}
