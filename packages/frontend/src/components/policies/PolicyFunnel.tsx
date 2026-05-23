import { ArrowDown, FileEdit, Layers, Lightbulb, Stamp, type LucideIcon } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import * as React from 'react';
import { revealUp, staggerContainer, viewportOnce } from '@/lib/motion';

interface Stage {
  readonly number: string;
  readonly icon: LucideIcon;
  readonly name: string;
  readonly count: string;
  readonly description: string;
}

// MOCK: stage counts until the policy platform is live.
const STAGES: readonly Stage[] = [
  {
    number: '01',
    icon: Lightbulb,
    name: 'Ideas',
    count: '47 open',
    description: 'Anyone submits. The community upvotes and comments.',
  },
  {
    number: '02',
    icon: Layers,
    name: 'Themes',
    count: '9 forming',
    description: 'Ideas cluster. Agree / disagree voting surfaces cross-spectrum consensus.',
  },
  {
    number: '03',
    icon: FileEdit,
    name: 'Drafts',
    count: '3 in progress',
    description: 'Working groups with portfolio experts shape the draft.',
  },
  {
    number: '04',
    icon: Stamp,
    name: 'Policies',
    count: '0 adopted',
    description: 'Adopted by the party, with dissent acknowledged.',
  },
];

type ReduceMotion = boolean | null;

function StageCell({ stage }: { stage: Stage }) {
  const Icon = stage.icon;
  return (
    <motion.div
      variants={revealUp}
      className="flex flex-1 flex-col items-center gap-2 rounded-2xl bg-sb-white p-5 text-center ring-1 ring-sb-cream-warm shadow-[0_2px_8px_rgba(8,31,52,0.05)] min-[880px]:p-6"
    >
      <span className="flex size-12 items-center justify-center rounded-2xl bg-sb-accent/10">
        <Icon aria-hidden className="size-6 text-sb-accent-hot" />
      </span>
      <span className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-sb-accent-hot">
        Stage {stage.number}
      </span>
      <h3 className="font-display text-lg font-medium leading-tight text-sb-navy">{stage.name}</h3>
      <span className="inline-flex items-center rounded-full bg-sb-cream-warm px-3 py-1 text-xs font-medium text-sb-text">
        {stage.count}
      </span>
      <p className="text-xs leading-[1.5] text-sb-text-muted">{stage.description}</p>
    </motion.div>
  );
}

function FunnelConnector({ index, reduce }: { index: number; reduce: ReduceMotion }) {
  return (
    <>
      <div aria-hidden className="flex justify-center min-[880px]:hidden">
        <ArrowDown className="size-6 text-sb-text-muted/60" />
      </div>
      <div
        aria-hidden
        className="relative hidden h-px w-12 shrink-0 self-center bg-sb-cream-warm min-[880px]:block"
      >
        {!reduce && (
          <motion.span
            className="absolute -top-[3px] left-0 size-1.5 rounded-full bg-sb-accent-hot"
            animate={{ x: [0, 48] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'linear',
              delay: index * 2,
            }}
          />
        )}
      </div>
    </>
  );
}

export function PolicyFunnel() {
  const reduce = useReducedMotion();
  return (
    <div>
      <motion.div
        initial={reduce ? false : 'hidden'}
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="flex flex-col items-stretch gap-4 min-[880px]:flex-row min-[880px]:items-stretch min-[880px]:gap-2"
      >
        {STAGES.map((stage, i) => (
          <React.Fragment key={stage.number}>
            <StageCell stage={stage} />
            {i < STAGES.length - 1 && <FunnelConnector index={i} reduce={reduce} />}
          </React.Fragment>
        ))}
      </motion.div>
      <p className="mx-auto mt-4 max-w-[58ch] text-center text-sm italic leading-[1.6] text-sb-text-muted">
        The platform that runs this funnel is in development. Counts shown are illustrative.
      </p>
    </div>
  );
}
