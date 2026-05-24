import {
  AlertTriangle,
  ArrowLeft,
  Bell,
  ChevronDown,
  ClipboardList,
  Columns2,
  RotateCw,
  Users,
  X,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import * as React from 'react';
import type { PortfolioScore, MemberProfile, PeopleResponse } from '@backend/types/people';
import type { SurveyDefinitionResponse, SurveyPortfolio } from '@backend/types/survey';
import { Button } from '@/components/ui/button';
import {
  PORTFOLIO_ICONS,
  PortfolioSpectra,
  LeaningsScatter,
  expertiseToOpacity,
  type ScatterPoint,
} from '@/components/people';
import { usePeoplePage, type PeoplePageState } from '@/hooks/usePeoplePage';
import { Caveat } from '@/components/prose';
import { Link } from '@/lib/router';
import { revealUp, staggerContainer, viewportOnce } from '@/lib/motion';
import { cn } from '@/lib/utils';

type ToggleKey = 'leadership' | 'members' | 'all';
type Members = PeopleResponse['members'];
type Portfolios = SurveyDefinitionResponse['definition']['portfolios'];

function meanExpertise(member: MemberProfile): 1 | 2 | 3 | 4 | 5 {
  if (member.portfolioScores.length === 0) return 1;
  const sum = member.portfolioScores.reduce((acc, ds) => acc + ds.expertise, 0);
  const mean = sum / member.portfolioScores.length;
  return Math.max(1, Math.min(5, Math.round(mean))) as 1 | 2 | 3 | 4 | 5;
}

function memberToPoint(member: MemberProfile): ScatterPoint {
  return {
    id: member.id,
    label: member.name,
    sublabel: member.role,
    economicAxis: member.economicAxis,
    socialAxis: member.socialAxis,
    opacity: expertiseToOpacity(meanExpertise(member)),
    leadership: member.isLeadership,
  };
}

function portfolioScoreToPoint(
  ds: PortfolioScore,
  portfolio: SurveyPortfolio | undefined,
): ScatterPoint | null {
  if (ds.economicComponent === null && ds.socialComponent === null) return null;
  return {
    id: ds.portfolioId,
    label: portfolio?.name ?? ds.portfolioId,
    sublabel: `Expertise: ${ds.expertise}/5 · Score: ${Math.round(ds.score)}`,
    economicAxis: ds.economicComponent ?? 0,
    socialAxis: ds.socialComponent ?? 0,
    opacity: expertiseToOpacity(ds.expertise),
    icon: PORTFOLIO_ICONS[ds.portfolioId],
  };
}

export function People() {
  const reduce = useReducedMotion() ?? false;
  const [state, retry] = usePeoplePage();
  return (
    <div className="flex flex-col gap-16 px-6 pb-24 pt-6 min-[880px]:gap-24 min-[880px]:px-12 min-[880px]:pt-10">
      <PeopleBand state={state} retry={retry} reduce={reduce} />
      <Caveat reduce={reduce}>
        Axes are derived from the policy portfolios in the Leadership Leanings Survey,
        aggregated by the economic and social mapping recorded against each item in the
        survey definition. Member profiles are placeholders until enough real submissions
        exist; the visible spread demonstrates how the chart will look once the team has
        filled it in.
      </Caveat>
      <SurveyCta reduce={reduce} />
      <PeopleFinalCta reduce={reduce} />
    </div>
  );
}

function PeopleHeader({ reduce }: { reduce: boolean }) {
  return (
    <motion.header
      initial={reduce ? false : 'hidden'}
      animate="visible"
      variants={staggerContainer}
      className="flex w-full flex-col items-start gap-5"
    >
      <PeopleEyebrow />
      <PeopleHeaderBody />
    </motion.header>
  );
}

function PeopleEyebrow() {
  return (
    <motion.span
      variants={revealUp}
      className="inline-flex items-center gap-2 text-sb-accent-hot"
    >
      <Users aria-hidden className="size-4" />
      <span className="text-xs font-semibold uppercase tracking-[0.22em]">People</span>
    </motion.span>
  );
}

function PeopleHeaderBody() {
  return (
    <>
      <motion.h1
        variants={revealUp}
        className="font-display text-[clamp(2.8rem,6.5vw,4.6rem)] font-medium italic leading-[1.02] tracking-[-0.05em] text-sb-accent"
      >
        A team with range, not a tribe.
      </motion.h1>
      <motion.blockquote
        variants={revealUp}
        className="flex w-full gap-4 border-l-4 border-sb-accent pl-4"
      >
        <p className="font-display text-[clamp(1.6rem,3.5vw,2.4rem)] font-medium italic leading-[1.15] tracking-[-0.03em] text-sb-navy">
          &ldquo;We wouldn&rsquo;t agree on everything.{' '}
          <span className="text-sb-accent-hot">That is exactly the point.</span>&rdquo;
        </p>
      </motion.blockquote>
      <motion.p
        variants={revealUp}
        className="max-w-[60ch] text-[1.05rem] leading-[1.6] text-sb-text"
      >
        Something Better Australia is built by people who would not agree on everything if you sat
        them around a kitchen table — and that is exactly the point. Below is where each of us sits
        across the major policy portfolios. Click anyone to see the detail.
      </motion.p>
    </>
  );
}

function PeopleBand({
  state,
  retry,
  reduce,
}: {
  state: PeoplePageState;
  retry: () => void;
  reduce: boolean;
}) {
  if (state.kind === 'loading') {
    return (
      <section className="mx-auto w-full max-w-5xl">
        <div className="grid grid-cols-1 gap-10 min-[880px]:grid-cols-2 min-[880px]:items-start min-[880px]:gap-12">
          <PeopleHeader reduce={reduce} />
          <LoadingCard reduce={reduce} />
        </div>
      </section>
    );
  }
  if (state.kind === 'error') {
    return (
      <section className="mx-auto w-full max-w-5xl">
        <div className="grid grid-cols-1 gap-10 min-[880px]:grid-cols-2 min-[880px]:items-start min-[880px]:gap-12">
          <PeopleHeader reduce={reduce} />
          <ErrorCard message={state.message} onRetry={retry} />
        </div>
      </section>
    );
  }
  return (
    <section className="mx-auto w-full max-w-5xl">
      <Visualisation members={state.members} portfolios={state.portfolios} reduce={reduce} />
    </section>
  );
}

function LoadingCard({ reduce }: { reduce: boolean }) {
  return (
    <motion.div
      animate={reduce ? undefined : { opacity: [0.5, 1, 0.5] }}
      transition={reduce ? undefined : { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      className={cn(
        'flex min-h-[24rem] flex-col items-center justify-center gap-3 rounded-3xl bg-sb-white p-8 shadow-[0_12px_30px_rgba(8,31,52,0.08)] ring-1 ring-sb-cream-warm',
        reduce && 'opacity-70',
      )}
    >
      <Users aria-hidden className="size-6 text-sb-accent-hot" />
      <p className="text-sm text-sb-text-muted">Loading the team…</p>
    </motion.div>
  );
}

function ErrorCard({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex min-h-[24rem] flex-col items-center justify-center gap-4 rounded-3xl bg-sb-white p-8 shadow-[0_12px_30px_rgba(8,31,52,0.08)] ring-1 ring-sb-error/30">
      <AlertTriangle aria-hidden className="size-6 text-sb-error" />
      <p className="max-w-[40ch] text-center text-sm text-sb-text">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-1.5 rounded-full bg-sb-cream-warm px-4 py-1.5 text-sm font-medium text-sb-navy transition-colors hover:bg-sb-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-accent"
      >
        <RotateCw aria-hidden className="size-4" />
        Try again
      </button>
    </div>
  );
}

function Visualisation({
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
          onMemberClicked={handleRightMemberClicked}
        />
      </div>
      <div ref={detailRef} className="mt-8 min-[880px]:mt-10">
        <AnimatePresence initial={false}>
          {!comparisonMode && rightSelectedMember && (
            <motion.section
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <MemberDetail
                member={rightSelectedMember}
                portfolios={portfolios}
                onClear={() => setRightSelectedId(undefined)}
              />
            </motion.section>
          )}
        </AnimatePresence>
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
                  {selectedPortfolio &&
                    (() => {
                      const Icon = PORTFOLIO_ICONS[selectedPortfolio.id];
                      if (!Icon) return null;
                      return (
                        <div className="relative">
                          <span
                            aria-label={selectedPortfolio.name}
                            className="peer flex size-8 shrink-0 items-center justify-center rounded-lg bg-sb-accent-hot text-sb-white"
                          >
                            <Icon aria-hidden className="size-4" />
                          </span>
                          <span
                            role="tooltip"
                            className="pointer-events-none absolute right-0 top-full z-10 mt-1 whitespace-nowrap rounded-md bg-sb-white px-2 py-1 font-display text-[0.72rem] text-sb-navy opacity-0 shadow-[0_4px_12px_rgba(8,31,52,0.12)] ring-1 ring-sb-cream-warm transition-opacity duration-150 peer-hover:opacity-100"
                          >
                            {selectedPortfolio.name}
                          </span>
                        </div>
                      );
                    })()}
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
                {selectedPortfolio &&
                  (() => {
                    const Icon = PORTFOLIO_ICONS[selectedPortfolio.id];
                    if (!Icon) return null;
                    return (
                      <div className="relative">
                        <span
                          aria-label={selectedPortfolio.name}
                          className="peer flex size-8 shrink-0 items-center justify-center rounded-lg bg-sb-accent-hot text-sb-white"
                        >
                          <Icon aria-hidden className="size-4" />
                        </span>
                        <span
                          role="tooltip"
                          className="pointer-events-none absolute right-0 top-full z-10 mt-1 whitespace-nowrap rounded-md bg-sb-white px-2 py-1 font-display text-[0.72rem] text-sb-navy opacity-0 shadow-[0_4px_12px_rgba(8,31,52,0.12)] ring-1 ring-sb-cream-warm transition-opacity duration-150 peer-hover:opacity-100"
                        >
                          {selectedPortfolio.name}
                        </span>
                      </div>
                    );
                  })()}
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
            />
          </div>
          {selectedMember && selectedPortfolio ? (
            <p className="mt-4 text-xs leading-[1.6] text-sb-text-muted min-[880px]:text-sm">
              <span className="font-medium text-sb-navy">{selectedMember.name}</span>&rsquo;s
              position on{' '}
              <span className="font-medium text-sb-navy">{selectedPortfolio.name}</span>. Tap the icon
              again to see all their portfolios.
            </p>
          ) : selectedMember ? (
            <p className="mt-4 text-xs leading-[1.6] text-sb-text-muted min-[880px]:text-sm">
              Each dot is one policy portfolio for{' '}
              <span className="font-medium text-sb-navy">{selectedMember.name}</span>. The spread
              across quadrants shows that a single person doesn&rsquo;t fit one party — they lean
              one way on some issues, another on others.
            </p>
          ) : selectedPortfolio ? (
            <p className="mt-4 text-xs leading-[1.6] text-sb-text-muted min-[880px]:text-sm">
              Each dot is a member&rsquo;s position on{' '}
              <span className="font-medium text-sb-navy">{selectedPortfolio.name}</span>. Click a
              member to drill into their full portfolio breakdown.
            </p>
          ) : (
            <p className="mt-4 text-xs leading-[1.6] text-sb-text-muted min-[880px]:text-sm">
              Up–down is social and cultural orientation; left–right is economic. Dot opacity
              reflects how expert that person rates themselves across the portfolios they answered.
            </p>
          )}
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
            <p className="px-2 py-3 text-center text-xs italic text-sb-text-muted">
              No matches
            </p>
          ) : (
            <ul role="list" className="m-0 flex max-h-72 list-none flex-col gap-0.5 overflow-y-auto p-0">
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

function MemberDetail({
  member,
  portfolios,
  onClear,
}: {
  member: MemberProfile;
  portfolios: Portfolios;
  onClear: () => void;
}) {
  return (
    <div className="rounded-3xl bg-sb-cream-warm/40 p-6 ring-1 ring-sb-cream-warm min-[880px]:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-medium leading-tight tracking-tight text-sb-navy min-[880px]:text-3xl">
            {member.name}
          </h2>
          <p className="mt-1 text-sm text-sb-text-muted">
            {member.role} · {member.background}
          </p>
        </div>
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear selection"
          className="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs text-sb-text-muted transition-colors hover:bg-sb-cream hover:text-sb-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-accent"
        >
          <X aria-hidden className="size-3.5" />
          Clear
        </button>
      </div>
      <div className="mt-6">
        <PortfolioSpectra member={member} portfolios={portfolios} />
      </div>
    </div>
  );
}

function SurveyCta({ reduce }: { reduce: boolean }) {
  return (
    <motion.section
      initial={reduce ? false : 'hidden'}
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer}
      className="mx-auto w-full max-w-5xl"
    >
      <div className="relative overflow-hidden rounded-3xl bg-sb-navy p-6 text-sb-cream shadow-[0_18px_40px_rgba(8,31,52,0.18)] ring-1 ring-sb-navy min-[880px]:p-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-sb-accent/15 mix-blend-soft-light blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-16 size-64 rounded-full bg-sb-accent-hot/15 mix-blend-soft-light blur-3xl"
        />
        <div className="relative flex flex-col gap-5">
          <motion.span
            variants={revealUp}
            className="inline-flex items-center gap-2 text-sb-accent"
          >
            <ClipboardList aria-hidden className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em]">
              Add your dot
            </span>
          </motion.span>
          <motion.h2
            variants={revealUp}
            className="font-display text-[clamp(1.8rem,3.5vw,2.6rem)] font-medium italic leading-[1.1] tracking-[-0.04em] text-sb-accent"
          >
            Where do you sit?
          </motion.h2>
          <motion.p
            variants={revealUp}
            className="max-w-[58ch] text-[1.05rem] leading-[1.6] text-sb-cream/90"
          >
            Take the 30-minute survey. We&rsquo;ll plot you anonymously alongside the team,
            and you&rsquo;ll see the diversity is real.
          </motion.p>
          <motion.div variants={revealUp}>
            <Button
              asChild
              className="rounded-full bg-sb-accent text-sb-navy hover:bg-sb-accent-hot focus-visible:ring-sb-accent"
            >
              <Link to="/survey">
                <ClipboardList aria-hidden className="size-4" />
                Take the survey
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

function PeopleFinalCta({ reduce }: { reduce: boolean }) {
  return (
    <section className="mx-auto w-full max-w-3xl text-center">
      <motion.div
        initial={reduce ? false : 'hidden'}
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="flex flex-col items-center gap-4"
      >
        <motion.span
          variants={revealUp}
          className="inline-flex items-center gap-2 text-sb-accent-hot"
        >
          <Bell aria-hidden className="size-4" />
          <span className="text-xs font-semibold uppercase tracking-[0.22em]">
            Stay in the loop
          </span>
        </motion.span>
        <motion.h2
          variants={revealUp}
          className="font-display text-[clamp(1.7rem,3.2vw,2.4rem)] font-medium leading-[1.15] tracking-[-0.03em] text-sb-navy"
        >
          Become a member.
        </motion.h2>
        <motion.p
          variants={revealUp}
          className="max-w-[58ch] text-[1.05rem] leading-[1.6] text-sb-text"
        >
          If you can make the next number larger, please join us.
        </motion.p>
        <motion.div variants={revealUp}>
          <Button
            asChild
            className="rounded-full bg-sb-navy text-sb-cream hover:bg-sb-navy-hot focus-visible:ring-sb-accent"
          >
            <Link to="/">
              <Bell aria-hidden className="size-4" />
              Become a member
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
