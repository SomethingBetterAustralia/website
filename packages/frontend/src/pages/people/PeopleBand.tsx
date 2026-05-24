import { AlertTriangle, RotateCw, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { type PeoplePageState } from '@/hooks/usePeoplePage';
import { PeopleChart } from './PeopleChart';
import { PeopleHeader } from './PeopleHeader';

export function PeopleBand({
  state,
  retry,
  reduce,
}: {
  state: PeoplePageState;
  retry: () => void;
  reduce: boolean;
}) {
  if (state.kind === 'loading') {
    return (
      <section className="mx-auto w-full max-w-5xl">
        <div className="grid grid-cols-1 gap-10 min-[880px]:grid-cols-2 min-[880px]:items-start min-[880px]:gap-12">
          <PeopleHeader reduce={reduce} />
          <LoadingCard reduce={reduce} />
        </div>
      </section>
    );
  }
  if (state.kind === 'error') {
    return (
      <section className="mx-auto w-full max-w-5xl">
        <div className="grid grid-cols-1 gap-10 min-[880px]:grid-cols-2 min-[880px]:items-start min-[880px]:gap-12">
          <PeopleHeader reduce={reduce} />
          <ErrorCard message={state.message} onRetry={retry} />
        </div>
      </section>
    );
  }
  return (
    <section className="mx-auto w-full max-w-5xl">
      <PeopleChart members={state.members} portfolios={state.portfolios} reduce={reduce} />
    </section>
  );
}

function LoadingCard({ reduce }: { reduce: boolean }) {
  return (
    <motion.div
      animate={reduce ? undefined : { opacity: [0.5, 1, 0.5] }}
      transition={reduce ? undefined : { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      className={cn(
        'flex min-h-[24rem] flex-col items-center justify-center gap-3 rounded-3xl bg-sb-white p-8 shadow-[0_12px_30px_rgba(8,31,52,0.08)] ring-1 ring-sb-cream-warm',
        reduce && 'opacity-70',
      )}
    >
      <Users aria-hidden className="size-6 text-sb-accent-hot" />
      <p className="text-sm text-sb-text-muted">Loading the team…</p>
    </motion.div>
  );
}

function ErrorCard({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex min-h-[24rem] flex-col items-center justify-center gap-4 rounded-3xl bg-sb-white p-8 shadow-[0_12px_30px_rgba(8,31,52,0.08)] ring-1 ring-sb-error/30">
      <AlertTriangle aria-hidden className="size-6 text-sb-error" />
      <p className="max-w-[40ch] text-center text-sm text-sb-text">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-1.5 rounded-full bg-sb-cream-warm px-4 py-1.5 text-sm font-medium text-sb-navy transition-colors hover:bg-sb-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-accent"
      >
        <RotateCw aria-hidden className="size-4" />
        Try again
      </button>
    </div>
  );
}
