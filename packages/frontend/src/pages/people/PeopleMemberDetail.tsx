import { MapPin, X } from 'lucide-react';
import type { MemberProfile } from '@backend/types/people';
import { PortfolioSpectra, ProfileAvatar } from '@/components/people';
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
  const hasMeta = Boolean(member.joined) || member.focusAreas.length > 0;
  return (
    <div className="rounded-3xl bg-sb-cream-warm/40 p-6 ring-1 ring-sb-cream-warm min-[880px]:p-8">
      <div className="flex flex-col gap-4 min-[880px]:flex-row min-[880px]:items-start">
        <div className="flex items-center gap-4 min-[880px]:flex-1">
          <ProfileAvatar
            id={member.id}
            name={member.name}
            photoUrl={member.photoUrl}
            size={56}
            className="shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-2xl font-medium leading-tight tracking-tight text-sb-navy min-[880px]:text-3xl">
              {member.name}
            </h2>
            <p className="mt-1 text-sm text-sb-text-muted">
              {member.role}
              {member.location && (
                <>
                  <span aria-hidden> · </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin aria-hidden className="size-3.5" />
                    {member.location}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear selection"
          className="inline-flex shrink-0 items-center gap-1 self-start rounded-full px-2 py-1 text-xs text-sb-text-muted transition-colors hover:bg-sb-cream hover:text-sb-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-accent"
        >
          <X aria-hidden className="size-3.5" />
          Clear
        </button>
      </div>

      {hasMeta && (
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-sb-text-muted">
          {member.joined && <span>Joined {member.joined}</span>}
          {member.joined && member.focusAreas.length > 0 && <span aria-hidden>·</span>}
          {member.focusAreas.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {member.focusAreas.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-sb-cream-warm px-2 py-0.5 text-[0.65rem] font-medium text-sb-text"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {member.bioLong && (
        <p className="mt-5 text-sm leading-[1.6] text-sb-text min-[880px]:text-base">
          {member.bioLong}
        </p>
      )}

      <div className="mt-6">
        <PortfolioSpectra member={member} portfolios={portfolios} />
      </div>
    </div>
  );
}
