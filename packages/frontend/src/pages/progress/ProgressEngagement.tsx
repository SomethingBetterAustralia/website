import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Network,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { Link } from '@/lib/router';
import { cn } from '@/lib/utils';
import { SectionHeader, type ReduceMotion } from './ProgressShared';

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

export function ProgressEngagement({ reduce }: { reduce: ReduceMotion }) {
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
