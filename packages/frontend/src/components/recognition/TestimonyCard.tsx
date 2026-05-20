import { MessageSquareQuote } from 'lucide-react';

export interface TestimonyCardProps {
  quote: string;
  name: string;
  location: string;
}

export function TestimonyCard({ quote, name, location }: TestimonyCardProps) {
  return (
    <figure className="flex h-full flex-col gap-4 rounded-2xl bg-sb-white p-6 shadow-[0_2px_8px_rgba(8,31,52,0.05)] ring-1 ring-sb-cream-warm">
      <MessageSquareQuote aria-hidden className="size-7 text-sb-accent" />
      <blockquote className="font-display text-[1.05rem] italic leading-[1.55] text-sb-text">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <figcaption className="mt-auto text-sm text-sb-text-muted">
        <span className="font-semibold text-sb-navy">{name}</span>
        <span aria-hidden className="px-1.5">·</span>
        {location}
      </figcaption>
    </figure>
  );
}
