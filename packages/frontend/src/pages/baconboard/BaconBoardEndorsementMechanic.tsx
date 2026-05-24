import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion, useInView } from 'motion/react';
import * as React from 'react';
import { NetworkBloom } from '@/components/bacon';
import { revealUp, staggerContainer, viewportOnce } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { type ReduceMotion } from './BaconBoardShared';

const SLIDE_DURATION_MS = 5000;

interface Rule {
  readonly number: string;
  readonly headline: string;
  readonly body: string;
}

const RULES: readonly Rule[] = [
  {
    number: '01',
    headline: 'SBA lists a quest, by description.',
    body: 'Someone we would like to have a conversation with — described, not named, while the endorsement is in motion.',
  },
  {
    number: '02',
    headline: 'You start an endorsement.',
    body: 'From the quest page, request a private link. The link is yours, but it has five charges.',
  },
  {
    number: '03',
    headline: 'You forward to five people.',
    body: 'People you trust. People you think are closer than you are to the destination. When someone clicks your link, the system mints a new private link for them with its own five charges.',
  },
  {
    number: '04',
    headline: 'The endorsement branches outward.',
    body: 'Each forwarder learns the destination’s name when they decide to forward — so they can choose who is closer. Degrees of separation and elapsed time are tracked.',
  },
  {
    number: '05',
    headline: 'The endorsement closes through a warm introduction.',
    body: 'The closing forwarder — who personally knows the destination — makes a discreet introduction on SBA’s behalf. If the destination accepts a conversation, the endorsement is recorded and can be closed publicly. If they decline, the endorsement ends quietly. No second endorsement is ever started toward the same person.',
  },
];

export function BaconBoardEndorsementMechanic({ reduce }: { reduce: ReduceMotion }) {
  const sectionRef = React.useRef<HTMLDivElement | null>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.4 });
  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    if (reduce || !inView) return;
    const id = window.setInterval(
      () => setActiveIndex((i) => (i + 1) % RULES.length),
      SLIDE_DURATION_MS,
    );
    return () => window.clearInterval(id);
  }, [reduce, inView, activeIndex]);

  const active = RULES[activeIndex];

  return (
    <motion.div
      ref={sectionRef}
      initial={reduce ? false : 'hidden'}
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer}
      className="flex w-full flex-col gap-2 min-[880px]:pt-16"
    >
      <motion.h2
        variants={revealUp}
        className="text-center font-display text-[clamp(1.7rem,3.2vw,2.4rem)] font-medium leading-[1.15] tracking-[-0.03em] text-sb-navy"
      >
        How an Endorsement Works.
      </motion.h2>

      {reduce ? (
        <ol role="list" className="flex list-none flex-col gap-6 p-0">
          {RULES.map((r) => (
            <li key={r.number} className="flex items-start gap-5">
              <span className="font-display text-3xl font-semibold leading-none text-sb-accent min-[880px]:text-4xl">
                {r.number}
              </span>
              <div className="flex flex-col gap-1">
                <p className="font-display text-[1.05rem] font-medium leading-tight text-sb-navy min-[880px]:text-[1.15rem]">
                  {r.headline}
                </p>
                <p className="text-[0.95rem] leading-[1.6] text-sb-text-muted">{r.body}</p>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <motion.div variants={revealUp} className="flex flex-col gap-1.5">
          <div
            className="relative"
            role="region"
            aria-roledescription="carousel"
            aria-label="How an endorsement works"
          >
            <NetworkBloom />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  aria-live="polite"
                  aria-roledescription="slide"
                  aria-label={`Step ${activeIndex + 1} of ${RULES.length}`}
                  className="flex max-w-sm flex-col gap-3 p-5 min-[880px]:p-6"
                >
                  <div className="flex items-center gap-4">
                    <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-sb-white ring-1 ring-sb-cream-warm shadow-[0_2px_8px_rgba(8,31,52,0.05)]">
                      <span className="font-display text-xl font-semibold leading-none text-sb-accent">
                        {active.number}
                      </span>
                    </span>
                    <p className="flex-1 font-display text-base font-medium leading-tight text-sb-navy">
                      {active.headline}
                    </p>
                  </div>
                  <p className="pl-4 text-sm leading-[1.55] text-sb-text-muted">
                    {active.body}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-1">
            <button
              type="button"
              onClick={() =>
                setActiveIndex((i) => (i - 1 + RULES.length) % RULES.length)
              }
              aria-label="Previous step"
              className="inline-flex size-9 items-center justify-center rounded-full bg-sb-cream-warm text-sb-navy transition-colors hover:bg-sb-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-accent"
            >
              <ChevronLeft aria-hidden className="size-4" />
            </button>
            <div className="flex items-center gap-2">
              {RULES.map((r, i) => (
                <button
                  key={r.number}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Show step ${i + 1}: ${r.headline}`}
                  aria-current={i === activeIndex ? 'true' : undefined}
                  className={cn(
                    'rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-accent',
                    i === activeIndex
                      ? 'size-2.5 bg-sb-accent-hot'
                      : 'size-2 bg-sb-cream-warm hover:bg-sb-cream',
                  )}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setActiveIndex((i) => (i + 1) % RULES.length)}
              aria-label="Next step"
              className="inline-flex size-9 items-center justify-center rounded-full bg-sb-cream-warm text-sb-navy transition-colors hover:bg-sb-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-accent"
            >
              <ChevronRight aria-hidden className="size-4" />
            </button>
          </div>
        </motion.div>
      )}

      <p className="mx-auto mt-4 max-w-[58ch] text-center text-sm italic leading-[1.6] text-sb-text-muted">
        Endorsements close through warm introductions, not cold messages. Names appear only when
        the destination accepts the conversation.
      </p>
    </motion.div>
  );
}
