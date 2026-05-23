import type {
  ExpertiseLevel,
  LikertResponse,
  SurveyPortfolio,
} from '@backend/types/survey';
import { ExpertiseRow } from './ExpertiseRow';
import { LikertRow } from './LikertRow';

export interface PortfolioStepProps {
  portfolio: SurveyPortfolio;
  expertise: ExpertiseLevel | undefined;
  responses: Record<string, LikertResponse>;
  onExpertiseChange: (next: ExpertiseLevel) => void;
  onResponseChange: (code: string, value: LikertResponse) => void;
}

export function PortfolioStep({
  portfolio,
  expertise,
  responses,
  onExpertiseChange,
  onResponseChange,
}: PortfolioStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <ExpertiseRow value={expertise} onChange={onExpertiseChange} />
      <hr className="border-sb-cream-warm" />
      <div className="flex flex-col gap-6">
        {portfolio.items.map((item) => (
          <LikertRow
            key={item.code}
            statement={item.text}
            value={item.code in responses ? responses[item.code] : undefined}
            onChange={(next) => onResponseChange(item.code, next)}
          />
        ))}
      </div>
    </div>
  );
}
