import { PieChart } from 'lucide-react';
import { StateBreakdown, type StateBreakdownDatum } from '@/components/financials';
import {
  SectionHeader,
  formatCents,
  type Aggregates,
  type ReduceMotion,
} from './FinancialsShared';

export function FinancialsBreakdown({ reduce, agg }: { reduce: ReduceMotion; agg: Aggregates }) {
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
