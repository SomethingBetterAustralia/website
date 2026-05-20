import { motion, useReducedMotion } from 'motion/react';
import { revealUp, staggerContainer } from '@/lib/motion';

const HEADLINE_WORDS = ['Something', 'Better', 'Australia'] as const;

export function Hero() {
  const reduce = useReducedMotion();
  return (
    <section className="relative overflow-hidden px-6 pb-16 pt-8 min-[880px]:px-12 min-[880px]:pb-24 min-[880px]:pt-12">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 size-[28rem] rounded-full bg-sb-accent/10 blur-3xl"
      />
      <motion.div
        className="relative mx-auto flex max-w-4xl flex-col gap-4"
        initial={reduce ? false : 'hidden'}
        animate="visible"
        variants={staggerContainer}
      >
        <motion.p
          variants={revealUp}
          className="max-w-[44ch] text-xs font-bold uppercase tracking-[0.22em] text-sb-text-muted"
        >
          <strong>
            More and more Australians are feeling politically abandoned. Let’s reinvent the wheel.
          </strong>
        </motion.p>
        <motion.h2
          variants={revealUp}
          className="font-display text-[clamp(2rem,4vw,3.1rem)] font-medium leading-[1.1] tracking-[-0.04em] text-sb-navy/80"
        >
          Join the people building
        </motion.h2>
        <motion.h1
          variants={revealUp}
          className="relative flex flex-wrap gap-x-3 font-display text-[clamp(2.8rem,7vw,5rem)] font-medium italic leading-[1.02] tracking-[-0.05em] text-sb-accent"
        >
          {HEADLINE_WORDS.map((word) => (
            <motion.span key={word} variants={revealUp} className="inline-block">
              {word}
            </motion.span>
          ))}
          <motion.span
            aria-hidden
            initial={reduce ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.6, ease: 'easeOut' }}
            className="absolute -bottom-2 left-0 h-[3px] w-2/3 origin-left rounded-full bg-sb-accent/70"
          />
        </motion.h1>
        <motion.p
          variants={revealUp}
          className="mt-2 max-w-[44ch] text-[1.05rem] font-bold italic leading-[1.5] text-sb-text"
        >
          <strong>
            <em>The grassroots movement to create Australia’s next major political party.</em>
          </strong>
        </motion.p>
      </motion.div>
    </section>
  );
}
