import { motion } from 'motion/react';
import * as React from 'react';
import type { MemberProfile } from '@backend/types/people';
import { ProfileAvatar } from './ProfileAvatar';

export interface PortfolioHelmCardProps {
  readonly member: MemberProfile;
  readonly onSelect: (id: string) => void;
  readonly reduce: boolean | null;
}

export function PortfolioHelmCard({
  member,
  onSelect,
  reduce,
}: PortfolioHelmCardProps): React.ReactElement {
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(member.id)}
      whileHover={reduce ? undefined : { y: -2 }}
      whileTap={reduce ? undefined : { scale: 0.99 }}
      className="flex h-full w-full flex-col items-center gap-2 rounded-2xl bg-sb-white p-4 text-center shadow-[0_4px_12px_rgba(8,31,52,0.06)] ring-1 ring-sb-cream-warm transition-colors hover:ring-sb-accent-hot focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-accent"
    >
      <ProfileAvatar
        id={member.id}
        name={member.name}
        photoUrl={member.photoUrl}
        size={128}
        aspect="portrait"
        className="mx-auto"
      />
      <span className="m-0 font-display text-sm font-medium leading-tight text-sb-navy">
        {member.name}
      </span>
      <span className="m-0 text-xs text-sb-text-muted">{member.role}</span>
      {member.location && (
        <span className="m-0 text-[0.65rem] text-sb-text-muted">{member.location}</span>
      )}
      {member.bioShort && (
        <p className="m-0 mt-2 line-clamp-2 flex-1 text-xs leading-snug text-sb-text-muted">
          {member.bioShort}
        </p>
      )}
    </motion.button>
  );
}
