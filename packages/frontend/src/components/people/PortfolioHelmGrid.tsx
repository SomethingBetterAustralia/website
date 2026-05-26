import * as React from 'react';
import type { MemberProfile } from '@backend/types/people';
import { PortfolioHelmCard } from './PortfolioHelmCard';

export interface PortfolioHelmGridProps {
  readonly leaders: readonly MemberProfile[];
  readonly onSelect: (id: string) => void;
  readonly reduce: boolean | null;
}

export function PortfolioHelmGrid({
  leaders,
  onSelect,
  reduce,
}: PortfolioHelmGridProps): React.ReactElement | null {
  if (leaders.length === 0) return null;
  return (
    <ul
      role="list"
      className="grid list-none grid-cols-1 gap-3 p-0 min-[480px]:grid-cols-2 min-[720px]:grid-cols-3 min-[880px]:gap-4 min-[1024px]:grid-cols-5"
    >
      {leaders.map((member) => (
        <li key={member.id}>
          <PortfolioHelmCard member={member} onSelect={onSelect} reduce={reduce} />
        </li>
      ))}
    </ul>
  );
}
