import type { LucideIcon } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import * as React from 'react';
import { scoreToNormalised } from './leanings-math';

export interface ScatterPoint {
  readonly id: string;
  readonly label: string;
  readonly sublabel: string;
  readonly economicAxis: number;
  readonly socialAxis: number;
  readonly opacity: number;
  readonly icon?: LucideIcon;
  readonly leadership?: boolean;
}

export interface LeaningsScatterProps {
  points: readonly ScatterPoint[];
  selectedPointId?: string;
  onSelectPoint?: (id: string) => void;
}

// 400×300 viewBox; 24px outer margin reserved for axis labels.
const VIEW_W = 400;
const VIEW_H = 300;
const PLOT_MIN = 24;
const PLOT_MAX_X = VIEW_W - PLOT_MIN;
const PLOT_MAX_Y = VIEW_H - PLOT_MIN;
const PLOT_SPAN_X = PLOT_MAX_X - PLOT_MIN;
const PLOT_SPAN_Y = PLOT_MAX_Y - PLOT_MIN;
const CENTRE_X = VIEW_W / 2;
const CENTRE_Y = VIEW_H / 2;
const GRID_TICKS_X: readonly number[] = [
  PLOT_MIN,
  PLOT_MIN + PLOT_SPAN_X / 4,
  CENTRE_X,
  PLOT_MIN + (3 * PLOT_SPAN_X) / 4,
  PLOT_MAX_X,
];
const GRID_TICKS_Y: readonly number[] = [
  PLOT_MIN,
  PLOT_MIN + PLOT_SPAN_Y / 4,
  CENTRE_Y,
  PLOT_MIN + (3 * PLOT_SPAN_Y) / 4,
  PLOT_MAX_Y,
];
const TOOLTIP_LABEL_LIMIT = 24;

function pointToPosition(point: ScatterPoint): { cx: number; cy: number } {
  const cx = PLOT_MIN + scoreToNormalised(point.economicAxis) * PLOT_SPAN_X;
  // y axis flipped: high socialAxis (progressive) sits at the top (low cy).
  const cy = PLOT_MIN + (1 - scoreToNormalised(point.socialAxis)) * PLOT_SPAN_Y;
  return { cx, cy };
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1) + '…';
}

interface ScatterDotProps {
  point: ScatterPoint;
  selected: boolean;
  onSelect?: (id: string) => void;
  onHoverChange: (id: string, hovering: boolean) => void;
  reduceMotion: boolean;
}

function ScatterDot({ point, selected, onSelect, onHoverChange, reduceMotion }: ScatterDotProps) {
  const { cx, cy } = pointToPosition(point);
  const clickable = Boolean(onSelect);
  const Icon = point.icon;
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <motion.g
        whileHover={reduceMotion ? undefined : { scale: 1.4 }}
        onMouseEnter={() => onHoverChange(point.id, true)}
        onMouseLeave={() => onHoverChange(point.id, false)}
        onFocus={() => onHoverChange(point.id, true)}
        onBlur={() => onHoverChange(point.id, false)}
        onClick={onSelect ? () => onSelect(point.id) : undefined}
        onKeyDown={
          onSelect
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelect(point.id);
                }
              }
            : undefined
        }
        tabIndex={clickable ? 0 : undefined}
        role={clickable ? 'button' : undefined}
        aria-label={clickable ? `${point.label}, ${point.sublabel}` : point.label}
        className={clickable ? 'cursor-pointer focus-visible:outline-none' : undefined}
        style={Icon ? { opacity: point.opacity } : undefined}
      >
        {Icon ? (
          <>
            <circle
              cx={0}
              cy={0}
              r={11}
              strokeWidth={1.5}
              className="fill-sb-white stroke-sb-accent-hot"
            />
            <foreignObject
              x={-7}
              y={-7}
              width={14}
              height={14}
              pointerEvents="none"
            >
              <div className="flex size-3.5 items-center justify-center">
                <Icon className="size-3.5 text-sb-accent-hot" aria-hidden />
              </div>
            </foreignObject>
          </>
        ) : selected ? (
          <circle cx={0} cy={0} r={8} strokeWidth={2} className="fill-sb-accent stroke-sb-navy" />
        ) : (
          <circle
            cx={0}
            cy={0}
            r={6}
            fillOpacity={point.opacity}
            className={point.leadership ? 'fill-sb-navy' : 'fill-sb-accent-hot'}
          />
        )}
      </motion.g>
    </g>
  );
}

function Tooltip({ cx, cy, point }: { cx: number; cy: number; point: ScatterPoint }) {
  const tooltipLeft = cx > 280;
  const tooltipAbove = cy > 220;
  const w = 156;
  const h = 40;
  const tipX = tooltipLeft ? cx - 12 - w : cx + 12;
  const tipY = tooltipAbove ? cy - 12 - h : cy + 12;
  return (
    <g pointerEvents="none">
      <rect
        x={tipX}
        y={tipY}
        width={w}
        height={h}
        rx={6}
        strokeWidth={1}
        className="fill-sb-white stroke-sb-cream-warm"
      />
      <text x={tipX + 10} y={tipY + 16} className="fill-sb-navy font-display text-[0.72rem]">
        {truncate(point.label, TOOLTIP_LABEL_LIMIT)}
      </text>
      <text x={tipX + 10} y={tipY + 30} className="fill-sb-text-muted text-[0.62rem]">
        {truncate(point.sublabel, TOOLTIP_LABEL_LIMIT + 4)}
      </text>
    </g>
  );
}

function SelectedLabel({ point }: { point: ScatterPoint }) {
  const { cx, cy } = pointToPosition(point);
  const labelLeft = cx >= CENTRE_X;
  const x = labelLeft ? cx - 14 : cx + 14;
  return (
    <text
      x={x}
      y={cy + 4}
      textAnchor={labelLeft ? 'end' : 'start'}
      className="fill-sb-navy font-display text-[0.78rem] font-medium"
      pointerEvents="none"
    >
      {truncate(point.label, TOOLTIP_LABEL_LIMIT)}
    </text>
  );
}

export function LeaningsScatter({
  points,
  selectedPointId,
  onSelectPoint,
}: LeaningsScatterProps) {
  const reduce = useReducedMotion() ?? false;
  const selected = points.find((p) => p.id === selectedPointId);
  const [hoverId, setHoverId] = React.useState<string | null>(null);
  const hovered = hoverId ? points.find((p) => p.id === hoverId) : undefined;
  const handleHoverChange = React.useCallback((id: string, hovering: boolean) => {
    setHoverId((cur) => (hovering ? id : cur === id ? null : cur));
  }, []);
  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className="h-auto w-full"
      role="img"
      aria-label="Member leanings scatter"
    >
      <defs>
        <radialGradient id="leanings-bg" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="var(--color-sb-cream-warm)" />
          <stop offset="100%" stopColor="var(--color-sb-white)" />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={VIEW_W} height={VIEW_H} fill="url(#leanings-bg)" />
      {GRID_TICKS_X.map((t) => (
        <line
          key={`v-${t}`}
          x1={t}
          y1={PLOT_MIN}
          x2={t}
          y2={PLOT_MAX_Y}
          strokeWidth={1}
          className={t === CENTRE_X ? 'stroke-sb-cream' : 'stroke-sb-cream-warm'}
        />
      ))}
      {GRID_TICKS_Y.map((t) => (
        <line
          key={`h-${t}`}
          x1={PLOT_MIN}
          y1={t}
          x2={PLOT_MAX_X}
          y2={t}
          strokeWidth={1}
          className={t === CENTRE_Y ? 'stroke-sb-cream' : 'stroke-sb-cream-warm'}
        />
      ))}
      <text
        x={CENTRE_X}
        y={14}
        textAnchor="middle"
        className="fill-sb-text-muted text-[0.65rem] uppercase tracking-[0.18em]"
      >
        More progressive →
      </text>
      <text
        x={CENTRE_X}
        y={VIEW_H - 6}
        textAnchor="middle"
        className="fill-sb-text-muted text-[0.65rem] uppercase tracking-[0.18em]"
      >
        More traditional
      </text>
      <text
        x={12}
        y={CENTRE_Y}
        textAnchor="middle"
        transform={`rotate(-90 12 ${CENTRE_Y})`}
        className="fill-sb-text-muted text-[0.65rem] uppercase tracking-[0.18em]"
      >
        More interventionist
      </text>
      <text
        x={VIEW_W - 12}
        y={CENTRE_Y}
        textAnchor="middle"
        transform={`rotate(90 ${VIEW_W - 12} ${CENTRE_Y})`}
        className="fill-sb-text-muted text-[0.65rem] uppercase tracking-[0.18em]"
      >
        More market
      </text>
      {points.map((point) =>
        point.id === selectedPointId ? null : (
          <ScatterDot
            key={point.id}
            point={point}
            selected={false}
            onSelect={onSelectPoint}
            onHoverChange={handleHoverChange}
            reduceMotion={reduce}
          />
        ),
      )}
      {selected && (
        <>
          <ScatterDot
            key={selected.id}
            point={selected}
            selected
            onSelect={onSelectPoint}
            onHoverChange={handleHoverChange}
            reduceMotion={reduce}
          />
          <SelectedLabel point={selected} />
        </>
      )}
      {hovered && (() => {
        const { cx, cy } = pointToPosition(hovered);
        return <Tooltip cx={cx} cy={cy} point={hovered} />;
      })()}
    </svg>
  );
}
