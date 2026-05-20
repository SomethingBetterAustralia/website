import { BarChart3, BookOpen, Pause, Play, Scale, ScrollText, type LucideIcon } from 'lucide-react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import * as React from 'react';
import parliamentUrl from '@/assets/parliament.jpg';
import { cn } from '@/lib/utils';

interface TranscriptLine {
  readonly speaker: 'member' | 'treasurer';
  readonly text: string;
}

type AnnotationKind = 'stat' | 'history' | 'framing' | 'reading';

interface Annotation {
  readonly lineIndex: number;
  readonly kind: AnnotationKind;
  readonly body: string;
  readonly sourceLabel: string;
  readonly sourceHref: string;
}

const SPEAKER_LABELS: Record<TranscriptLine['speaker'], string> = {
  member: 'Member for Bracken Ridge',
  treasurer: 'The Treasurer',
};

const KIND_ICON: Record<AnnotationKind, LucideIcon> = {
  stat: BarChart3,
  history: ScrollText,
  framing: Scale,
  reading: BookOpen,
};

const KIND_LABEL: Record<AnnotationKind, string> = {
  stat: 'Stat check',
  history: 'Historical context',
  framing: 'Framing note',
  reading: 'Further reading',
};

const TRANSCRIPT: readonly TranscriptLine[] = [
  {
    speaker: 'member',
    text: 'Thank you, Mr Speaker. My question is to the Treasurer. The Treasurer told this House last year that household electricity bills would fall by twelve per cent under this government’s plan. Bills have not fallen. Will the Treasurer now apologise to working families?',
  },
  {
    speaker: 'treasurer',
    text: 'I thank the honourable Member for the question and assure him that this government is delivering for working Australians.',
  },
  {
    speaker: 'treasurer',
    text: 'Since coming to government we have invested record amounts in transmission infrastructure, in storage, and in firmed renewables — investments that the previous government walked away from.',
  },
  {
    speaker: 'member',
    text: 'Mr Speaker, the question was about bills, not investments. The Treasurer has answered a question he wasn’t asked.',
  },
  {
    speaker: 'treasurer',
    text: 'The honourable Member knows full well that wholesale prices have eased over the past two quarters and that the savings will flow through to retail customers in the next billing cycle.',
  },
  {
    speaker: 'member',
    text: 'When? Working families are paying more today than they were when the Treasurer made his promise.',
  },
  {
    speaker: 'treasurer',
    text: 'We make no apology for backing real engineering solutions over slogans. Australians know which side of this House actually fights for cheaper, cleaner power.',
  },
  {
    speaker: 'member',
    text: 'Mr Speaker, I direct the Treasurer to the National Energy Market data showing wholesale prices have only fallen four per cent year-on-year — not the twelve the Treasurer claimed.',
  },
  {
    speaker: 'treasurer',
    text: 'I refer the Member to the Australian Energy Regulator’s latest default offer determination, which I would suggest he read in full.',
  },
  {
    speaker: 'member',
    text: 'Mr Speaker, I have a copy of it here. I look forward to the Treasurer reading it.',
  },
];

const ANNOTATIONS: readonly Annotation[] = [
  {
    lineIndex: 0,
    kind: 'stat',
    body: 'The 12% figure cited refers to a Treasury modelling release from 2023. The most recent ABS retail electricity price index (Sep 2025 quarter) is up 4.1% year-on-year, not down 12%.',
    sourceLabel: 'ABS 6401.0 — Consumer Price Index, Sep 2025 quarter',
    sourceHref: '#',
  },
  {
    lineIndex: 2,
    kind: 'history',
    body: 'Investment in transmission has risen, but the previous government also passed firming-capacity funding in 2021 (the Capacity Investment Scheme precursor). The “walked away from” framing is contested on both sides of the House.',
    sourceLabel: 'Parliamentary Library bills digest, 2021–22',
    sourceHref: '#',
  },
  {
    lineIndex: 6,
    kind: 'framing',
    body: 'Both major parties have used “cheaper, cleaner power” as a framing device in budget-reply speeches since at least 2018. Karen surfaces this as a stock phrase, not a verdict on either side.',
    sourceLabel: 'Hansard search — budget-reply speeches 2018–2025',
    sourceHref: '#',
  },
  {
    lineIndex: 7,
    kind: 'stat',
    body: 'AEMO Q3 2025 data shows the National Electricity Market wholesale price index fell 6.8% year-on-year — between the Member’s 4% figure and the Treasurer’s 12% claim. Wholesale prices are not retail; the lag is typically 6–12 months.',
    sourceLabel: 'AEMO Quarterly Energy Dynamics, Q3 2025',
    sourceHref: '#',
  },
];

const LINE_DURATION_MS = 3500;
const ANNOTATION_DELAY_S = 0.5;
const VISIBLE_LINE_CAP = 4;

export function AnnotatedTranscript() {
  const reduce = useReducedMotion();
  return (
    <div>
      <div className="sr-only">
        <h3>Question Time excerpt with Karen&rsquo;s annotations</h3>
        <ol>
          {TRANSCRIPT.map((line, i) => {
            const a = ANNOTATIONS.find((x) => x.lineIndex === i);
            return (
              <li key={i}>
                <p>
                  <strong>{SPEAKER_LABELS[line.speaker]}:</strong> {line.text}
                </p>
                {a && (
                  <p>
                    <em>Karen — {KIND_LABEL[a.kind]}:</em> {a.body} Source: {a.sourceLabel}.
                  </p>
                )}
              </li>
            );
          })}
        </ol>
      </div>
      {reduce ? <StaticDemo /> : <AnimatedDemo />}
      <p className="mt-6 max-w-[58ch] text-sm italic leading-[1.6] text-sb-text-muted">
        Mockup. Karen does not exist yet — the repo is at the linking-and-listening stage.
        Statistics shown are illustrative.
      </p>
    </div>
  );
}

function AnimatedDemo() {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const inView = useInView(containerRef, { once: true, amount: 0.4 });
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    if (inView) setIsPlaying(true);
  }, [inView]);

  React.useEffect(() => {
    if (!isPlaying) return;
    const initialId = window.setTimeout(() => setTick((t) => Math.max(t, 1)), 600);
    const intervalId = window.setInterval(() => setTick((t) => t + 1), LINE_DURATION_MS);
    return () => {
      window.clearTimeout(initialId);
      window.clearInterval(intervalId);
    };
  }, [isPlaying]);

  const totalRevealed = tick;
  const lastIdxAbs = totalRevealed - 1;
  const cycleIndex =
    totalRevealed === 0 ? 0 : Math.floor(lastIdxAbs / TRANSCRIPT.length);
  const lineInCycle = totalRevealed === 0 ? -1 : lastIdxAbs % TRANSCRIPT.length;
  const visibleStart =
    totalRevealed === 0 ? 0 : Math.max(0, lineInCycle - (VISIBLE_LINE_CAP - 1));
  const visibleLines =
    totalRevealed === 0 ? [] : TRANSCRIPT.slice(visibleStart, lineInCycle + 1);
  const activeAnnotation =
    lineInCycle >= 0
      ? ANNOTATIONS.find((a) => a.lineIndex === lineInCycle) ?? null
      : null;

  return (
    <div ref={containerRef} aria-hidden className="relative">
      <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-sb-navy text-sb-cream shadow-[0_18px_40px_rgba(8,31,52,0.18)] ring-1 ring-sb-navy min-[880px]:aspect-video">
        <img
          src={parliamentUrl}
          alt=""
          aria-hidden
          className="absolute inset-0 size-full object-cover"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-sb-navy/40 via-sb-navy/55 to-sb-navy/90"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-sb-accent/15 mix-blend-soft-light blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-16 size-64 rounded-full bg-sb-accent-hot/15 mix-blend-soft-light blur-3xl"
        />

        <div className="relative flex h-full flex-col justify-end gap-2 p-4 min-[880px]:gap-3 min-[880px]:p-6">
          <AnimatePresence initial={false}>
            {visibleLines.map((line, i) => {
              const absoluteIdx = visibleStart + i;
              const stackPos = visibleLines.length - 1 - i;
              const opacity =
                stackPos === 0
                  ? 1
                  : stackPos === 1
                    ? 0.6
                    : stackPos === 2
                      ? 0.4
                      : 0.25;
              return (
                <motion.div
                  key={`${cycleIndex}-${absoluteIdx}`}
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className={cn(
                    'flex max-w-[80%] flex-col gap-1',
                    line.speaker === 'member'
                      ? 'items-start self-start'
                      : 'items-end self-end',
                  )}
                >
                  <span className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-sb-cream/70">
                    {SPEAKER_LABELS[line.speaker]}
                  </span>
                  <p
                    className={cn(
                      'rounded-2xl px-3 py-2 text-[0.85rem] leading-[1.45] ring-1 backdrop-blur-sm min-[880px]:px-4 min-[880px]:py-2.5 min-[880px]:text-[0.92rem]',
                      line.speaker === 'member'
                        ? 'bg-sb-cream/15 text-sb-cream ring-sb-cream/15'
                        : 'bg-sb-accent/20 text-sb-cream ring-sb-accent/30',
                    )}
                  >
                    {line.text}
                  </p>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {!isPlaying && (
            <motion.button
              key="play"
              type="button"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => setIsPlaying(true)}
              aria-label="Play the demo"
              className="absolute left-1/2 top-1/2 z-10 flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-sb-accent text-sb-navy shadow-[0_8px_24px_rgba(212,166,73,0.45)] transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sb-accent/40"
            >
              <Play aria-hidden className="size-8 translate-x-0.5 fill-current" />
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isPlaying && (
            <motion.button
              key="pause"
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPlaying(false)}
              aria-label="Pause the demo"
              className="absolute right-3 top-3 z-10 inline-flex size-9 items-center justify-center rounded-full bg-sb-cream/15 text-sb-cream backdrop-blur-sm transition-colors hover:bg-sb-cream/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-accent min-[880px]:right-4 min-[880px]:top-4"
            >
              <Pause aria-hidden className="size-4 fill-current" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        {activeAnnotation &&
          (() => {
            const Icon = KIND_ICON[activeAnnotation.kind];
            return (
              <motion.aside
                key={`${cycleIndex}-${activeAnnotation.lineIndex}`}
                initial={{ opacity: 0, x: 16 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: {
                    duration: 0.4,
                    delay: ANNOTATION_DELAY_S,
                    ease: 'easeOut',
                  },
                }}
                exit={{ opacity: 0, x: 16, transition: { duration: 0.3 } }}
                className="mt-4 w-full min-[880px]:absolute min-[880px]:-right-6 min-[880px]:top-1/2 min-[880px]:mt-0 min-[880px]:w-[18rem] min-[880px]:max-w-[18rem] min-[880px]:-translate-y-1/2"
              >
                <div className="relative rounded-2xl bg-sb-cream p-4 shadow-[0_8px_24px_rgba(8,31,52,0.18)] ring-1 ring-sb-cream-warm min-[880px]:p-5">
                  <span
                    aria-hidden
                    className="absolute -left-3 top-1/2 hidden size-3 -translate-y-1/2 rounded-full bg-sb-accent ring-2 ring-sb-cream min-[880px]:block"
                  />
                  <header className="mb-2 flex items-center gap-2">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-xl bg-sb-accent/15">
                      <Icon aria-hidden className="size-3.5 text-sb-accent-hot" />
                    </span>
                    <span className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-sb-accent-hot">
                      Karen · {KIND_LABEL[activeAnnotation.kind]}
                    </span>
                  </header>
                  <p className="text-[0.88rem] leading-[1.5] text-sb-text">
                    {activeAnnotation.body}
                  </p>
                  <a
                    href={activeAnnotation.sourceHref}
                    className="mt-2 inline-block text-xs font-medium text-sb-accent-hot hover:underline"
                  >
                    Source: {activeAnnotation.sourceLabel}
                  </a>
                </div>
              </motion.aside>
            );
          })()}
      </AnimatePresence>
    </div>
  );
}

function StaticDemo() {
  return (
    <div aria-hidden>
      <div className="relative min-h-[440px] overflow-hidden rounded-3xl bg-sb-navy text-sb-cream shadow-[0_18px_40px_rgba(8,31,52,0.18)] ring-1 ring-sb-navy">
        <img
          src={parliamentUrl}
          alt=""
          aria-hidden
          className="absolute inset-0 size-full object-cover"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-sb-navy/40 via-sb-navy/55 to-sb-navy/90"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-sb-accent/15 mix-blend-soft-light blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-16 size-64 rounded-full bg-sb-accent-hot/15 mix-blend-soft-light blur-3xl"
        />

        <div
          role="img"
          aria-label="Animation disabled by reduced-motion preference"
          className="absolute left-1/2 top-6 z-10 flex size-12 -translate-x-1/2 items-center justify-center rounded-full ring-2 ring-sb-cream/30 backdrop-blur-sm"
        >
          <Play aria-hidden className="size-5 fill-sb-cream/50 text-sb-cream/50" />
        </div>

        <div className="relative flex flex-col gap-2 p-4 pt-20 min-[880px]:gap-3 min-[880px]:p-6 min-[880px]:pt-20">
          {TRANSCRIPT.map((line, i) => (
            <div
              key={i}
              className={cn(
                'flex max-w-[80%] flex-col gap-1',
                line.speaker === 'member'
                  ? 'items-start self-start'
                  : 'items-end self-end',
              )}
            >
              <span className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-sb-cream/70">
                {SPEAKER_LABELS[line.speaker]}
              </span>
              <p
                className={cn(
                  'rounded-2xl px-3 py-2 text-[0.85rem] leading-[1.45] ring-1 backdrop-blur-sm min-[880px]:px-4 min-[880px]:py-2.5 min-[880px]:text-[0.92rem]',
                  line.speaker === 'member'
                    ? 'bg-sb-cream/15 text-sb-cream ring-sb-cream/15'
                    : 'bg-sb-accent/20 text-sb-cream ring-sb-accent/30',
                )}
              >
                {line.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 min-[880px]:grid-cols-2 min-[880px]:gap-5">
        {ANNOTATIONS.map((a) => {
          const Icon = KIND_ICON[a.kind];
          return (
            <div
              key={a.lineIndex}
              className="rounded-2xl bg-sb-cream p-4 shadow-[0_8px_24px_rgba(8,31,52,0.18)] ring-1 ring-sb-cream-warm min-[880px]:p-5"
            >
              <header className="mb-2 flex items-center gap-2">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-xl bg-sb-accent/15">
                  <Icon aria-hidden className="size-3.5 text-sb-accent-hot" />
                </span>
                <span className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-sb-accent-hot">
                  Karen · {KIND_LABEL[a.kind]}
                </span>
              </header>
              <p className="text-[0.88rem] leading-[1.5] text-sb-text">{a.body}</p>
              <a
                href={a.sourceHref}
                className="mt-2 inline-block text-xs font-medium text-sb-accent-hot hover:underline"
              >
                Source: {a.sourceLabel}
              </a>
              <p className="mt-2 text-[0.7rem] text-sb-text-muted/80">
                Triggered by {SPEAKER_LABELS[TRANSCRIPT[a.lineIndex].speaker]}&rsquo;s line.
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
