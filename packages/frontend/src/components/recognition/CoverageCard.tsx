import { ArrowUpRight, Megaphone, Mic, Newspaper, Radio, type LucideIcon } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badge = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em]',
  {
    variants: {
      tone: {
        press: 'bg-sb-cream-warm text-sb-navy-hot',
        opinion: 'bg-sb-accent/15 text-sb-accent-hot ring-1 ring-sb-accent/30',
        podcast: 'bg-sb-navy text-sb-cream',
        interview: 'bg-sb-cream text-sb-navy',
      },
    },
    defaultVariants: { tone: 'press' },
  }
);

export type CoverageTone = NonNullable<VariantProps<typeof badge>['tone']>;

const TONE_ICON: Record<CoverageTone, LucideIcon> = {
  press: Newspaper,
  opinion: Megaphone,
  podcast: Mic,
  interview: Radio,
};

export interface CoverageCardProps {
  outlet: string;
  title: string;
  summary: string;
  date: string;
  url: string;
  tone: CoverageTone;
}

export function CoverageCard({ outlet, title, summary, date, url, tone }: CoverageCardProps) {
  const Icon = TONE_ICON[tone];
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full flex-col gap-3 rounded-2xl bg-sb-white p-6 shadow-[0_2px_8px_rgba(8,31,52,0.05)] ring-1 ring-sb-cream-warm transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(8,31,52,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-accent"
    >
      <div className="flex items-center justify-between gap-3">
        <span className={cn(badge({ tone }))}>
          <Icon aria-hidden className="size-3.5" />
          {tone}
        </span>
        <time className="text-xs text-sb-text-muted">{date}</time>
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-sb-accent-hot">
          {outlet}
        </p>
        <h3 className="font-display text-xl font-medium leading-[1.2] tracking-[-0.02em] text-sb-text">
          {title}
        </h3>
        <p className="text-[0.95rem] leading-[1.55] text-sb-text-muted">{summary}</p>
      </div>
      <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-sb-accent-hot transition-all group-hover:gap-2">
        Read article
        <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
    </a>
  );
}
