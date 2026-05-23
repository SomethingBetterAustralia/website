import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  BookOpenCheck,
  Bot,
  Code2,
  Compass,
  DoorOpen,
  Eye,
  FileText,
  Flag,
  GitBranch,
  Globe,
  Network,
  Receipt,
  Scale,
  Sparkles,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { OpenSky } from '@/components/open';
import { Caveat } from '@/components/prose';
import { Link, type Route } from '@/lib/router';
import { revealUp, staggerContainer, viewportOnce } from '@/lib/motion';

// MOCK: URL not verified against an authoritative source;
// assumed to be SomethingBetterAustralia/website.
const WEBSITE_REPO_URL = 'https://github.com/SomethingBetterAustralia/website';
const ORG_GITHUB_URL = 'https://github.com/SomethingBetterAustralia';

type ReduceMotion = boolean | null;

type ArtefactRow =
  | {
      readonly kind: 'external';
      readonly icon: LucideIcon;
      readonly label: string;
      readonly body: string;
      readonly href: string;
      readonly linkLabel: string;
    }
  | {
      readonly kind: 'internal';
      readonly icon: LucideIcon;
      readonly label: string;
      readonly body: string;
      readonly route: Route;
      readonly linkLabel: string;
    }
  | {
      readonly kind: 'future';
      readonly icon: LucideIcon;
      readonly label: string;
      readonly body: string;
    };

const ARTEFACTS: readonly ArtefactRow[] = [
  {
    kind: 'external',
    icon: Code2,
    label: 'The website itself.',
    body: 'This site, including every page you’re reading, is open source.',
    href: WEBSITE_REPO_URL,
    linkLabel: 'Open repository',
  },
  {
    kind: 'internal',
    icon: Receipt,
    label: 'The financial ledger.',
    body: 'Every transaction in, every transaction out — a versioned public ledger updated weekly. Beyond what the AEC requires.',
    route: '/financials',
    linkLabel: 'See the Financials page',
  },
  {
    kind: 'internal',
    icon: BookOpenCheck,
    label: 'The leanings methodology.',
    body: 'Survey design, scoring approach, visualisation primitives — all open.',
    route: '/people',
    linkLabel: 'See the People page',
  },
  {
    kind: 'internal',
    icon: Bot,
    label: 'Karen.',
    body: 'Open-source AI moderator and contextualiser.',
    route: '/karen',
    linkLabel: 'See the Karen page',
  },
  {
    kind: 'internal',
    icon: Network,
    label: 'The Bacon Board.',
    body: 'Gamified outreach with consent and dignity baked in.',
    route: '/bacon-board',
    linkLabel: 'See the Bacon Board page',
  },
  {
    kind: 'future',
    icon: FileText,
    label: 'Decisions and errata.',
    body: 'Material decisions and corrections are documented publicly when they happen.',
  },
  {
    kind: 'future',
    icon: Scale,
    label: 'The policy process.',
    body: 'How a party of cross-spectrum experts produces policy without collapsing into the median view of its loudest faction.',
  },
];

interface OpenPersonRow {
  readonly icon: LucideIcon;
  readonly label: string;
  readonly body: string;
}

const OPEN_PEOPLE: readonly OpenPersonRow[] = [
  {
    icon: Users,
    label: 'Members.',
    body: 'Australians who want to be part of the work — bring a perspective, bring a problem, bring a sceptical eye.',
  },
  {
    icon: Flag,
    label: 'Candidates.',
    body: 'People willing to stand on policy substance, not factional theatre.',
  },
  {
    icon: GitBranch,
    label: 'Contributors.',
    body: 'Engineers, designers, researchers, writers — every artefact we publish takes outside hands to sharpen.',
  },
  {
    icon: Eye,
    label: 'Sceptical critics.',
    body: 'If you think we’re wrong, say so in public. We’ll publish corrections when you’re right.',
  },
  {
    icon: BookOpen,
    label: 'Journalists and researchers.',
    body: 'The methodology and the data are on the record. Use them, dispute them, attribute as you like.',
  },
  {
    icon: Globe,
    label: 'Friends abroad.',
    body: 'Watchers in other countries thinking about what a movement like this could look like where you are.',
  },
];

export function Open() {
  const reduce = useReducedMotion();
  return (
    <div className="flex flex-col gap-16 px-6 pb-24 pt-6 min-[880px]:gap-24 min-[880px]:px-12 min-[880px]:pt-10">
      <OpenHero reduce={reduce} />
      <OpenSkySection />
      <OpenPremise reduce={reduce} />
      <OpenArtefactsAndTravels reduce={reduce} />
      <OpenOutsideAustralia reduce={reduce} />
      <OpenAustralianWork reduce={reduce} />
      <OpenFinalCta reduce={reduce} />
    </div>
  );
}

function OpenHero({ reduce }: { reduce: ReduceMotion }) {
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
      <motion.p
        variants={revealUp}
        className="text-sm italic leading-[1.6] text-sb-text-muted"
      >
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

function OpenSkySection() {
  return (
    <section className="mx-auto w-full max-w-5xl">
      <div className="relative mx-auto w-full max-w-[820px] overflow-hidden rounded-3xl bg-sb-navy shadow-[0_18px_40px_rgba(8,31,52,0.18)] ring-1 ring-sb-navy">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-sb-accent/15 mix-blend-soft-light blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-16 size-64 rounded-full bg-sb-accent-hot/15 mix-blend-soft-light blur-3xl"
        />
        <OpenSky />
      </div>
      <p className="mx-auto mt-4 max-w-[58ch] text-center text-sm italic leading-[1.6] text-sb-text-muted">
        Working in the open, in case any of this turns out to be useful elsewhere.
      </p>
    </section>
  );
}

function OpenPremise({ reduce }: { reduce: ReduceMotion }) {
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
          <Compass aria-hidden className="size-4" />
          <span className="text-xs font-semibold uppercase tracking-[0.22em]">Why open</span>
        </motion.span>
        <motion.h2
          variants={revealUp}
          className="font-display text-[clamp(1.7rem,3.2vw,2.4rem)] font-medium leading-[1.15] tracking-[-0.03em] text-sb-navy"
        >
          It&rsquo;s not just an Australian problem.
        </motion.h2>
      </motion.div>
      <motion.div
        initial={reduce ? false : 'hidden'}
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="flex flex-col gap-5"
      >
        <motion.p
          variants={revealUp}
          className="text-[1.05rem] leading-[1.65] text-sb-text"
        >
          The political dysfunction Something Better Australia is responding to &mdash;
          short-termism, factional capture, performance over policy &mdash; isn&rsquo;t an
          Australian peculiarity. It shows up in similar shapes across the UK, the US, Canada,
          New Zealand, and parts of Europe.
        </motion.p>
        <motion.p
          variants={revealUp}
          className="text-[1.05rem] leading-[1.65] text-sb-text"
        >
          Our response isn&rsquo;t to &lsquo;export&rsquo; anything. The problems are global;
          the solutions are local. What can travel is the methodology &mdash; how a party of
          cross-spectrum portfolio experts actually works in practice &mdash; and the tools we
          build to support it.
        </motion.p>
        <motion.p
          variants={revealUp}
          className="text-[1.05rem] leading-[1.65] text-sb-text"
        >
          That&rsquo;s why everything we build is in the open from day one. It&rsquo;s not a
          marketing move. It&rsquo;s that a methodology only travels if others can see it,
          audit it, adapt it, and improve it.
        </motion.p>
      </motion.div>
    </section>
  );
}

function OpenArtefactsAndTravels({ reduce }: { reduce: ReduceMotion }) {
  return (
    <section className="mx-auto w-full max-w-5xl">
      <div className="grid grid-cols-1 gap-10 min-[880px]:grid-cols-2 min-[880px]:items-start min-[880px]:gap-12">
        <div
          id="open-artefacts"
          className="scroll-mt-24 min-[880px]:scroll-mt-28"
        >
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
              <GitBranch aria-hidden className="size-4" />
              <span className="text-xs font-semibold uppercase tracking-[0.22em]">
                What&rsquo;s open
              </span>
            </motion.span>
            <motion.h2
              variants={revealUp}
              className="font-display text-[clamp(1.7rem,3.2vw,2.4rem)] font-medium leading-[1.15] tracking-[-0.03em] text-sb-navy"
            >
              Everything we build, where it lives.
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
            {ARTEFACTS.map((row) => {
              const Icon = row.icon;
              return (
                <motion.li
                  key={row.label}
                  variants={revealUp}
                  className="flex items-start gap-4"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sb-accent/10">
                    <Icon aria-hidden className="size-5 text-sb-accent-hot" />
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <p className="font-display text-[1.05rem] font-medium text-sb-navy">
                      {row.label}
                    </p>
                    <p className="text-[1rem] leading-[1.55] text-sb-text-muted">
                      {row.body}
                      {row.kind === 'future' && (
                        <span className="italic text-sb-text-muted/80"> (coming soon)</span>
                      )}
                    </p>
                    {row.kind === 'external' && (
                      <a
                        href={row.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-fit items-center gap-1 text-sm font-medium text-sb-accent-hot hover:underline"
                      >
                        {row.linkLabel}
                        <ArrowUpRight aria-hidden className="size-3.5" />
                      </a>
                    )}
                    {row.kind === 'internal' && (
                      <Link
                        to={row.route}
                        className="inline-flex w-fit items-center gap-1 text-sm font-medium text-sb-accent-hot hover:underline"
                      >
                        {row.linkLabel}
                        <ArrowRight aria-hidden className="size-3.5" />
                      </Link>
                    )}
                  </div>
                </motion.li>
              );
            })}
          </motion.ul>
        </div>

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
                Who&rsquo;s Open
              </span>
            </motion.span>
            <motion.h2
              variants={revealUp}
              className="font-display text-[clamp(1.7rem,3.2vw,2.4rem)] font-medium leading-[1.15] tracking-[-0.03em] text-sb-navy"
            >
              Who the door is open to.
            </motion.h2>
          </motion.div>
          <motion.p
            initial={reduce ? false : 'hidden'}
            whileInView="visible"
            viewport={viewportOnce}
            variants={revealUp}
            className="mb-8 max-w-[60ch] text-[1.05rem] leading-[1.6] text-sb-text"
          >
            Open isn&rsquo;t only what we publish. It&rsquo;s who we work with &mdash; and who
            the door is open to.
          </motion.p>
          <motion.ul
            role="list"
            initial={reduce ? false : 'hidden'}
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer}
            className="flex list-none flex-col gap-6 p-0"
          >
            {OPEN_PEOPLE.map(({ icon: Icon, label, body }) => (
              <motion.li key={label} variants={revealUp} className="flex items-start gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sb-accent/10">
                  <Icon aria-hidden className="size-5 text-sb-accent-hot" />
                </span>
                <div className="flex flex-col gap-1">
                  <p className="font-display text-[1.05rem] font-medium text-sb-navy">
                    {label}
                  </p>
                  <p className="text-[1rem] leading-[1.55] text-sb-text-muted">{body}</p>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}

function OpenOutsideAustralia({ reduce }: { reduce: ReduceMotion }) {
  return (
    <Caveat reduce={reduce}>
      If you&rsquo;re reading from outside Australia and any of this resonates &mdash; as an
      organiser, a researcher, a journalist, or someone wondering what a movement like this
      could look like where you are &mdash; please get in touch. We are not running
      international chapters and we have no plans to. But we are happy to share what we&rsquo;re
      learning, send you the relevant repos, introduce you to people in our network where it
      makes sense, and learn from whatever you build. There is nothing to join from outside
      Australia yet. There is a conversation to have.
    </Caveat>
  );
}

function OpenAustralianWork({ reduce }: { reduce: ReduceMotion }) {
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
            <Flag aria-hidden className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em]">
              Where the work is
            </span>
          </motion.span>
          <motion.h2
            variants={revealUp}
            className="font-display text-[clamp(1.8rem,3.5vw,2.6rem)] font-medium italic leading-[1.1] tracking-[-0.04em] text-sb-accent"
          >
            Start here.
          </motion.h2>
          <motion.p
            variants={revealUp}
            className="max-w-[58ch] text-[1.05rem] leading-[1.6] text-sb-cream/90"
          >
            Everything above only exists because of the work happening in Australia right
            now. If you&rsquo;d like to be part of it &mdash; as a member, a candidate, a
            contributor, or a sceptical critic &mdash; start here.
          </motion.p>
          <motion.div variants={revealUp}>
            <Button
              asChild
              className="rounded-full bg-sb-accent text-sb-navy hover:bg-sb-accent-hot focus-visible:ring-sb-accent"
            >
              <Link to="/">
                <Flag aria-hidden className="size-4" />
                Join the Australian movement
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

function OpenFinalCta({ reduce }: { reduce: ReduceMotion }) {
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
          Want to know what we open next?{' '}
          <Link to="/" className="font-medium text-sb-accent-hot hover:underline">
            Subscribe on the home page.
          </Link>
        </motion.p>
      </motion.div>
    </section>
  );
}
