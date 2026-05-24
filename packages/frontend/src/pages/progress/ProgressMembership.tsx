import { Users } from 'lucide-react';
import {
  LineChart,
  StateBreakdown,
  type LineChartDatum,
  type StateBreakdownDatum,
} from '@/components/progress';
import { SectionHeader, type ReduceMotion } from './ProgressShared';

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

export function ProgressMembership({ reduce }: { reduce: ReduceMotion }) {
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
          <LineChart data={MEMBER_SERIES} ariaLabel="Weekly member count over 20 weeks." />
          <p className="mt-3 text-xs leading-[1.55] text-sb-text-muted">
            Subscribers to the home page signup, not all of whom will translate to formal
            members once registration opens. Counted weekly.
          </p>
        </div>
        <div>
          <p className="mb-3 font-display text-base font-medium text-sb-navy">
            Where members are
          </p>
          <StateBreakdown data={STATE_DATA} ariaLabel="Members by state and territory." />
          <p className="mt-3 text-xs leading-[1.55] text-sb-text-muted">
            By stated state on signup. Members without a stated state are not shown.
          </p>
        </div>
      </div>
    </section>
  );
}
