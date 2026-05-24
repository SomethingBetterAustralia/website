import { GitBranch, GitFork, GitPullRequest, Star, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { StatCard, type StatCardProps } from '@/components/progress';
import { revealUp, staggerContainer, viewportOnce } from '@/lib/motion';
import { ORG_GITHUB_URL, SectionHeader, type ReduceMotion } from './ProgressShared';

// MOCK: open-source mini-stats.
const OS_STATS: readonly StatCardProps[] = [
  { icon: Star, label: 'Stars', value: '142' },
  { icon: GitFork, label: 'Forks', value: '23' },
  { icon: GitPullRequest, label: 'Merged PRs', value: '37' },
  { icon: Users, label: 'Contributors', value: '14' },
];

export function ProgressOpenSource({ reduce }: { reduce: ReduceMotion }) {
  return (
    <section className="mx-auto w-full max-w-5xl">
      <SectionHeader
        reduce={reduce}
        icon={GitBranch}
        eyebrow="Open source"
        title="Build with us."
      />
      <motion.ul
        role="list"
        initial={reduce ? false : 'hidden'}
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="grid list-none grid-cols-1 gap-4 p-0 min-[640px]:grid-cols-2 min-[880px]:grid-cols-4 min-[880px]:gap-5"
      >
        {OS_STATS.map((stat) => (
          <motion.li key={stat.label} variants={revealUp}>
            <StatCard {...stat} />
          </motion.li>
        ))}
      </motion.ul>
      <p className="mt-6 max-w-[60ch] text-[0.95rem] leading-[1.6] text-sb-text-muted">
        Across all public SBA repositories &mdash; the website, Karen, the Bacon Board, and
        the policy platform. See{' '}
        <a
          href={ORG_GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-sb-accent-hot hover:underline"
        >
          github.com/SomethingBetterAustralia
        </a>
        .
      </p>
    </section>
  );
}
