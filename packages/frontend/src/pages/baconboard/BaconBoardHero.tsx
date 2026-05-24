import { Network } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { revealUp, staggerContainer } from '@/lib/motion';
import { type ReduceMotion } from './BaconBoardShared';

export function BaconBoardHero({ reduce }: { reduce: ReduceMotion }) {
  return (
    <motion.div
      initial={reduce ? false : 'hidden'}
      animate="visible"
      variants={staggerContainer}
      className="flex w-full flex-col items-start gap-5"
    >
      <motion.span
        variants={revealUp}
        className="inline-flex items-center gap-2 text-sb-accent-hot"
      >
        <Network aria-hidden className="size-4" />
        <span className="text-xs font-semibold uppercase tracking-[0.22em]">
          Coming soon — community prototype
        </span>
      </motion.span>
      <motion.h1
        variants={revealUp}
        className="font-display text-[clamp(2.8rem,6.5vw,4.6rem)] font-medium italic leading-[1.02] tracking-[-0.05em] text-sb-accent"
      >
        The Bacon Board.
      </motion.h1>
      <motion.blockquote
        variants={revealUp}
        className="flex w-full gap-4 border-l-4 border-sb-accent pl-4"
      >
        <p className="font-display text-[clamp(1.6rem,3.5vw,2.4rem)] font-medium italic leading-[1.15] tracking-[-0.03em] text-sb-navy">
          &ldquo;Six degrees of separation, pointed at{' '}
          <span className="text-sb-accent-hot">the people we&rsquo;d most like to talk to</span>.&rdquo;
        </p>
      </motion.blockquote>
      <motion.p
        variants={revealUp}
        className="max-w-[58ch] text-[1.05rem] leading-[1.6] text-sb-text"
      >
        Something Better Australia names conversations it would like to have — by description,
        not by name — and the community plays a game in homage to{' '}
        <a
          href="https://en.wikipedia.org/wiki/Six_Degrees_of_Kevin_Bacon"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sb-text underline underline-offset-4 hover:text-sb-text"
        >
          Six Degrees of Kevin Bacon
        </a>
        , pointed somewhere useful, to bridge to those conversations. An endorsement closes when
        someone in the destination&rsquo;s orbit makes a warm introduction on our behalf, and
        the destination chooses to accept. No cold messages. No mass campaigns.
      </motion.p>
      <motion.div
        variants={revealUp}
        className="mt-2 flex flex-col gap-3 min-[880px]:flex-row min-[880px]:items-center"
      >
        <Button
          asChild
          variant="ghost"
          className="rounded-full text-sb-navy hover:bg-sb-cream-warm"
        >
          <a href="#bacon-quests">See the open quests</a>
        </Button>
      </motion.div>
    </motion.div>
  );
}
