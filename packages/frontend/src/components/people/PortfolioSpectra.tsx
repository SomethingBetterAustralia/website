import { ChevronDown, Sparkles } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import * as React from 'react';
import type { DomainScore, MemberProfile } from '@backend/types/people';
import type { LikertResponse, SurveyDomain } from '@backend/types/survey';
import { cn } from '@/lib/utils';
import { DOMAIN_ICONS } from './domain-icons';
import { expertiseToOpacity, scoreToNormalised } from './leanings-math';

export interface DomainSpectraProps {
  member: MemberProfile;
  domains: readonly SurveyDomain[];
}

const LIKERT_VALUES: readonly (-2 | -1 | 0 | 1 | 2)[] = [-2, -1, 0, 1, 2];
const LIKERT_LABEL: Record<number, string> = {
  [-2]: 'Strongly disagree',
  [-1]: 'Disagree',
  [0]: 'Neutral',
  [1]: 'Agree',
  [2]: 'Strongly agree',
};

function inferAxisHint(domain: SurveyDomain): { left: string; right: string } {
  let economic = 0;
  let social = 0;
  let mixed = 0;
  for (const item of domain.items) {
    if (item.summaryAxis === 'economic') economic += 1;
    else if (item.summaryAxis === 'social') social += 1;
    else mixed += 1;
  }
  if (economic >= social && economic >= mixed) return { left: 'Interventionist', right: 'Market' };
  if (social >= mixed) return { left: 'Progressive', right: 'Traditional' };
  return { left: 'Less', right: 'More' };
}

function LikertDisplay({ response }: { response: LikertResponse }) {
  const skipped = response === null;
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <span className="inline-flex items-center gap-1">
        {LIKERT_VALUES.map((v) => (
          <span
            key={v}
            className={cn(
              'size-2 rounded-full',
              !skipped && response === v ? 'bg-sb-accent-hot' : 'bg-sb-cream-warm',
            )}
          />
        ))}
      </span>
      {skipped ? (
        <span className="text-xs italic text-sb-text-muted">Skipped</span>
      ) : (
        <span className="text-xs font-medium text-sb-navy">{LIKERT_LABEL[response]}</span>
      )}
    </div>
  );
}

function ExpertiseDisplay({ expertise }: { expertise: DomainScore['expertise'] }) {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <Sparkles aria-hidden className="size-4 text-sb-accent-hot" />
      <span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-sb-text-muted">
        Self-rated expertise
      </span>
      <span className="inline-flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            className={cn(
              'size-2 rounded-full',
              n <= expertise ? 'bg-sb-accent-hot' : 'bg-sb-cream-warm',
            )}
          />
        ))}
      </span>
      <span className="text-xs font-medium text-sb-navy">{expertise} of 5</span>
    </div>
  );
}

interface DomainRowProps {
  readonly domain: SurveyDomain;
  readonly score: DomainScore | undefined;
  readonly index: number;
  readonly reduce: boolean | null;
}

function DomainRow({ domain, score, index, reduce }: DomainRowProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const panelId = `domain-panel-${domain.id}`;
  const Icon = DOMAIN_ICONS[domain.id];
  const hint = inferAxisHint(domain);
  const targetCx = score ? scoreToNormalised(score.score) * 400 : 200;
  const opacity = score ? expertiseToOpacity(score.expertise) : 0;
  const readout = score
    ? `Score ${Math.round(score.score)} out of 100, expertise level ${score.expertise} of 5`
    : 'No score reported.';
  const expandable = Boolean(score);

  return (
    <div className="border-b border-sb-cream-warm/60 last:border-b-0">
      <button
        type="button"
        onClick={expandable ? () => setIsOpen((v) => !v) : undefined}
        aria-expanded={expandable ? isOpen : undefined}
        aria-controls={expandable ? panelId : undefined}
        disabled={!expandable}
        className={cn(
          'grid w-full grid-cols-1 gap-2 rounded-lg py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-accent',
          'min-[880px]:grid-cols-[2fr_3fr] min-[880px]:items-center min-[880px]:gap-4',
          expandable
            ? 'cursor-pointer hover:bg-sb-cream-warm/30'
            : 'cursor-default opacity-70',
        )}
      >
        <div className="flex items-start gap-2.5">
          {Icon && (
            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-sb-accent/10">
              <Icon className="size-3.5 text-sb-accent-hot" aria-hidden />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <div className="font-display text-sm font-medium text-sb-navy">{domain.name}</div>
            <div className="text-xs text-sb-text-muted">{domain.blurb}</div>
          </div>
          {expandable && (
            <ChevronDown
              aria-hidden
              className={cn(
                'mt-1 size-4 shrink-0 text-sb-text-muted transition-transform duration-200',
                isOpen && 'rotate-180',
              )}
            />
          )}
        </div>
        <div className="flex flex-col gap-1">
          <span className="sr-only">{readout}</span>
          <svg viewBox="0 0 400 32" className="h-auto w-full" aria-hidden>
            <rect x={0} y={12} width={400} height={8} rx={4} className="fill-sb-cream-warm" />
            <line
              x1={200}
              y1={6}
              x2={200}
              y2={26}
              strokeWidth={1.5}
              className="stroke-sb-cream"
            />
            {score ? (
              reduce ? (
                <circle
                  cx={targetCx}
                  cy={16}
                  r={8}
                  fillOpacity={opacity}
                  className="fill-sb-navy"
                />
              ) : (
                <motion.circle
                  cx={200}
                  cy={16}
                  r={8}
                  fillOpacity={opacity}
                  className="fill-sb-navy"
                  animate={{ cx: targetCx }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.04 }}
                />
              )
            ) : (
              <text
                x={200}
                y={20}
                textAnchor="middle"
                className="fill-sb-text-muted text-[0.7rem]"
              >
                —
              </text>
            )}
          </svg>
          <div className="flex justify-between text-[0.6rem] uppercase tracking-[0.18em] text-sb-text-muted">
            <span>{hint.left}</span>
            <span>{hint.right}</span>
          </div>
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && score && (
          <motion.div
            id={panelId}
            key="panel"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.22, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="mb-4 mt-1 rounded-2xl bg-sb-white p-5 ring-1 ring-sb-cream-warm">
              <ExpertiseDisplay expertise={score.expertise} />
              <ul role="list" className="mt-4 flex list-none flex-col p-0">
                {domain.items.map((item) => (
                  <li
                    key={item.code}
                    className="flex flex-col gap-2 border-t border-sb-cream-warm/40 py-3 first:border-t-0 first:pt-1 last:pb-1"
                  >
                    <p className="m-0 text-sm leading-[1.5] text-sb-text">{item.text}</p>
                    <LikertDisplay response={score.responses?.[item.code] ?? null} />
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DomainSpectra({ member, domains }: DomainSpectraProps) {
  const reduce = useReducedMotion();
  const scoresById = new Map(member.domainScores.map((d) => [d.domainId, d]));
  return (
    <div className="flex flex-col">
      {domains.map((domain, index) => (
        <DomainRow
          key={domain.id}
          domain={domain}
          score={scoresById.get(domain.id)}
          index={index}
          reduce={reduce}
        />
      ))}
    </div>
  );
}
