import { GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

export type DraftStatus = 'forming' | 'drafting' | 'review';

export interface DraftCardProps {
  readonly title: string;
  readonly problem: string;
  readonly workingGroup: readonly string[];
  readonly expertName: string;
  readonly expertBackground: string;
  readonly status: DraftStatus;
  readonly openedDaysAgo: number;
}

const STATUS_PILL_CLASS: Record<DraftStatus, string> = {
  forming: 'bg-sb-accent/15 text-sb-accent-hot',
  drafting: 'bg-sb-navy/10 text-sb-navy',
  review: 'bg-sb-cream-warm text-sb-text-muted',
};

const STATUS_PILL_LABEL: Record<DraftStatus, string> = {
  forming: 'Forming',
  drafting: 'Drafting',
  review: 'In review',
};

export function DraftCard({
  title,
  problem,
  workingGroup,
  expertName,
  expertBackground,
  status,
  openedDaysAgo,
}: DraftCardProps) {
  return (
    <article className="flex h-full flex-col gap-4 rounded-2xl bg-sb-white p-6 ring-1 ring-sb-cream-warm min-[880px]:p-7">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="font-display text-xl font-medium leading-snug tracking-tight text-sb-navy">
          {title}
        </h3>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${STATUS_PILL_CLASS[status]}`}
        >
          {STATUS_PILL_LABEL[status]}
        </span>
      </header>
      <p className="text-[1.05rem] italic leading-[1.55] text-sb-text">{problem}</p>
      <div className="flex flex-col gap-3 rounded-xl bg-sb-cream-warm/30 p-4 ring-1 ring-sb-cream-warm">
        <span className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-sb-text-muted">
          Working group
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {workingGroup.map((name) => {
            const isExpert = name === expertName;
            return (
              <span
                key={name}
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs',
                  isExpert
                    ? 'bg-sb-cream font-medium text-sb-navy ring-1 ring-sb-accent/40'
                    : 'bg-sb-cream-warm/60 text-sb-text',
                )}
              >
                {isExpert && (
                  <GraduationCap aria-hidden className="size-3.5 text-sb-accent-hot" />
                )}
                {name}
              </span>
            );
          })}
        </div>
        <p className="text-xs italic leading-[1.5] text-sb-text-muted">
          Expert: {expertName} — {expertBackground}
        </p>
      </div>
      <div className="text-xs text-sb-text-muted">Opened {openedDaysAgo} days ago</div>
    </article>
  );
}
