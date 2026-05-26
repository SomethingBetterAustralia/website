import { ArrowLeft, ChevronDown, Columns2, ShipWheel, User, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import * as React from 'react';
import {
  FindMemberPill,
  LeaningsScatter,
  PORTFOLIO_ICONS,
  PortfolioHelmGrid,
  expertiseToOpacity,
  type ScatterPoint,
} from '@/components/people';
import { staggerContainer } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { PeopleEyebrow, PeopleHeaderBody } from './PeopleHeader';
import { PeopleMemberDetail } from './PeopleMemberDetail';
import {
  memberToPoint,
  portfolioScoreToPoint,
  type Members,
  type Portfolios,
  type ToggleKey,
} from './PeopleShared';

export function PeopleChart({
  members,
  portfolios,
  reduce,
}: {
  members: Members;
  portfolios: Portfolios;
  reduce: boolean;
}) {
  const [comparisonMode, setComparisonMode] = React.useState(false);

  const [rightToggle, setRightToggle] = React.useState<ToggleKey>('leadership');
  const [rightSelectedId, setRightSelectedId] = React.useState<string | undefined>(undefined);
  const [rightSelectedPortfolioId, setRightSelectedPortfolioId] = React.useState<
    string | undefined
  >(undefined);

  const [leftToggle, setLeftToggle] = React.useState<ToggleKey>('members');
  const [leftSelectedId, setLeftSelectedId] = React.useState<string | undefined>(undefined);
  const [leftSelectedPortfolioId, setLeftSelectedPortfolioId] = React.useState<
    string | undefined
  >(undefined);

  const detailRef = React.useRef<HTMLDivElement | null>(null);

  const rightSelectedMember = React.useMemo(
    () => (rightSelectedId ? members.find((m) => m.id === rightSelectedId) : undefined),
    [rightSelectedId, members],
  );

  const leadership = React.useMemo(
    () => members.filter((m) => m.isLeadership),
    [members],
  );

  function toggleComparison() {
    setComparisonMode((m) => !m);
  }

  function handleRightMemberClicked() {
    if (comparisonMode) return;
    requestAnimationFrame(() => {
      detailRef.current?.scrollIntoView({
        behavior: reduce ? 'auto' : 'smooth',
        block: 'start',
      });
    });
  }

  function handleHelmSelect(id: string) {
    setRightSelectedId(id);
    handleRightMemberClicked();
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-10 min-[880px]:grid-cols-2 min-[880px]:items-start min-[880px]:gap-12">
        <motion.div
          initial={reduce ? false : 'hidden'}
          animate="visible"
          variants={staggerContainer}
          className="flex w-full flex-col items-start gap-5"
        >
          <PeopleEyebrow />
          {comparisonMode ? (
            <ChartCard
              key="left"
              members={members}
              portfolios={portfolios}
              reduce={reduce}
              toggle={leftToggle}
              setToggle={setLeftToggle}
              selectedId={leftSelectedId}
              setSelectedId={setLeftSelectedId}
              selectedPortfolioId={leftSelectedPortfolioId}
              setSelectedPortfolioId={setLeftSelectedPortfolioId}
              comparisonActive
              onToggleComparison={toggleComparison}
              topOffset={false}
            />
          ) : (
            <PeopleHeaderBody />
          )}
        </motion.div>
        <ChartCard
          key="right"
          members={members}
          portfolios={portfolios}
          reduce={reduce}
          toggle={rightToggle}
          setToggle={setRightToggle}
          selectedId={rightSelectedId}
          setSelectedId={setRightSelectedId}
          selectedPortfolioId={rightSelectedPortfolioId}
          setSelectedPortfolioId={setRightSelectedPortfolioId}
          comparisonActive={comparisonMode}
          onToggleComparison={toggleComparison}
          topOffset
        />
      </div>
      <div ref={detailRef} className="mt-8 scroll-mt-24 min-[880px]:mt-10">
        {!comparisonMode && (() => {
          const showMemberHeader = Boolean(
            rightSelectedMember && !rightSelectedMember.isLeadership,
          );
          const SectionIcon = showMemberHeader ? User : ShipWheel;
          const eyebrowText = showMemberHeader ? 'Member' : 'Leadership';
          const sectionTitle = showMemberHeader ? 'Member profile' : 'Our Portfolio Helm';
          const sectionDescription = rightSelectedMember
            ? `Below is ${rightSelectedMember.name}'s bio and survey portfolio breakdown. Click Clear to return to the team.`
            : 'Click anyone to see their bio and survey portfolio breakdown.';
          return (
          <section aria-labelledby="portfolio-helm-heading">
            <div className="mb-8 flex flex-col gap-4 min-[880px]:flex-row min-[880px]:items-center min-[880px]:justify-between min-[880px]:gap-6">
              <div className="flex flex-col gap-2 min-[880px]:flex-1">
                <span className="inline-flex items-center gap-2 text-sb-accent-hot">
                  <SectionIcon aria-hidden className="size-4" />
                  <span className="text-xs font-semibold uppercase tracking-[0.22em]">
                    {eyebrowText}
                  </span>
                </span>
                <h2
                  id="portfolio-helm-heading"
                  className="font-display text-[clamp(1.7rem,3.2vw,2.4rem)] font-medium leading-[1.15] tracking-[-0.03em] text-sb-navy"
                >
                  {sectionTitle}
                </h2>
                <p className="text-sm leading-[1.6] text-sb-text-muted min-[880px]:text-base">
                  {sectionDescription}
                </p>
              </div>
              {!rightSelectedMember && (
                <FindMemberPill reduce={reduce} className="min-[880px]:shrink-0" />
              )}
            </div>
            <AnimatePresence initial={false} mode="wait">
              {rightSelectedMember ? (
                <motion.div
                  key="detail"
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={reduce ? { duration: 0 } : { duration: 0.25, ease: 'easeOut' }}
                  className="overflow-hidden"
                >
                  <PeopleMemberDetail
                    member={rightSelectedMember}
                    portfolios={portfolios}
                    onClear={() => setRightSelectedId(undefined)}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="grid"
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0 }}
                  transition={reduce ? { duration: 0 } : { duration: 0.25, ease: 'easeOut' }}
                >
                  <PortfolioHelmGrid
                    leaders={leadership}
                    onSelect={handleHelmSelect}
                    reduce={reduce}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </section>
          );
        })()}
      </div>
    </>
  );
}

interface ChartCardProps {
  members: Members;
  portfolios: Portfolios;
  reduce: boolean;
  toggle: ToggleKey;
  setToggle: (next: ToggleKey) => void;
  selectedId: string | undefined;
  setSelectedId: React.Dispatch<React.SetStateAction<string | undefined>>;
  selectedPortfolioId: string | undefined;
  setSelectedPortfolioId: React.Dispatch<React.SetStateAction<string | undefined>>;
  comparisonActive: boolean;
  onToggleComparison: () => void;
  topOffset: boolean;
  onMemberClicked?: () => void;
}

function ChartCard({
  members,
  portfolios,
  reduce,
  toggle,
  setToggle,
  selectedId,
  setSelectedId,
  selectedPortfolioId,
  setSelectedPortfolioId,
  comparisonActive,
  onToggleComparison,
  topOffset,
  onMemberClicked,
}: ChartCardProps) {
  const counts = React.useMemo(() => {
    const leadership = members.filter((m) => m.isLeadership).length;
    return {
      leadership,
      members: members.length - leadership,
      all: members.length,
    };
  }, [members]);

  const filtered = React.useMemo(() => {
    if (toggle === 'leadership') return members.filter((m) => m.isLeadership);
    if (toggle === 'members') return members.filter((m) => !m.isLeadership);
    return members;
  }, [toggle, members]);

  const selectedMember = React.useMemo(
    () => (selectedId ? members.find((m) => m.id === selectedId) : undefined),
    [selectedId, members],
  );

  const selectedPortfolio = React.useMemo(
    () => (selectedPortfolioId ? portfolios.find((d) => d.id === selectedPortfolioId) : undefined),
    [selectedPortfolioId, portfolios],
  );

  const portfolioMode = Boolean(selectedMember);

  const points = React.useMemo<ScatterPoint[]>(() => {
    if (selectedMember && selectedPortfolio) {
      const ds = selectedMember.portfolioScores.find(
        (d) => d.portfolioId === selectedPortfolio.id,
      );
      if (!ds) return [];
      const p = portfolioScoreToPoint(ds, selectedPortfolio);
      return p ? [p] : [];
    }
    if (selectedMember) {
      const byId = new Map(portfolios.map((d) => [d.id, d]));
      const out: ScatterPoint[] = [];
      for (const ds of selectedMember.portfolioScores) {
        const p = portfolioScoreToPoint(ds, byId.get(ds.portfolioId));
        if (p) out.push(p);
      }
      return out;
    }
    if (selectedPortfolio) {
      const out: ScatterPoint[] = [];
      const ordered = [...filtered].sort(
        (a, b) => Number(a.isLeadership) - Number(b.isLeadership),
      );
      for (const member of ordered) {
        const ds = member.portfolioScores.find((d) => d.portfolioId === selectedPortfolio.id);
        if (!ds) continue;
        if (ds.economicComponent === null && ds.socialComponent === null) continue;
        out.push({
          id: member.id,
          label: member.name,
          sublabel: `Score ${Math.round(ds.score)} · Expertise ${ds.expertise}/5`,
          economicAxis: ds.economicComponent ?? 0,
          socialAxis: ds.socialComponent ?? 0,
          opacity: expertiseToOpacity(ds.expertise),
          leadership: member.isLeadership,
        });
      }
      return out;
    }
    const ordered = [...filtered].sort(
      (a, b) => Number(a.isLeadership) - Number(b.isLeadership),
    );
    return ordered.map(memberToPoint);
  }, [selectedMember, selectedPortfolio, portfolios, filtered]);

  function handleSelectMember(id: string) {
    setSelectedId(id);
    onMemberClicked?.();
  }

  function handleToggleChange(next: ToggleKey) {
    setToggle(next);
    setSelectedId(undefined);
  }

  function handleTogglePortfolio(id: string) {
    setSelectedPortfolioId((cur) => (cur === id ? undefined : id));
  }

  return (
    <div
      className={cn(
        'rounded-3xl bg-sb-white p-6 shadow-[0_12px_30px_rgba(8,31,52,0.08)] ring-1 ring-sb-cream-warm min-[880px]:p-8',
        topOffset && 'min-[880px]:mt-9',
      )}
    >
      <div className="flex min-h-[2.75rem] items-center">
        {portfolioMode && selectedMember ? (
          <div className="flex w-full items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedId(undefined)}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-sb-cream-warm px-3 py-1.5 text-sm font-medium text-sb-navy transition-colors hover:bg-sb-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-accent"
              >
                <ArrowLeft aria-hidden className="size-4" />
                All
              </button>
              <ComparisonButton active={comparisonActive} onClick={onToggleComparison} />
            </div>
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex min-w-0 items-center gap-1">
                <div className="min-w-0 text-right">
                  <p className="truncate font-display text-sm font-medium text-sb-navy">
                    {selectedMember.name}
                  </p>
                  <p className="truncate text-xs text-sb-text-muted">{selectedMember.role}</p>
                </div>
                <MemberPicker
                  members={members}
                  currentId={selectedMember.id}
                  onSelect={setSelectedId}
                />
              </div>
              {selectedPortfolio && (
                <ActivePortfolioPill portfolioId={selectedPortfolio.id} name={selectedPortfolio.name} />
              )}
            </div>
          </div>
        ) : (
          <div className="flex w-full items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Toggle
                current={toggle}
                counts={counts}
                onChange={handleToggleChange}
                reduce={reduce}
              />
              <ComparisonButton active={comparisonActive} onClick={onToggleComparison} />
            </div>
            {selectedPortfolio && (
              <ActivePortfolioPill portfolioId={selectedPortfolio.id} name={selectedPortfolio.name} />
            )}
          </div>
        )}
      </div>
      <ul
        role="list"
        className="mt-4 grid list-none grid-cols-5 gap-0.5 p-0 min-[880px]:grid-cols-15"
      >
        {portfolios.map((d) => {
          const Icon = PORTFOLIO_ICONS[d.id];
          if (!Icon) return null;
          const isActive = selectedPortfolioId === d.id;
          return (
            <li key={d.id} className="relative">
              <button
                type="button"
                onClick={() => handleTogglePortfolio(d.id)}
                aria-label={`Filter by ${d.name}`}
                aria-pressed={isActive}
                className={cn(
                  'peer inline-flex size-6 items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-accent',
                  isActive
                    ? 'bg-sb-accent-hot text-sb-white'
                    : 'text-sb-accent-hot hover:text-sb-navy',
                )}
              >
                <Icon aria-hidden className={isActive ? 'size-4' : 'size-5'} />
              </button>
              <span
                role="tooltip"
                className="pointer-events-none absolute left-1/2 top-full z-10 mt-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-sb-white px-2 py-1 font-display text-[0.72rem] text-sb-navy opacity-0 shadow-[0_4px_12px_rgba(8,31,52,0.12)] ring-1 ring-sb-cream-warm transition-opacity duration-150 peer-hover:opacity-100 peer-focus-visible:opacity-100"
              >
                {d.name}
              </span>
            </li>
          );
        })}
      </ul>
      <div className="mt-6">
        <LeaningsScatter
          points={points}
          selectedPointId={portfolioMode ? undefined : selectedId}
          onSelectPoint={portfolioMode ? undefined : handleSelectMember}
          members={members}
        />
      </div>
      {selectedMember && selectedPortfolio ? (
        <p className="mt-4 text-xs leading-[1.6] text-sb-text-muted min-[880px]:text-sm">
          <span className="font-medium text-sb-navy">{selectedMember.name}</span>&rsquo;s position
          on <span className="font-medium text-sb-navy">{selectedPortfolio.name}</span>. Tap the
          icon again to see all their portfolios.
        </p>
      ) : selectedMember ? (
        <p className="mt-4 text-xs leading-[1.6] text-sb-text-muted min-[880px]:text-sm">
          Each dot is one policy portfolio for{' '}
          <span className="font-medium text-sb-navy">{selectedMember.name}</span>. The spread
          across quadrants shows that a single person doesn&rsquo;t fit one party. They lean one
          way on some issues, another on others.
        </p>
      ) : selectedPortfolio ? (
        <p className="mt-4 text-xs leading-[1.6] text-sb-text-muted min-[880px]:text-sm">
          Each dot is a member&rsquo;s position on{' '}
          <span className="font-medium text-sb-navy">{selectedPortfolio.name}</span>. Click a
          member to drill into their full portfolio breakdown.
        </p>
      ) : (
        <p className="mt-4 text-xs leading-[1.6] text-sb-text-muted min-[880px]:text-sm">
          Up–down is social and cultural orientation; left–right is economic. Dot opacity reflects
          how expert that person rates themselves across the portfolios they answered.
        </p>
      )}
    </div>
  );
}

function ActivePortfolioPill({ portfolioId, name }: { portfolioId: string; name: string }) {
  const Icon = PORTFOLIO_ICONS[portfolioId];
  if (!Icon) return null;
  return (
    <div className="relative">
      <span
        aria-label={name}
        className="peer flex size-8 shrink-0 items-center justify-center rounded-lg bg-sb-accent-hot text-sb-white"
      >
        <Icon aria-hidden className="size-4" />
      </span>
      <span
        role="tooltip"
        className="pointer-events-none absolute right-0 top-full z-10 mt-1 whitespace-nowrap rounded-md bg-sb-white px-2 py-1 font-display text-[0.72rem] text-sb-navy opacity-0 shadow-[0_4px_12px_rgba(8,31,52,0.12)] ring-1 ring-sb-cream-warm transition-opacity duration-150 peer-hover:opacity-100"
      >
        {name}
      </span>
    </div>
  );
}

function MemberPicker({
  members,
  currentId,
  onSelect,
}: {
  members: Members;
  currentId: string;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  React.useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      setQuery('');
    }
  }, [open]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const others = members.filter((m) => m.id !== currentId);
    const sorted = [...others].sort((a, b) => {
      if (a.isLeadership !== b.isLeadership) return a.isLeadership ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    if (!q) return sorted;
    return sorted.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        m.background.toLowerCase().includes(q),
    );
  }, [members, currentId, query]);

  function handleSelect(id: string) {
    onSelect(id);
    setOpen(false);
  }

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Switch to another member"
        aria-expanded={open}
        className="inline-flex size-6 items-center justify-center text-sb-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-accent"
      >
        <ChevronDown
          aria-hidden
          className={cn('size-4 transition-transform', open && 'rotate-180')}
        />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-20 mt-1 flex w-72 flex-col gap-2 rounded-2xl bg-sb-white p-3 shadow-[0_18px_40px_rgba(8,31,52,0.18)] ring-1 ring-sb-cream-warm">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search by name, role, or background"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-md border-0 bg-sb-cream-warm/50 px-3 py-2 text-sm text-sb-navy placeholder:text-sb-text-muted focus:bg-sb-cream-warm focus:outline-none focus:ring-2 focus:ring-sb-accent"
          />
          {filtered.length === 0 ? (
            <p className="px-2 py-3 text-center text-xs italic text-sb-text-muted">No matches</p>
          ) : (
            <ul
              role="list"
              className="m-0 flex max-h-72 list-none flex-col gap-0.5 overflow-y-auto p-0"
            >
              {filtered.map((m) => (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(m.id)}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-sb-cream-warm focus-visible:bg-sb-cream-warm focus-visible:outline-none"
                  >
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate font-display text-sm font-medium text-sb-navy">
                        {m.name}
                      </span>
                      <span className="truncate text-xs text-sb-text-muted">{m.role}</span>
                    </div>
                    {m.isLeadership && (
                      <span className="shrink-0 rounded-full bg-sb-accent/15 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-sb-accent-hot">
                        Helm
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function ComparisonButton({ active, onClick }: { active: boolean; onClick: () => void }) {
  const label = active ? 'Exit comparison' : 'Compare';
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        aria-pressed={active}
        className={cn(
          'peer inline-flex size-9 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-accent',
          active
            ? 'bg-sb-accent-hot text-sb-white hover:bg-sb-accent'
            : 'bg-sb-cream-warm text-sb-navy hover:bg-sb-cream',
        )}
      >
        {active ? (
          <X aria-hidden className="size-4" />
        ) : (
          <Columns2 aria-hidden className="size-4" />
        )}
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute left-1/2 top-full z-10 mt-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-sb-white px-2 py-1 font-display text-[0.72rem] text-sb-navy opacity-0 shadow-[0_4px_12px_rgba(8,31,52,0.12)] ring-1 ring-sb-cream-warm transition-opacity duration-150 peer-hover:opacity-100 peer-focus-visible:opacity-100"
      >
        {label}
      </span>
    </div>
  );
}

function Toggle({
  current,
  counts,
  onChange,
  reduce,
}: {
  current: ToggleKey;
  counts: { leadership: number; members: number; all: number };
  onChange: (next: ToggleKey) => void;
  reduce: boolean;
}) {
  const items: ReadonlyArray<{ key: ToggleKey; label: string; count: number }> = [
    { key: 'leadership', label: 'Helm', count: counts.leadership },
    { key: 'members', label: 'Members', count: counts.members },
    { key: 'all', label: 'All', count: counts.all },
  ];
  return (
    <div
      role="tablist"
      aria-label="Member filter"
      className="inline-flex items-center gap-1 rounded-full bg-sb-cream-warm p-1"
    >
      {items.map((item) => {
        const active = current === item.key;
        return (
          <motion.button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.key)}
            whileTap={reduce ? undefined : { scale: 0.97 }}
            className={cn(
              'inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium transition-colors min-[880px]:px-4 min-[880px]:py-1.5',
              active ? 'bg-sb-navy text-sb-cream' : 'text-sb-text-muted hover:bg-sb-cream',
            )}
          >
            <span>{item.label}</span>
            <span className="text-xs opacity-70">· {item.count}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
