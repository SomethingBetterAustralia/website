import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import * as React from 'react';

interface FaintStar {
  readonly cx: number;
  readonly cy: number;
  readonly r: number;
  readonly opacity: number;
}

interface TwinkleSpec {
  readonly starIndex: number;
  readonly periodMs: number;
  readonly delayMs: number;
  readonly minOpacity: number;
}

interface TraceTarget {
  readonly cx: number;
  readonly cy: number;
}

const STAR_CX = 400;
const STAR_CY = 340;
const TRACE_CYCLE_MS = 4000;

const FAINT_STARS: readonly FaintStar[] = [
  { cx: 60, cy: 50, r: 1.5, opacity: 0.55 },
  { cx: 120, cy: 110, r: 2.2, opacity: 0.65 },
  { cx: 200, cy: 70, r: 1.0, opacity: 0.40 },
  { cx: 290, cy: 110, r: 1.8, opacity: 0.50 },
  { cx: 370, cy: 60, r: 1.2, opacity: 0.35 },
  { cx: 450, cy: 95, r: 1.4, opacity: 0.45 },
  { cx: 540, cy: 50, r: 2.0, opacity: 0.60 },
  { cx: 610, cy: 100, r: 1.6, opacity: 0.55 },
  { cx: 700, cy: 70, r: 1.0, opacity: 0.30 },
  { cx: 760, cy: 120, r: 2.5, opacity: 0.70 },
  { cx: 90, cy: 200, r: 1.3, opacity: 0.45 },
  { cx: 180, cy: 240, r: 0.9, opacity: 0.30 },
  { cx: 260, cy: 180, r: 1.7, opacity: 0.55 },
  { cx: 320, cy: 250, r: 1.0, opacity: 0.35 },
  { cx: 490, cy: 200, r: 1.5, opacity: 0.50 },
  { cx: 560, cy: 240, r: 0.9, opacity: 0.30 },
  { cx: 640, cy: 180, r: 2.3, opacity: 0.65 },
  { cx: 720, cy: 260, r: 1.4, opacity: 0.45 },
  { cx: 110, cy: 410, r: 1.6, opacity: 0.50 },
  { cx: 200, cy: 460, r: 1.0, opacity: 0.35 },
  { cx: 300, cy: 390, r: 1.8, opacity: 0.55 },
  { cx: 520, cy: 430, r: 1.2, opacity: 0.40 },
  { cx: 610, cy: 410, r: 2.0, opacity: 0.60 },
  { cx: 700, cy: 470, r: 1.4, opacity: 0.45 },
];

const TWINKLES: readonly TwinkleSpec[] = [
  { starIndex: 1, periodMs: 4000, delayMs: 0, minOpacity: 0.20 },
  { starIndex: 9, periodMs: 5500, delayMs: 1200, minOpacity: 0.30 },
  { starIndex: 14, periodMs: 6000, delayMs: 600, minOpacity: 0.15 },
  { starIndex: 22, periodMs: 7000, delayMs: 1800, minOpacity: 0.20 },
];

const TRACE_TARGETS: readonly TraceTarget[] = [
  { cx: 120, cy: 110 },
  { cx: 640, cy: 180 },
  { cx: 200, cy: 460 },
  { cx: 610, cy: 100 },
  { cx: 610, cy: 410 },
];

export function OpenSky() {
  const reduce = useReducedMotion();
  const [activeTraceIndex, setActiveTraceIndex] = React.useState(0);

  React.useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(
      () => setActiveTraceIndex((i) => (i + 1) % TRACE_TARGETS.length),
      TRACE_CYCLE_MS,
    );
    return () => window.clearInterval(id);
  }, [reduce]);

  const twinkleStarIndices = new Set(TWINKLES.map((t) => t.starIndex));

  if (reduce) {
    return (
      <svg
        viewBox="0 0 800 500"
        className="h-auto w-full"
        role="img"
        aria-label="A bright star surrounded by sparse other stars"
      >
        <defs>
          <linearGradient id="open-sky-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-sb-navy-hot)" />
            <stop offset="100%" stopColor="var(--color-sb-navy)" />
          </linearGradient>
        </defs>
        <rect x={0} y={0} width={800} height={500} fill="url(#open-sky-bg)" />
        {FAINT_STARS.map((s, i) => (
          <circle
            key={`f${i}`}
            cx={s.cx}
            cy={s.cy}
            r={s.r}
            className="fill-sb-cream"
            opacity={s.opacity}
          />
        ))}
        <circle cx={STAR_CX} cy={STAR_CY} r={22} className="fill-sb-accent" opacity={0.25} />
        <circle cx={STAR_CX} cy={STAR_CY} r={10} className="fill-sb-accent" />
      </svg>
    );
  }

  const target = TRACE_TARGETS[activeTraceIndex];

  return (
    <svg
      viewBox="0 0 800 500"
      className="h-auto w-full"
      role="img"
      aria-label="A bright star surrounded by sparse other stars"
    >
      <defs>
        <linearGradient id="open-sky-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-sb-navy-hot)" />
          <stop offset="100%" stopColor="var(--color-sb-navy)" />
        </linearGradient>
        <filter id="open-star-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
        </filter>
      </defs>
      <rect x={0} y={0} width={800} height={500} fill="url(#open-sky-bg)" />

      {FAINT_STARS.map((s, i) =>
        twinkleStarIndices.has(i) ? null : (
          <circle
            key={`f${i}`}
            cx={s.cx}
            cy={s.cy}
            r={s.r}
            className="fill-sb-cream"
            opacity={s.opacity}
          />
        ),
      )}

      {TWINKLES.map((t) => {
        const s = FAINT_STARS[t.starIndex];
        return (
          <motion.circle
            key={`t${t.starIndex}`}
            cx={s.cx}
            cy={s.cy}
            r={s.r}
            className="fill-sb-cream"
            animate={{ opacity: [s.opacity, t.minOpacity, s.opacity] }}
            transition={{
              duration: t.periodMs / 1000,
              delay: t.delayMs / 1000,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ opacity: s.opacity }}
          />
        );
      })}

      <AnimatePresence mode="wait">
        <motion.line
          key={activeTraceIndex}
          x1={STAR_CX}
          y1={STAR_CY}
          x2={target.cx}
          y2={target.cy}
          className="stroke-sb-accent"
          strokeWidth={1}
          strokeOpacity={0.5}
          fill="none"
          animate={{ pathLength: [0, 1, 1, 0, 0], opacity: [0, 1, 1, 0, 0] }}
          transition={{
            duration: TRACE_CYCLE_MS / 1000,
            times: [0, 0.125, 0.5, 0.625, 1],
            ease: 'easeInOut',
          }}
          style={{ pathLength: 0, opacity: 0 }}
        />
      </AnimatePresence>

      <motion.circle
        cx={STAR_CX}
        cy={STAR_CY}
        r={22}
        className="fill-sb-accent"
        filter="url(#open-star-glow)"
        animate={{ r: [22, 26.4, 22], opacity: [0.2, 0.3, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{ opacity: 0.25 }}
      />
      <motion.circle
        cx={STAR_CX}
        cy={STAR_CY}
        r={10}
        className="fill-sb-accent"
        animate={{ r: [10, 11.5, 10], opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
    </svg>
  );
}
