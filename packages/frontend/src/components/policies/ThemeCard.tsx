import { Lightbulb, Users } from 'lucide-react';

export type ConsensusSignal = 'strong' | 'moderate' | 'split';

export interface ThemeCardProps {
  readonly title: string;
  readonly summary: string;
  readonly ideaCount: number;
  readonly memberCount: number;
  readonly consensusSignal: ConsensusSignal;
  readonly topTags: readonly string[];
}

const CONSENSUS_SEGMENTS: Record<ConsensusSignal, readonly [string, string, string]> = {
  strong: ['bg-sb-accent', 'bg-sb-accent', 'bg-sb-accent'],
  moderate: ['bg-sb-accent', 'bg-sb-accent', 'bg-sb-cream-warm'],
  split: ['bg-sb-accent', 'bg-sb-cream-warm', 'bg-sb-error/40'],
};

const CONSENSUS_LABEL: Record<ConsensusSignal, string> = {
  strong: 'Strong cross-spectrum support',
  moderate: 'Moderate support',
  split: 'Split — needs more drafting',
};

function ConsensusBar({ signal }: { signal: ConsensusSignal }) {
  const segments = CONSENSUS_SEGMENTS[signal];
  const label = CONSENSUS_LABEL[signal];
  return (
    <div className="flex flex-col gap-1.5">
      <div role="img" aria-label={label} className="flex gap-1">
        {segments.map((cls, i) => (
          <span key={i} className={`h-1.5 flex-1 rounded-full ${cls}`} />
        ))}
      </div>
      <span className="text-xs text-sb-text-muted">{label}</span>
    </div>
  );
}

export function ThemeCard({
  title,
  summary,
  ideaCount,
  memberCount,
  consensusSignal,
  topTags,
}: ThemeCardProps) {
  return (
    <article className="flex h-full flex-col gap-4 rounded-2xl bg-sb-white p-6 ring-1 ring-sb-cream-warm">
      <div className="flex flex-wrap gap-1.5">
        {topTags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-sb-accent/10 px-2.5 py-0.5 text-xs font-medium text-sb-accent-hot"
          >
            {tag}
          </span>
        ))}
      </div>
      <h3 className="font-display text-xl font-medium leading-snug tracking-tight text-sb-navy">
        {title}
      </h3>
      <p className="text-[0.95rem] leading-[1.6] text-sb-text">{summary}</p>
      <div className="mt-auto flex flex-col gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-4 text-xs text-sb-text-muted">
          <span className="inline-flex items-center gap-1">
            <Lightbulb aria-hidden className="size-3.5" />
            {ideaCount} ideas merged
          </span>
          <span className="inline-flex items-center gap-1">
            <Users aria-hidden className="size-3.5" />
            {memberCount} members voted
          </span>
        </div>
        <ConsensusBar signal={consensusSignal} />
      </div>
    </article>
  );
}
