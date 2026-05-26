import { ArrowRight } from 'lucide-react';
import * as React from 'react';
import type { MemberProfile } from '@backend/types/people';
import { ProfileAvatar } from './ProfileAvatar';

export interface LeadershipBioCardProps {
  readonly member: MemberProfile;
}

export function LeadershipBioCard({ member }: LeadershipBioCardProps): React.ReactElement {
  const tags = member.focusAreas.slice(0, 4);
  return (
    <div className="w-[280px] rounded-2xl bg-sb-white p-4 shadow-[0_18px_40px_rgba(8,31,52,0.18)] ring-1 ring-sb-cream-warm">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <ProfileAvatar id={member.id} name={member.name} photoUrl={member.photoUrl} size={48} />
          <div className="min-w-0 flex-1">
            <p className="m-0 truncate font-display text-base font-medium leading-tight text-sb-navy">
              {member.name}
            </p>
            <p className="m-0 truncate text-xs text-sb-text-muted">
              {member.role}
              {member.location && ` · ${member.location}`}
            </p>
          </div>
        </div>
        {member.bioShort && (
          <p className="m-0 line-clamp-3 text-sm leading-[1.5] text-sb-text">
            {member.bioShort}
          </p>
        )}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-sb-cream-warm px-2 py-0.5 text-[0.65rem] font-medium text-sb-text"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="inline-flex items-center gap-1 text-[0.65rem] text-sb-text-muted">
          <span>Click for full profile</span>
          <ArrowRight aria-hidden className="size-3" />
        </div>
      </div>
    </div>
  );
}
