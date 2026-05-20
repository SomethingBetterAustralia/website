import type { SurveyDomain } from '@backend/types/survey';

export interface AboutYouStepProps {
  memberName: string;
  background: string;
  expertiseAreas: ReadonlySet<string>;
  domains: readonly SurveyDomain[];
  onMemberNameChange: (next: string) => void;
  onBackgroundChange: (next: string) => void;
  onExpertiseAreasChange: (next: Set<string>) => void;
}

const inputClasses =
  'w-full rounded-sm border-0 bg-sb-cream/40 px-[0.9rem] py-[0.7rem] text-base text-sb-text transition-shadow duration-100 focus:shadow-[0_0_0_2px_var(--color-sb-accent)] focus:outline-none';
const fieldLabelClasses = 'text-[0.88rem] font-medium text-sb-text';
const fieldReqClasses = 'ml-1 text-[0.78rem] font-normal italic text-sb-text-muted';
const fieldClasses = 'flex flex-col gap-[0.3rem]';

export function AboutYouStep({
  memberName,
  background,
  expertiseAreas,
  domains,
  onMemberNameChange,
  onBackgroundChange,
  onExpertiseAreasChange,
}: AboutYouStepProps) {
  function toggleArea(id: string, checked: boolean) {
    const next = new Set(expertiseAreas);
    if (checked) next.add(id);
    else next.delete(id);
    onExpertiseAreasChange(next);
  }
  return (
    <>
      <label className={fieldClasses}>
        <span className={fieldLabelClasses}>
          Your name
          <span className={fieldReqClasses}>(optional — leave empty to be anonymous)</span>
        </span>
        <input
          type="text"
          autoComplete="name"
          className={inputClasses}
          value={memberName}
          onChange={(e) => onMemberNameChange(e.target.value)}
        />
      </label>
      <label className={fieldClasses}>
        <span className={fieldLabelClasses}>
          Background <span className={fieldReqClasses}>(required)</span>
        </span>
        <input
          type="text"
          placeholder="e.g. GP, software engineer, small-business owner"
          className={inputClasses}
          value={background}
          onChange={(e) => onBackgroundChange(e.target.value)}
        />
      </label>
      <fieldset className="m-0 flex flex-col gap-3 border-0 p-0">
        <legend className={fieldLabelClasses}>
          Which policy domains do you feel strongest in?
          <span className={fieldReqClasses}>(optional, multi-select)</span>
        </legend>
        <div className="grid grid-cols-1 gap-2 min-[880px]:grid-cols-2">
          {domains.map((domain) => {
            const checked = expertiseAreas.has(domain.id);
            return (
              <label
                key={domain.id}
                className="flex cursor-pointer items-start gap-3 rounded-2xl bg-sb-cream-warm/50 px-3 py-2 transition-colors hover:bg-sb-cream-warm"
              >
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 flex-shrink-0 cursor-pointer accent-sb-navy"
                  checked={checked}
                  onChange={(e) => toggleArea(domain.id, e.target.checked)}
                />
                <span className="text-[0.95rem] leading-[1.4] text-sb-text">{domain.name}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
    </>
  );
}
