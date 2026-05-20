import type { CrossCuttingItem, LikertResponse } from '@backend/types/survey';
import { LikertRow } from './LikertRow';

export interface CrossCuttingStepProps {
  items: readonly CrossCuttingItem[];
  responses: Record<string, LikertResponse>;
  onChange: (code: string, value: LikertResponse) => void;
}

export function CrossCuttingStep({ items, responses, onChange }: CrossCuttingStepProps) {
  return (
    <div className="flex flex-col gap-6">
      {items.map((item) => (
        <LikertRow
          key={item.code}
          statement={item.text}
          value={item.code in responses ? responses[item.code] : undefined}
          onChange={(next) => onChange(item.code, next)}
        />
      ))}
    </div>
  );
}
