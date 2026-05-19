import { motion, useReducedMotion } from 'motion/react';
import { revealUp, staggerContainer, viewportOnce } from '@/lib/motion';

const cardClasses =
  'rounded-2xl border-l-[3px] border-sb-accent bg-sb-white/70 px-6 py-5 shadow-[0_1px_2px_rgba(8,31,52,0.04)] backdrop-blur-sm transition-shadow hover:shadow-[0_10px_28px_rgba(8,31,52,0.07)] [&_p]:m-0 [&_p]:text-[1.05rem] [&_p]:leading-[1.6] [&_p]:text-sb-text [&_strong]:font-bold [&_strong]:text-sb-navy';

export function Vision() {
  const reduce = useReducedMotion();
  return (
    <section className="px-6 py-16 min-[880px]:px-12 min-[880px]:py-20">
      <motion.div
        className="mx-auto grid max-w-4xl gap-4"
        initial={reduce ? false : 'hidden'}
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
      >
        <motion.div variants={revealUp} className={cardClasses}>
          <p>
            Australia deserves Something Better, a hopeful movement focused on a better way forward.
          </p>
        </motion.div>
        <motion.div variants={revealUp} className={cardClasses}>
          <p>
            <strong>Not grievance politics.</strong> Just an energetic, constructive community
            backing Australia and building a fit for purpose modern political party.
          </p>
        </motion.div>
        <motion.div variants={revealUp} className={cardClasses}>
          <p>
            <strong>We’re focused on the long term</strong>. Serious reform, clear priorities, and
            decisions that set Australia up for the next decades, not just the next election.
          </p>
        </motion.div>
        <motion.div variants={revealUp} className={cardClasses}>
          <p>
            We care less about where ideas come from, and more about whether they work and{' '}
            <strong>deliver for Australians.</strong>
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
