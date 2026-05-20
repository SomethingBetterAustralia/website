import { motion, useReducedMotion } from 'motion/react';

export interface LineChartDatum {
  readonly date: string;
  readonly value: number;
}

export interface LineChartProps {
  readonly data: readonly LineChartDatum[];
  readonly height?: number;
  readonly colorClass?: string;
  readonly fillClass?: string;
  readonly ariaLabel: string;
}

const WIDTH = 600;
const DEFAULT_HEIGHT = 220;
const INSET = { top: 24, right: 24, bottom: 32, left: 40 } as const;

export function LineChart({
  data,
  height = DEFAULT_HEIGHT,
  colorClass = 'stroke-sb-accent',
  fillClass = 'fill-sb-accent/10',
  ariaLabel,
}: LineChartProps) {
  const reduce = useReducedMotion();

  const chartW = WIDTH - INSET.left - INSET.right;
  const chartH = height - INSET.top - INSET.bottom;

  const values = data.map((d) => d.value);
  const maxRaw = Math.max(...values, 1);
  const maxY = maxRaw * 1.05;
  const minY = 0;

  const xAt = (i: number) => INSET.left + (chartW * i) / Math.max(1, data.length - 1);
  const yAt = (v: number) =>
    INSET.top + chartH * (1 - (v - minY) / Math.max(1, maxY - minY));

  const linePath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i)} ${yAt(d.value)}`)
    .join(' ');

  const areaPath =
    linePath +
    ` L ${xAt(data.length - 1)} ${INSET.top + chartH}` +
    ` L ${xAt(0)} ${INSET.top + chartH} Z`;

  const gridYs = [0.25, 0.5, 0.75, 1].map((q) => INSET.top + chartH * q);

  const first = data[0];
  const last = data[data.length - 1];

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${height}`}
      className="h-auto w-full"
      role="img"
      aria-label={ariaLabel}
    >
      {gridYs.map((y, i) => (
        <line
          key={`g${i}`}
          x1={INSET.left}
          y1={y}
          x2={WIDTH - INSET.right}
          y2={y}
          strokeWidth={1}
          className="stroke-sb-cream-warm"
        />
      ))}
      <path d={areaPath} className={fillClass} />
      {reduce ? (
        <path
          d={linePath}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          className={colorClass}
        />
      ) : (
        <motion.path
          d={linePath}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          className={colorClass}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{ pathLength: 0 }}
        />
      )}
      <circle cx={xAt(0)} cy={yAt(first.value)} r={4} className="fill-sb-accent" />
      <circle
        cx={xAt(data.length - 1)}
        cy={yAt(last.value)}
        r={4}
        className="fill-sb-accent"
      />
      <text
        x={xAt(0)}
        y={yAt(first.value) + 18}
        textAnchor="start"
        className="fill-sb-text-muted font-mono text-[0.62rem]"
      >
        {first.date}
      </text>
      <text
        x={xAt(data.length - 1)}
        y={yAt(last.value) - 10}
        textAnchor="end"
        className="fill-sb-navy font-display text-[0.78rem] font-medium"
      >
        {last.value.toLocaleString()}
      </text>
      <text
        x={xAt(data.length - 1)}
        y={yAt(last.value) + 18}
        textAnchor="end"
        className="fill-sb-text-muted font-mono text-[0.62rem]"
      >
        {last.date}
      </text>
    </svg>
  );
}
