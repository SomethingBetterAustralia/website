import {
  ArrowUpRight,
  Bell,
  BookOpen,
  CalendarClock,
  Check,
  ChevronLeft,
  ChevronRight,
  Compass,
  Copy,
  ExternalLink,
  GitBranch,
  LockOpen,
  MessageCircleQuestion,
  MessageSquareMore,
  Radio,
  Scale,
  Sparkles,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { AnnotatedTranscript, CapabilityCard } from '@/components/karen';
import { Caveat } from '@/components/prose';
import { Link } from '@/lib/router';
import { revealUp, staggerContainer, viewportOnce } from '@/lib/motion';
import { cn } from '@/lib/utils';

const KAREN_REPO_URL = 'https://github.com/SomethingBetterAustralia/karen';
const SLIDE_DURATION_MS = 5000;

type ReduceMotion = boolean | null;

interface Capability {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly body: string;
}

const CAPABILITIES: readonly Capability[] = [
  {
    icon: Radio,
    title: 'Live Hansard companion',
    body: 'Real-time commentary on Question Time and major debates. Karen surfaces sources, prior statements, and the historical track record of claims as they are made — not after the news cycle has moved on.',
  },
  {
    icon: BookOpen,
    title: 'Briefing on demand',
    body: 'Ask about any policy topic and get a citizen-friendly explainer with the spread of credible expert views — economists left and right, public health experts, defence analysts — with citations you can chase.',
  },
  {
    icon: CalendarClock,
    title: 'Promise tracker',
    body: 'Longitudinal accountability across electoral cycles. What was promised, what was delivered, what changed, and how the framing shifted over time.',
  },
  {
    icon: MessageSquareMore,
    title: 'Community moderator',
    body: 'Where communities invite her, Karen drops into discussion forums to add context to contested claims — never to pick winners, only to surface what is known and what is disputed.',
  },
];

interface Principle {
  readonly icon: LucideIcon;
  readonly label: string;
  readonly body: string;
}

const PRINCIPLES: readonly Principle[] = [
  {
    icon: LockOpen,
    label: 'Open source',
    body: 'every prompt, every source, every model decision is in the repo. Audit it.',
  },
  {
    icon: Scale,
    label: 'The spread, not the verdict',
    body: 'Karen surfaces credible expert views across the political spectrum and lets you decide.',
  },
  {
    icon: Compass,
    label: 'Data is not values',
    body: 'empirical claims get the evidence; values disagreements get laid out as values disagreements, not adjudicated.',
  },
  {
    icon: Users,
    label: 'Community-governed',
    body: 'endorsed by SBA, owned by no party. Errata public. Decisions documented.',
  },
];

export function Karen() {
  const reduce = useReducedMotion();
  return (
    <div className="flex flex-col gap-16 px-6 pb-24 pt-6 min-[880px]:gap-24 min-[880px]:px-12 min-[880px]:pt-10">
      <KarenHero reduce={reduce} />
      <KarenTranscriptSection reduce={reduce} />
      <KarenWhatAndHow reduce={reduce} />
      <KarenNotThis reduce={reduce} />
      <KarenContribute reduce={reduce} />
      <KarenFinalCta reduce={reduce} />
    </div>
  );
}

function KarenHero({ reduce }: { reduce: ReduceMotion }) {
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

function KarenTranscriptSection({ reduce }: { reduce: ReduceMotion }) {
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
          <Radio aria-hidden className="size-4" />
          <span className="text-xs font-semibold uppercase tracking-[0.22em]">Live demo</span>
        </motion.span>
        <motion.h2
          variants={revealUp}
          className="font-display text-[clamp(1.7rem,3.2vw,2.4rem)] font-medium leading-[1.15] tracking-[-0.03em] text-sb-navy"
        >
          What Karen does in practice
        </motion.h2>
      </motion.div>
      <AnnotatedTranscript />
    </section>
  );
}

function KarenWhatAndHow({ reduce }: { reduce: ReduceMotion }) {
  return (
    <section id="karen-capabilities" className="mx-auto w-full max-w-5xl scroll-mt-24 min-[880px]:scroll-mt-28">
      <div className="grid grid-cols-1 gap-12 min-[880px]:grid-cols-2 min-[880px]:gap-10 min-[880px]:items-start">
        <CapabilitiesPanel reduce={reduce} />
        <PrinciplesPanel reduce={reduce} />
      </div>
    </section>
  );
}

function CapabilitiesPanel({ reduce }: { reduce: ReduceMotion }) {
  const slideshowRef = React.useRef<HTMLDivElement | null>(null);
  const inView = useInView(slideshowRef, { once: true, amount: 0.4 });
  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    if (reduce || !inView) return;
    const id = window.setInterval(
      () => setActiveIndex((i) => (i + 1) % CAPABILITIES.length),
      SLIDE_DURATION_MS,
    );
    return () => window.clearInterval(id);
  }, [reduce, inView, activeIndex]);

  const active = CAPABILITIES[activeIndex];
  const ActiveIcon = active.icon;

  return (
    <div>
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
          <Sparkles aria-hidden className="size-4" />
          <span className="text-xs font-semibold uppercase tracking-[0.22em]">
            What she&rsquo;ll do
          </span>
        </motion.span>
        <motion.h2
          variants={revealUp}
          className="font-display text-[clamp(1.7rem,3.2vw,2.4rem)] font-medium leading-[1.15] tracking-[-0.03em] text-sb-navy"
        >
          Four jobs, one assistant
        </motion.h2>
      </motion.div>

      {reduce ? (
        <div className="flex flex-col gap-6">
          {CAPABILITIES.map((c) => (
            <CapabilityCard key={c.title} icon={c.icon} title={c.title} body={c.body} />
          ))}
        </div>
      ) : (
        <div
          ref={slideshowRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="What Karen will do"
        >
          <article className="relative flex min-h-[24rem] flex-col gap-4 rounded-3xl bg-sb-white p-6 shadow-[0_2px_8px_rgba(8,31,52,0.05)] ring-1 ring-sb-cream-warm min-[880px]:p-7">
            <div className="relative flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  aria-live="polite"
                  aria-roledescription="slide"
                  aria-label={`Capability ${activeIndex + 1} of ${CAPABILITIES.length}`}
                  className="flex flex-col gap-4"
                >
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-sb-accent/10">
                    <ActiveIcon aria-hidden className="size-6 text-sb-accent-hot" />
                  </span>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-display text-xl font-medium leading-tight tracking-tight text-sb-navy">
                      {active.title}
                    </h3>
                    <p className="text-[0.95rem] leading-[1.6] text-sb-text-muted">
                      {active.body}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() =>
                  setActiveIndex(
                    (i) => (i - 1 + CAPABILITIES.length) % CAPABILITIES.length,
                  )
                }
                aria-label="Previous capability"
                className="inline-flex size-9 items-center justify-center rounded-full bg-sb-cream-warm text-sb-navy transition-colors hover:bg-sb-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-accent"
              >
                <ChevronLeft aria-hidden className="size-4" />
              </button>
              <div className="flex items-center gap-2">
                {CAPABILITIES.map((c, i) => (
                  <button
                    key={c.title}
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    aria-label={`Show capability ${i + 1}: ${c.title}`}
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
                onClick={() => setActiveIndex((i) => (i + 1) % CAPABILITIES.length)}
                aria-label="Next capability"
                className="inline-flex size-9 items-center justify-center rounded-full bg-sb-cream-warm text-sb-navy transition-colors hover:bg-sb-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-accent"
              >
                <ChevronRight aria-hidden className="size-4" />
              </button>
            </div>
          </article>
        </div>
      )}
    </div>
  );
}

function PrinciplesPanel({ reduce }: { reduce: ReduceMotion }) {
  return (
    <div>
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
          <Scale aria-hidden className="size-4" />
          <span className="text-xs font-semibold uppercase tracking-[0.22em]">
            How Karen earns trust
          </span>
        </motion.span>
        <motion.h2
          variants={revealUp}
          className="font-display text-[clamp(1.7rem,3.2vw,2.4rem)] font-medium leading-[1.15] tracking-[-0.03em] text-sb-navy"
        >
          Principles
        </motion.h2>
      </motion.div>
      <motion.ul
        role="list"
        initial={reduce ? false : 'hidden'}
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="flex list-none flex-col gap-6 p-0"
      >
        {PRINCIPLES.map(({ icon: Icon, label, body }) => (
          <motion.li key={label} variants={revealUp} className="flex items-start gap-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sb-accent/10">
              <Icon aria-hidden className="size-5 text-sb-accent-hot" />
            </span>
            <p className="text-[1rem] leading-[1.55] text-sb-text">
              <span className="font-display text-[1.05rem] font-medium text-sb-navy">{label}</span>
              {' — '}
              <span className="text-sb-text">{body}</span>
            </p>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}

function KarenNotThis({ reduce }: { reduce: ReduceMotion }) {
  return (
    <Caveat reduce={reduce}>
      Karen is not a judge, not a partisan tool, not a replacement for journalism, and not
      always right. She is a research assistant — fast, sourced, plural, transparent — and she
      is only as good as the prompts, sources, and people behind her. All of which you can
      see.
    </Caveat>
  );
}

function KarenContribute({ reduce }: { reduce: ReduceMotion }) {
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
      await navigator.clipboard.writeText(KAREN_REPO_URL);
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
            Karen is built in the open.
          </motion.h2>
          <motion.p
            variants={revealUp}
            className="max-w-[58ch] text-[1.05rem] leading-[1.6] text-sb-cream/90"
          >
            Karen is open source from the first line of code. The repo is at zero — early
            contributors shape what she becomes. We need prompt engineering, source curation,
            governance frameworks, evaluation harnesses, and journalism partnerships. If you
            care about Australian political discourse and you can ship, she needs you.
          </motion.p>
          <motion.div variants={revealUp} className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-sb-navy-hot px-4 py-2 ring-1 ring-sb-cream/10">
              <code className="font-mono text-sm text-sb-cream">{KAREN_REPO_URL}</code>
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
              <a href={KAREN_REPO_URL} target="_blank" rel="noopener noreferrer">
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

function KarenFinalCta({ reduce }: { reduce: ReduceMotion }) {
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
          Want to know when Karen ships?{' '}
          <Link to="/" className="font-medium text-sb-accent-hot hover:underline">
            Subscribe on the home page.
          </Link>
        </motion.p>
      </motion.div>
    </section>
  );
}
