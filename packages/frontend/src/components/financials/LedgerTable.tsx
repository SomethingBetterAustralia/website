import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Search,
  type LucideIcon,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import * as React from 'react';
import { revealUp, viewportOnce } from '@/lib/motion';
import { cn } from '@/lib/utils';

export type LedgerCategory =
  | 'Donations'
  | 'Founder'
  | 'Software'
  | 'Infrastructure'
  | 'Legal'
  | 'Events'
  | 'Fees'
  | 'Other';

export interface LedgerEntry {
  readonly id: string;
  readonly date: string;
  readonly description: string;
  readonly category: LedgerCategory;
  readonly direction: 'in' | 'out';
  readonly amount: number;
  readonly balance: number;
}

export interface LedgerTableProps {
  readonly entries: readonly LedgerEntry[];
  readonly lastSynced: string;
}

type DirectionFilter = 'all' | 'in' | 'out';

const AUD = new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' });
const formatCents = (cents: number): string => AUD.format(cents / 100);

const DIRECTION_OPTIONS: readonly { value: DirectionFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'in', label: 'In' },
  { value: 'out', label: 'Out' },
];

export function LedgerTable({ entries, lastSynced }: LedgerTableProps) {
  const reduce = useReducedMotion();
  const [direction, setDirection] = React.useState<DirectionFilter>('all');
  const [categories, setCategories] = React.useState<ReadonlySet<LedgerCategory>>(
    () => new Set(),
  );
  const [search, setSearch] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');

  React.useEffect(() => {
    const id = window.setTimeout(() => setDebouncedSearch(search), 150);
    return () => window.clearTimeout(id);
  }, [search]);

  const presentCategories = React.useMemo<readonly LedgerCategory[]>(() => {
    const seen = new Set<LedgerCategory>();
    for (const e of entries) seen.add(e.category);
    return Array.from(seen);
  }, [entries]);

  const sorted = React.useMemo(
    () =>
      [...entries].sort(
        (a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id),
      ),
    [entries],
  );

  const filtered = React.useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    return sorted.filter((e) => {
      if (direction !== 'all' && e.direction !== direction) return false;
      if (categories.size > 0 && !categories.has(e.category)) return false;
      if (q && !e.description.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [sorted, direction, categories, debouncedSearch]);

  const hasFilters = direction !== 'all' || categories.size > 0 || search !== '';

  function clearFilters() {
    setDirection('all');
    setCategories(new Set());
    setSearch('');
  }

  function toggleCategory(c: LedgerCategory) {
    setCategories((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  }

  return (
    <motion.div
      initial={reduce ? false : 'hidden'}
      whileInView="visible"
      viewport={viewportOnce}
      variants={revealUp}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-3 min-[880px]:flex-row min-[880px]:items-center min-[880px]:gap-4">
        <div
          role="group"
          aria-label="Filter by direction"
          className="inline-flex shrink-0 items-center gap-1 rounded-full bg-sb-cream-warm p-1"
        >
          {DIRECTION_OPTIONS.map((opt) => {
            const active = direction === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                aria-pressed={active}
                onClick={() => setDirection(opt.value)}
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-accent',
                  active
                    ? 'bg-sb-navy text-sb-cream'
                    : 'text-sb-text-muted hover:text-sb-navy',
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        <div
          role="group"
          aria-label="Filter by category"
          className="flex flex-wrap items-center gap-1.5"
        >
          {presentCategories.map((c) => {
            const active = categories.has(c);
            return (
              <button
                key={c}
                type="button"
                aria-pressed={active}
                onClick={() => toggleCategory(c)}
                className={cn(
                  'rounded-full px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-accent',
                  active
                    ? 'bg-sb-accent text-sb-navy'
                    : 'bg-sb-cream-warm text-sb-text-muted hover:text-sb-navy',
                )}
              >
                {c}
              </button>
            );
          })}
        </div>

        <div className="relative min-[880px]:ml-auto min-[880px]:w-64">
          <Search
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-sb-text-muted"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search description…"
            aria-label="Search ledger descriptions"
            className="w-full rounded-full bg-sb-white py-2 pl-10 pr-4 text-sm text-sb-text ring-1 ring-sb-cream-warm placeholder:text-sb-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-accent"
          />
        </div>

        <span className="shrink-0 text-xs text-sb-text-muted min-[880px]:ml-2">
          {filtered.length} {filtered.length === 1 ? 'entry' : 'entries'}
        </span>
      </div>

      {hasFilters && (
        <div>
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs font-medium text-sb-accent-hot hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-accent"
          >
            Clear filters
          </button>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-sb-white p-10 ring-1 ring-sb-cream-warm">
          <p className="text-sm text-sb-text-muted">No matching transactions.</p>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-medium text-sb-accent-hot hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-accent"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-2xl bg-sb-white ring-1 ring-sb-cream-warm min-[880px]:block">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-sb-cream-warm/40">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-sb-text-muted"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-sb-text-muted"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-sb-text-muted"
                  >
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-right text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-sb-text-muted"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-right text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-sb-text-muted"
                  >
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e, i) => {
                  const isIn = e.direction === 'in';
                  const Icon: LucideIcon = isIn ? ArrowDownToLine : ArrowUpFromLine;
                  const amountClass = isIn ? 'text-sb-accent-hot' : 'text-sb-text';
                  return (
                    <tr
                      key={e.id}
                      className={cn(
                        'transition-colors hover:bg-sb-cream-warm/30',
                        i !== filtered.length - 1 && 'border-b border-sb-cream-warm/60',
                      )}
                    >
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-sb-text-muted">
                        {e.date}
                      </td>
                      <td className="px-4 py-3 text-sb-text">{e.description}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-sb-cream-warm/60 px-2 py-0.5 text-xs text-sb-text">
                          {e.category}
                        </span>
                      </td>
                      <td
                        className={cn(
                          'whitespace-nowrap px-4 py-3 text-right font-display font-medium tabular-nums',
                          amountClass,
                        )}
                      >
                        <span className="inline-flex items-center gap-1.5">
                          <Icon aria-hidden className="size-3.5" />
                          {formatCents(e.amount)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right font-display font-medium tabular-nums text-sb-navy">
                        {formatCents(e.balance)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <ul
            role="list"
            className="flex list-none flex-col gap-3 p-0 min-[880px]:hidden"
          >
            {filtered.map((e) => {
              const isIn = e.direction === 'in';
              const Icon: LucideIcon = isIn ? ArrowDownToLine : ArrowUpFromLine;
              const amountClass = isIn ? 'text-sb-accent-hot' : 'text-sb-text';
              return (
                <li
                  key={e.id}
                  className="flex flex-col gap-2 rounded-2xl bg-sb-white p-4 ring-1 ring-sb-cream-warm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-sb-text-muted">{e.date}</span>
                    <span className="rounded-full bg-sb-cream-warm/60 px-2 py-0.5 text-xs text-sb-text">
                      {e.category}
                    </span>
                  </div>
                  <p className="text-sm text-sb-text">{e.description}</p>
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1.5 font-display text-base font-medium tabular-nums',
                        amountClass,
                      )}
                    >
                      <Icon aria-hidden className="size-3.5" />
                      {formatCents(e.amount)}
                    </span>
                    <span className="font-display text-base font-medium tabular-nums text-sb-navy">
                      {formatCents(e.balance)}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}

      <p className="text-xs text-sb-text-muted">
        Synced from Xero. Last updated: {lastSynced}.
      </p>
    </motion.div>
  );
}
