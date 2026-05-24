import { type LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { revealUp, staggerContainer, viewportOnce } from '@/lib/motion';

export type ReduceMotion = boolean | null;

// MOCK: dashboard data until the persistence layer is built.
export const LAST_UPDATED = '20 May 2026';

export const ORG_GITHUB_URL = 'https://github.com/SomethingBetterAustralia';

export function SectionHeader({
  reduce,
  icon: Icon,
  eyebrow,
  title,
}: {
  reduce: ReduceMotion;
  icon: LucideIcon;
  eyebrow: string;
  title: string;
}) {
  return (
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
        <Icon aria-hidden className="size-4" />
        <span className="text-xs font-semibold uppercase tracking-[0.22em]">{eyebrow}</span>
      </motion.span>
      <motion.h2
        variants={revealUp}
        className="font-display text-[clamp(1.7rem,3.2vw,2.4rem)] font-medium leading-[1.15] tracking-[-0.03em] text-sb-navy"
      >
        {title}
      </motion.h2>
    </motion.div>
  );
}
