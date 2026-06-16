import { AlertTriangle, Check, ClipboardList } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Link } from '@/lib/router';
import { revealUp, staggerContainer } from '@/lib/motion';
import { cn } from '@/lib/utils';

export function SurveyLoadingCard({ reduce }: { reduce: boolean }) {
  return (
    <motion.div
      animate={reduce ? undefined : { opacity: [0.5, 1, 0.5] }}
      transition={reduce ? undefined : { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      className={cn(
        'flex min-h-[20rem] flex-col items-center justify-center gap-3 rounded-3xl bg-sb-white p-8 shadow-[0_12px_30px_rgba(8,31,52,0.08)] ring-1 ring-sb-cream-warm',
        reduce && 'opacity-70',
      )}
    >
      <ClipboardList aria-hidden className="size-6 text-sb-accent-hot" />
      <p className="text-sm text-sb-text-muted">Loading the survey…</p>
    </motion.div>
  );
}

export function SurveyErrorCard({ message }: { message: string }) {
  return (
    <div className="flex min-h-[20rem] flex-col items-center justify-center gap-3 rounded-3xl bg-sb-white p-8 shadow-[0_12px_30px_rgba(8,31,52,0.08)] ring-1 ring-sb-error/30">
      <AlertTriangle aria-hidden className="size-6 text-sb-error" />
      <p className="max-w-[40ch] text-center text-sm text-sb-text">{message}</p>
    </div>
  );
}

export function SurveySubmittedCard({ reduce }: { reduce: boolean }) {
  return (
    <motion.div
      initial={reduce ? false : 'hidden'}
      animate="visible"
      variants={staggerContainer}
      className="flex flex-col items-start gap-4 rounded-3xl bg-sb-white p-6 shadow-[0_12px_30px_rgba(8,31,52,0.08)] ring-1 ring-sb-cream-warm min-[880px]:p-10"
    >
      <motion.span
        variants={revealUp}
        className="inline-flex items-center gap-2 text-sb-accent-hot"
      >
        <Check aria-hidden className="size-4" />
        <span className="text-xs font-semibold uppercase tracking-[0.22em]">Done</span>
      </motion.span>
      <motion.h2
        variants={revealUp}
        className="font-display text-[clamp(1.8rem,4vw,2.8rem)] font-medium italic leading-[1.1] tracking-[-0.04em] text-sb-accent"
      >
        Submitted — thank you.
      </motion.h2>
      <motion.p
        variants={revealUp}
        className="max-w-[52ch] text-[1.05rem] leading-[1.6] text-sb-text"
      >
        Your response has been recorded. Thank you for taking the time to contribute.
      </motion.p>
      <motion.div variants={revealUp} className="mt-2">
        <Button
          asChild
          className="rounded-full bg-sb-accent text-sb-white shadow-[0_4px_12px_rgba(212,166,73,0.35)] hover:bg-sb-accent-hot focus-visible:ring-sb-accent"
        >
          <Link to="/">Back to home</Link>
        </Button>
      </motion.div>
    </motion.div>
  );
}
