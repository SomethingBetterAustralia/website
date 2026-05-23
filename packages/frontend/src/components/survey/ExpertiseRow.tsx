import type { ExpertiseLevel } from '@backend/types/survey';
import { cn } from '@/lib/utils';

export interface ExpertiseRowProps {
  value: ExpertiseLevel | undefined;
  onChange: (next: ExpertiseLevel) => void;
}

const LEVELS: ReadonlyArray<ExpertiseLevel> = [1, 2, 3, 4, 5];

export function ExpertiseRow({ value, onChange }: ExpertiseRowProps) {
  return (
    <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
      <legend className="m-0 p-0 text-[0.95rem] leading-[1.4] text-sb-text">
        How would you rate your expertise in this portfolio?
      </legend>
      <div className="flex items-center justify-between gap-2">
        {LEVELS.map((level) => {
          const selected = value === level;
          return (
            <button
              key={level}
              type="button"
              onClick={() => onChange(level)}
              aria-label={`Expertise level ${level} of 5`}
              aria-pressed={selected}
              className={cn(
                'inline-flex size-11 items-center justify-center rounded-full font-display text-base font-medium transition-colors min-[880px]:size-12',
                selected
                  ? 'bg-sb-navy text-sb-cream'
                  : 'bg-sb-cream-warm text-sb-text-muted hover:bg-sb-cream',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-accent',
              )}
            >
              {level}
            </button>
          );
        })}
      </div>
      <div className="flex justify-between text-[0.65rem] uppercase tracking-[0.18em] text-sb-text-muted">
        <span>Passing familiarity</span>
        <span>Deep professional knowledge</span>
      </div>
    </fieldset>
  );
}
