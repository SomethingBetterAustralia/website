import {
  Bell,
  FileEdit,
  Filter,
  GitMerge,
  Layers,
  Lightbulb,
  Stamp,
  Workflow,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { Button } from '@/components/ui/button';
import {
  DraftCard,
  IdeaCard,
  PolicyFunnel,
  ThemeCard,
  type DraftCardProps,
  type IdeaCardProps,
  type ThemeCardProps,
} from '@/components/policies';
import { Caveat } from '@/components/prose';
import { Link } from '@/lib/router';
import { revealUp, staggerContainer, viewportOnce } from '@/lib/motion';

type ReduceMotion = boolean | null;

// MOCK: idea-card examples until the policy platform is live.
const IDEAS: readonly IdeaCardProps[] = [
  {
    title: 'Fast-track approval for missing-middle housing in capital cities',
    excerpt:
      'State and local planning regimes are bottlenecking density between detached homes and apartment towers. A federal approval pathway tied to housing targets would unblock it.',
    upvotes: 142,
    commentCount: 38,
    tags: ['housing', 'planning'],
    authorHandle: 'Sasha O.',
    daysOpen: 5,
  },
  {
    title: 'National network of regional rail spines',
    excerpt:
      'Two or three high-speed corridors linking regional centres would shift settlement patterns away from the capital cities and decentralise growth.',
    upvotes: 98,
    commentCount: 26,
    tags: ['infrastructure', 'regional'],
    authorHandle: 'Anonymous member #117',
    daysOpen: 11,
  },
  {
    title: 'Match TAFE funding to university funding for comparable cohorts',
    excerpt:
      'Vocational education is consistently underfunded relative to universities despite producing graduates the labour market actively needs. Funding parity would close that gap.',
    upvotes: 76,
    commentCount: 19,
    tags: ['education', 'skills'],
    authorHandle: 'Hassan T.',
    daysOpen: 3,
  },
  {
    title: 'Four-year fixed federal parliamentary terms',
    excerpt:
      'Three-year terms shorten every policy horizon by definition. Four-year fixed terms would let governments commit to reforms whose payoff lies beyond the next election.',
    upvotes: 64,
    commentCount: 22,
    tags: ['governance', 'reform'],
    authorHandle: 'Lena P.',
    daysOpen: 8,
  },
];

// MOCK: theme-card examples until the policy platform is live.
const THEMES: readonly ThemeCardProps[] = [
  {
    title: 'Housing supply by federal preemption',
    summary:
      'A cluster of ideas converging on federal authority to override state and local planning obstacles where supply targets aren’t met. Includes density, modular construction, and infrastructure-linked release.',
    ideaCount: 8,
    memberCount: 142,
    consensusSignal: 'strong',
    topTags: ['housing', 'planning', 'federalism'],
  },
  {
    title: 'Regional connectivity',
    summary:
      'Rail spines, regional internet, decentralised government services. Different proposals, shared underlying idea: capitals get most things; regions get most of nothing.',
    ideaCount: 6,
    memberCount: 89,
    consensusSignal: 'moderate',
    topTags: ['regional', 'infrastructure'],
  },
  {
    title: 'Workforce strategy across health and care',
    summary:
      'Aged care, mental health, and primary care workforce shortages framed as a single national strategy rather than three separate fights.',
    ideaCount: 5,
    memberCount: 71,
    consensusSignal: 'moderate',
    topTags: ['healthcare', 'workforce'],
  },
];

// MOCK: draft-card examples until the policy platform is live.
const DRAFTS: readonly DraftCardProps[] = [
  {
    title: 'Federal housing approval pathway',
    problem:
      'Missing-middle density is structurally undersupplied because state and local planning systems are not designed to enable it at scale.',
    workingGroup: ['Sasha O.', 'Patrick W.', 'Dr. Naomi L.'],
    expertName: 'Dr. Naomi L.',
    expertBackground: 'Urban economist, 14 years at three Australian universities',
    status: 'drafting',
    openedDaysAgo: 12,
  },
  {
    title: 'Regional connectivity bill',
    problem:
      'Regional Australia bears disproportionate costs from centralisation. A coordinated rail / digital / services strategy could change the underlying economic geometry.',
    workingGroup: ['Anonymous member #117', 'Margot K.', 'Tom A.', 'Dr. Cameron R.'],
    expertName: 'Dr. Cameron R.',
    expertBackground: 'Former Infrastructure Australia senior analyst',
    status: 'forming',
    openedDaysAgo: 4,
  },
];

export function Policies() {
  const reduce = useReducedMotion();
  return (
    <div className="flex flex-col gap-16 px-6 pb-24 pt-6 min-[880px]:gap-24 min-[880px]:px-12 min-[880px]:pt-10">
      <PoliciesHero reduce={reduce} />
      <PoliciesFunnelSection reduce={reduce} />
      <PoliciesIdeas reduce={reduce} />
      <PoliciesThemes reduce={reduce} />
      <PoliciesDrafts reduce={reduce} />
      <PoliciesAdopted reduce={reduce} />
      <PoliciesHowThisWorks reduce={reduce} />
      <PoliciesCta reduce={reduce} />
    </div>
  );
}

function PoliciesHero({ reduce }: { reduce: ReduceMotion }) {
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
        domain experts draft; and the party adopts only the proposals that survive all four.
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

function PoliciesFunnelSection({ reduce }: { reduce: ReduceMotion }) {
  return (
    <section id="policy-funnel" className="mx-auto w-full max-w-5xl scroll-mt-24 min-[880px]:scroll-mt-28">
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
          <Filter aria-hidden className="size-4" />
          <span className="text-xs font-semibold uppercase tracking-[0.22em]">The funnel</span>
        </motion.span>
        <motion.h2
          variants={revealUp}
          className="font-display text-[clamp(1.7rem,3.2vw,2.4rem)] font-medium leading-[1.15] tracking-[-0.03em] text-sb-navy"
        >
          Four stages, deliberately narrow.
        </motion.h2>
      </motion.div>
      <PolicyFunnel />
    </section>
  );
}

function PoliciesIdeas({ reduce }: { reduce: ReduceMotion }) {
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
          <Lightbulb aria-hidden className="size-4" />
          <span className="text-xs font-semibold uppercase tracking-[0.22em]">
            Stage 1 &mdash; Ideas
          </span>
        </motion.span>
        <motion.h2
          variants={revealUp}
          className="font-display text-[clamp(1.7rem,3.2vw,2.4rem)] font-medium leading-[1.15] tracking-[-0.03em] text-sb-navy"
        >
          Open submission.
        </motion.h2>
      </motion.div>
      <motion.p
        initial={reduce ? false : 'hidden'}
        whileInView="visible"
        viewport={viewportOnce}
        variants={revealUp}
        className="mb-8 max-w-[64ch] text-[1.05rem] leading-[1.6] text-sb-text"
      >
        Open submission. Reddit-shape: a title, a few paragraphs, tags, upvotes, comments. The
        barrier to participate is one paragraph and a click. Most ideas live here, get a few
        votes, and gracefully retire. That&rsquo;s expected &mdash; early-stage idea triage is
        the whole point.
      </motion.p>
      <motion.ul
        role="list"
        initial={reduce ? false : 'hidden'}
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="grid list-none grid-cols-1 gap-6 p-0 min-[880px]:grid-cols-2 min-[880px]:gap-8"
      >
        {IDEAS.map((idea) => (
          <motion.li key={idea.title} variants={revealUp}>
            <IdeaCard {...idea} />
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}

function PoliciesThemes({ reduce }: { reduce: ReduceMotion }) {
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
          <Layers aria-hidden className="size-4" />
          <span className="text-xs font-semibold uppercase tracking-[0.22em]">
            Stage 2 &mdash; Themes
          </span>
        </motion.span>
        <motion.h2
          variants={revealUp}
          className="font-display text-[clamp(1.7rem,3.2vw,2.4rem)] font-medium leading-[1.15] tracking-[-0.03em] text-sb-navy"
        >
          Clusters and consensus.
        </motion.h2>
      </motion.div>
      <motion.p
        initial={reduce ? false : 'hidden'}
        whileInView="visible"
        viewport={viewportOnce}
        variants={revealUp}
        className="mb-8 max-w-[64ch] text-[1.05rem] leading-[1.6] text-sb-text"
      >
        Ideas with sustained engagement get reviewed for clustering. Similar ideas get grouped;
        the original contributors get credited. At this stage the platform switches from simple
        upvotes to agree / disagree / pass voting &mdash; the Pol.is pattern. The interesting
        signal is which themes get support from members who otherwise disagree on most things.
        Those are what we promote to drafting.
      </motion.p>
      <motion.ul
        role="list"
        initial={reduce ? false : 'hidden'}
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="grid list-none grid-cols-1 gap-6 p-0 min-[880px]:grid-cols-2 min-[880px]:gap-8"
      >
        {THEMES.map((theme) => (
          <motion.li key={theme.title} variants={revealUp}>
            <ThemeCard {...theme} />
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}

function PoliciesDrafts({ reduce }: { reduce: ReduceMotion }) {
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
          <FileEdit aria-hidden className="size-4" />
          <span className="text-xs font-semibold uppercase tracking-[0.22em]">
            Stage 3 &mdash; Drafts
          </span>
        </motion.span>
        <motion.h2
          variants={revealUp}
          className="font-display text-[clamp(1.7rem,3.2vw,2.4rem)] font-medium leading-[1.15] tracking-[-0.03em] text-sb-navy"
        >
          Experts shape the proposal.
        </motion.h2>
      </motion.div>
      <motion.p
        initial={reduce ? false : 'hidden'}
        whileInView="visible"
        viewport={viewportOnce}
        variants={revealUp}
        className="mb-8 max-w-[64ch] text-[1.05rem] leading-[1.6] text-sb-text"
      >
        Themes that survive consensus voting get handed to a working group. Every group includes
        at least one domain expert (often more), at least one community contributor from the
        originating ideas, and at least one person from a different political leaning than the
        bulk of the support. They produce a structured draft: the problem, the proposal, the
        evidence, the tradeoffs, the estimated cost, and the dissents.
      </motion.p>
      <motion.ul
        role="list"
        initial={reduce ? false : 'hidden'}
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="mx-auto flex max-w-[64ch] list-none flex-col gap-6 p-0"
      >
        {DRAFTS.map((draft) => (
          <motion.li key={draft.title} variants={revealUp}>
            <DraftCard {...draft} />
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}

function PoliciesAdopted({ reduce }: { reduce: ReduceMotion }) {
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
          <Stamp aria-hidden className="size-4" />
          <span className="text-xs font-semibold uppercase tracking-[0.22em]">
            Stage 4 &mdash; Policies
          </span>
        </motion.span>
        <motion.h2
          variants={revealUp}
          className="font-display text-[clamp(1.7rem,3.2vw,2.4rem)] font-medium leading-[1.15] tracking-[-0.03em] text-sb-navy"
        >
          Adopted, with dissent.
        </motion.h2>
      </motion.div>
      <motion.div
        initial={reduce ? false : 'hidden'}
        whileInView="visible"
        viewport={viewportOnce}
        variants={revealUp}
        className="mx-auto flex max-w-[58ch] flex-col items-center gap-4 rounded-3xl bg-sb-cream-warm/40 p-8 text-center ring-1 ring-sb-cream-warm"
      >
        <Stamp aria-hidden className="size-10 text-sb-accent-hot" />
        <h3 className="font-display text-xl font-medium leading-tight text-sb-navy">
          No policies adopted yet.
        </h3>
        <p className="text-[0.95rem] leading-[1.6] text-sb-text-muted">
          The funnel is new and so are we. First adopted policies are expected once the platform
          launches and the first drafts complete the cycle. They&rsquo;ll appear here, with the
          working group, the supporting evidence, and the dissents attached.
        </p>
      </motion.div>
    </section>
  );
}

function PoliciesHowThisWorks({ reduce }: { reduce: ReduceMotion }) {
  return (
    <Caveat reduce={reduce}>
      This page describes the model. The platform that runs it doesn&rsquo;t exist yet
      &mdash; what you&rsquo;re seeing are illustrative examples. We are building it openly:
      the consensus voting will use established open-source tooling, the working-group
      software will be ours, and every draft will be published under permissive licenses for
      other chapters (and other countries) to adapt. None of the people listed in the mock
      working groups are real. Real people will join real working groups once the platform
      opens; everyone whose idea contributes to a draft is credited by name (or by anonymous
      handle if they prefer).
    </Caveat>
  );
}

function PoliciesCta({ reduce }: { reduce: ReduceMotion }) {
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
          <Bell aria-hidden className="size-4" />
          <span className="text-xs font-semibold uppercase tracking-[0.22em]">
            Stay in the loop
          </span>
        </motion.span>
        <motion.h2
          variants={revealUp}
          className="font-display text-[clamp(1.7rem,3.2vw,2.4rem)] font-medium leading-[1.15] tracking-[-0.03em] text-sb-navy"
        >
          Subscribe.
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
          className="max-w-[58ch] text-[1.05rem] leading-[1.6] text-sb-text"
        >
          Want to be among the first to submit an idea? Subscribe on the home page &mdash; the
          policy platform opens to members when we reach a working size.
        </motion.p>
        <motion.div variants={revealUp}>
          <Button
            asChild
            className="rounded-full bg-sb-navy text-sb-cream hover:bg-sb-navy-hot focus-visible:ring-sb-accent"
          >
            <Link to="/">
              <Bell aria-hidden className="size-4" />
              Subscribe to be notified
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
