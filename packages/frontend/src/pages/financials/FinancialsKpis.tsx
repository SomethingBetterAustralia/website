import { Banknote, Gauge, HeartHandshake, TrendingUp, Wallet } from 'lucide-react';
import { motion } from 'motion/react';
import { StatCard } from '@/components/financials';
import { revealUp, staggerContainer, viewportOnce } from '@/lib/motion';
import {
  LAST_SYNCED,
  SectionHeader,
  formatCents,
  type Aggregates,
  type ReduceMotion,
} from './FinancialsShared';

export function FinancialsKpis({ reduce, agg }: { reduce: ReduceMotion; agg: Aggregates }) {
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
