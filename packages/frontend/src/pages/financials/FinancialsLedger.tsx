import { Receipt } from 'lucide-react';
import { motion } from 'motion/react';
import { LedgerTable } from '@/components/financials';
import { revealUp, staggerContainer, viewportOnce } from '@/lib/motion';
import {
  LAST_SYNCED,
  MOCK_LEDGER,
  REPO_DISPLAY,
  REPO_URL,
  SectionHeader,
  formatCents,
  type Aggregates,
  type ReduceMotion,
} from './FinancialsShared';

export function FinancialsLedger({ reduce, agg }: { reduce: ReduceMotion; agg: Aggregates }) {
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
