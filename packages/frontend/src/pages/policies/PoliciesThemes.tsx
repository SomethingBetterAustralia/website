import { Layers } from 'lucide-react';
import { motion } from 'motion/react';
import { ThemeCard, type ThemeCardProps } from '@/components/policies';
import { CardFan } from '@/components/ui/CardFan';
import { revealUp, staggerContainer, viewportOnce } from '@/lib/motion';
import { type ReduceMotion } from './PoliciesShared';

// MOCK: theme-card examples until the policy platform is live.
const THEMES: readonly ThemeCardProps[] = [
  {
    title: 'Housing supply by federal preemption',
    summary:
      'A cluster of ideas converging on federal authority to override state and local planning obstacles where supply targets aren’t met. Includes density, modular construction, and infrastructure-linked release.',
    ideaCount: 8,
    memberCount: 142,
    consensusSignal: 'strong',
    topTags: ['housing', 'planning', 'federalism'],
  },
  {
    title: 'Regional connectivity',
    summary:
      'Rail spines, regional internet, decentralised government services. Different proposals, shared underlying idea: capitals get most things; regions get most of nothing.',
    ideaCount: 6,
    memberCount: 89,
    consensusSignal: 'moderate',
    topTags: ['regional', 'infrastructure'],
  },
  {
    title: 'Workforce strategy across health and care',
    summary:
      'Aged care, mental health, and primary care workforce shortages framed as a single national strategy rather than three separate fights.',
    ideaCount: 5,
    memberCount: 71,
    consensusSignal: 'moderate',
    topTags: ['healthcare', 'workforce'],
  },
];

export function PoliciesThemes({ reduce }: { reduce: ReduceMotion }) {
  return (
    <section className="mx-auto w-full max-w-5xl">
      <motion.div
        initial={reduce ? false : 'hidden'}
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="mb-8 flex flex-col gap-2"
      >
        <motion.span
          variants={revealUp}
          className="inline-flex items-center gap-2 text-sb-accent-hot"
        >
          <Layers aria-hidden className="size-4" />
          <span className="text-xs font-semibold uppercase tracking-[0.22em]">
            Stage 2 &mdash; Themes
          </span>
        </motion.span>
        <motion.h2
          variants={revealUp}
          className="font-display text-[clamp(1.7rem,3.2vw,2.4rem)] font-medium leading-[1.15] tracking-[-0.03em] text-sb-navy"
        >
          Clusters and consensus.
        </motion.h2>
      </motion.div>
      <motion.p
        initial={reduce ? false : 'hidden'}
        whileInView="visible"
        viewport={viewportOnce}
        variants={revealUp}
        className="mb-8 max-w-[64ch] text-[1.05rem] leading-[1.6] text-sb-text"
      >
        Ideas with sustained engagement get reviewed for clustering. Similar ideas get grouped;
        the original contributors get credited. At this stage the platform switches from simple
        upvotes to agree / disagree / pass voting &mdash; the Pol.is pattern. The interesting
        signal is which themes get support from members who otherwise disagree on most things.
        Those are what we promote to drafting.
      </motion.p>
      <CardFan
        items={THEMES}
        getKey={(theme) => theme.title}
        getLabel={(theme) => theme.title}
        renderCard={(theme) => <ThemeCard {...theme} />}
        ariaLabel="Stage 2 themes"
        mobileFallback={
          <motion.ul
            role="list"
            initial={reduce ? false : 'hidden'}
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer}
            className="grid list-none grid-cols-1 gap-6 p-0"
          >
            {THEMES.map((theme) => (
              <motion.li key={theme.title} variants={revealUp}>
                <ThemeCard {...theme} />
              </motion.li>
            ))}
          </motion.ul>
        }
      />
    </section>
  );
}
