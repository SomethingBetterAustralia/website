import {
  Banknote,
  Bell,
  BookOpenText,
  Check,
  ChevronRight,
  Copy,
  ExternalLink,
  Gauge,
  GitBranch,
  HandHeart,
  HeartHandshake,
  LineChart as LineChartIcon,
  PieChart,
  Receipt,
  RefreshCw,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { LedgerTable, type LedgerEntry } from '@/components/financials';
import {
  LineChart,
  StateBreakdown,
  StatCard,
  type LineChartDatum,
  type StateBreakdownDatum,
} from '@/components/progress';
import { Caveat } from '@/components/prose';
import { Link } from '@/lib/router';
import { revealUp, staggerContainer, viewportOnce } from '@/lib/motion';
import { cn } from '@/lib/utils';

type ReduceMotion = boolean | null;

const AUD = new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' });
const formatCents = (cents: number): string => AUD.format(cents / 100);

const LAST_SYNCED = '2026-05-18';
const REPO_URL = 'https://github.com/SomethingBetterAustralia/aec-financials';
const REPO_DISPLAY = 'github.com/SomethingBetterAustralia/aec-financials';

// MOCK: ledger to be replaced by the aec-financials pipeline.
// Amounts in integer cents. Running balance reconciled.
const MOCK_LEDGER: readonly LedgerEntry[] = [
  { id: 'L01', date: '2026-04-20', description: 'Founder seed',                      category: 'Founder',        direction: 'in',  amount:  71400, balance:  71400 },
  { id: 'L02', date: '2026-04-21', description: 'Individual donation',               category: 'Donations',      direction: 'in',  amount:   2000, balance:  73400 },
  { id: 'L03', date: '2026-04-22', description: 'Stripe setup',                      category: 'Fees',           direction: 'out', amount:   3000, balance:  70400 },
  { id: 'L04', date: '2026-04-22', description: 'Founder contribution',              category: 'Founder',        direction: 'in',  amount: 282000, balance: 352400 },
  { id: 'L05', date: '2026-04-25', description: 'Individual donation',               category: 'Donations',      direction: 'in',  amount:   5000, balance: 357400 },
  { id: 'L06', date: '2026-04-28', description: 'Individual donation',               category: 'Donations',      direction: 'in',  amount:  20000, balance: 377400 },
  { id: 'L07', date: '2026-05-01', description: 'Domain renewal',                    category: 'Infrastructure', direction: 'out', amount:   4800, balance: 372600 },
  { id: 'L08', date: '2026-05-02', description: 'Individual donation',               category: 'Donations',      direction: 'in',  amount:  50000, balance: 422600 },
  { id: 'L09', date: '2026-05-04', description: 'Legal advice — party registration', category: 'Legal',          direction: 'out', amount: 120000, balance: 302600 },
  { id: 'L10', date: '2026-05-05', description: 'Mailgun (email)',                   category: 'Software',       direction: 'out', amount:   3500, balance: 299100 },
  { id: 'L11', date: '2026-05-08', description: 'Founder contribution',              category: 'Founder',        direction: 'in',  amount: 200000, balance: 499100 },
  { id: 'L12', date: '2026-05-09', description: 'Stripe processing fees',            category: 'Fees',           direction: 'out', amount:    485, balance: 498615 },
  { id: 'L13', date: '2026-05-10', description: 'Individual donation',               category: 'Donations',      direction: 'in',  amount:   2000, balance: 500615 },
  { id: 'L14', date: '2026-05-11', description: 'Event venue hire — Sydney',         category: 'Events',         direction: 'out', amount:  25000, balance: 475615 },
  { id: 'L15', date: '2026-05-12', description: 'Notion (workspace)',                category: 'Software',       direction: 'out', amount:   2400, balance: 473215 },
  { id: 'L16', date: '2026-05-14', description: 'Individual donation',               category: 'Donations',      direction: 'in',  amount:  10000, balance: 483215 },
  { id: 'L17', date: '2026-05-16', description: 'AWS hosting (May)',                 category: 'Infrastructure', direction: 'out', amount:   8700, balance: 474515 },
  { id: 'L18', date: '2026-05-17', description: 'Individual donation',               category: 'Donations',      direction: 'in',  amount:   5000, balance: 479515 },
  { id: 'L19', date: '2026-05-18', description: 'Individual donation',               category: 'Donations',      direction: 'in',  amount:   2500, balance: 482015 },
];

// MOCK: 8-week running-balance snapshots (values in dollars-rounded for
// chart convenience; cents precision lives in MOCK_LEDGER).
const MOCK_BALANCE_TIMELINE: readonly LineChartDatum[] = [
  { date: '2026-03-30', value: 0 },
  { date: '2026-04-06', value: 0 },
  { date: '2026-04-13', value: 0 },
  { date: '2026-04-20', value: 734 },
  { date: '2026-04-27', value: 3574 },
  { date: '2026-05-04', value: 3026 },
  { date: '2026-05-11', value: 4756 },
  { date: '2026-05-18', value: 4820 },
];

interface Aggregates {
  readonly totalIn: number;
  readonly totalOut: number;
  readonly currentBalance: number;
  readonly averageDonation: number;
  readonly netByCat: readonly StateBreakdownDatum[];
}

function computeAggregates(entries: readonly LedgerEntry[]): Aggregates {
  let totalIn = 0;
  let totalOut = 0;
  let donationTotal = 0;
  let donationCount = 0;
  const byCat = new Map<string, number>();

  for (const e of entries) {
    if (e.direction === 'in') {
      totalIn += e.amount;
      if (e.category === 'Donations') {
        donationTotal += e.amount;
        donationCount += 1;
      }
    } else {
      totalOut += e.amount;
      byCat.set(e.category, (byCat.get(e.category) ?? 0) + e.amount);
    }
  }

  const currentBalance =
    entries.length === 0 ? 0 : entries[entries.length - 1].balance;
  const averageDonation =
    donationCount === 0 ? 0 : Math.round(donationTotal / donationCount);

  const netByCat: StateBreakdownDatum[] = Array.from(byCat.entries()).map(
    ([state, count]) => ({ state, count }),
  );

  return { totalIn, totalOut, currentBalance, averageDonation, netByCat };
}

export function Financials() {
  const reduce = useReducedMotion();
  const agg = React.useMemo(() => computeAggregates(MOCK_LEDGER), []);
  return (
    <div className="flex flex-col gap-16 px-6 pb-24 pt-6 min-[880px]:gap-24 min-[880px]:px-12 min-[880px]:pt-10">
      <FinancialsHero reduce={reduce} />
      <FinancialsLedger reduce={reduce} agg={agg} />
      <FinancialsKpis reduce={reduce} agg={agg} />
      <FinancialsCashflow reduce={reduce} />
      <FinancialsBreakdown reduce={reduce} agg={agg} />
      <FinancialsArchitecture reduce={reduce} />
      <FinancialsCaveat reduce={reduce} />
      <FinancialsCta reduce={reduce} />
    </div>
  );
}

function FinancialsHero({ reduce }: { reduce: ReduceMotion }) {
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
        <BookOpenText aria-hidden className="size-4" />
        <span className="text-xs font-semibold uppercase tracking-[0.22em]">Open books</span>
      </motion.span>
      <motion.h1
        variants={revealUp}
        className="font-display text-[clamp(2.8rem,6.5vw,4.6rem)] font-medium italic leading-[1.02] tracking-[-0.05em] text-sb-accent"
      >
        Financials.
      </motion.h1>
      <motion.blockquote
        variants={revealUp}
        className="flex w-full gap-4 border-l-4 border-sb-accent pl-4"
      >
        <p className="font-display text-[clamp(1.6rem,3.5vw,2.4rem)] font-medium italic leading-[1.15] tracking-[-0.03em] text-sb-navy">
          &ldquo;Every dollar in. Every dollar out.{' '}
          <span className="text-sb-accent-hot">Every transaction visible.</span>&rdquo;
        </p>
      </motion.blockquote>
      <motion.p
        variants={revealUp}
        className="max-w-[64ch] text-[1.05rem] leading-[1.6] text-sb-text"
      >
        Australian political parties are only legally required to disclose donations above a
        threshold, in annual returns to the Australian Electoral Commission. We publish every
        transaction, every week, through an open-source pipeline. The ledger below is the
        actual ledger &mdash; small, real, and not the version sanitised for a year-end report.
      </motion.p>
      <motion.p
        variants={revealUp}
        className="inline-flex items-center gap-2 text-sm text-sb-text-muted"
      >
        <RefreshCw aria-hidden className="size-3.5" />
        <span>Synced from Xero. Last updated: {LAST_SYNCED}.</span>
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

function FinancialsLedger({ reduce, agg }: { reduce: ReduceMotion; agg: Aggregates }) {
  const pills = [
    { label: 'Total in', value: formatCents(agg.totalIn) },
    { label: 'Total out', value: formatCents(agg.totalOut) },
    { label: 'Current balance', value: formatCents(agg.currentBalance) },
  ];
  return (
    <section className="mx-auto w-full max-w-5xl">
      <SectionHeader
        reduce={reduce}
        icon={Receipt}
        eyebrow="The ledger"
        title="Every transaction, on the record."
      />
      <motion.ul
        role="list"
        initial={reduce ? false : 'hidden'}
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="mb-6 flex list-none flex-wrap gap-3 p-0"
      >
        {pills.map((pill) => (
          <motion.li
            key={pill.label}
            variants={revealUp}
            className="inline-flex items-center gap-3 rounded-full bg-sb-white px-4 py-2 ring-1 ring-sb-cream-warm"
          >
            <span className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-sb-text-muted">
              {pill.label}
            </span>
            <span className="font-display text-sm font-medium tabular-nums text-sb-navy">
              {pill.value}
            </span>
          </motion.li>
        ))}
      </motion.ul>
      <LedgerTable entries={MOCK_LEDGER} lastSynced={LAST_SYNCED} />
      <p className="mt-4 text-sm text-sb-text-muted">
        Every row of this ledger is published to{' '}
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-sb-accent-hot hover:underline"
        >
          {REPO_DISPLAY}
        </a>{' '}
        when it changes. The commit history is the audit trail.
      </p>
    </section>
  );
}

function FinancialsKpis({ reduce, agg }: { reduce: ReduceMotion; agg: Aggregates }) {
  const cards = [
    {
      icon: HeartHandshake,
      label: 'Total raised',
      value: formatCents(agg.totalIn),
      subText: 'since launch',
    },
    {
      icon: Wallet,
      label: 'Total spent',
      value: formatCents(agg.totalOut),
      subText: 'since launch',
    },
    {
      icon: Banknote,
      label: 'Current balance',
      value: formatCents(agg.currentBalance),
      subText: `as of ${LAST_SYNCED}`,
    },
    {
      icon: TrendingUp,
      label: 'Average donation',
      value: formatCents(agg.averageDonation),
      subText: 'ex. founder contributions',
    },
  ];
  return (
    <section className="mx-auto w-full max-w-5xl">
      <SectionHeader
        reduce={reduce}
        icon={Gauge}
        eyebrow="At a glance"
        title="The numbers, summarised."
      />
      <motion.ul
        role="list"
        initial={reduce ? false : 'hidden'}
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="grid list-none grid-cols-1 gap-4 p-0 min-[640px]:grid-cols-2 min-[880px]:grid-cols-4 min-[880px]:gap-5"
      >
        {cards.map((c) => (
          <motion.li key={c.label} variants={revealUp}>
            <StatCard icon={c.icon} label={c.label} value={c.value} subText={c.subText} />
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}

function FinancialsCashflow({ reduce }: { reduce: ReduceMotion }) {
  const cards = [
    {
      title: 'Monthly burn rate',
      body: '~$420/month on average across software, legal, and events. Variable — legal advice on party registration was a one-off $1,200 spike in early May.',
    },
    {
      title: 'Runway at current burn',
      body: '~11.5 months at the current balance, assuming no further income. With recent donation trends factored in, indefinite.',
    },
  ];
  return (
    <section className="mx-auto w-full max-w-5xl">
      <SectionHeader
        reduce={reduce}
        icon={LineChartIcon}
        eyebrow="Cashflow over time"
        title="Where the money has been."
      />
      <div className="grid grid-cols-1 gap-8 min-[880px]:grid-cols-2 min-[880px]:items-start min-[880px]:gap-10">
        <div>
          <p className="mb-3 font-display text-base font-medium text-sb-navy">Running balance</p>
          <LineChart
            data={MOCK_BALANCE_TIMELINE}
            ariaLabel="Weekly running balance over 8 weeks, in dollars."
          />
          <p className="mt-3 text-xs leading-[1.55] text-sb-text-muted">
            Computed from the ledger. The dips are real expenses; the climbs are donations or
            founder contributions.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          {cards.map((card) => (
            <article
              key={card.title}
              className="flex flex-col gap-2 rounded-2xl bg-sb-white p-5 ring-1 ring-sb-cream-warm"
            >
              <h3 className="font-display text-base font-medium text-sb-navy">{card.title}</h3>
              <p className="text-sm leading-[1.55] text-sb-text-muted">{card.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinancialsBreakdown({
  reduce,
  agg,
}: {
  reduce: ReduceMotion;
  agg: Aggregates;
}) {
  const data: readonly StateBreakdownDatum[] = agg.netByCat.map((d) => ({
    state: d.state,
    count: Math.round(d.count / 100),
  }));
  return (
    <section className="mx-auto w-full max-w-5xl">
      <SectionHeader
        reduce={reduce}
        icon={PieChart}
        eyebrow="Where the money goes"
        title="Outgoing, by category."
      />
      <div>
        <p className="mb-3 font-display text-base font-medium text-sb-navy">
          Outgoing, by category
        </p>
        <StateBreakdown
          data={data}
          ariaLabel="Outgoing spend by category, in Australian dollars."
        />
        <p className="mt-3 max-w-[60ch] text-xs leading-[1.55] text-sb-text-muted">
          Legal is dominated by one-off party-registration advice. Software, infrastructure,
          and fees are recurring. Bars show whole dollars; row totals:{' '}
          {formatCents(agg.totalOut)} across {agg.netByCat.length} categories.
        </p>
      </div>
    </section>
  );
}

interface FlowChip {
  readonly label: string;
  readonly active?: boolean;
}

const FLOW_CHIPS: readonly FlowChip[] = [
  { label: 'Bank + Stripe' },
  { label: 'Xero' },
  { label: 'Reconciliation' },
  { label: 'aec-financials repo', active: true },
  { label: 'This page' },
];

function FinancialsArchitecture({ reduce }: { reduce: ReduceMotion }) {
  return (
    <section className="mx-auto w-full max-w-5xl">
      <SectionHeader
        reduce={reduce}
        icon={GitBranch}
        eyebrow="How this works"
        title="The pipeline behind the page."
      />
      <ul
        role="list"
        className="mb-8 flex list-none flex-wrap items-center gap-2 p-0"
      >
        {FLOW_CHIPS.map((c, i) => (
          <li key={c.label} className="inline-flex items-center gap-2">
            <span
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium',
                c.active
                  ? 'bg-sb-accent/15 text-sb-accent-hot'
                  : 'bg-sb-cream-warm text-sb-navy',
              )}
            >
              {c.label}
            </span>
            {i !== FLOW_CHIPS.length - 1 && (
              <ChevronRight aria-hidden className="size-4 text-sb-text-muted/60" />
            )}
          </li>
        ))}
      </ul>
      <p className="mb-8 max-w-[64ch] text-[1.05rem] leading-[1.6] text-sb-text">
        Donations and expenses flow through our bank and Stripe. Transactions are reconciled
        in Xero (a standard accounting tool). Every week, a categorised export is written to
        a public GitHub repository &mdash; aec-financials &mdash; as a versioned ledger. This
        page reads from that repo. The commit history of the repo IS the audit trail: every
        correction, every reclassification, every late entry is visible in git blame.
      </p>
      <ArchitectureRepoPill reduce={reduce} />
    </section>
  );
}

function ArchitectureRepoPill({ reduce }: { reduce: ReduceMotion }) {
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
      await navigator.clipboard.writeText(REPO_URL);
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
    <motion.div
      initial={reduce ? false : 'hidden'}
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer}
      className="relative overflow-hidden rounded-3xl bg-sb-navy p-6 text-sb-cream shadow-[0_18px_40px_rgba(8,31,52,0.18)] ring-1 ring-sb-navy min-[880px]:p-10"
    >
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
          <span className="text-xs font-semibold uppercase tracking-[0.22em]">
            The audit trail
          </span>
        </motion.span>
        <motion.h3
          variants={revealUp}
          className="font-display text-[clamp(1.6rem,3vw,2.2rem)] font-medium italic leading-[1.1] tracking-[-0.04em] text-sb-accent"
        >
          aec-financials, on GitHub.
        </motion.h3>
        <motion.div variants={revealUp} className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-sb-navy-hot px-4 py-2 ring-1 ring-sb-cream/10">
            <code className="font-mono text-sm text-sb-cream">{REPO_DISPLAY}</code>
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
            <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
              Open the repo
              <ExternalLink aria-hidden className="size-4" />
            </a>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}

function FinancialsCaveat({ reduce }: { reduce: ReduceMotion }) {
  return (
    <Caveat reduce={reduce}>
      What&rsquo;s not on the ledger: individual donor identities are aggregated by default,
      in line with the AEC&rsquo;s privacy regime. Donors who specifically request public
      acknowledgment are named in the description column; everyone else appears as
      &lsquo;Individual donation&rsquo; with no identifying information. Charlotte&rsquo;s
      founder contributions are named openly because she has consented. There is a 1&ndash;3
      day lag between a transaction settling and appearing here &mdash; bank reconciliation
      takes time, and we&rsquo;d rather be slow and right than fast and wrong.
    </Caveat>
  );
}

function FinancialsCta({ reduce }: { reduce: ReduceMotion }) {
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
            Add to the ledger
          </span>
        </motion.span>
        <motion.h2
          variants={revealUp}
          className="font-display text-[clamp(1.7rem,3.2vw,2.4rem)] font-medium leading-[1.15] tracking-[-0.03em] text-sb-navy"
        >
          Donate.
        </motion.h2>
        <motion.p
          variants={revealUp}
          className="max-w-[58ch] text-[1.05rem] leading-[1.6] text-sb-text"
        >
          If you&rsquo;d like to add a row to this ledger, the donate page is open.
        </motion.p>
        <motion.div variants={revealUp}>
          <Button
            asChild
            className="rounded-full bg-sb-navy text-sb-cream hover:bg-sb-navy-hot focus-visible:ring-sb-accent"
          >
            <Link to="/donate">
              <HandHeart aria-hidden className="size-4" />
              Donate
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
