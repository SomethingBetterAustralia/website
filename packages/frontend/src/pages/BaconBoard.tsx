import {
  Bell,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  ExternalLink,
  GitBranch,
  Network,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Leaderboard,
  NetworkBloom,
  QuestCard,
  type QuestCardProps,
} from '@/components/bacon';
import { Caveat } from '@/components/prose';
import { Link } from '@/lib/router';
import { revealUp, staggerContainer, viewportOnce } from '@/lib/motion';
import { cn } from '@/lib/utils';

const BACON_REPO_URL = 'https://github.com/SomethingBetterAustralia/bacon-board';
const SLIDE_DURATION_MS = 5000;
const QUEST_DURATION_MS = 8000;

type ReduceMotion = boolean | null;

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

// MOCK: example quests until the game launches. Real quests will replace these.
const QUESTS: readonly QuestCardProps[] = [
  {
    status: 'open',
    description: 'A respected economist in regional NSW',
    reason: 'Their work on rural cost-of-living would sharpen our housing thinking.',
    endorsementsInMotion: 0,
    bestBaconNumber: null,
    daysOpen: 2,
    isMockNote: 'Example only — real quests launch with the game.',
  },
  {
    status: 'in-motion',
    description: 'A former independent MP, possibly returning',
    reason: 'We would like to hear what would make them say yes.',
    endorsementsInMotion: 14,
    bestBaconNumber: null,
    daysOpen: 9,
    isMockNote: 'Example only — real quests launch with the game.',
  },
  {
    status: 'closed-accepted',
    description: 'A leader in disability advocacy',
    reason: 'Their critique of our policy framing made us rethink the brief.',
    endorsementsInMotion: 6,
    bestBaconNumber: 4,
    daysOpen: 18,
    outcome: 'Conversation took place. The destination preferred not to be named publicly.',
    isMockNote: 'Example only — real quests launch with the game.',
  },
  {
    status: 'closed-declined',
    description: 'A senior climate scientist with policy experience',
    reason: 'Their experience translating models into policy briefs is exactly what we need on energy.',
    endorsementsInMotion: 3,
    bestBaconNumber: null,
    daysOpen: 22,
    outcome: 'Politely declined. Following our rules, no new endorsement will ever be started toward this person.',
    isMockNote: 'Example only — real quests launch with the game.',
  },
];

export function BaconBoard() {
  const reduce = useReducedMotion();
  return (
    <div className="flex flex-col gap-16 px-6 pb-24 pt-6 min-[880px]:gap-24 min-[880px]:px-12 min-[880px]:pt-10">
      <BaconHeroSection reduce={reduce} />
      <BaconLeaderboardSection reduce={reduce} />
      <BaconQuests reduce={reduce} />
      <BaconConduct reduce={reduce} />
      <BaconContribute reduce={reduce} />
      <BaconFinalCta reduce={reduce} />
    </div>
  );
}

function BaconHeroSection({ reduce }: { reduce: ReduceMotion }) {
  return (
    <section className="mx-auto w-full max-w-5xl">
      <div className="grid grid-cols-1 gap-10 min-[880px]:grid-cols-2 min-[880px]:items-start min-[880px]:gap-12">
        <BaconHeader reduce={reduce} />
        <EndorsementMechanic reduce={reduce} />
      </div>
    </section>
  );
}

function BaconHeader({ reduce }: { reduce: ReduceMotion }) {
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
        not by name — and the community uses endorsements of trusted forwards to bridge to those
        conversations. An endorsement closes when someone in the destination&rsquo;s orbit makes
        a warm introduction on our behalf, and the destination chooses to accept. No cold
        messages. No mass campaigns.
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

function EndorsementMechanic({ reduce }: { reduce: ReduceMotion }) {
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

const QUEST_CARD_WIDTH_PCT = 60;
const QUEST_INACTIVE_SCALE = 0.95;

function BaconQuests({ reduce }: { reduce: ReduceMotion }) {
  const rolodexRef = React.useRef<HTMLDivElement | null>(null);
  const inView = useInView(rolodexRef, { once: true, amount: 0.3 });
  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    if (reduce || !inView) return;
    const id = window.setInterval(
      () => setActiveIndex((i) => (i + 1) % QUESTS.length),
      QUEST_DURATION_MS,
    );
    return () => window.clearInterval(id);
  }, [reduce, inView, activeIndex]);

  return (
    <section
      id="bacon-quests"
      className="mx-auto w-full max-w-5xl scroll-mt-24 min-[880px]:scroll-mt-28"
    >
      <motion.div
        initial={reduce ? false : 'hidden'}
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="mb-2 flex flex-col gap-2"
      >
        <motion.span
          variants={revealUp}
          className="inline-flex items-center gap-2 text-sb-accent-hot"
        >
          <Sparkles aria-hidden className="size-4" />
          <span className="text-xs font-semibold uppercase tracking-[0.22em]">Quests</span>
        </motion.span>
        <motion.h2
          variants={revealUp}
          className="font-display text-[clamp(1.7rem,3.2vw,2.4rem)] font-medium leading-[1.15] tracking-[-0.03em] text-sb-navy"
        >
          What we&rsquo;d like to talk about
        </motion.h2>
      </motion.div>
      <p className="mb-6 mt-2 text-sm leading-[1.6] text-sb-text-muted">
        Open, in motion, and closed — we publish every outcome, including the declines.
      </p>

      {reduce ? (
        <ul
          role="list"
          className="grid list-none grid-cols-1 gap-6 p-0 min-[880px]:grid-cols-2 min-[880px]:gap-8"
        >
          {QUESTS.map((q) => (
            <li key={q.description}>
              <QuestCard {...q} />
            </li>
          ))}
        </ul>
      ) : (
        <>
          <ul
            role="list"
            className="grid list-none grid-cols-1 gap-6 p-0 min-[880px]:hidden"
          >
            {QUESTS.map((q) => (
              <li key={q.description}>
                <QuestCard {...q} />
              </li>
            ))}
          </ul>

          <div ref={rolodexRef} className="hidden min-[880px]:block">
            <div
              className="relative h-[24rem]"
              role="region"
              aria-roledescription="carousel"
              aria-label="Quests"
            >
              {QUESTS.map((q, i) => {
                const isActive = i === activeIndex;
                const stepPct =
                  (100 - QUEST_CARD_WIDTH_PCT) / (QUESTS.length - 1);
                const leftPct = i * stepPct;
                const z = isActive
                  ? 100
                  : i < activeIndex
                    ? i + 1
                    : QUESTS.length - i;
                return (
                  <motion.div
                    key={q.description}
                    initial={false}
                    animate={{
                      scale: isActive ? 1 : QUEST_INACTIVE_SCALE,
                      zIndex: z,
                    }}
                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    style={{
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      left: `${leftPct}%`,
                      width: `${QUEST_CARD_WIDTH_PCT}%`,
                      transformOrigin: 'center',
                    }}
                    onClick={() => setActiveIndex(i)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setActiveIndex(i);
                      }
                    }}
                    role={isActive ? undefined : 'button'}
                    tabIndex={isActive ? -1 : 0}
                    aria-label={
                      isActive ? undefined : `Show quest: ${q.description}`
                    }
                    aria-current={isActive ? 'true' : undefined}
                    className={cn(
                      'rounded-3xl',
                      !isActive &&
                        'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-accent',
                    )}
                  >
                    <QuestCard {...q} />
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setActiveIndex((i) => (i - 1 + QUESTS.length) % QUESTS.length)}
                aria-label="Previous quest"
                className="inline-flex size-9 items-center justify-center rounded-full bg-sb-cream-warm text-sb-navy transition-colors hover:bg-sb-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-accent"
              >
                <ChevronLeft aria-hidden className="size-4" />
              </button>
              <div className="flex items-center gap-2">
                {QUESTS.map((q, i) => (
                  <button
                    key={q.description}
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    aria-label={`Show quest ${i + 1}: ${q.description}`}
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
                onClick={() => setActiveIndex((i) => (i + 1) % QUESTS.length)}
                aria-label="Next quest"
                className="inline-flex size-9 items-center justify-center rounded-full bg-sb-cream-warm text-sb-navy transition-colors hover:bg-sb-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-accent"
              >
                <ChevronRight aria-hidden className="size-4" />
              </button>
            </div>

            <p className="mt-3 text-center text-xs text-sb-text-muted">
              {activeIndex + 1} of {QUESTS.length}
            </p>
          </div>
        </>
      )}
    </section>
  );
}

function BaconLeaderboardSection({ reduce }: { reduce: ReduceMotion }) {
  return (
    <section className="mx-auto w-full max-w-5xl">
      <motion.div
        initial={reduce ? false : 'hidden'}
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="mb-8 flex flex-col gap-2"
      >
        <motion.span
          variants={revealUp}
          className="inline-flex items-center gap-2 text-sb-accent-hot"
        >
          <Trophy aria-hidden className="size-4" />
          <span className="text-xs font-semibold uppercase tracking-[0.22em]">
            Top connectors
          </span>
        </motion.span>
        <motion.h2
          variants={revealUp}
          className="font-display text-[clamp(1.7rem,3.2vw,2.4rem)] font-medium leading-[1.15] tracking-[-0.03em] text-sb-navy"
        >
          The Bacon Factor
        </motion.h2>
      </motion.div>
      <Leaderboard />
    </section>
  );
}

function BaconConduct({ reduce }: { reduce: ReduceMotion }) {
  return (
    <Caveat reduce={reduce}>
      Bacon Board has firm rules. Quest destinations are described, not named, on the public
      board — their identity propagates only down the endorsement, only to the forwarders who
      need it. Endorsements never reach the destination directly; the closing forwarder, who
      knows them, makes a single warm introduction on our behalf. Even if multiple endorsements
      converge, we serialise — one introduction, not five. If a destination declines, the
      endorsement ends quietly and no new endorsement is ever started toward them. Each person
      can be a Quest exactly once. Connector names are displayed only with consent — opt
      anonymous and only SBA knows it&rsquo;s you. We will close any endorsement that crosses
      these lines, and we will remove any connector who tries.
    </Caveat>
  );
}

function BaconContribute({ reduce }: { reduce: ReduceMotion }) {
  const [copyStatus, setCopyStatus] = React.useState<'idle' | 'copied'>('idle');
  const copyTimerRef = React.useRef<number | null>(null);

  React.useEffect(
    () => () => {
      if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current);
    },
    [],
  );

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(BACON_REPO_URL);
      setCopyStatus('copied');
      if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current);
      copyTimerRef.current = window.setTimeout(() => {
        setCopyStatus('idle');
        copyTimerRef.current = null;
      }, 1500);
    } catch {
      // Leave status idle; no fallback UI at v1.
    }
  }

  return (
    <motion.section
      initial={reduce ? false : 'hidden'}
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer}
      className="mx-auto w-full max-w-5xl"
    >
      <div className="relative overflow-hidden rounded-3xl bg-sb-navy p-6 text-sb-cream shadow-[0_18px_40px_rgba(8,31,52,0.18)] ring-1 ring-sb-navy min-[880px]:p-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-sb-accent/15 mix-blend-soft-light blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-16 size-64 rounded-full bg-sb-accent-hot/15 mix-blend-soft-light blur-3xl"
        />
        <div className="relative flex flex-col gap-5">
          <motion.span
            variants={revealUp}
            className="inline-flex items-center gap-2 text-sb-accent"
          >
            <GitBranch aria-hidden className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em]">Open source</span>
          </motion.span>
          <motion.h2
            variants={revealUp}
            className="font-display text-[clamp(1.8rem,3.5vw,2.6rem)] font-medium italic leading-[1.1] tracking-[-0.04em] text-sb-accent"
          >
            Help us build it.
          </motion.h2>
          <motion.p
            variants={revealUp}
            className="max-w-[58ch] text-[1.05rem] leading-[1.6] text-sb-cream/90"
          >
            Bacon Board is open source from the first commit. We need backend engineers
            (endorsement logic, anti-abuse, the serialised-introduction queue), product designers
            (the invitation and consent flows are the hardest UX work on this project), and
            researchers (effective network reach in small countries is a real question). The
            repo is at zero — early contributors shape what this becomes.
          </motion.p>
          <motion.div variants={revealUp} className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-sb-navy-hot px-4 py-2 ring-1 ring-sb-cream/10">
              <code className="font-mono text-sm text-sb-cream">{BACON_REPO_URL}</code>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-2 rounded-full bg-sb-cream/10 px-3 py-2 text-sm font-medium text-sb-cream transition-colors hover:bg-sb-cream/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-accent"
            >
              {copyStatus === 'copied' ? (
                <>
                  <Check aria-hidden className="size-4" />
                  <span aria-live="polite">Copied</span>
                </>
              ) : (
                <>
                  <Copy aria-hidden className="size-4" />
                  <span>Copy URL</span>
                </>
              )}
            </button>
          </motion.div>
          <motion.div variants={revealUp}>
            <Button
              asChild
              className="rounded-full bg-sb-accent text-sb-navy hover:bg-sb-accent-hot focus-visible:ring-sb-accent"
            >
              <a href={BACON_REPO_URL} target="_blank" rel="noopener noreferrer">
                Open the repo
                <ExternalLink aria-hidden className="size-4" />
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

function BaconFinalCta({ reduce }: { reduce: ReduceMotion }) {
  return (
    <section className="mx-auto w-full max-w-3xl text-center">
      <motion.div
        initial={reduce ? false : 'hidden'}
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="flex flex-col items-center gap-3"
      >
        <motion.span
          variants={revealUp}
          className="inline-flex items-center gap-2 text-sb-accent-hot"
        >
          <Bell aria-hidden className="size-4" />
          <span className="text-xs font-semibold uppercase tracking-[0.22em]">
            Stay in the loop
          </span>
        </motion.span>
        <motion.p variants={revealUp} className="text-[1.05rem] leading-[1.6] text-sb-text">
          Want to play when this launches?{' '}
          <Link to="/" className="font-medium text-sb-accent-hot hover:underline">
            Subscribe on the home page.
          </Link>
        </motion.p>
      </motion.div>
    </section>
  );
}
