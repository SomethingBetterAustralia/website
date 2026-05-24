import { HeartHandshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BarChart, type BarChartDatum } from '@/components/progress';
import { Link } from '@/lib/router';
import { SectionHeader, type ReduceMotion } from './ProgressShared';

// MOCK: 6 trailing months of donations.
const DONATION_DATA: readonly BarChartDatum[] = [
  { label: 'Dec', value: 0 },
  { label: 'Jan', value: 0 },
  { label: 'Feb', value: 420 },
  { label: 'Mar', value: 980 },
  { label: 'Apr', value: 1420 },
  { label: 'May', value: 2000 },
];

export function ProgressSupport({ reduce }: { reduce: ReduceMotion }) {
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
