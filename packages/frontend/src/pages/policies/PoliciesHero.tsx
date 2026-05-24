import { GitMerge, Lightbulb, Workflow } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { revealUp, staggerContainer } from '@/lib/motion';
import { type ReduceMotion } from './PoliciesShared';

export function PoliciesHero({ reduce }: { reduce: ReduceMotion }) {
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
        <Workflow aria-hidden className="size-4" />
        <span className="text-xs font-semibold uppercase tracking-[0.22em]">Policy funnel</span>
      </motion.span>
      <motion.h1
        variants={revealUp}
        className="font-display text-[clamp(2.8rem,6.5vw,4.6rem)] font-medium italic leading-[1.02] tracking-[-0.05em] text-sb-accent"
      >
        Policy, in the open.
      </motion.h1>
      <motion.blockquote
        variants={revealUp}
        className="flex w-full gap-4 border-l-4 border-sb-accent pl-4"
      >
        <p className="font-display text-[clamp(1.6rem,3.5vw,2.4rem)] font-medium italic leading-[1.15] tracking-[-0.03em] text-sb-navy">
          &ldquo;Many ideas. Fewer themes. Fewer drafts.{' '}
          <span className="text-sb-accent-hot">Real policies.</span>&rdquo;
        </p>
      </motion.blockquote>
      <motion.p
        variants={revealUp}
        className="max-w-[60ch] text-[1.05rem] leading-[1.6] text-sb-text"
      >
        Conventional parties write policy behind closed doors. We do it in four open stages
        &mdash; anyone can submit an idea; the community clusters and votes on what matters;
        portfolio experts draft; and the party adopts only the proposals that survive all four.
        The signal we&rsquo;re chasing isn&rsquo;t what&rsquo;s popular. It&rsquo;s what the
        left and the right of our membership both end up agreeing with after looking at the
        evidence.
      </motion.p>
      <motion.p
        variants={revealUp}
        className="flex max-w-[62ch] items-start gap-2 text-sm leading-[1.6] text-sb-text-muted"
      >
        <GitMerge aria-hidden className="mt-1 size-4 shrink-0 text-sb-accent-hot" />
        <span>
          Stage 2 is modelled on{' '}
          <a
            href="https://pol.is"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-sb-accent-hot hover:underline"
          >
            Pol.is
          </a>{' '}
          &mdash; the open-source platform behind Taiwan&rsquo;s vTaiwan project, and the
          clearest demonstration we&rsquo;ve seen of surfacing statements that hold support
          across political divides. We&rsquo;re adapting the pattern; the original deserves the
          credit.
        </span>
      </motion.p>
      <motion.div
        variants={revealUp}
        className="mt-2 flex flex-col gap-3 min-[880px]:flex-row min-[880px]:items-center"
      >
        <button
          type="button"
          disabled
          title="The platform opens once we have enough members to run it well — subscribe on the home page to be notified."
          className="inline-flex items-center justify-center gap-2 rounded-full bg-sb-accent px-4 py-2 text-sm font-medium text-sb-navy transition-colors hover:bg-sb-accent-hot focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-accent disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Lightbulb aria-hidden className="size-4" />
          Submit an idea
        </button>
        <Button
          asChild
          variant="ghost"
          className="rounded-full text-sb-navy hover:bg-sb-cream-warm"
        >
          <a href="#policy-funnel">See the funnel</a>
        </Button>
      </motion.div>
    </motion.header>
  );
}
