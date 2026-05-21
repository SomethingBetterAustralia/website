import { CalendarRange, Compass, Hammer, Lightbulb, Sunrise } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import * as React from 'react';
import { revealUp, staggerContainer, viewportOnce } from '@/lib/motion';

interface VisionCard {
  readonly icon: LucideIcon;
  readonly content: React.ReactNode;
}

const VISIONS: readonly VisionCard[] = [
  {
    icon: Sunrise,
    content: (
      <>
        Australia deserves Something Better, a hopeful movement focused on a better way forward.
      </>
    ),
  },
  {
    icon: Hammer,
    content: (
      <>
        <strong>Not grievance politics.</strong> Just an energetic, constructive community
        backing Australia and building a fit for purpose modern political party.
      </>
    ),
  },
  {
    icon: CalendarRange,
    content: (
      <>
        <strong>We&rsquo;re focused on the long term</strong>. Serious reform, clear
        priorities, and decisions that set Australia up for the next decades, not just the
        next election.
      </>
    ),
  },
  {
    icon: Lightbulb,
    content: (
      <>
        We care less about where ideas come from, and more about whether they work and{' '}
        <strong>deliver for Australians.</strong>
      </>
    ),
  },
];

const cardClasses =
  'rounded-2xl border-l-[3px] border-sb-accent bg-sb-white/70 px-6 py-5 shadow-[0_1px_2px_rgba(8,31,52,0.04)] backdrop-blur-sm transition-shadow hover:shadow-[0_10px_28px_rgba(8,31,52,0.07)] [&_p]:m-0 [&_p]:text-[1.05rem] [&_p]:leading-[1.6] [&_p]:text-sb-text [&_strong]:font-bold [&_strong]:text-sb-navy';

export function Vision() {
  const reduce = useReducedMotion();
  return (
    <section className="px-6 py-16 min-[880px]:px-12 min-[880px]:py-20">
      <motion.div
        className="mx-auto flex max-w-4xl flex-col gap-4"
        initial={reduce ? false : 'hidden'}
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
      >
        <motion.div variants={revealUp} className="mb-4 flex flex-col gap-2">
          <span className="inline-flex items-center gap-2 text-sb-accent-hot">
            <Compass aria-hidden className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em]">
              Why we exist
            </span>
          </span>
          <h2 className="font-display text-[clamp(1.7rem,3.2vw,2.4rem)] font-medium leading-[1.15] tracking-[-0.03em] text-sb-navy">
            What we&rsquo;re building toward.
          </h2>
        </motion.div>
        {VISIONS.map((v, i) => {
          const Icon = v.icon;
          return (
            <motion.div key={i} variants={revealUp} className={cardClasses}>
              <div className="flex items-start gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sb-accent/15 text-sb-accent-hot">
                  <Icon aria-hidden className="size-5" />
                </span>
                <p>{v.content}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
