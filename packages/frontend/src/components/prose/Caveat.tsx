import { motion } from 'motion/react';
import * as React from 'react';
import { revealUp, viewportOnce } from '@/lib/motion';

type ReduceMotion = boolean | null;

export interface CaveatProps {
  readonly children: React.ReactNode;
  readonly reduce: ReduceMotion;
}

export function Caveat({ children, reduce }: CaveatProps) {
  return (
    <section className="mx-auto w-full max-w-3xl">
      <motion.blockquote
        initial={reduce ? false : 'hidden'}
        whileInView="visible"
        viewport={viewportOnce}
        variants={revealUp}
        className="mx-auto max-w-[62ch] border-l-4 border-sb-accent pl-5 text-lg italic leading-[1.6] text-sb-text min-[880px]:text-xl"
      >
        {children}
      </motion.blockquote>
    </section>
  );
}
