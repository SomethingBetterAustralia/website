import { X } from 'lucide-react';
import type { MemberProfile } from '@backend/types/people';
import { PortfolioSpectra } from '@/components/people';
import { type Portfolios } from './PeopleShared';

export function PeopleMemberDetail({
  member,
  portfolios,
  onClear,
}: {
  member: MemberProfile;
  portfolios: Portfolios;
  onClear: () => void;
}) {
  return (
    <div className="rounded-3xl bg-sb-cream-warm/40 p-6 ring-1 ring-sb-cream-warm min-[880px]:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-medium leading-tight tracking-tight text-sb-navy min-[880px]:text-3xl">
            {member.name}
          </h2>
          <p className="mt-1 text-sm text-sb-text-muted">
            {member.role} · {member.background}
          </p>
        </div>
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear selection"
          className="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs text-sb-text-muted transition-colors hover:bg-sb-cream hover:text-sb-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-accent"
        >
          <X aria-hidden className="size-3.5" />
          Clear
        </button>
      </div>
      <div className="mt-6">
        <PortfolioSpectra member={member} portfolios={portfolios} />
      </div>
    </div>
  );
}
