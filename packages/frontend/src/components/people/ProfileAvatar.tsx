import * as React from 'react';
import { cn } from '@/lib/utils';
import { InitialsAvatar } from './InitialsAvatar';

export interface ProfileAvatarProps {
  readonly id: string;
  readonly name: string;
  readonly photoUrl: string;
  readonly size?: number;
  readonly aspect?: 'square' | 'portrait';
  readonly className?: string;
}

export function ProfileAvatar({
  id,
  name,
  photoUrl,
  size = 48,
  aspect = 'square',
  className,
}: ProfileAvatarProps): React.ReactElement {
  const width = size;
  const height = aspect === 'portrait' ? Math.round(size * 1.25) : size;
  const shape: 'circle' | 'rounded' = aspect === 'portrait' ? 'rounded' : 'circle';

  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    setFailed(false);
  }, [id, photoUrl]);

  if (!photoUrl || failed) {
    return (
      <InitialsAvatar
        id={id}
        name={name}
        width={width}
        height={height}
        shape={shape}
        className={cn('ring-2 ring-sb-accent-hot', className)}
      />
    );
  }

  return (
    <span
      role="img"
      aria-label={name}
      className={cn(
        'inline-flex shrink-0 overflow-hidden bg-sb-cream-warm ring-2 ring-sb-accent-hot',
        shape === 'circle' ? 'rounded-full' : 'rounded-2xl',
        className,
      )}
      style={{ width, height }}
    >
      <img
        src={photoUrl}
        alt=""
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className="size-full object-cover"
      />
    </span>
  );
}
