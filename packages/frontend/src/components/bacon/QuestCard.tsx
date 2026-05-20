import { Clock, Hash, Network } from 'lucide-react';

export type QuestStatus = 'open' | 'in-motion' | 'closed-accepted' | 'closed-declined';

export interface QuestCardProps {
  readonly status: QuestStatus;
  readonly description: string;
  readonly reason: string;
  readonly chainsInMotion: number;
  readonly bestBaconNumber: number | null;
  readonly daysOpen: number;
  readonly outcome?: string;
  readonly isMockNote: string;
}

const STATUS_PILL_CLASS: Record<QuestStatus, string> = {
  'open': 'bg-sb-accent/15 text-sb-accent-hot',
  'in-motion': 'bg-sb-navy/10 text-sb-navy',
  'closed-accepted': 'bg-sb-cream-warm text-sb-text-muted',
  'closed-declined': 'bg-sb-cream-warm text-sb-text-muted',
};

const STATUS_PILL_LABEL: Record<QuestStatus, string> = {
  'open': 'Open',
  'in-motion': 'In motion',
  'closed-accepted': 'Closed · Conversation took place',
  'closed-declined': 'Closed · Conversation declined',
};

function isClosed(s: QuestStatus): boolean {
  return s === 'closed-accepted' || s === 'closed-declined';
}

export function QuestCard({
  status,
  description,
  reason,
  chainsInMotion,
  bestBaconNumber,
  daysOpen,
  outcome,
  isMockNote,
}: QuestCardProps) {
  const closed = isClosed(status);
  return (
    <article className="flex h-full flex-col gap-4 rounded-3xl bg-sb-white p-6 shadow-[0_2px_8px_rgba(8,31,52,0.05)] ring-1 ring-sb-cream-warm min-[880px]:p-7">
      <header className="flex items-start justify-between gap-3">
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${STATUS_PILL_CLASS[status]}`}
        >
          {STATUS_PILL_LABEL[status]}
        </span>
      </header>
      <div className="flex flex-col gap-2">
        <h3 className="font-display text-xl font-medium leading-tight tracking-tight text-sb-navy">
          {description}
        </h3>
        <p className="text-[0.95rem] leading-[1.6] text-sb-text-muted">{reason}</p>
      </div>
      {closed ? (
        <div className="flex flex-col gap-3 rounded-2xl bg-sb-cream-warm/40 p-4 ring-1 ring-sb-cream-warm">
          {outcome && (
            <p className="text-[0.92rem] italic leading-[1.5] text-sb-text">{outcome}</p>
          )}
          <dl className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-sb-text-muted">
            <div className="inline-flex items-center gap-1.5">
              <Network aria-hidden className="size-3.5" />
              {chainsInMotion} chains
            </div>
            {bestBaconNumber !== null && (
              <div className="inline-flex items-center gap-1.5">
                <Hash aria-hidden className="size-3.5" />
                Final Bacon Number {bestBaconNumber}
              </div>
            )}
            <div className="inline-flex items-center gap-1.5">
              <Clock aria-hidden className="size-3.5" />
              {daysOpen} days
            </div>
          </dl>
        </div>
      ) : (
        <dl className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-sb-text-muted">
          <div className="inline-flex items-center gap-1.5">
            <Network aria-hidden className="size-4" />
            {chainsInMotion} in motion
          </div>
          <div className="inline-flex items-center gap-1.5">
            <Hash aria-hidden className="size-4" />
            {bestBaconNumber === null ? 'No closes yet' : `Best Bacon ${bestBaconNumber}`}
          </div>
          <div className="inline-flex items-center gap-1.5">
            <Clock aria-hidden className="size-4" />
            {daysOpen} days open
          </div>
        </dl>
      )}
      <div className="mt-auto flex flex-col gap-3 pt-2">
        {!closed && (
          <button
            type="button"
            disabled
            title="Game launching soon — subscribe to be notified."
            className="inline-flex w-fit items-center gap-2 rounded-full bg-sb-cream-warm px-4 py-2 text-sm font-medium text-sb-text-muted disabled:cursor-not-allowed disabled:opacity-70"
          >
            Start a chain
          </button>
        )}
        <p className="text-xs italic text-sb-text-muted">{isMockNote}</p>
      </div>
    </article>
  );
}
