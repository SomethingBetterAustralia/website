import type { LikertResponse } from '@backend/types/survey';
import { cn } from '@/lib/utils';

export interface LikertRowProps {
  statement: string;
  value: LikertResponse | undefined;
  onChange: (next: LikertResponse) => void;
}

const SCALE_OPTIONS: ReadonlyArray<{
  readonly value: -2 | -1 | 0 | 1 | 2;
  readonly label: string;
  readonly shortLabel: string;
}> = [
  { value: -2, label: 'Strongly disagree', shortLabel: '−−' },
  { value: -1, label: 'Disagree', shortLabel: '−' },
  { value: 0, label: 'Neutral', shortLabel: '0' },
  { value: 1, label: 'Agree', shortLabel: '+' },
  { value: 2, label: 'Strongly agree', shortLabel: '++' },
];

function ScaleButton({
  selected,
  emphasised,
  label,
  shortLabel,
  onClick,
}: {
  selected: boolean;
  emphasised: boolean;
  label: string;
  shortLabel: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={selected}
      className={cn(
        'inline-flex flex-1 items-center justify-center rounded-full font-display font-medium transition-colors min-h-[44px]',
        emphasised ? 'text-base px-3' : 'text-sm px-2',
        selected
          ? 'bg-sb-navy text-sb-cream'
          : 'bg-sb-cream-warm text-sb-text-muted hover:bg-sb-cream',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-accent',
      )}
    >
      {shortLabel}
    </button>
  );
}

export function LikertRow({ statement, value, onChange }: LikertRowProps) {
  return (
    <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
      <legend className="m-0 mb-1 p-0 text-[0.95rem] leading-[1.4] text-sb-text">
        {statement}
      </legend>
      <div className="flex flex-col gap-2 min-[880px]:flex-row min-[880px]:items-center min-[880px]:gap-3">
        <div className="grid grid-cols-5 gap-1.5 min-[880px]:flex min-[880px]:flex-1 min-[880px]:gap-2">
          {SCALE_OPTIONS.map((opt) => (
            <ScaleButton
              key={opt.value}
              selected={value === opt.value}
              emphasised={opt.value === -2 || opt.value === 2}
              label={opt.label}
              shortLabel={opt.shortLabel}
              onClick={() => onChange(opt.value)}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => onChange(null)}
          aria-pressed={value === null}
          className={cn(
            'inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] transition-colors min-h-[44px]',
            value === null
              ? 'bg-sb-navy text-sb-cream'
              : 'bg-sb-cream-warm text-sb-text-muted hover:bg-sb-cream',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-accent',
            'min-[880px]:ml-2',
          )}
        >
          No strong view
        </button>
      </div>
      <div className="hidden justify-between text-[0.65rem] uppercase tracking-[0.18em] text-sb-text-muted min-[880px]:flex">
        <span>Strongly disagree</span>
        <span>Strongly agree</span>
      </div>
    </fieldset>
  );
}
