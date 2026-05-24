import { Lightbulb } from 'lucide-react';
import { motion } from 'motion/react';
import { IdeaCard, type IdeaCardProps } from '@/components/policies';
import { CardFan } from '@/components/ui/CardFan';
import { revealUp, staggerContainer, viewportOnce } from '@/lib/motion';
import { type ReduceMotion } from './PoliciesShared';

// MOCK: idea-card examples until the policy platform is live.
const IDEAS: readonly IdeaCardProps[] = [
  {
    title: 'Fast-track approval for missing-middle housing in capital cities',
    excerpt:
      'State and local planning regimes are bottlenecking density between detached homes and apartment towers. A federal approval pathway tied to housing targets would unblock it.',
    upvotes: 142,
    commentCount: 38,
    tags: ['housing', 'planning'],
    authorHandle: 'Sasha O.',
    daysOpen: 5,
  },
  {
    title: 'National network of regional rail spines',
    excerpt:
      'Two or three high-speed corridors linking regional centres would shift settlement patterns away from the capital cities and decentralise growth.',
    upvotes: 98,
    commentCount: 26,
    tags: ['infrastructure', 'regional'],
    authorHandle: 'Anonymous member #117',
    daysOpen: 11,
  },
  {
    title: 'Match TAFE funding to university funding for comparable cohorts',
    excerpt:
      'Vocational education is consistently underfunded relative to universities despite producing graduates the labour market actively needs. Funding parity would close that gap.',
    upvotes: 76,
    commentCount: 19,
    tags: ['education', 'skills'],
    authorHandle: 'Hassan T.',
    daysOpen: 3,
  },
  {
    title: 'Four-year fixed federal parliamentary terms',
    excerpt:
      'Three-year terms shorten every policy horizon by definition. Four-year fixed terms would let governments commit to reforms whose payoff lies beyond the next election.',
    upvotes: 64,
    commentCount: 22,
    tags: ['governance', 'reform'],
    authorHandle: 'Lena P.',
    daysOpen: 8,
  },
];

export function PoliciesIdeas({ reduce }: { reduce: ReduceMotion }) {
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
          <Lightbulb aria-hidden className="size-4" />
          <span className="text-xs font-semibold uppercase tracking-[0.22em]">
            Stage 1 &mdash; Ideas
          </span>
        </motion.span>
        <motion.h2
          variants={revealUp}
          className="font-display text-[clamp(1.7rem,3.2vw,2.4rem)] font-medium leading-[1.15] tracking-[-0.03em] text-sb-navy"
        >
          Open submission.
        </motion.h2>
      </motion.div>
      <motion.p
        initial={reduce ? false : 'hidden'}
        whileInView="visible"
        viewport={viewportOnce}
        variants={revealUp}
        className="mb-8 max-w-[64ch] text-[1.05rem] leading-[1.6] text-sb-text"
      >
        Open submission. Reddit-shape: a title, a few paragraphs, tags, upvotes, comments. The
        barrier to participate is one paragraph and a click. Most ideas live here, get a few
        votes, and gracefully retire. That&rsquo;s expected &mdash; early-stage idea triage is
        the whole point.
      </motion.p>
      <CardFan
        items={IDEAS}
        getKey={(idea) => idea.title}
        getLabel={(idea) => idea.title}
        renderCard={(idea) => <IdeaCard {...idea} />}
        ariaLabel="Stage 1 ideas"
        mobileFallback={
          <motion.ul
            role="list"
            initial={reduce ? false : 'hidden'}
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer}
            className="grid list-none grid-cols-1 gap-6 p-0"
          >
            {IDEAS.map((idea) => (
              <motion.li key={idea.title} variants={revealUp}>
                <IdeaCard {...idea} />
              </motion.li>
            ))}
          </motion.ul>
        }
      />
    </section>
  );
}
