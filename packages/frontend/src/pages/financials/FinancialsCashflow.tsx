import { LineChart as LineChartIcon } from 'lucide-react';
import { LineChart } from '@/components/financials';
import {
  MOCK_BALANCE_TIMELINE,
  SectionHeader,
  type ReduceMotion,
} from './FinancialsShared';

export function FinancialsCashflow({ reduce }: { reduce: ReduceMotion }) {
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
