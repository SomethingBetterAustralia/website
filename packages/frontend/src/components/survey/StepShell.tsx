import { motion, useReducedMotion } from 'motion/react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface StepShellProps {
  stepIndex: number;
  totalSteps: number;
  title: string;
  intro?: string;
  canAdvance: boolean;
  isLastStep: boolean;
  submitting?: boolean;
  onBack: () => void;
  onNext: () => void;
  children: React.ReactNode;
}

export function StepShell({
  stepIndex,
  totalSteps,
  title,
  intro,
  canAdvance,
  isLastStep,
  submitting = false,
  onBack,
  onNext,
  children,
}: StepShellProps) {
  const reduce = useReducedMotion();
  const progress = ((stepIndex + 1) / totalSteps) * 100;
  return (
    <div className="rounded-3xl bg-sb-white p-6 shadow-[0_12px_30px_rgba(8,31,52,0.08)] ring-1 ring-sb-cream-warm min-[880px]:p-8">
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sb-accent-hot">
          Step {stepIndex + 1} of {totalSteps}
        </p>
        <div
          role="progressbar"
          aria-valuenow={stepIndex + 1}
          aria-valuemin={1}
          aria-valuemax={totalSteps}
          aria-label="Survey progress"
          className="h-1.5 w-full overflow-hidden rounded-full bg-sb-cream-warm"
        >
          <div
            className="h-full rounded-full bg-sb-accent transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <h2 className="font-display text-[clamp(1.5rem,3vw,2rem)] font-medium leading-[1.2] tracking-[-0.03em] text-sb-navy">
          {title}
        </h2>
        {intro && (
          <p className="text-[0.95rem] leading-[1.55] text-sb-text-muted">{intro}</p>
        )}
      </div>
      <motion.div
        key={stepIndex}
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="mt-6 flex flex-col gap-6 min-[880px]:mt-8"
      >
        {children}
      </motion.div>
      <div className="mt-8 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={stepIndex === 0 || submitting}
          className={cn(
            'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-colors min-h-[44px]',
            'text-sb-navy hover:bg-sb-cream-warm',
            'disabled:cursor-not-allowed disabled:text-sb-text-muted/50 disabled:hover:bg-transparent',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-accent',
          )}
        >
          Back
        </button>
        <Button
          type="button"
          onClick={onNext}
          disabled={!canAdvance || submitting}
          className={cn(
            'rounded-full bg-sb-navy text-sb-cream min-h-[44px] hover:bg-sb-navy-hot',
            'disabled:cursor-not-allowed disabled:opacity-60',
            'focus-visible:ring-sb-accent',
          )}
        >
          {submitting ? 'Submitting…' : isLastStep ? 'Submit' : 'Next'}
        </Button>
      </div>
    </div>
  );
}
