import { Check, ChevronRight, Copy, ExternalLink, GitBranch } from 'lucide-react';
import { motion } from 'motion/react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { revealUp, staggerContainer, viewportOnce } from '@/lib/motion';
import { cn } from '@/lib/utils';
import {
  REPO_DISPLAY,
  REPO_URL,
  SectionHeader,
  type ReduceMotion,
} from './FinancialsShared';

interface FlowChip {
  readonly label: string;
  readonly active?: boolean;
}

const FLOW_CHIPS: readonly FlowChip[] = [
  { label: 'Bank + Stripe' },
  { label: 'Xero' },
  { label: 'Reconciliation' },
  { label: 'aec-financials repo', active: true },
  { label: 'This page' },
];

export function FinancialsArchitecture({ reduce }: { reduce: ReduceMotion }) {
  return (
    <section className="mx-auto w-full max-w-5xl">
      <SectionHeader
        reduce={reduce}
        icon={GitBranch}
        eyebrow="How this works"
        title="The pipeline behind the page."
      />
      <ul role="list" className="mb-8 flex list-none flex-wrap items-center gap-2 p-0">
        {FLOW_CHIPS.map((c, i) => (
          <li key={c.label} className="inline-flex items-center gap-2">
            <span
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium',
                c.active
                  ? 'bg-sb-accent/15 text-sb-accent-hot'
                  : 'bg-sb-cream-warm text-sb-navy',
              )}
            >
              {c.label}
            </span>
            {i !== FLOW_CHIPS.length - 1 && (
              <ChevronRight aria-hidden className="size-4 text-sb-text-muted/60" />
            )}
          </li>
        ))}
      </ul>
      <p className="max-w-[64ch] text-[1.05rem] leading-[1.6] text-sb-text">
        Donations and expenses flow through our bank and Stripe. Transactions are reconciled
        in Xero (a standard accounting tool). Every week, a categorised export is written to
        a public GitHub repository &mdash; aec-financials &mdash; as a versioned ledger. This
        page reads from that repo. The commit history of the repo IS the audit trail: every
        correction, every reclassification, every late entry is visible in git blame.
      </p>
    </section>
  );
}

export function FinancialsArchitectureRepoPill({ reduce }: { reduce: ReduceMotion }) {
  const [copyStatus, setCopyStatus] = React.useState<'idle' | 'copied'>('idle');
  const copyTimerRef = React.useRef<number | null>(null);

  React.useEffect(
    () => () => {
      if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current);
    },
    [],
  );

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(REPO_URL);
      setCopyStatus('copied');
      if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current);
      copyTimerRef.current = window.setTimeout(() => {
        setCopyStatus('idle');
        copyTimerRef.current = null;
      }, 1500);
    } catch {
      // Leave status idle; no fallback UI at v1.
    }
  }

  return (
    <motion.section
      initial={reduce ? false : 'hidden'}
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer}
      className="mx-auto w-full max-w-5xl"
    >
      <div className="relative overflow-hidden rounded-3xl bg-sb-navy p-6 text-sb-cream shadow-[0_18px_40px_rgba(8,31,52,0.18)] ring-1 ring-sb-navy min-[880px]:p-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-sb-accent/15 mix-blend-soft-light blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-16 size-64 rounded-full bg-sb-accent-hot/15 mix-blend-soft-light blur-3xl"
        />
        <div className="relative flex flex-col gap-5">
          <motion.span
            variants={revealUp}
            className="inline-flex items-center gap-2 text-sb-accent"
          >
            <GitBranch aria-hidden className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em]">
              The audit trail
            </span>
          </motion.span>
          <motion.h3
            variants={revealUp}
            className="font-display text-[clamp(1.6rem,3vw,2.2rem)] font-medium italic leading-[1.1] tracking-[-0.04em] text-sb-accent"
          >
            aec-financials, on GitHub.
          </motion.h3>
          <motion.div variants={revealUp} className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-sb-navy-hot px-4 py-2 ring-1 ring-sb-cream/10">
              <code className="font-mono text-sm text-sb-cream">{REPO_DISPLAY}</code>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-2 rounded-full bg-sb-cream/10 px-3 py-2 text-sm font-medium text-sb-cream transition-colors hover:bg-sb-cream/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-accent"
            >
              {copyStatus === 'copied' ? (
                <>
                  <Check aria-hidden className="size-4" />
                  <span aria-live="polite">Copied</span>
                </>
              ) : (
                <>
                  <Copy aria-hidden className="size-4" />
                  <span>Copy URL</span>
                </>
              )}
            </button>
          </motion.div>
          <motion.div variants={revealUp}>
            <Button
              asChild
              className="rounded-full bg-sb-accent text-sb-navy hover:bg-sb-accent-hot focus-visible:ring-sb-accent"
            >
              <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
                Open the repo
                <ExternalLink aria-hidden className="size-4" />
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
