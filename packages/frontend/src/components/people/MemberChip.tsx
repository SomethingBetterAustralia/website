import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

export interface MemberChipProps {
  name: string;
  role: string;
  selected?: boolean;
  onClick?: () => void;
}

const baseClasses =
  'inline-flex items-center gap-2 rounded-full px-3 py-1.5 transition-colors min-[880px]:px-4 min-[880px]:py-2';
const nameClasses = 'font-display text-sm font-medium leading-tight';
const roleClasses = 'text-xs leading-tight opacity-70';

export function MemberChip({ name, role, selected = false, onClick }: MemberChipProps) {
  const reduce = useReducedMotion();
  const stateClasses = selected ? 'bg-sb-navy text-sb-cream' : 'bg-sb-cream-warm text-sb-navy';
  const content = (
    <>
      <span className={nameClasses}>{name}</span>
      <span className={roleClasses}>{role}</span>
    </>
  );
  if (!onClick) {
    return <span className={cn(baseClasses, stateClasses)}>{content}</span>;
  }
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={reduce ? undefined : { scale: 1.03 }}
      whileTap={reduce ? undefined : { scale: 0.98 }}
      className={cn(
        baseClasses,
        stateClasses,
        'cursor-pointer hover:ring-2 hover:ring-sb-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-accent',
      )}
    >
      {content}
    </motion.button>
  );
}
