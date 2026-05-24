import { ChevronDown, Sparkles } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import * as React from 'react';
import type { PortfolioScore, MemberProfile } from '@backend/types/people';
import type { LikertResponse, SurveyItem, SurveyPortfolio } from '@backend/types/survey';
import { cn } from '@/lib/utils';
import { PORTFOLIO_ICONS } from './portfolio-icons';
import { expertiseToOpacity, scoreToNormalised } from './leanings-math';

export interface PortfolioSpectraProps {
  member: MemberProfile;
  portfolios: readonly SurveyPortfolio[];
}

interface AxisHint {
  readonly left: string;
  readonly right: string;
}

const ECON_HINT: AxisHint = { left: 'Interventionist', right: 'Market' };
const SOCIAL_HINT: AxisHint = { left: 'Progressive', right: 'Traditional' };
const NEUTRAL_HINT: AxisHint = { left: 'Less', right: 'More' };

function inferAxisHint(portfolio: SurveyPortfolio): AxisHint {
  let economic = 0;
  let social = 0;
  let mixed = 0;
  for (const item of portfolio.items) {
    if (item.summaryAxis === 'economic') economic += 1;
    else if (item.summaryAxis === 'social') social += 1;
    else mixed += 1;
  }
  if (economic >= social && economic >= mixed) return ECON_HINT;
  if (social >= mixed) return SOCIAL_HINT;
  return NEUTRAL_HINT;
}

interface AggregateSliderProps {
  readonly value: number | null;
  readonly opacity: number;
  readonly index: number;
  readonly reduce: boolean | null;
  readonly hint: AxisHint;
  readonly label?: string;
}

function AggregateSlider({
  value,
  opacity,
  index,
  reduce,
  hint,
  label,
}: AggregateSliderProps) {
  const targetCx = value !== null ? scoreToNormalised(value) * 400 : 200;
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <span className="text-[0.55rem] font-semibold uppercase tracking-[0.18em] text-sb-accent-hot">
          {label}
        </span>
      )}
      <svg viewBox="0 0 400 32" className="h-auto w-full" aria-hidden>
        <rect x={0} y={12} width={400} height={8} rx={4} className="fill-sb-cream-warm" />
        <line x1={200} y1={6} x2={200} y2={26} strokeWidth={1.5} className="stroke-sb-cream" />
        {value !== null ? (
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
  );
}

function LikertSlider({
  response,
  reduce,
  index,
}: {
  response: LikertResponse;
  reduce: boolean | null;
  index: number;
}) {
  const skipped = response === null;
  // Map -2..+2 onto the same 0..400 track the aggregated slider uses:
  // -2 -> 0 (far left), 0 -> 200 (centre), +2 -> 400 (far right).
  const targetCx = skipped ? 200 : 200 + response * 100;
  return (
    <div className="flex flex-col gap-1">
      <svg viewBox="0 0 400 32" className="h-auto w-full" aria-hidden>
        <rect x={0} y={13} width={400} height={6} rx={3} className="fill-sb-cream-warm" />
        <line x1={200} y1={7} x2={200} y2={25} strokeWidth={1.5} className="stroke-sb-cream" />
        {skipped ? (
          <text
            x={200}
            y={20}
            textAnchor="middle"
            className="fill-sb-text-muted text-[0.7rem]"
          >
            —
          </text>
        ) : reduce ? (
          <circle cx={targetCx} cy={16} r={7} className="fill-sb-navy" />
        ) : (
          <motion.circle
            cx={200}
            cy={16}
            r={7}
            className="fill-sb-navy"
            animate={{ cx: targetCx }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.04 }}
          />
        )}
      </svg>
      <div className="flex justify-between text-[0.55rem] uppercase tracking-[0.18em] text-sb-text-muted">
        {skipped ? (
          <>
            <span />
            <span className="italic normal-case tracking-normal">Skipped</span>
          </>
        ) : (
          <>
            <span>Strongly disagree</span>
            <span>Strongly agree</span>
          </>
        )}
      </div>
    </div>
  );
}

function ExpertisePill({ expertise }: { expertise: PortfolioScore['expertise'] }) {
  return (
    <div className="mt-1 flex items-center gap-1.5">
      <Sparkles aria-hidden className="size-3 text-sb-accent-hot" />
      <span className="inline-flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            className={cn(
              'size-1.5 rounded-full',
              n <= expertise ? 'bg-sb-accent-hot' : 'bg-sb-cream-warm',
            )}
          />
        ))}
      </span>
      <span className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-sb-text-muted">
        Expertise {expertise}/5
      </span>
    </div>
  );
}

interface QuestionGridProps {
  readonly items: readonly SurveyItem[];
  readonly responses: Record<string, LikertResponse>;
  readonly reduce: boolean | null;
  readonly baseIndex: number;
  readonly labelOf: (item: SurveyItem) => string;
}

function QuestionGrid({ items, responses, reduce, baseIndex, labelOf }: QuestionGridProps) {
  return (
    <div className="grid grid-cols-1 gap-x-4 min-[880px]:grid-cols-[2fr_3fr]">
      {items.map((item, i) => (
        <React.Fragment key={item.code}>
          <p
            className={cn(
              'm-0 pb-1 pl-[38px] pt-3 text-xs font-light text-sb-text-muted min-[880px]:pb-3',
              i > 0 && 'border-t border-sb-cream-warm/40',
            )}
          >
            <span className="font-medium text-sb-navy">{labelOf(item)}</span> {item.text}
          </p>
          <div
            className={cn(
              'pb-3 pt-1 min-[880px]:py-3 min-[880px]:self-center',
              i > 0 && 'min-[880px]:border-t min-[880px]:border-sb-cream-warm/40',
            )}
          >
            <LikertSlider
              response={responses[item.code] ?? null}
              reduce={reduce}
              index={baseIndex + i}
            />
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

interface PortfolioRowProps {
  readonly portfolio: SurveyPortfolio;
  readonly score: PortfolioScore | undefined;
  readonly index: number;
  readonly reduce: boolean | null;
}

function PortfolioRow({ portfolio, score, index, reduce }: PortfolioRowProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const panelId = `portfolio-panel-${portfolio.id}`;
  const Icon = PORTFOLIO_ICONS[portfolio.id];
  const opacity = score ? expertiseToOpacity(score.expertise) : 0;
  const expandable = Boolean(score);

  const letter = String.fromCharCode(65 + index);
  const itemNumberByCode = new Map<string, number>();
  portfolio.items.forEach((item, i) => itemNumberByCode.set(item.code, i + 1));
  const labelOf = (item: SurveyItem) =>
    `${letter}.${itemNumberByCode.get(item.code) ?? '?'}`;

  const econItems = portfolio.items.filter((i) => i.summaryAxis === 'economic');
  const socialItems = portfolio.items.filter((i) => i.summaryAxis === 'social');
  const otherItems = portfolio.items.filter((i) => i.summaryAxis === 'none');
  const isMulti = econItems.length > 0 && socialItems.length > 0;

  const readout = score
    ? isMulti
      ? `Economic ${Math.round(score.economicComponent ?? 0)}, Social ${Math.round(score.socialComponent ?? 0)}, expertise ${score.expertise} of 5`
      : `Score ${Math.round(score.score)} out of 100, expertise ${score.expertise} of 5`
    : 'No score reported.';

  const firstLabel: string | undefined = isMulti
    ? 'Economic'
    : econItems.length > 0
      ? 'Economic'
      : socialItems.length > 0
        ? 'Social'
        : undefined;

  return (
    <div className="border-b-2 border-sb-navy/15 py-4 last:border-b-0">
      <div className="grid grid-cols-1 gap-y-2 min-[880px]:grid-cols-[2fr_3fr] min-[880px]:items-start min-[880px]:gap-x-4 min-[880px]:gap-y-3">
        <button
          type="button"
          onClick={expandable ? () => setIsOpen((v) => !v) : undefined}
          aria-expanded={expandable ? isOpen : undefined}
          aria-controls={expandable ? panelId : undefined}
          disabled={!expandable}
          className={cn(
            'flex items-start gap-2.5 rounded-lg text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-accent',
            expandable
              ? 'cursor-pointer hover:bg-sb-cream-warm/30'
              : 'cursor-default opacity-70',
          )}
        >
          {Icon && (
            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-sb-accent/10">
              <Icon className="size-3.5 text-sb-accent-hot" aria-hidden />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <div className="font-display text-sm font-medium text-sb-navy">
              ({letter}) {portfolio.name}
            </div>
            <div className="text-xs text-sb-text-muted">{portfolio.blurb}</div>
            {score && <ExpertisePill expertise={score.expertise} />}
            <span className="sr-only">{readout}</span>
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
        </button>

        <div>
          <AggregateSlider
            value={isMulti ? (score?.economicComponent ?? null) : (score?.score ?? null)}
            opacity={opacity}
            index={index}
            reduce={reduce}
            hint={isMulti ? ECON_HINT : inferAxisHint(portfolio)}
            label={firstLabel}
          />
        </div>

        <AnimatePresence initial={false}>
          {isOpen && score && (
            <motion.div
              key={`${panelId}-first`}
              id={panelId}
              initial={reduce ? false : { height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={reduce ? { duration: 0 } : { duration: 0.22, ease: 'easeOut' }}
              className="overflow-hidden min-[880px]:col-span-2"
            >
              <QuestionGrid
                items={isMulti ? econItems : portfolio.items}
                responses={score.responses}
                reduce={reduce}
                baseIndex={0}
                labelOf={labelOf}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {isMulti && (
          <>
            <div className="min-[880px]:col-start-2">
              <AggregateSlider
                value={score?.socialComponent ?? null}
                opacity={opacity}
                index={index}
                reduce={reduce}
                hint={SOCIAL_HINT}
                label="Social"
              />
            </div>
            <AnimatePresence initial={false}>
              {isOpen && score && (
                <motion.div
                  key={`${panelId}-social`}
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={reduce ? { duration: 0 } : { duration: 0.22, ease: 'easeOut' }}
                  className="overflow-hidden min-[880px]:col-span-2"
                >
                  <QuestionGrid
                    items={socialItems}
                    responses={score.responses}
                    reduce={reduce}
                    baseIndex={econItems.length}
                    labelOf={labelOf}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {isMulti && otherItems.length > 0 && (
          <>
            <AnimatePresence initial={false}>
              {isOpen && score && (
                <motion.div
                  key={`${panelId}-mixed-label`}
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={reduce ? { duration: 0 } : { duration: 0.22, ease: 'easeOut' }}
                  className="overflow-hidden min-[880px]:col-start-2"
                >
                  <span className="text-[0.55rem] font-semibold uppercase tracking-[0.18em] text-sb-accent-hot">
                    Mixed
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence initial={false}>
              {isOpen && score && (
                <motion.div
                  key={`${panelId}-mixed-questions`}
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={reduce ? { duration: 0 } : { duration: 0.22, ease: 'easeOut' }}
                  className="overflow-hidden min-[880px]:col-span-2"
                >
                  <QuestionGrid
                    items={otherItems}
                    responses={score.responses}
                    reduce={reduce}
                    baseIndex={econItems.length + socialItems.length}
                    labelOf={labelOf}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

      </div>
    </div>
  );
}

export function PortfolioSpectra({ member, portfolios }: PortfolioSpectraProps) {
  const reduce = useReducedMotion();
  const scoresById = new Map(member.portfolioScores.map((d) => [d.portfolioId, d]));
  return (
    <div className="flex flex-col">
      {portfolios.map((portfolio, index) => (
        <PortfolioRow
          key={portfolio.id}
          portfolio={portfolio}
          score={scoresById.get(portfolio.id)}
          index={index}
          reduce={reduce}
        />
      ))}
    </div>
  );
}
