import { Crown, Hash, Network, Trophy } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { revealUp, staggerContainer, viewportOnce } from '@/lib/motion';
import { cn } from '@/lib/utils';

interface LeaderboardEntry {
  readonly rank: number;
  readonly handle: string;
  readonly isAnonymous: boolean;
  readonly chainsClosed: number;
  readonly bestBaconNumber: number;
  readonly chainsInMotion: number;
}

// MOCK: leaderboard entries until the real game starts producing closed chains.
const ENTRIES: readonly LeaderboardEntry[] = [
  { rank: 1, handle: 'Margot K.', isAnonymous: false, chainsClosed: 12, bestBaconNumber: 3, chainsInMotion: 4 },
  { rank: 2, handle: 'Anonymous Connector #12', isAnonymous: true, chainsClosed: 9, bestBaconNumber: 3, chainsInMotion: 2 },
  { rank: 3, handle: 'Hassan T.', isAnonymous: false, chainsClosed: 8, bestBaconNumber: 4, chainsInMotion: 3 },
  { rank: 4, handle: 'Lena O.', isAnonymous: false, chainsClosed: 7, bestBaconNumber: 4, chainsInMotion: 1 },
  { rank: 5, handle: 'Anonymous Connector #41', isAnonymous: true, chainsClosed: 6, bestBaconNumber: 4, chainsInMotion: 5 },
  { rank: 6, handle: 'Priya S.', isAnonymous: false, chainsClosed: 5, bestBaconNumber: 5, chainsInMotion: 2 },
  { rank: 7, handle: 'Anonymous Connector #08', isAnonymous: true, chainsClosed: 4, bestBaconNumber: 5, chainsInMotion: 0 },
  { rank: 8, handle: 'Marko V.', isAnonymous: false, chainsClosed: 3, bestBaconNumber: 5, chainsInMotion: 1 },
];

const FILTER_LABELS = ['All', 'Named only', 'Anonymous only'] as const;

export function Leaderboard() {
  const reduce = useReducedMotion();
  return (
    <div className="flex flex-col gap-4">
      <div
        role="group"
        aria-label="Filter by connector visibility"
        className="inline-flex w-fit items-center gap-1 self-start rounded-full bg-sb-cream-warm p-1"
      >
        {FILTER_LABELS.map((label, i) => (
          <button
            key={label}
            type="button"
            disabled
            title="When the board is live, this will filter the view."
            className={cn(
              'inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed',
              i === 0 ? 'bg-sb-navy text-sb-cream opacity-90' : 'text-sb-text-muted opacity-80',
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <motion.ul
        role="list"
        initial={reduce ? false : 'hidden'}
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="flex list-none flex-col gap-3 p-0"
      >
        {ENTRIES.map((e) => (
          <motion.li
            key={e.rank}
            variants={revealUp}
            className="flex flex-wrap items-center gap-3 rounded-2xl bg-sb-white p-4 ring-1 ring-sb-cream-warm min-[880px]:gap-4"
          >
            <div className="flex w-14 shrink-0 items-center gap-1.5 font-display text-base font-medium text-sb-navy">
              {e.rank === 1 && <Crown aria-hidden className="size-4 text-sb-accent-hot" />}
              <span>{String(e.rank).padStart(2, '0')}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  'font-medium',
                  e.isAnonymous ? 'italic text-sb-text-muted' : 'text-sb-navy',
                )}
              >
                {e.handle}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-sb-text-muted">
              <div className="inline-flex items-center gap-1">
                <Trophy aria-hidden className="size-3.5" />
                {e.chainsClosed} closed
              </div>
              <div className="inline-flex items-center gap-1">
                <Hash aria-hidden className="size-3.5" />
                best {e.bestBaconNumber}
              </div>
              <div className="inline-flex items-center gap-1">
                <Network aria-hidden className="size-3.5" />
                {e.chainsInMotion} in motion
              </div>
            </div>
          </motion.li>
        ))}
      </motion.ul>
      <p className="text-xs italic text-sb-text-muted">
        Showing example data. The real leaderboard begins with the first closed chain.
      </p>
    </div>
  );
}
