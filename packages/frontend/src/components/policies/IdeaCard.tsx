import { ArrowUp, Clock, MessageSquare } from 'lucide-react';

export interface IdeaCardProps {
  readonly title: string;
  readonly excerpt: string;
  readonly upvotes: number;
  readonly commentCount: number;
  readonly tags: readonly string[];
  readonly authorHandle: string;
  readonly daysOpen: number;
}

export function IdeaCard({
  title,
  excerpt,
  upvotes,
  commentCount,
  tags,
  authorHandle,
  daysOpen,
}: IdeaCardProps) {
  return (
    <article className="flex h-full flex-col gap-3 rounded-2xl bg-sb-white p-6 shadow-[0_2px_8px_rgba(8,31,52,0.04)] ring-1 ring-sb-cream-warm transition-shadow hover:shadow-md">
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-sb-accent/10 px-2.5 py-0.5 text-xs font-medium text-sb-accent-hot"
          >
            {tag}
          </span>
        ))}
      </div>
      <h3 className="font-display text-lg font-medium leading-snug tracking-tight text-sb-navy">
        {title}
      </h3>
      <p className="line-clamp-3 text-[0.95rem] leading-[1.55] text-sb-text-muted">{excerpt}</p>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-sb-text-muted">
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled
            title="Voting opens when the platform launches"
            className="inline-flex items-center gap-1 disabled:cursor-not-allowed"
          >
            <ArrowUp aria-hidden className="size-3.5" />
            {upvotes}
          </button>
          <button
            type="button"
            disabled
            title="Voting opens when the platform launches"
            className="inline-flex items-center gap-1 disabled:cursor-not-allowed"
          >
            <MessageSquare aria-hidden className="size-3.5" />
            {commentCount}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span>{authorHandle}</span>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1">
            <Clock aria-hidden className="size-3" />
            {daysOpen}d
          </span>
        </div>
      </div>
    </article>
  );
}
