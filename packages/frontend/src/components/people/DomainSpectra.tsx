import { motion, useReducedMotion } from 'motion/react';
import type { MemberProfile } from '@backend/types/people';
import type { SurveyDomain } from '@backend/types/survey';
import { expertiseToOpacity, scoreToNormalised } from './leanings-math';

export interface DomainSpectraProps {
  member: MemberProfile;
  domains: readonly SurveyDomain[];
}

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

export function DomainSpectra({ member, domains }: DomainSpectraProps) {
  const reduce = useReducedMotion();
  const scoresById = new Map(member.domainScores.map((d) => [d.domainId, d]));
  return (
    <div className="flex flex-col gap-3 min-[880px]:gap-2">
      {domains.map((domain, index) => {
        const score = scoresById.get(domain.id);
        const hint = inferAxisHint(domain);
        const targetCx = score ? scoreToNormalised(score.score) * 400 : 200;
        const opacity = score ? expertiseToOpacity(score.expertise) : 0;
        const readout = score
          ? `Score ${Math.round(score.score)} out of 100, expertise level ${score.expertise} of 5`
          : 'No score reported.';
        return (
          <div
            key={domain.id}
            className="grid grid-cols-1 gap-2 min-[880px]:grid-cols-[2fr_3fr] min-[880px]:items-center min-[880px]:gap-4"
          >
            <div>
              <div className="font-display text-sm font-medium text-sb-navy">{domain.name}</div>
              <div className="text-xs text-sb-text-muted">{domain.blurb}</div>
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
          </div>
        );
      })}
    </div>
  );
}
