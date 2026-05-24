import { motion } from 'motion/react';
import { type LucideIcon } from 'lucide-react';
import { type LedgerEntry } from '@/components/financials';
import { type LineChartDatum, type StateBreakdownDatum } from '@/components/progress';
import { revealUp, staggerContainer, viewportOnce } from '@/lib/motion';

export type ReduceMotion = boolean | null;

const AUD = new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' });
export const formatCents = (cents: number): string => AUD.format(cents / 100);

export const LAST_SYNCED = '2026-05-18';
export const REPO_URL = 'https://github.com/SomethingBetterAustralia/aec-financials';
export const REPO_DISPLAY = 'github.com/SomethingBetterAustralia/aec-financials';

// MOCK: ledger to be replaced by the aec-financials pipeline.
// Amounts in integer cents. Running balance reconciled.
export const MOCK_LEDGER: readonly LedgerEntry[] = [
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
export const MOCK_BALANCE_TIMELINE: readonly LineChartDatum[] = [
  { date: '2026-03-30', value: 0 },
  { date: '2026-04-06', value: 0 },
  { date: '2026-04-13', value: 0 },
  { date: '2026-04-20', value: 734 },
  { date: '2026-04-27', value: 3574 },
  { date: '2026-05-04', value: 3026 },
  { date: '2026-05-11', value: 4756 },
  { date: '2026-05-18', value: 4820 },
];

export interface Aggregates {
  readonly totalIn: number;
  readonly totalOut: number;
  readonly currentBalance: number;
  readonly averageDonation: number;
  readonly netByCat: readonly StateBreakdownDatum[];
}

export function computeAggregates(entries: readonly LedgerEntry[]): Aggregates {
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

  const currentBalance = entries.length === 0 ? 0 : entries[entries.length - 1].balance;
  const averageDonation = donationCount === 0 ? 0 : Math.round(donationTotal / donationCount);

  const netByCat: StateBreakdownDatum[] = Array.from(byCat.entries()).map(([state, count]) => ({
    state,
    count,
  }));

  return { totalIn, totalOut, currentBalance, averageDonation, netByCat };
}

export function SectionHeader({
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
