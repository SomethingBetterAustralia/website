import { ArrowUpRight, GitBranch, MessageCircleQuestion } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { revealUp, staggerContainer } from '@/lib/motion';
import { KAREN_REPO_URL, type ReduceMotion } from './KarenShared';

export function KarenHero({ reduce }: { reduce: ReduceMotion }) {
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
        <MessageCircleQuestion aria-hidden className="size-4" />
        <span className="text-xs font-semibold uppercase tracking-[0.22em]">
          Coming soon — open source
        </span>
      </motion.span>
      <motion.h1
        variants={revealUp}
        className="font-display text-[clamp(2.8rem,6.5vw,4.6rem)] font-medium italic leading-[1.02] tracking-[-0.05em] text-sb-accent"
      >
        Meet Karen.
      </motion.h1>
      <motion.blockquote
        variants={revealUp}
        className="flex w-full gap-4 border-l-4 border-sb-accent pl-4"
      >
        <p className="font-display text-[clamp(1.6rem,3.5vw,2.4rem)] font-medium italic leading-[1.15] tracking-[-0.03em] text-sb-navy">
          &ldquo;This is a name the Internet stole from the Karens. We&rsquo;re{' '}
          <span className="text-sb-accent-hot">stealing it back</span>.&rdquo;
        </p>
      </motion.blockquote>
      <motion.p
        variants={revealUp}
        className="max-w-[58ch] text-[1.05rem] leading-[1.6] text-sb-text"
      >
        Karen is an open-source AI moderator, fact-checker, and contextualiser specialising in
        Australian politics. She listens to Question Time, fields citizen briefing requests on
        any policy topic, and tracks promises across electoral cycles. She is
        community-governed, plural by design, and built in public.
      </motion.p>
      <motion.div
        variants={revealUp}
        className="mt-2 flex flex-col gap-3 min-[880px]:flex-row min-[880px]:items-center"
      >
        <Button
          asChild
          className="rounded-full bg-sb-accent text-sb-navy hover:bg-sb-accent-hot focus-visible:ring-sb-accent"
        >
          <a href={KAREN_REPO_URL} target="_blank" rel="noopener noreferrer">
            <GitBranch aria-hidden className="size-4" />
            See Karen on GitHub
            <ArrowUpRight aria-hidden className="size-4" />
          </a>
        </Button>
        <Button
          asChild
          variant="ghost"
          className="rounded-full text-sb-navy hover:bg-sb-cream-warm"
        >
          <a href="#karen-capabilities">What she&rsquo;ll do</a>
        </Button>
      </motion.div>
    </motion.header>
  );
}
