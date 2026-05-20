import { Minus, TrendingDown, TrendingUp, type LucideIcon } from 'lucide-react';
import { Link, type Route } from '@/lib/router';

export interface StatCardProps {
  readonly icon: LucideIcon;
  readonly label: string;
  readonly value: string;
  readonly trend?: {
    readonly direction: 'up' | 'down' | 'flat';
    readonly label: string;
  };
  readonly link?: {
    readonly to: Route;
    readonly label?: string;
  };
  readonly subText?: string;
}

const TREND_ICON: Record<'up' | 'down' | 'flat', LucideIcon> = {
  up: TrendingUp,
  down: TrendingDown,
  flat: Minus,
};

const TREND_COLOR_CLASS: Record<'up' | 'down' | 'flat', string> = {
  up: 'text-sb-accent-hot',
  down: 'text-sb-text-muted',
  flat: 'text-sb-text-muted',
};

function StatCardBody({
  icon: Icon,
  label,
  value,
  trend,
  subText,
}: Pick<StatCardProps, 'icon' | 'label' | 'value' | 'trend' | 'subText'>) {
  const TrendIcon = trend ? TREND_ICON[trend.direction] : null;
  return (
    <article className="flex h-full flex-col gap-3 rounded-2xl bg-sb-white p-6 shadow-[0_2px_8px_rgba(8,31,52,0.04)] ring-1 ring-sb-cream-warm transition-shadow hover:shadow-md">
      <span className="flex size-10 items-center justify-center rounded-xl bg-sb-accent/10">
        <Icon aria-hidden className="size-5 text-sb-accent-hot" />
      </span>
      <span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-sb-text-muted">
        {label}
      </span>
      <span className="font-display text-3xl font-medium leading-tight text-sb-navy min-[880px]:text-4xl">
        {value}
      </span>
      {trend && TrendIcon && (
        <div
          className={`inline-flex items-center gap-1 text-xs ${TREND_COLOR_CLASS[trend.direction]}`}
        >
          <TrendIcon aria-hidden className="size-3.5" />
          <span>{trend.label}</span>
        </div>
      )}
      {subText && <p className="text-xs text-sb-text-muted">{subText}</p>}
    </article>
  );
}

export function StatCard(props: StatCardProps) {
  if (props.link) {
    return (
      <Link
        to={props.link.to}
        className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-accent"
        aria-label={props.link.label ?? `${props.label}: ${props.value}`}
      >
        <StatCardBody
          icon={props.icon}
          label={props.label}
          value={props.value}
          trend={props.trend}
          subText={props.subText}
        />
      </Link>
    );
  }
  return (
    <StatCardBody
      icon={props.icon}
      label={props.label}
      value={props.value}
      trend={props.trend}
      subText={props.subText}
    />
  );
}
