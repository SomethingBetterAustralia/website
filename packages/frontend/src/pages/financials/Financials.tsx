import { useReducedMotion } from 'motion/react';
import * as React from 'react';
import { Caveat } from '@/components/prose';
import {
  FinancialsArchitecture,
  FinancialsArchitectureRepoPill,
} from './FinancialsArchitecture';
import { FinancialsBreakdown } from './FinancialsBreakdown';
import { FinancialsCashflow } from './FinancialsCashflow';
import { FinancialsFinalCta } from './FinancialsFinalCta';
import { FinancialsHero } from './FinancialsHero';
import { FinancialsKpis } from './FinancialsKpis';
import { FinancialsLedger } from './FinancialsLedger';
import { MOCK_LEDGER, computeAggregates, type ReduceMotion } from './FinancialsShared';

export function Financials() {
  const reduce = useReducedMotion();
  const agg = React.useMemo(() => computeAggregates(MOCK_LEDGER), []);
  return (
    <div className="flex flex-col gap-16 px-6 pb-24 pt-6 min-[880px]:gap-24 min-[880px]:px-12 min-[880px]:pt-10">
      <FinancialsHero reduce={reduce} />
      <FinancialsLedger reduce={reduce} agg={agg} />
      <FinancialsKpis reduce={reduce} agg={agg} />
      <FinancialsCashflow reduce={reduce} />
      <FinancialsBreakdown reduce={reduce} agg={agg} />
      <FinancialsArchitecture reduce={reduce} />
      <FinancialsCaveat reduce={reduce} />
      <FinancialsArchitectureRepoPill reduce={reduce} />
      <FinancialsFinalCta reduce={reduce} />
    </div>
  );
}

function FinancialsCaveat({ reduce }: { reduce: ReduceMotion }) {
  return (
    <Caveat reduce={reduce}>
      What&rsquo;s not on the ledger: individual donor identities are aggregated by default,
      in line with the AEC&rsquo;s privacy regime. Donors who specifically request public
      acknowledgment are named in the description column; everyone else appears as
      &lsquo;Individual donation&rsquo; with no identifying information. Charlotte&rsquo;s
      founder contributions are named openly because she has consented. There is a 1&ndash;3
      day lag between a transaction settling and appearing here &mdash; bank reconciliation
      takes time, and we&rsquo;d rather be slow and right than fast and wrong.
    </Caveat>
  );
}
