import { motion, useReducedMotion } from 'motion/react';
import { revealUp, staggerContainer, viewportOnce } from '@/lib/motion';

export function SignupCTA() {
  const reduce = useReducedMotion();
  return (
    <motion.section
      className="flex flex-col gap-[0.85rem]"
      initial={reduce ? false : 'hidden'}
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer}
    >
      <motion.h3
        variants={revealUp}
        className="mt-0 mb-2 font-display text-[clamp(1.7rem,3vw,2.4rem)] font-medium leading-[1.15] tracking-[-0.04em] text-sb-navy"
      >
        <strong>Sign up to help us build Something Better.</strong>
      </motion.h3>
      <motion.p variants={revealUp} className="m-0 text-[1.05rem] leading-[1.55] text-sb-text">
        Under section 126 of the Electoral Act, to turn this into a new Party we need:
      </motion.p>
      <motion.ul
        variants={revealUp}
        className="m-0 flex list-disc flex-col gap-1 pl-[1.4rem] text-[1.05rem] leading-[1.55] text-sb-text marker:text-sb-accent"
      >
        <li>
          1,500 members <u>OR</u>
        </li>
        <li>one MP come on board.</li>
      </motion.ul>
      <motion.p
        variants={revealUp}
        className="mt-3 mb-0 text-[0.78rem] leading-[1.3] text-sb-text-muted"
      >
        <span className="underline decoration-sb-accent decoration-1 underline-offset-2">
          *This is not a registration for a political party.
        </span>{' '}
        By signing up, you are expressing interest in and supporting the development of a new
        political movement that intends to establish a future political party.
      </motion.p>
    </motion.section>
  );
}
