export interface OpenResponseStepProps {
  value: string;
  onChange: (next: string) => void;
}

const textareaClasses =
  'w-full min-h-[10rem] rounded-md border-0 bg-sb-cream/40 px-[0.9rem] py-[0.7rem] text-base text-sb-text transition-shadow duration-100 focus:shadow-[0_0_0_2px_var(--color-sb-accent)] focus:outline-none';

export function OpenResponseStep({ value, onChange }: OpenResponseStepProps) {
  return (
    <label className="flex flex-col gap-[0.3rem]">
      <span className="text-[0.88rem] font-medium text-sb-text">
        Anything we missed? (optional)
      </span>
      <textarea
        className={textareaClasses}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Tell us anything else you think the team should consider…"
      />
    </label>
  );
}
