import { useReducedMotion } from 'motion/react';
import { Caveat } from '@/components/prose';
import { BaconBoardContribute } from './BaconBoardContribute';
import { BaconBoardEndorsementMechanic } from './BaconBoardEndorsementMechanic';
import { BaconBoardFinalCta } from './BaconBoardFinalCta';
import { BaconBoardHero } from './BaconBoardHero';
import { BaconBoardLeaderboard } from './BaconBoardLeaderboard';
import { BaconBoardQuests } from './BaconBoardQuests';
import { type ReduceMotion } from './BaconBoardShared';

export function BaconBoard() {
  const reduce = useReducedMotion();
  return (
    <div className="flex flex-col gap-16 px-6 pb-24 pt-6 min-[880px]:gap-24 min-[880px]:px-12 min-[880px]:pt-10">
      <BaconBoardHeroSection reduce={reduce} />
      <BaconBoardLeaderboard reduce={reduce} />
      <BaconBoardQuests reduce={reduce} />
      <BaconBoardConduct reduce={reduce} />
      <BaconBoardContribute reduce={reduce} />
      <BaconBoardFinalCta reduce={reduce} />
    </div>
  );
}

function BaconBoardHeroSection({ reduce }: { reduce: ReduceMotion }) {
  return (
    <section className="mx-auto w-full max-w-5xl">
      <div className="grid grid-cols-1 gap-10 min-[880px]:grid-cols-2 min-[880px]:items-start min-[880px]:gap-12">
        <BaconBoardHero reduce={reduce} />
        <BaconBoardEndorsementMechanic reduce={reduce} />
      </div>
    </section>
  );
}

function BaconBoardConduct({ reduce }: { reduce: ReduceMotion }) {
  return (
    <Caveat reduce={reduce}>
      Bacon Board has firm rules. Quest destinations are described, not named, on the public
      board — their identity propagates only down the endorsement, only to the forwarders who
      need it. Endorsements never reach the destination directly; the closing forwarder, who
      knows them, makes a single warm introduction on our behalf. Even if multiple endorsements
      converge, we serialise — one introduction, not five. If a destination declines, the
      endorsement ends quietly and no new endorsement is ever started toward them. Each person
      can be a Quest exactly once. Connector names are displayed only with consent — opt
      anonymous and only SBA knows it&rsquo;s you. We will close any endorsement that crosses
      these lines, and we will remove any connector who tries.
    </Caveat>
  );
}
