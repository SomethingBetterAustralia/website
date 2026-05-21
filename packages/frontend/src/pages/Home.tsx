import { ArrowUpRight, GitBranch } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { Hero } from '@/components/home/Hero';
import { KeyPrinciples } from '@/components/home/KeyPrinciples';
import { SignupBlock } from '@/components/home/SignupBlock';
import { Vision } from '@/components/home/Vision';
import { Caveat } from '@/components/prose';
import { Button } from '@/components/ui/button';
import { revealUp, staggerContainer, viewportOnce } from '@/lib/motion';

const ORG_GITHUB_URL = 'https://github.com/SomethingBetterAustralia';

type ReduceMotion = boolean | null;

export function Home() {
  const reduce = useReducedMotion();
  return (
    <>
      <Hero />
      <Vision />
      <KeyPrinciples />
      <section className="flex flex-col gap-12 px-6 pb-20 pt-12 min-[880px]:gap-16 min-[880px]:px-12 min-[880px]:pb-24 min-[880px]:pt-16">
        <Caveat reduce={reduce}>
          This isn&rsquo;t a registration for a political party. By signing up, you&rsquo;re
          expressing interest in and supporting the development of a new political movement
          that intends to establish a future political party &mdash; and you&rsquo;re helping
          us reach the threshold to formally register one.
        </Caveat>
        <SignupBlock />
        <HelpUsBuildCta reduce={reduce} />
      </section>
    </>
  );
}

function HelpUsBuildCta({ reduce }: { reduce: ReduceMotion }) {
  return (
    <section className="mx-auto w-full max-w-3xl text-center">
      <motion.div
        initial={reduce ? false : 'hidden'}
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="flex flex-col items-center gap-4"
      >
        <motion.span
          variants={revealUp}
          className="inline-flex items-center gap-2 text-sb-accent-hot"
        >
          <GitBranch aria-hidden className="size-4" />
          <span className="text-xs font-semibold uppercase tracking-[0.22em]">
            Open source
          </span>
        </motion.span>
        <motion.h2
          variants={revealUp}
          className="font-display text-[clamp(1.7rem,3.2vw,2.4rem)] font-medium leading-[1.15] tracking-[-0.03em] text-sb-navy"
        >
          Help us build.
        </motion.h2>
        <motion.p
          variants={revealUp}
          className="max-w-[58ch] text-[1.05rem] leading-[1.6] text-sb-text"
        >
          Every project on this site is open source. Engineers, designers, researchers
          &mdash; bring what you&rsquo;ve got.
        </motion.p>
        <motion.div variants={revealUp}>
          <Button
            asChild
            className="rounded-full bg-sb-navy text-sb-cream hover:bg-sb-navy-hot focus-visible:ring-sb-accent"
          >
            <a href={ORG_GITHUB_URL} target="_blank" rel="noopener noreferrer">
              <GitBranch aria-hidden className="size-4" />
              Help us build
              <ArrowUpRight aria-hidden className="size-4" />
            </a>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
