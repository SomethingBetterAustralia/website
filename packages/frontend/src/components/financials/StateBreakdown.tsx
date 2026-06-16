import { motion, useReducedMotion } from 'motion/react';
import { revealUp, staggerContainer, viewportOnce } from '@/lib/motion';

export interface StateBreakdownDatum {
  readonly state: string;
  readonly count: number;
}

export interface StateBreakdownProps {
  readonly data: readonly StateBreakdownDatum[];
  readonly ariaLabel: string;
}

export function StateBreakdown({ data, ariaLabel }: StateBreakdownProps) {
  const reduce = useReducedMotion();
  const sorted = [...data].sort((a, b) => b.count - a.count);
  const max = Math.max(...sorted.map((d) => d.count), 1);

  return (
    <motion.ul
      role="list"
      aria-label={ariaLabel}
      initial={reduce ? false : 'hidden'}
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer}
      className="flex list-none flex-col gap-2.5 p-0"
    >
      {sorted.map((row) => {
        const pct = (row.count / max) * 100;
        return (
          <motion.li key={row.state} variants={revealUp} className="flex items-center gap-3">
            <span className="w-12 shrink-0 font-mono text-xs uppercase tracking-[0.12em] text-sb-text-muted">
              {row.state}
            </span>
            <div className="relative h-4 flex-1 overflow-hidden rounded-full bg-sb-cream-warm/40">
              {reduce ? (
                <div
                  className="h-full rounded-full bg-sb-accent"
                  style={{ width: `${pct}%` }}
                />
              ) : (
                <motion.div
                  className="h-full rounded-full bg-sb-accent"
                  initial={{ width: '0%' }}
                  whileInView={{ width: `${pct}%` }}
                  viewport={viewportOnce}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              )}
            </div>
            <span className="w-14 shrink-0 text-right font-display text-sm font-medium text-sb-navy">
              {row.count.toLocaleString()}
            </span>
          </motion.li>
        );
      })}
    </motion.ul>
  );
}
