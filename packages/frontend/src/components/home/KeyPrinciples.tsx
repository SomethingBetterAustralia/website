import { Handshake, Microscope, Scale, ShieldCheck, Telescope } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { revealUp, staggerContainer, viewportOnce } from '@/lib/motion';

interface Principle {
  readonly icon: LucideIcon;
  readonly text: string;
}

const PRINCIPLES: readonly Principle[] = [
  { icon: Telescope, text: '10-year goals and visions for Australia, not election promises.' },
  { icon: Microscope, text: 'Decisions based on evidence not ideology.' },
  {
    icon: Handshake,
    text: 'Collaborative politics across the aisle for the greater good of the country.',
  },
  {
    icon: ShieldCheck,
    text: 'Valuing Australia’s prosperity, democracy and cohesion over desire to stay in power, grievances and division.',
  },
];

export function KeyPrinciples() {
  const reduce = useReducedMotion();
  return (
    <section className="bg-sb-cream-warm/40 px-6 py-20 min-[880px]:px-12">
      <div className="mx-auto max-w-5xl">
        <motion.div
          className="mb-10 flex flex-col gap-2"
          initial={reduce ? false : 'hidden'}
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
        >
          <motion.span
            variants={revealUp}
            className="inline-flex items-center gap-2 text-sb-accent-hot"
          >
            <Scale aria-hidden className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em]">
              Key principles
            </span>
          </motion.span>
          <motion.h2
            variants={revealUp}
            className="font-display text-[clamp(1.7rem,3.2vw,2.4rem)] font-medium leading-[1.15] tracking-[-0.03em] text-sb-navy"
          >
            How we&rsquo;re different.
          </motion.h2>
        </motion.div>
        <motion.ul
          className="grid list-none grid-cols-1 gap-4 p-0 min-[880px]:grid-cols-2"
          initial={reduce ? false : 'hidden'}
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
        >
          {PRINCIPLES.map((p) => {
            const Icon = p.icon;
            return (
              <motion.li
                key={p.text}
                variants={revealUp}
                className="group flex items-start gap-4 rounded-2xl bg-sb-white p-6 shadow-[0_2px_8px_rgba(8,31,52,0.05)] transition-shadow hover:shadow-[0_12px_28px_rgba(8,31,52,0.08)]"
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-sb-accent/15 text-sb-accent-hot transition-colors group-hover:bg-sb-accent/25">
                  <Icon aria-hidden className="size-6" />
                </span>
                <p className="m-0 pt-2 text-[1.05rem] leading-[1.55] text-sb-text">{p.text}</p>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
