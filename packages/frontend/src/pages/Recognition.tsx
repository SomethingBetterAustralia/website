import { AtSign, MessageSquareQuote, Newspaper, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import {
  CoverageCard,
  type CoverageTone,
} from '@/components/recognition/CoverageCard';
import { FeaturedStory } from '@/components/recognition/FeaturedStory';
import { TestimonyCard } from '@/components/recognition/TestimonyCard';
import { revealUp, staggerContainer, viewportOnce } from '@/lib/motion';

interface CoverageItem {
  readonly outlet: string;
  readonly title: string;
  readonly summary: string;
  readonly date: string;
  readonly url: string;
  readonly tone: CoverageTone;
}

const COVERAGE: readonly CoverageItem[] = [
  {
    outlet: "Women's Agenda",
    title:
      "Disillusionment with major parties fuels Charlotte Mortlock's new grassroots push",
    summary:
      'A deep-dive into why Mortlock left the Liberal Party and what she hopes Something Better will become.',
    date: 'May 2026',
    url: 'https://womensagenda.com.au/latest/disillusionment-with-major-parties-fuels-charlotte-mortlocks-new-grassroots-push/',
    tone: 'press',
  },
  {
    outlet: 'Crikey',
    title:
      'Something Better, or much worse? An incomplete history of splinter parties in Australian politics',
    summary:
      'Crikey contextualises Something Better against the long line of Australian splinter and minor parties.',
    date: '4 May 2026',
    url: 'https://www.crikey.com.au/2026/05/04/something-better-jacquie-lambie-one-nation-clive-palmer-cory-bernardi/',
    tone: 'opinion',
  },
  {
    outlet: 'EuropeSays',
    title: 'Why Charlotte Mortlock thinks she can change politics in Australia',
    summary:
      "A syndicated profile covering Mortlock's motivation and the long-term, issues-based vision behind the movement.",
    date: 'May 2026',
    url: 'https://www.europesays.com/australia/8346/',
    tone: 'press',
  },
  {
    outlet: 'Australian News Locally',
    title: 'Mortlock ditches Liberals to launch a new political movement',
    summary:
      'Coverage of the launch and the political moment that prompted Mortlock to step away from the Liberals.',
    date: '10 May 2026',
    url: 'https://australian5.com/2026/05/10/mortlock-ditches-liberals-to-launch-radical-new-party-shake-up/',
    tone: 'press',
  },
];

interface Testimony {
  readonly quote: string;
  readonly name: string;
  readonly location: string;
  readonly _isMock: true;
}

// MOCK: placeholder testimonies until real supporter quotes are collected.
const TESTIMONIES: readonly Testimony[] = [
  {
    quote:
      "I've never felt politically at home — Something Better is the first movement that sounds like it's actually listening.",
    name: 'MOCK: Sample supporter',
    location: 'NSW',
    _isMock: true,
  },
  {
    quote:
      "Long-term thinking, evidence over ideology, and decency. That's the Australia I want my kids to grow up in.",
    name: 'MOCK: Sample supporter',
    location: 'VIC',
    _isMock: true,
  },
];

export function Recognition() {
  const reduce = useReducedMotion();
  return (
    <div className="flex flex-col gap-16 px-6 pb-24 pt-12 min-[880px]:gap-24 min-[880px]:px-12 min-[880px]:pt-20">
      <motion.header
        initial={reduce ? false : 'hidden'}
        animate="visible"
        variants={staggerContainer}
        className="mx-auto flex w-full max-w-5xl flex-col items-start gap-4"
      >
        <motion.span
          variants={revealUp}
          className="inline-flex items-center gap-2 text-sb-accent-hot"
        >
          <Sparkles aria-hidden className="size-4" />
          <span className="text-xs font-semibold uppercase tracking-[0.22em]">Recognition</span>
        </motion.span>
        <motion.h1
          variants={revealUp}
          className="font-display text-[clamp(2.8rem,6.5vw,4.6rem)] font-medium italic leading-[1.02] tracking-[-0.05em] text-sb-accent"
        >
          Coverage, commentary, and voices.
        </motion.h1>
        <motion.p
          variants={revealUp}
          className="max-w-[52ch] text-[1.05rem] leading-[1.6] text-sb-text"
        >
          What the press is saying about Charlotte Mortlock and Something Better Australia, plus
          the supporters and stories that are starting to find us.
        </motion.p>
      </motion.header>

      <section className="mx-auto w-full max-w-5xl">
        <FeaturedStory
          outlet="ABC News"
          outletDate="10 May 2026"
          headline="Charlotte Mortlock launches Something Better, a new political movement"
          summary="Former journalist and ex-Liberal Party campaigner Charlotte Mortlock — founder of Hilma's Network — launches a long-term, issues-based movement aimed at breaking the left-versus-right binary. Mortlock told Women's Agenda that 'Australians are starving for hope and for more alternatives', and told triple j hack 'if you can't have a crack in Australia, where can you have a crack?'"
          url="https://www.abc.net.au/news/2026-05-10/charlotte-mortlock-something-better-liberals-greens-one-nation/106658632"
          audioUrl="https://mediacore-live-production.akamaized.net/audio/02/k9/Z/35.mp3"
        />
      </section>

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
            <Newspaper aria-hidden className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em]">In the press</span>
          </motion.span>
          <motion.h2
            variants={revealUp}
            className="font-display text-[clamp(1.7rem,3.2vw,2.4rem)] font-medium leading-[1.15] tracking-[-0.03em] text-sb-navy"
          >
            Recent coverage
          </motion.h2>
        </motion.div>
        <motion.ul
          initial={reduce ? false : 'hidden'}
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="grid list-none grid-cols-1 gap-4 p-0 min-[880px]:grid-cols-2"
        >
          {COVERAGE.map((item) => (
            <motion.li key={item.url} variants={revealUp}>
              <CoverageCard
                outlet={item.outlet}
                title={item.title}
                summary={item.summary}
                date={item.date}
                url={item.url}
                tone={item.tone}
              />
            </motion.li>
          ))}
        </motion.ul>
      </section>

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
            <MessageSquareQuote aria-hidden className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em]">Voices</span>
          </motion.span>
          <motion.h2
            variants={revealUp}
            className="font-display text-[clamp(1.7rem,3.2vw,2.4rem)] font-medium leading-[1.15] tracking-[-0.03em] text-sb-navy"
          >
            From the movement
          </motion.h2>
        </motion.div>
        <motion.ul
          initial={reduce ? false : 'hidden'}
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="grid list-none grid-cols-1 gap-4 p-0 min-[880px]:grid-cols-2"
        >
          {TESTIMONIES.map((t, i) => (
            <motion.li key={`${t.name}-${i}`} variants={revealUp}>
              <TestimonyCard quote={t.quote} name={t.name} location={t.location} />
            </motion.li>
          ))}
        </motion.ul>
      </section>

      <section className="mx-auto w-full max-w-5xl">
        {/* MOCK: socials stub — replace with real social links / embeds when accounts go live. */}
        <motion.div
          initial={reduce ? false : 'hidden'}
          whileInView="visible"
          viewport={viewportOnce}
          variants={revealUp}
          className="flex flex-col items-center gap-3 rounded-2xl bg-sb-white px-6 py-10 text-center shadow-[0_2px_8px_rgba(8,31,52,0.05)] ring-1 ring-sb-cream-warm"
        >
          <span className="inline-flex items-center gap-2 text-sb-accent-hot">
            <AtSign aria-hidden className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em]">Socials</span>
          </span>
          <p className="max-w-[42ch] text-[1rem] leading-[1.55] text-sb-text-muted">
            Live social posts and community highlights will land here once accounts are live.
          </p>
        </motion.div>
      </section>
    </div>
  );
}
