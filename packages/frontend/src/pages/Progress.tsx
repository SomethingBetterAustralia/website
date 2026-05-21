import {
  ArrowRight,
  Bell,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  Flag,
  Gauge,
  GitBranch,
  GitFork,
  GitPullRequest,
  HandHeart,
  HeartHandshake,
  LineChart as LineChartIcon,
  Lightbulb,
  MapPin,
  Network,
  Newspaper,
  RefreshCw,
  Sparkles,
  Star,
  Users,
  Workflow,
  type LucideIcon,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { PolicyFunnel } from '@/components/policies';
import {
  BarChart,
  LineChart,
  StateBreakdown,
  StatCard,
  type BarChartDatum,
  type LineChartDatum,
  type StatCardProps,
  type StateBreakdownDatum,
} from '@/components/progress';
import { Caveat } from '@/components/prose';
import { Link } from '@/lib/router';
import { revealUp, staggerContainer, viewportOnce } from '@/lib/motion';
import { cn } from '@/lib/utils';

type ReduceMotion = boolean | null;

// MOCK: dashboard data until the persistence layer is built.
const LAST_UPDATED = '20 May 2026';

// MOCK: KPI grid values.
const KPIS: readonly StatCardProps[] = [
  {
    icon: Users,
    label: 'Members',
    value: '1,247',
    trend: { direction: 'up', label: '+184 this month' },
    link: { to: '/' },
  },
  {
    icon: MapPin,
    label: 'Electorates covered',
    value: '89',
    subText: 'of 151 federal',
    trend: { direction: 'up', label: '+12 this month' },
  },
  {
    icon: ClipboardCheck,
    label: 'Survey responses',
    value: '73',
    subText: 'leanings survey',
    link: { to: '/people' },
  },
  {
    icon: HandHeart,
    label: 'Volunteer hours',
    value: '384',
    subText: 'this month',
    trend: { direction: 'up', label: '+92' },
  },
  {
    icon: Lightbulb,
    label: 'Policy ideas open',
    value: '47',
    link: { to: '/policies' },
  },
  {
    icon: GitBranch,
    label: 'GitHub stars',
    value: '142',
    subText: 'across all repos',
  },
  {
    icon: HeartHandshake,
    label: 'Donations',
    value: '$4,820',
    subText: 'total raised',
  },
  {
    icon: Newspaper,
    label: 'Press articles',
    value: '8',
    link: { to: '/recognition' },
  },
];

// MOCK: 20-point weekly hockey-stick.
const MEMBER_SERIES: readonly LineChartDatum[] = [
  { date: '3 Jan 2026', value: 0 },
  { date: '10 Jan 2026', value: 1 },
  { date: '17 Jan 2026', value: 2 },
  { date: '24 Jan 2026', value: 6 },
  { date: '31 Jan 2026', value: 12 },
  { date: '7 Feb 2026', value: 23 },
  { date: '14 Feb 2026', value: 45 },
  { date: '21 Feb 2026', value: 78 },
  { date: '28 Feb 2026', value: 124 },
  { date: '7 Mar 2026', value: 198 },
  { date: '14 Mar 2026', value: 290 },
  { date: '21 Mar 2026', value: 405 },
  { date: '28 Mar 2026', value: 524 },
  { date: '4 Apr 2026', value: 658 },
  { date: '11 Apr 2026', value: 750 },
  { date: '18 Apr 2026', value: 879 },
  { date: '25 Apr 2026', value: 956 },
  { date: '2 May 2026', value: 1058 },
  { date: '9 May 2026', value: 1149 },
  { date: '20 May 2026', value: 1247 },
];

// MOCK: members by state.
const STATE_DATA: readonly StateBreakdownDatum[] = [
  { state: 'NSW', count: 412 },
  { state: 'VIC', count: 318 },
  { state: 'QLD', count: 218 },
  { state: 'WA', count: 117 },
  { state: 'SA', count: 89 },
  { state: 'TAS', count: 41 },
  { state: 'ACT', count: 38 },
  { state: 'NT', count: 14 },
];

interface FootprintBlock {
  readonly number: string;
  readonly label: string;
  readonly body: string;
}

// MOCK: political footprint figures.
const FOOTPRINT: readonly FootprintBlock[] = [
  {
    number: '0',
    label: 'Elected officials',
    body: 'No SBA candidates currently hold elected office.',
  },
  {
    number: '0',
    label: 'Candidates running',
    body: 'No candidates currently in selection. First selection opens once membership reaches the threshold for federal party registration.',
  },
  {
    number: '89 / 151',
    label: 'Electorate coverage',
    body: 'Electorates with at least one signed-up member. Coverage is the precondition for fielding candidates federally.',
  },
];

// MOCK: 6 trailing months of donations.
const DONATION_DATA: readonly BarChartDatum[] = [
  { label: 'Dec', value: 0 },
  { label: 'Jan', value: 0 },
  { label: 'Feb', value: 420 },
  { label: 'Mar', value: 980 },
  { label: 'Apr', value: 1420 },
  { label: 'May', value: 2000 },
];

// MOCK: open-source mini-stats.
const OS_STATS: readonly StatCardProps[] = [
  { icon: Star, label: 'Stars', value: '142' },
  { icon: GitFork, label: 'Forks', value: '23' },
  { icon: GitPullRequest, label: 'Merged PRs', value: '37' },
  { icon: Users, label: 'Contributors', value: '14' },
];

interface EventEntry {
  readonly date: string;
  readonly name: string;
  readonly body: string;
  readonly attendance: number;
}

// MOCK: events to date.
const EVENTS: readonly EventEntry[] = [
  {
    date: '2 May 2026',
    name: 'Launch announcement',
    body: 'Sydney inner west',
    attendance: 64,
  },
  {
    date: '9 May 2026',
    name: 'Members Q&A (Zoom)',
    body: 'Online',
    attendance: 142,
  },
  {
    date: '18 May 2026',
    name: 'Policy roundtable: housing',
    body: 'Melbourne CBD',
    attendance: 28,
  },
];

interface BaconStatRow {
  readonly icon: LucideIcon;
  readonly label: string;
  readonly value: number;
}

// MOCK: Bacon Board status totals.
const BACON_STATUS: readonly BaconStatRow[] = [
  { icon: Sparkles, label: 'Open quests', value: 2 },
  { icon: Network, label: 'In motion', value: 1 },
  { icon: CheckCircle2, label: 'Closed', value: 1 },
];

const ORG_GITHUB_URL = 'https://github.com/SomethingBetterAustralia';

export function Progress() {
  const reduce = useReducedMotion();
  return (
    <div className="flex flex-col gap-16 px-6 pb-24 pt-6 min-[880px]:gap-24 min-[880px]:px-12 min-[880px]:pt-10">
      <ProgressHero reduce={reduce} />
      <ProgressKpis reduce={reduce} />
      <ProgressMembership reduce={reduce} />
      <ProgressFootprint reduce={reduce} />
      <ProgressPipeline reduce={reduce} />
      <ProgressSupport reduce={reduce} />
      <ProgressOpenSource reduce={reduce} />
      <ProgressEngagement reduce={reduce} />
      <ProgressCaveat reduce={reduce} />
      <ProgressCta reduce={reduce} />
    </div>
  );
}

function ProgressHero({ reduce }: { reduce: ReduceMotion }) {
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
        <LineChartIcon aria-hidden className="size-4" />
        <span className="text-xs font-semibold uppercase tracking-[0.22em]">
          Progress dashboard
        </span>
      </motion.span>
      <motion.h1
        variants={revealUp}
        className="font-display text-[clamp(2.8rem,6.5vw,4.6rem)] font-medium italic leading-[1.02] tracking-[-0.05em] text-sb-accent"
      >
        Progress.
      </motion.h1>
      <motion.blockquote
        variants={revealUp}
        className="flex w-full gap-4 border-l-4 border-sb-accent pl-4"
      >
        <p className="font-display text-[clamp(1.6rem,3.5vw,2.4rem)] font-medium italic leading-[1.15] tracking-[-0.03em] text-sb-navy">
          &ldquo;Every number is real. Most of them are small.{' '}
          <span className="text-sb-accent-hot">All of them count.</span>&rdquo;
        </p>
      </motion.blockquote>
      <motion.p
        variants={revealUp}
        className="max-w-[60ch] text-[1.05rem] leading-[1.6] text-sb-text"
      >
        This page shows where the movement actually is, without dressing it up. Some numbers
        are encouraging. Some are zero. All are dated.
      </motion.p>
      <motion.p
        variants={revealUp}
        className="inline-flex items-center gap-2 text-sm text-sb-text-muted"
      >
        <RefreshCw aria-hidden className="size-3.5" />
        <span>Updated weekly. Last updated: {LAST_UPDATED}.</span>
      </motion.p>
    </motion.header>
  );
}

function SectionHeader({
  reduce,
  icon: Icon,
  eyebrow,
  title,
}: {
  reduce: ReduceMotion;
  icon: LucideIcon;
  eyebrow: string;
  title: string;
}) {
  return (
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
        <Icon aria-hidden className="size-4" />
        <span className="text-xs font-semibold uppercase tracking-[0.22em]">{eyebrow}</span>
      </motion.span>
      <motion.h2
        variants={revealUp}
        className="font-display text-[clamp(1.7rem,3.2vw,2.4rem)] font-medium leading-[1.15] tracking-[-0.03em] text-sb-navy"
      >
        {title}
      </motion.h2>
    </motion.div>
  );
}

function ProgressKpis({ reduce }: { reduce: ReduceMotion }) {
  return (
    <section className="mx-auto w-full max-w-5xl">
      <SectionHeader
        reduce={reduce}
        icon={Gauge}
        eyebrow="At a glance"
        title="Where things stand right now."
      />
      <motion.ul
        role="list"
        initial={reduce ? false : 'hidden'}
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="grid list-none grid-cols-1 gap-4 p-0 min-[640px]:grid-cols-2 min-[880px]:grid-cols-4 min-[880px]:gap-5"
      >
        {KPIS.map((kpi) => (
          <motion.li key={kpi.label} variants={revealUp}>
            <StatCard {...kpi} />
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}

function ProgressMembership({ reduce }: { reduce: ReduceMotion }) {
  return (
    <section className="mx-auto w-full max-w-5xl">
      <SectionHeader
        reduce={reduce}
        icon={Users}
        eyebrow="Membership"
        title="Members over time, by state."
      />
      <div className="grid grid-cols-1 gap-8 min-[880px]:grid-cols-2 min-[880px]:items-start min-[880px]:gap-10">
        <div>
          <p className="mb-3 font-display text-base font-medium text-sb-navy">
            Members over time
          </p>
          <LineChart
            data={MEMBER_SERIES}
            ariaLabel="Weekly member count over 20 weeks."
          />
          <p className="mt-3 text-xs leading-[1.55] text-sb-text-muted">
            Subscribers to the home page signup, not all of whom will translate to formal
            members once registration opens. Counted weekly.
          </p>
        </div>
        <div>
          <p className="mb-3 font-display text-base font-medium text-sb-navy">
            Where members are
          </p>
          <StateBreakdown
            data={STATE_DATA}
            ariaLabel="Members by state and territory."
          />
          <p className="mt-3 text-xs leading-[1.55] text-sb-text-muted">
            By stated state on signup. Members without a stated state are not shown.
          </p>
        </div>
      </div>
    </section>
  );
}

function ProgressFootprint({ reduce }: { reduce: ReduceMotion }) {
  return (
    <section className="mx-auto w-full max-w-5xl">
      <SectionHeader
        reduce={reduce}
        icon={Flag}
        eyebrow="Political footprint"
        title="The honest count."
      />
      <motion.ul
        role="list"
        initial={reduce ? false : 'hidden'}
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="grid list-none grid-cols-1 gap-6 p-0 min-[880px]:grid-cols-3 min-[880px]:gap-8"
      >
        {FOOTPRINT.map((b) => (
          <motion.li
            key={b.label}
            variants={revealUp}
            className="flex h-full flex-col gap-3 rounded-2xl bg-sb-white p-6 ring-1 ring-sb-cream-warm"
          >
            <span className="font-display text-[clamp(2.5rem,5vw,3.5rem)] font-medium leading-none text-sb-accent">
              {b.number}
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-sb-navy">
              {b.label}
            </span>
            <p className="text-[0.95rem] leading-[1.55] text-sb-text-muted">{b.body}</p>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}

function ProgressPipeline({ reduce }: { reduce: ReduceMotion }) {
  return (
    <section className="mx-auto w-full max-w-5xl">
      <SectionHeader
        reduce={reduce}
        icon={Workflow}
        eyebrow="Policy pipeline"
        title="Where ideas are in the funnel."
      />
      <p className="mb-8 max-w-[60ch] text-[1.05rem] leading-[1.6] text-sb-text-muted">
        Snapshot of the funnel &mdash; see{' '}
        <Link
          to="/policies"
          className="font-medium text-sb-accent-hot hover:underline"
        >
          /policies
        </Link>{' '}
        for the model.
      </p>
      <PolicyFunnel />
      <p className="mt-6">
        <Link
          to="/policies"
          className="inline-flex items-center gap-1 text-sm font-medium text-sb-accent-hot hover:underline"
        >
          Read the full process
          <ArrowRight aria-hidden className="size-3.5" />
        </Link>
      </p>
    </section>
  );
}

function ProgressSupport({ reduce }: { reduce: ReduceMotion }) {
  return (
    <section className="mx-auto w-full max-w-5xl">
      <SectionHeader
        reduce={reduce}
        icon={HeartHandshake}
        eyebrow="Support"
        title="Donations to date."
      />
      <div className="grid grid-cols-1 gap-8 min-[880px]:grid-cols-2 min-[880px]:items-start min-[880px]:gap-10">
        <div>
          <p className="mb-3 font-display text-base font-medium text-sb-navy">
            Donations by month
          </p>
          <BarChart
            data={DONATION_DATA}
            ariaLabel="Donations by month, in Australian dollars."
            valueFormatter={(v) => `$${v.toLocaleString()}`}
          />
        </div>
        <div className="flex flex-col gap-4">
          <p className="max-w-[40ch] text-[1.05rem] leading-[1.6] text-sb-text">
            $4,820 raised to date. All small donations from individuals; no institutional
            backers.
          </p>
          <p className="max-w-[40ch] text-[1.05rem] leading-[1.6] text-sb-text">
            Charlotte has self-funded the movement so far. As we grow, your donations cover
            infrastructure, events, and the platform that runs the policy funnel.
          </p>
          <div>
            <Button
              asChild
              variant="ghost"
              className="rounded-full text-sb-navy hover:bg-sb-cream-warm"
            >
              <Link to="/donate">
                <HeartHandshake aria-hidden className="size-4" />
                Donate
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProgressOpenSource({ reduce }: { reduce: ReduceMotion }) {
  return (
    <section className="mx-auto w-full max-w-5xl">
      <SectionHeader
        reduce={reduce}
        icon={GitBranch}
        eyebrow="Open source"
        title="Build with us."
      />
      <motion.ul
        role="list"
        initial={reduce ? false : 'hidden'}
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="grid list-none grid-cols-1 gap-4 p-0 min-[640px]:grid-cols-2 min-[880px]:grid-cols-4 min-[880px]:gap-5"
      >
        {OS_STATS.map((stat) => (
          <motion.li key={stat.label} variants={revealUp}>
            <StatCard {...stat} />
          </motion.li>
        ))}
      </motion.ul>
      <p className="mt-6 max-w-[60ch] text-[0.95rem] leading-[1.6] text-sb-text-muted">
        Across all public SBA repositories &mdash; the website, Karen, the Bacon Board, and
        the policy platform. See{' '}
        <a
          href={ORG_GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-sb-accent-hot hover:underline"
        >
          github.com/SomethingBetterAustralia
        </a>
        .
      </p>
    </section>
  );
}

function ProgressEngagement({ reduce }: { reduce: ReduceMotion }) {
  return (
    <section className="mx-auto w-full max-w-5xl">
      <SectionHeader
        reduce={reduce}
        icon={Calendar}
        eyebrow="Engagement"
        title="Events and outreach."
      />
      <div className="grid grid-cols-1 gap-10 min-[880px]:grid-cols-2 min-[880px]:items-start min-[880px]:gap-12">
        <div>
          <p className="mb-4 font-display text-base font-medium text-sb-navy">Events held</p>
          <ul role="list" className="flex list-none flex-col p-0">
            {EVENTS.map((e, i) => (
              <li
                key={e.date}
                className={cn(
                  'flex flex-col gap-1 py-4',
                  i !== EVENTS.length - 1 && 'border-b border-sb-cream-warm',
                )}
              >
                <span className="font-mono text-xs uppercase tracking-[0.12em] text-sb-text-muted">
                  {e.date}
                </span>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-display text-[1.05rem] font-medium text-sb-navy">
                    {e.name}
                  </span>
                  <span className="rounded-full bg-sb-accent/15 px-2.5 py-0.5 text-xs font-medium text-sb-accent-hot">
                    {e.attendance} attended
                  </span>
                </div>
                <p className="text-[0.95rem] leading-[1.55] text-sb-text-muted">{e.body}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-4 font-display text-base font-medium text-sb-navy">Bacon Board</p>
          <ul role="list" className="flex list-none flex-col gap-4 p-0">
            {BACON_STATUS.map((row) => {
              const Icon = row.icon;
              return (
                <li
                  key={row.label}
                  className="flex items-center gap-4 rounded-2xl bg-sb-white p-4 ring-1 ring-sb-cream-warm"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sb-accent/10">
                    <Icon aria-hidden className="size-5 text-sb-accent-hot" />
                  </span>
                  <span className="font-display text-3xl font-medium text-sb-accent">
                    {row.value}
                  </span>
                  <span className="font-display text-sm font-medium text-sb-navy">
                    {row.label}
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="mt-4">
            <Link
              to="/bacon-board"
              className="inline-flex items-center gap-1 text-sm font-medium text-sb-accent-hot hover:underline"
            >
              See the Bacon Board
              <ArrowRight aria-hidden className="size-3.5" />
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

function ProgressCaveat({ reduce }: { reduce: ReduceMotion }) {
  return (
    <Caveat reduce={reduce}>
      Where these numbers come from: most are real but small &mdash; signups,
      volunteer-logged hours, GitHub activity. A few are estimates while the platform
      that will track them precisely is still being built (notably the Bacon Board
      figures and the policy funnel counts). The &lsquo;as of&rsquo; date at the top of
      this page applies to everything. When the platform is live, every number on this
      page will be live too.
    </Caveat>
  );
}

function ProgressCta({ reduce }: { reduce: ReduceMotion }) {
  return (
    <section className="mx-auto w-full max-w-3xl text-center">
      <motion.div
        initial={reduce ? false : 'hidden'}
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="flex flex-col items-center gap-4"
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
          Become a member.
        </motion.h2>
        <motion.p
          variants={revealUp}
          className="max-w-[58ch] text-[1.05rem] leading-[1.6] text-sb-text"
        >
          If you can make the next number larger, please join us.
        </motion.p>
        <motion.div variants={revealUp}>
          <Button
            asChild
            className="rounded-full bg-sb-navy text-sb-cream hover:bg-sb-navy-hot focus-visible:ring-sb-accent"
          >
            <Link to="/">
              <Bell aria-hidden className="size-4" />
              Become a member
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
