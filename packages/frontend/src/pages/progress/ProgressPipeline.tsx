import { ArrowRight, Workflow } from 'lucide-react';
import { PolicyFunnel } from '@/components/policies';
import { Link } from '@/lib/router';
import { SectionHeader, type ReduceMotion } from './ProgressShared';

export function ProgressPipeline({ reduce }: { reduce: ReduceMotion }) {
  return (
    <section className="mx-auto w-full max-w-5xl">
      <SectionHeader
        reduce={reduce}
        icon={Workflow}
        eyebrow="Policy pipeline"
        title="Where ideas are in the funnel."
      />
      <p className="mb-8 max-w-[60ch] text-[1.05rem] leading-[1.6] text-sb-text-muted">
        Snapshot of the funnel &mdash; see{' '}
        <Link to="/policies" className="font-medium text-sb-accent-hot hover:underline">
          /policies
        </Link>{' '}
        for the model.
      </p>
      <PolicyFunnel />
      <p className="mt-6">
        <Link
          to="/policies"
          className="inline-flex items-center gap-1 text-sm font-medium text-sb-accent-hot hover:underline"
        >
          Read the full process
          <ArrowRight aria-hidden className="size-3.5" />
        </Link>
      </p>
    </section>
  );
}
