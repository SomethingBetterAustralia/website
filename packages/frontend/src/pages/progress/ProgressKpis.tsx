import {
  ClipboardCheck,
  Gauge,
  GitBranch,
  HandHeart,
  HeartHandshake,
  Lightbulb,
  MapPin,
  Newspaper,
  Users,
} from 'lucide-react';
import { motion } from 'motion/react';
import { StatCard, type StatCardProps } from '@/components/progress';
import { revealUp, staggerContainer, viewportOnce } from '@/lib/motion';
import { SectionHeader, type ReduceMotion } from './ProgressShared';

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

export function ProgressKpis({ reduce }: { reduce: ReduceMotion }) {
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
