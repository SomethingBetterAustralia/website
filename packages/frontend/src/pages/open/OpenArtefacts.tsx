import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Bot,
  Code2,
  Eye,
  FileText,
  Flag,
  GitBranch,
  Globe,
  Network,
  Receipt,
  Scale,
  Sparkles,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Link, type Route } from '@/lib/router';
import { revealUp, staggerContainer, viewportOnce } from '@/lib/motion';
import { WEBSITE_REPO_URL, type ReduceMotion } from './OpenShared';

type ArtefactRow =
  | {
      readonly kind: 'external';
      readonly icon: LucideIcon;
      readonly label: string;
      readonly body: string;
      readonly href: string;
      readonly linkLabel: string;
    }
  | {
      readonly kind: 'internal';
      readonly icon: LucideIcon;
      readonly label: string;
      readonly body: string;
      readonly route: Route;
      readonly linkLabel: string;
    }
  | {
      readonly kind: 'future';
      readonly icon: LucideIcon;
      readonly label: string;
      readonly body: string;
    };

const ARTEFACTS: readonly ArtefactRow[] = [
  {
    kind: 'external',
    icon: Code2,
    label: 'The website itself.',
    body: 'This site, including every page you’re reading, is open source.',
    href: WEBSITE_REPO_URL,
    linkLabel: 'Open repository',
  },
  {
    kind: 'internal',
    icon: Receipt,
    label: 'The financial ledger.',
    body: 'Every transaction in, every transaction out — a versioned public ledger updated weekly. Beyond what the AEC requires.',
    route: '/financials',
    linkLabel: 'See the Financials page',
  },
  {
    kind: 'internal',
    icon: Bot,
    label: 'Karen.',
    body: 'Open-source AI moderator and contextualiser.',
    route: '/karen',
    linkLabel: 'See the Karen page',
  },
  {
    kind: 'internal',
    icon: Network,
    label: 'The Bacon Board.',
    body: 'Gamified outreach with consent and dignity baked in.',
    route: '/bacon-board',
    linkLabel: 'See the Bacon Board page',
  },
  {
    kind: 'future',
    icon: FileText,
    label: 'Decisions and errata.',
    body: 'Material decisions and corrections are documented publicly when they happen.',
  },
  {
    kind: 'future',
    icon: Scale,
    label: 'The policy process.',
    body: 'How a party of cross-spectrum experts produces policy without collapsing into the median view of its loudest faction.',
  },
];

interface OpenPersonRow {
  readonly icon: LucideIcon;
  readonly label: string;
  readonly body: string;
}

const OPEN_PEOPLE: readonly OpenPersonRow[] = [
  {
    icon: Users,
    label: 'Members.',
    body: 'Australians who want to be part of the work — bring a perspective, bring a problem, bring a sceptical eye.',
  },
  {
    icon: Flag,
    label: 'Candidates.',
    body: 'People willing to stand on policy substance, not factional theatre.',
  },
  {
    icon: GitBranch,
    label: 'Contributors.',
    body: 'Engineers, designers, researchers, writers — every artefact we publish takes outside hands to sharpen.',
  },
  {
    icon: Eye,
    label: 'Sceptical critics.',
    body: 'If you think we’re wrong, say so in public. We’ll publish corrections when you’re right.',
  },
  {
    icon: BookOpen,
    label: 'Journalists and researchers.',
    body: 'The methodology and the data are on the record. Use them, dispute them, attribute as you like.',
  },
  {
    icon: Globe,
    label: 'Friends abroad.',
    body: 'Watchers in other countries thinking about what a movement like this could look like where you are.',
  },
];

export function OpenArtefacts({ reduce }: { reduce: ReduceMotion }) {
  return (
    <section className="mx-auto w-full max-w-5xl">
      <div className="grid grid-cols-1 gap-10 min-[880px]:grid-cols-2 min-[880px]:items-start min-[880px]:gap-12">
        <div id="open-artefacts" className="scroll-mt-24 min-[880px]:scroll-mt-28">
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
              <GitBranch aria-hidden className="size-4" />
              <span className="text-xs font-semibold uppercase tracking-[0.22em]">
                What&rsquo;s open
              </span>
            </motion.span>
            <motion.h2
              variants={revealUp}
              className="font-display text-[clamp(1.7rem,3.2vw,2.4rem)] font-medium leading-[1.15] tracking-[-0.03em] text-sb-navy"
            >
              Everything we build, where it lives.
            </motion.h2>
          </motion.div>
          <motion.ul
            role="list"
            initial={reduce ? false : 'hidden'}
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer}
            className="flex list-none flex-col gap-6 p-0"
          >
            {ARTEFACTS.map((row) => {
              const Icon = row.icon;
              return (
                <motion.li key={row.label} variants={revealUp} className="flex items-start gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sb-accent/10">
                    <Icon aria-hidden className="size-5 text-sb-accent-hot" />
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <p className="font-display text-[1.05rem] font-medium text-sb-navy">
                      {row.label}
                    </p>
                    <p className="text-[1rem] leading-[1.55] text-sb-text-muted">
                      {row.body}
                      {row.kind === 'future' && (
                        <span className="italic text-sb-text-muted/80"> (coming soon)</span>
                      )}
                    </p>
                    {row.kind === 'external' && (
                      <a
                        href={row.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-fit items-center gap-1 text-sm font-medium text-sb-accent-hot hover:underline"
                      >
                        {row.linkLabel}
                        <ArrowUpRight aria-hidden className="size-3.5" />
                      </a>
                    )}
                    {row.kind === 'internal' && (
                      <Link
                        to={row.route}
                        className="inline-flex w-fit items-center gap-1 text-sm font-medium text-sb-accent-hot hover:underline"
                      >
                        {row.linkLabel}
                        <ArrowRight aria-hidden className="size-3.5" />
                      </Link>
                    )}
                  </div>
                </motion.li>
              );
            })}
          </motion.ul>
        </div>

        <div>
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
              <Sparkles aria-hidden className="size-4" />
              <span className="text-xs font-semibold uppercase tracking-[0.22em]">
                Who&rsquo;s Open
              </span>
            </motion.span>
            <motion.h2
              variants={revealUp}
              className="font-display text-[clamp(1.7rem,3.2vw,2.4rem)] font-medium leading-[1.15] tracking-[-0.03em] text-sb-navy"
            >
              Who the door is open to.
            </motion.h2>
          </motion.div>
          <motion.p
            initial={reduce ? false : 'hidden'}
            whileInView="visible"
            viewport={viewportOnce}
            variants={revealUp}
            className="mb-8 max-w-[60ch] text-[1.05rem] leading-[1.6] text-sb-text"
          >
            Open isn&rsquo;t only what we publish. It&rsquo;s who we work with &mdash; and who
            the door is open to.
          </motion.p>
          <motion.ul
            role="list"
            initial={reduce ? false : 'hidden'}
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer}
            className="flex list-none flex-col gap-6 p-0"
          >
            {OPEN_PEOPLE.map(({ icon: Icon, label, body }) => (
              <motion.li key={label} variants={revealUp} className="flex items-start gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sb-accent/10">
                  <Icon aria-hidden className="size-5 text-sb-accent-hot" />
                </span>
                <div className="flex flex-col gap-1">
                  <p className="font-display text-[1.05rem] font-medium text-sb-navy">{label}</p>
                  <p className="text-[1rem] leading-[1.55] text-sb-text-muted">{body}</p>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
