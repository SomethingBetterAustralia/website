export function scoreToNormalised(score: number): number {
  const clamped = Math.max(-100, Math.min(100, score));
  return (clamped + 100) / 200;
}

// SVG y grows downward; angle = -π/2 returns (0.5, 0) → the top of the unit
// square. radius clamped to 0..1; output is the unit square's interior.
export function polarToCartesian(
  angle: number,
  radius: number,
): { x: number; y: number } {
  const r = Math.max(0, Math.min(1, radius)) * 0.5;
  return {
    x: 0.5 + Math.cos(angle) * r,
    y: 0.5 + Math.sin(angle) * r,
  };
}

export function polygonVertices(
  n: number,
): readonly { x: number; y: number; angle: number }[] {
  if (n < 3) return [];
  const out: { x: number; y: number; angle: number }[] = [];
  for (let i = 0; i < n; i += 1) {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    const pt = polarToCartesian(angle, 1);
    out.push({ x: pt.x, y: pt.y, angle });
  }
  return out;
}

// Linear map 1..5 → 0.25..1.0; step = 0.1875.
export function expertiseToOpacity(level: 1 | 2 | 3 | 4 | 5): number {
  return 0.25 + (level - 1) * 0.1875;
}
