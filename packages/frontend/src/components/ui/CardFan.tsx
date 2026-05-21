import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import * as React from 'react';
import { cn } from '@/lib/utils';

const CARD_WIDTH_PCT = 60;
const INACTIVE_SCALE = 0.95;
const AUTO_ADVANCE_MS = 8000;

export interface CardFanProps<T> {
  readonly items: readonly T[];
  readonly getKey: (item: T) => string;
  readonly getLabel: (item: T) => string;
  readonly renderCard: (item: T) => React.ReactNode;
  readonly ariaLabel: string;
  readonly mobileFallback?: React.ReactNode;
  readonly heightClass?: string;
}

export function CardFan<T>({
  items,
  getKey,
  getLabel,
  renderCard,
  ariaLabel,
  mobileFallback,
  heightClass = 'h-[24rem]',
}: CardFanProps<T>) {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    if (reduce || !inView || items.length <= 1) return;
    const id = window.setInterval(
      () => setActiveIndex((i) => (i + 1) % items.length),
      AUTO_ADVANCE_MS,
    );
    return () => window.clearInterval(id);
  }, [reduce, inView, activeIndex, items.length]);

  if (items.length === 0) return null;

  if (reduce) {
    return <>{mobileFallback ?? null}</>;
  }

  if (items.length === 1) {
    return (
      <div ref={ref} className={cn('relative mx-auto w-full', heightClass)}>
        {renderCard(items[0])}
      </div>
    );
  }

  const stepPct = (100 - CARD_WIDTH_PCT) / (items.length - 1);

  return (
    <>
      {mobileFallback !== undefined && (
        <div className="min-[880px]:hidden">{mobileFallback}</div>
      )}

      <div
        ref={ref}
        className={cn(mobileFallback !== undefined && 'hidden min-[880px]:block')}
      >
        <div
          className={cn('relative', heightClass)}
          role="region"
          aria-roledescription="carousel"
          aria-label={ariaLabel}
        >
          {items.map((item, i) => {
            const isActive = i === activeIndex;
            const leftPct = i * stepPct;
            const z = isActive
              ? 100
              : i < activeIndex
                ? i + 1
                : items.length - i;
            const label = getLabel(item);
            return (
              <motion.div
                key={getKey(item)}
                initial={false}
                animate={{
                  scale: isActive ? 1 : INACTIVE_SCALE,
                  zIndex: z,
                }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: `${leftPct}%`,
                  width: `${CARD_WIDTH_PCT}%`,
                  transformOrigin: 'center',
                }}
                onClick={() => setActiveIndex(i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveIndex(i);
                  }
                }}
                role={isActive ? undefined : 'button'}
                tabIndex={isActive ? -1 : 0}
                aria-label={isActive ? undefined : `Show: ${label}`}
                aria-current={isActive ? 'true' : undefined}
                className={cn(
                  'rounded-3xl',
                  !isActive &&
                    'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-accent',
                )}
              >
                {renderCard(item)}
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setActiveIndex((i) => (i - 1 + items.length) % items.length)}
            aria-label="Previous"
            className="inline-flex size-9 items-center justify-center rounded-full bg-sb-cream-warm text-sb-navy transition-colors hover:bg-sb-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-accent"
          >
            <ChevronLeft aria-hidden className="size-4" />
          </button>
          <div className="flex items-center gap-2">
            {items.map((item, i) => (
              <button
                key={getKey(item)}
                type="button"
                onClick={() => setActiveIndex(i)}
                aria-label={`Show ${i + 1}: ${getLabel(item)}`}
                aria-current={i === activeIndex ? 'true' : undefined}
                className={cn(
                  'rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-accent',
                  i === activeIndex
                    ? 'size-2.5 bg-sb-accent-hot'
                    : 'size-2 bg-sb-cream-warm hover:bg-sb-cream',
                )}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setActiveIndex((i) => (i + 1) % items.length)}
            aria-label="Next"
            className="inline-flex size-9 items-center justify-center rounded-full bg-sb-cream-warm text-sb-navy transition-colors hover:bg-sb-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-accent"
          >
            <ChevronRight aria-hidden className="size-4" />
          </button>
        </div>

        <p className="mt-3 text-center text-xs text-sb-text-muted">
          {activeIndex + 1} of {items.length}
        </p>
      </div>
    </>
  );
}
