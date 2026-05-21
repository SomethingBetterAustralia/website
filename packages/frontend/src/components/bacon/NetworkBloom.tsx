import { motion, useReducedMotion } from 'motion/react';

interface Node {
  readonly cx: number;
  readonly cy: number;
  readonly r: number;
  readonly level: 1 | 2 | 3;
}

interface Edge {
  readonly fromCx: number;
  readonly fromCy: number;
  readonly toCx: number;
  readonly toCy: number;
  readonly level: 1 | 2 | 3 | 4;
}

const STARTER = { cx: 60, cy: 250, r: 9 } as const;
const DEST = { cx: 540, cy: 250, r: 11 } as const;

const L1: readonly { cx: number; cy: number; r: number }[] = [
  { cx: 180, cy: 60, r: 6 },
  { cx: 180, cy: 155, r: 6 },
  { cx: 180, cy: 250, r: 6 },
  { cx: 180, cy: 345, r: 6 },
  { cx: 180, cy: 440, r: 6 },
];

const L2: readonly { cx: number; cy: number; r: number }[] = [
  { cx: 300, cy: 50, r: 5 },
  { cx: 300, cy: 100, r: 5 },
  { cx: 300, cy: 150, r: 5 },
  { cx: 300, cy: 195, r: 5 },
  { cx: 300, cy: 235, r: 5 },
  { cx: 300, cy: 265, r: 5 },
  { cx: 300, cy: 305, r: 5 },
  { cx: 300, cy: 350, r: 5 },
  { cx: 300, cy: 400, r: 5 },
  { cx: 300, cy: 450, r: 5 },
];

const L3: readonly { cx: number; cy: number; r: number }[] = [
  { cx: 420, cy: 130, r: 4 },
  { cx: 420, cy: 175, r: 4 },
  { cx: 420, cy: 215, r: 4 },
  { cx: 420, cy: 245, r: 4 },
  { cx: 420, cy: 265, r: 4 },
  { cx: 420, cy: 295, r: 4 },
  { cx: 420, cy: 335, r: 4 },
  { cx: 420, cy: 380, r: 4 },
];

const INTERMEDIATE_NODES: readonly Node[] = [
  ...L1.map((n) => ({ ...n, level: 1 as const })),
  ...L2.map((n) => ({ ...n, level: 2 as const })),
  ...L3.map((n) => ({ ...n, level: 3 as const })),
];

const EDGES: readonly Edge[] = [
  ...L1.map(
    (n) =>
      ({
        fromCx: STARTER.cx,
        fromCy: STARTER.cy,
        toCx: n.cx,
        toCy: n.cy,
        level: 1 as const,
      }) satisfies Edge,
  ),
  { fromCx: L1[0].cx, fromCy: L1[0].cy, toCx: L2[0].cx, toCy: L2[0].cy, level: 2 },
  { fromCx: L1[0].cx, fromCy: L1[0].cy, toCx: L2[1].cx, toCy: L2[1].cy, level: 2 },
  { fromCx: L1[1].cx, fromCy: L1[1].cy, toCx: L2[2].cx, toCy: L2[2].cy, level: 2 },
  { fromCx: L1[1].cx, fromCy: L1[1].cy, toCx: L2[3].cx, toCy: L2[3].cy, level: 2 },
  { fromCx: L1[2].cx, fromCy: L1[2].cy, toCx: L2[4].cx, toCy: L2[4].cy, level: 2 },
  { fromCx: L1[2].cx, fromCy: L1[2].cy, toCx: L2[5].cx, toCy: L2[5].cy, level: 2 },
  { fromCx: L1[3].cx, fromCy: L1[3].cy, toCx: L2[6].cx, toCy: L2[6].cy, level: 2 },
  { fromCx: L1[3].cx, fromCy: L1[3].cy, toCx: L2[7].cx, toCy: L2[7].cy, level: 2 },
  { fromCx: L1[4].cx, fromCy: L1[4].cy, toCx: L2[8].cx, toCy: L2[8].cy, level: 2 },
  { fromCx: L1[4].cx, fromCy: L1[4].cy, toCx: L2[9].cx, toCy: L2[9].cy, level: 2 },
  { fromCx: L2[0].cx, fromCy: L2[0].cy, toCx: L3[0].cx, toCy: L3[0].cy, level: 3 },
  { fromCx: L2[1].cx, fromCy: L2[1].cy, toCx: L3[0].cx, toCy: L3[0].cy, level: 3 },
  { fromCx: L2[1].cx, fromCy: L2[1].cy, toCx: L3[1].cx, toCy: L3[1].cy, level: 3 },
  { fromCx: L2[2].cx, fromCy: L2[2].cy, toCx: L3[1].cx, toCy: L3[1].cy, level: 3 },
  { fromCx: L2[2].cx, fromCy: L2[2].cy, toCx: L3[2].cx, toCy: L3[2].cy, level: 3 },
  { fromCx: L2[3].cx, fromCy: L2[3].cy, toCx: L3[2].cx, toCy: L3[2].cy, level: 3 },
  { fromCx: L2[4].cx, fromCy: L2[4].cy, toCx: L3[3].cx, toCy: L3[3].cy, level: 3 },
  { fromCx: L2[5].cx, fromCy: L2[5].cy, toCx: L3[4].cx, toCy: L3[4].cy, level: 3 },
  { fromCx: L2[6].cx, fromCy: L2[6].cy, toCx: L3[5].cx, toCy: L3[5].cy, level: 3 },
  { fromCx: L2[7].cx, fromCy: L2[7].cy, toCx: L3[5].cx, toCy: L3[5].cy, level: 3 },
  { fromCx: L2[7].cx, fromCy: L2[7].cy, toCx: L3[6].cx, toCy: L3[6].cy, level: 3 },
  { fromCx: L2[8].cx, fromCy: L2[8].cy, toCx: L3[6].cx, toCy: L3[6].cy, level: 3 },
  { fromCx: L2[8].cx, fromCy: L2[8].cy, toCx: L3[7].cx, toCy: L3[7].cy, level: 3 },
  { fromCx: L2[9].cx, fromCy: L2[9].cy, toCx: L3[7].cx, toCy: L3[7].cy, level: 3 },
  ...L3.map(
    (n) =>
      ({
        fromCx: n.cx,
        fromCy: n.cy,
        toCx: DEST.cx,
        toCy: DEST.cy,
        level: 4 as const,
      }) satisfies Edge,
  ),
];

function levelKeyframes(level: 1 | 2 | 3 | 4) {
  const ENTER = level * 0.15;
  const PEAK = ENTER + 0.08;
  return {
    values: [0, 0, 1, 1, 0, 0],
    times: [0, ENTER, PEAK, 0.9, 0.97, 1],
  };
}

function FlowGradientDef() {
  return (
    <defs>
      <linearGradient
        id="bacon-flow"
        gradientUnits="userSpaceOnUse"
        x1="0"
        y1="0"
        x2="600"
        y2="0"
      >
        <stop offset="0%" stopOpacity={0.55} style={{ stopColor: 'var(--color-sb-accent)' }} />
        <stop offset="100%" stopOpacity={0.55} style={{ stopColor: 'var(--color-sb-accent-hot)' }} />
      </linearGradient>
    </defs>
  );
}

export function NetworkBloom() {
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <svg
        viewBox="0 0 600 500"
        className="h-auto w-full"
        role="img"
        aria-label="Network of forwarding endorsements converging on a destination"
      >
        <FlowGradientDef />
        {EDGES.map((e, i) => (
          <line
            key={`e${i}`}
            x1={e.fromCx}
            y1={e.fromCy}
            x2={e.toCx}
            y2={e.toCy}
            strokeWidth={1.5}
            stroke="url(#bacon-flow)"
            fill="none"
          />
        ))}
        {INTERMEDIATE_NODES.map((n, i) => (
          <circle key={`n${i}`} cx={n.cx} cy={n.cy} r={n.r} className="fill-sb-navy" />
        ))}
        <circle cx={STARTER.cx} cy={STARTER.cy} r={STARTER.r} className="fill-sb-navy" />
        <circle
          cx={DEST.cx}
          cy={DEST.cy}
          r={18}
          fill="none"
          strokeWidth={1}
          strokeOpacity={0.4}
          className="stroke-sb-accent-hot"
        />
        <circle cx={DEST.cx} cy={DEST.cy} r={DEST.r} className="fill-sb-accent" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 600 500"
      className="h-auto w-full"
      role="img"
      aria-label="Network of forwarding endorsements converging on a destination"
    >
      <FlowGradientDef />
      {EDGES.map((e, i) => {
        const kf = levelKeyframes(e.level);
        return (
          <motion.line
            key={`e${i}`}
            x1={e.fromCx}
            y1={e.fromCy}
            x2={e.toCx}
            y2={e.toCy}
            strokeWidth={1.5}
            stroke="url(#bacon-flow)"
            fill="none"
            animate={{ pathLength: kf.values, opacity: kf.values }}
            transition={{ duration: 12, times: kf.times, repeat: Infinity, ease: 'linear' }}
            style={{ pathLength: 0 }}
          />
        );
      })}
      {INTERMEDIATE_NODES.map((n, i) => {
        const kf = levelKeyframes(n.level);
        return (
          <motion.circle
            key={`n${i}`}
            cx={n.cx}
            cy={n.cy}
            r={n.r}
            className="fill-sb-navy"
            animate={{ fillOpacity: kf.values }}
            transition={{ duration: 12, times: kf.times, repeat: Infinity, ease: 'linear' }}
            style={{ fillOpacity: 0 }}
          />
        );
      })}
      <circle cx={STARTER.cx} cy={STARTER.cy} r={STARTER.r} className="fill-sb-navy" />
      <motion.circle
        cx={STARTER.cx}
        cy={STARTER.cy}
        r={9}
        fill="none"
        strokeWidth={1.5}
        className="stroke-sb-navy-hot"
        animate={{ r: [9, 18, 9], opacity: [0.55, 0, 0.55] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
      />
      <circle
        cx={DEST.cx}
        cy={DEST.cy}
        r={18}
        fill="none"
        strokeWidth={1}
        strokeOpacity={0.4}
        className="stroke-sb-accent-hot"
      />
      <circle cx={DEST.cx} cy={DEST.cy} r={DEST.r} className="fill-sb-accent" />
      <motion.circle
        cx={DEST.cx}
        cy={DEST.cy}
        r={DEST.r}
        className="fill-sb-accent-hot"
        animate={{ opacity: [0, 0, 0, 1, 0, 0] }}
        transition={{
          duration: 12,
          times: [0, 0.68, 0.7, 0.75, 0.82, 1],
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{ opacity: 0 }}
      />
    </svg>
  );
}
