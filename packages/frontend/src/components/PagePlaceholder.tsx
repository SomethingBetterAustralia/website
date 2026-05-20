import { motion, useReducedMotion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { revealUp, staggerContainer } from '@/lib/motion';

export interface PagePlaceholderProps {
  title: string;
  subtitle?: string;
}

export function PagePlaceholder({
  title,
  subtitle = 'Coming soon. Watch this space.',
}: PagePlaceholderProps) {
  const reduce = useReducedMotion();
  return (
    <section className="flex min-h-[60vh] items-center justify-center px-6 pb-24 pt-12">
      <motion.div
        initial={reduce ? false : 'hidden'}
        animate="visible"
        variants={staggerContainer}
        className="flex max-w-2xl flex-col items-center gap-5 text-center"
      >
        <motion.div
          variants={revealUp}
          className="flex items-center gap-2 text-sb-accent-hot"
        >
          <Sparkles aria-hidden className="size-4" />
          <span className="text-xs font-semibold uppercase tracking-[0.22em]">
            Something Better
          </span>
        </motion.div>
        <motion.h1
          variants={revealUp}
          className="font-display text-[clamp(2.8rem,6.5vw,4.6rem)] font-medium italic leading-[1.02] tracking-[-0.05em] text-sb-accent"
        >
          {title}
        </motion.h1>
        <motion.p
          variants={revealUp}
          className="max-w-[42ch] text-[1.1rem] leading-[1.55] text-sb-text"
        >
          {subtitle}
        </motion.p>
      </motion.div>
    </section>
  );
}
