import { motion, useReducedMotion } from 'motion/react';

export interface BarChartDatum {
  readonly label: string;
  readonly value: number;
}

export interface BarChartProps {
  readonly data: readonly BarChartDatum[];
  readonly height?: number;
  readonly barClass?: string;
  readonly ariaLabel: string;
  readonly valueFormatter?: (v: number) => string;
}

const WIDTH = 600;
const DEFAULT_HEIGHT = 220;
const INSET = { top: 32, right: 16, bottom: 32, left: 16 } as const;

export function BarChart({
  data,
  height = DEFAULT_HEIGHT,
  barClass = 'fill-sb-accent',
  ariaLabel,
  valueFormatter,
}: BarChartProps) {
  const reduce = useReducedMotion();
  const chartW = WIDTH - INSET.left - INSET.right;
  const chartH = height - INSET.top - INSET.bottom;
  const baseline = INSET.top + chartH;

  const maxV = Math.max(...data.map((d) => d.value), 1);
  const slotW = chartW / data.length;
  const barW = slotW * 0.6;
  const barGap = slotW * 0.4;
  const fmt = valueFormatter ?? ((v: number) => v.toLocaleString());

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${height}`}
      className="h-auto w-full"
      role="img"
      aria-label={ariaLabel}
    >
      {data.map((d, i) => {
        const x = INSET.left + slotW * i + barGap / 2;
        const h = (d.value / maxV) * chartH;
        const y = baseline - h;
        const labelX = x + barW / 2;
        return (
          <g key={d.label}>
            {reduce ? (
              <rect x={x} y={y} width={barW} height={h} rx={4} className={barClass} />
            ) : (
              <motion.rect
                x={x}
                width={barW}
                rx={4}
                className={barClass}
                initial={{ y: baseline, height: 0 }}
                animate={{ y, height: h }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: 'easeOut' }}
              />
            )}
            <text
              x={labelX}
              y={y - 8}
              textAnchor="middle"
              className="fill-sb-text font-display text-[0.7rem] font-medium"
            >
              {fmt(d.value)}
            </text>
            <text
              x={labelX}
              y={baseline + 20}
              textAnchor="middle"
              className="fill-sb-text-muted font-mono text-[0.62rem] uppercase tracking-[0.15em]"
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
