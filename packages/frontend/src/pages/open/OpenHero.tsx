import { ArrowUpRight, BookOpen, DoorOpen, GitBranch } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { revealUp, staggerContainer } from '@/lib/motion';
import { ORG_GITHUB_URL, type ReduceMotion } from './OpenShared';

export function OpenHero({ reduce }: { reduce: ReduceMotion }) {
  return (
    <motion.header
      initial={reduce ? false : 'hidden'}
      animate="visible"
      variants={staggerContainer}
      className="mx-auto flex w-full max-w-5xl flex-col items-start gap-5"
    >
      <motion.span
        variants={revealUp}
        className="inline-flex items-center gap-2 text-sb-accent-hot"
      >
        <DoorOpen aria-hidden className="size-4" />
        <span className="text-xs font-semibold uppercase tracking-[0.22em]">
          Open by default
        </span>
      </motion.span>
      <motion.h1
        variants={revealUp}
        className="font-display text-[clamp(2.8rem,6.5vw,4.6rem)] font-medium italic leading-[1.02] tracking-[-0.05em] text-sb-accent"
      >
        We&rsquo;re Open.
      </motion.h1>
      <motion.blockquote
        variants={revealUp}
        className="flex w-full gap-4 border-l-4 border-sb-accent pl-4"
      >
        <p className="font-display text-[clamp(1.6rem,3.5vw,2.4rem)] font-medium italic leading-[1.15] tracking-[-0.03em] text-sb-navy">
          &ldquo;Built local. Built open.{' '}
          <span className="text-sb-accent-hot">Take what&rsquo;s useful.</span>&rdquo;
        </p>
      </motion.blockquote>
      <motion.p
        variants={revealUp}
        className="max-w-[60ch] text-[1.05rem] leading-[1.6] text-sb-text"
      >
        Something Better Australia is being built in Australia, for Australia. But the way
        it&rsquo;s being built &mdash; the methodology, the tools, the decisions, the errata
        &mdash; is open. Other people, in other countries, are welcome to read it, copy it,
        fork it, argue with it. If any of it turns out to be useful where you are, take it. If
        you&rsquo;d like to talk, get in touch.
      </motion.p>
      <motion.p variants={revealUp} className="text-sm italic leading-[1.6] text-sb-text-muted">
        Small country. Big door.
      </motion.p>
      <motion.div
        variants={revealUp}
        className="mt-2 flex flex-col gap-3 min-[880px]:flex-row min-[880px]:items-center"
      >
        <Button
          asChild
          className="rounded-full bg-sb-accent text-sb-navy hover:bg-sb-accent-hot focus-visible:ring-sb-accent"
        >
          <a href="#open-artefacts">
            <BookOpen aria-hidden className="size-4" />
            What&rsquo;s open
          </a>
        </Button>
        <Button
          asChild
          variant="ghost"
          className="rounded-full text-sb-navy hover:bg-sb-cream-warm"
        >
          <a href={ORG_GITHUB_URL} target="_blank" rel="noopener noreferrer">
            <GitBranch aria-hidden className="size-4" />
            Read or contribute on GitHub
            <ArrowUpRight aria-hidden className="size-4" />
          </a>
        </Button>
      </motion.div>
    </motion.header>
  );
}
