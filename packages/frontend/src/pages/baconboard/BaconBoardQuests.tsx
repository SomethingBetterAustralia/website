import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { QuestCard, type QuestCardProps } from '@/components/bacon';
import { CardFan } from '@/components/ui/CardFan';
import { revealUp, staggerContainer, viewportOnce } from '@/lib/motion';
import { type ReduceMotion } from './BaconBoardShared';

// MOCK: example quests until the game launches. Real quests will replace these.
const QUESTS: readonly QuestCardProps[] = [
  {
    status: 'open',
    description: 'A respected economist in regional NSW',
    reason: 'Their work on rural cost-of-living would sharpen our housing thinking.',
    endorsementsInMotion: 0,
    bestBaconNumber: null,
    daysOpen: 2,
    isMockNote: 'Example only — real quests launch with the game.',
  },
  {
    status: 'in-motion',
    description: 'A former independent MP, possibly returning',
    reason: 'We would like to hear what would make them say yes.',
    endorsementsInMotion: 14,
    bestBaconNumber: null,
    daysOpen: 9,
    isMockNote: 'Example only — real quests launch with the game.',
  },
  {
    status: 'closed-accepted',
    description: 'A leader in disability advocacy',
    reason: 'Their critique of our policy framing made us rethink the brief.',
    endorsementsInMotion: 6,
    bestBaconNumber: 4,
    daysOpen: 18,
    outcome: 'Conversation took place. The destination preferred not to be named publicly.',
    isMockNote: 'Example only — real quests launch with the game.',
  },
  {
    status: 'closed-declined',
    description: 'A senior climate scientist with policy experience',
    reason:
      'Their experience translating models into policy briefs is exactly what we need on energy.',
    endorsementsInMotion: 3,
    bestBaconNumber: null,
    daysOpen: 22,
    outcome:
      'Politely declined. Following our rules, no new endorsement will ever be started toward this person.',
    isMockNote: 'Example only — real quests launch with the game.',
  },
];

export function BaconBoardQuests({ reduce }: { reduce: ReduceMotion }) {
  return (
    <section
      id="bacon-quests"
      className="mx-auto w-full max-w-5xl scroll-mt-24 min-[880px]:scroll-mt-28"
    >
      <motion.div
        initial={reduce ? false : 'hidden'}
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="mb-2 flex flex-col gap-2"
      >
        <motion.span
          variants={revealUp}
          className="inline-flex items-center gap-2 text-sb-accent-hot"
        >
          <Sparkles aria-hidden className="size-4" />
          <span className="text-xs font-semibold uppercase tracking-[0.22em]">Quests</span>
        </motion.span>
        <motion.h2
          variants={revealUp}
          className="font-display text-[clamp(1.7rem,3.2vw,2.4rem)] font-medium leading-[1.15] tracking-[-0.03em] text-sb-navy"
        >
          What we&rsquo;d like to talk about
        </motion.h2>
      </motion.div>
      <p className="mb-6 mt-2 text-sm leading-[1.6] text-sb-text-muted">
        Open, in motion, and closed — we publish every outcome, including the declines.
      </p>

      <CardFan
        items={QUESTS}
        getKey={(q) => q.description}
        getLabel={(q) => q.description}
        renderCard={(q) => <QuestCard {...q} />}
        ariaLabel="Quests"
        mobileFallback={
          <motion.ul
            role="list"
            initial={reduce ? false : 'hidden'}
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer}
            className="grid list-none grid-cols-1 gap-6 p-0"
          >
            {QUESTS.map((q) => (
              <motion.li key={q.description} variants={revealUp}>
                <QuestCard {...q} />
              </motion.li>
            ))}
          </motion.ul>
        }
      />
    </section>
  );
}
