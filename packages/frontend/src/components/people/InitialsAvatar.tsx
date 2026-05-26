import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InitialsAvatarProps {
  readonly id: string;
  readonly name: string;
  readonly width?: number;
  readonly height?: number;
  readonly shape?: 'circle' | 'rounded';
  readonly className?: string;
}

const PALETTE = ['sb-navy', 'sb-accent', 'sb-accent-hot', 'sb-text-muted'] as const;

export function pickFill(id: string): string {
  let sum = 0;
  for (let i = 0; i < id.length; i += 1) sum += id.charCodeAt(i);
  return `var(--color-${PALETTE[sum % PALETTE.length]})`;
}

export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase();
  }
  return (parts[0] ?? '').slice(0, 2).toUpperCase();
}

export function InitialsAvatar({
  id,
  name,
  width = 48,
  height,
  shape = 'circle',
  className,
}: InitialsAvatarProps): React.ReactElement {
  const h = height ?? width;
  const fontSize = Math.round(Math.min(width, h) * 0.375);
  return (
    <span
      role="img"
      aria-label={name}
      className={cn(
        'inline-flex shrink-0 select-none items-center justify-center font-display font-semibold text-sb-white',
        shape === 'circle' ? 'rounded-full' : 'rounded-2xl',
        className,
      )}
      style={{
        width,
        height: h,
        backgroundColor: pickFill(id),
        fontSize,
      }}
    >
      {initialsOf(name)}
    </span>
  );
}
