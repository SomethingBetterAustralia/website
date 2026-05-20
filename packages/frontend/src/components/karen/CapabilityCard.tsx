import type { LucideIcon } from 'lucide-react';

export interface CapabilityCardProps {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly body: string;
}

export function CapabilityCard({ icon: Icon, title, body }: CapabilityCardProps) {
  return (
    <article className="flex h-full flex-col gap-4 rounded-3xl bg-sb-white p-6 shadow-[0_2px_8px_rgba(8,31,52,0.05)] ring-1 ring-sb-cream-warm transition-shadow hover:shadow-md min-[880px]:p-7">
      <span className="flex size-12 items-center justify-center rounded-2xl bg-sb-accent/10">
        <Icon aria-hidden className="size-6 text-sb-accent-hot" />
      </span>
      <div className="flex flex-col gap-2">
        <h3 className="font-display text-xl font-medium leading-tight tracking-tight text-sb-navy">
          {title}
        </h3>
        <p className="text-[0.95rem] leading-[1.6] text-sb-text-muted">{body}</p>
      </div>
    </article>
  );
}
