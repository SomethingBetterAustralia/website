import { ChevronDown, Search } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface FindMemberPillProps {
  readonly reduce: boolean | null;
  readonly className?: string;
}

interface FormState {
  readonly name: string;
  readonly postcode: string;
}

type PanelStatus = 'closed' | 'open' | 'acknowledged';

const INITIAL_STATE: FormState = { name: '', postcode: '' };
const POSTCODE_PATTERN = /^\d{4}$/;

export function FindMemberPill({
  reduce,
  className,
}: FindMemberPillProps): React.ReactElement {
  const [status, setStatus] = React.useState<PanelStatus>('closed');
  const [state, setState] = React.useState<FormState>(INITIAL_STATE);

  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const pillRef = React.useRef<HTMLButtonElement | null>(null);
  const nameInputRef = React.useRef<HTMLInputElement | null>(null);
  const prevStatusRef = React.useRef<PanelStatus>('closed');

  React.useLayoutEffect(() => {
    const prev = prevStatusRef.current;
    if (prev === 'closed' && status === 'open') {
      nameInputRef.current?.focus();
    } else if (prev !== 'closed' && status === 'closed') {
      pillRef.current?.focus();
    }
    prevStatusRef.current = status;
  }, [status]);

  React.useEffect(() => {
    if (status === 'closed') return;
    function handlePointerDown(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setStatus('closed');
      }
    }
    document.addEventListener('mousedown', handlePointerDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [status]);

  function openPanel() {
    setState(INITIAL_STATE);
    setStatus('open');
  }

  function closePanel() {
    setStatus('closed');
  }

  function togglePanel() {
    if (status === 'closed') {
      openPanel();
    } else {
      closePanel();
    }
  }

  const name = state.name.trim();
  const postcode = state.postcode.trim();
  const hasName = name.length > 0;
  const hasPostcode = postcode.length > 0;
  const badPostcode = hasPostcode && !POSTCODE_PATTERN.test(postcode);
  const submitDisabled = (!hasName && !hasPostcode) || badPostcode;

  // MOCK: client-side acknowledgement. No backend route exists; submit
  // logs and transitions the panel to the acknowledged copy.
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitDisabled) return;
    console.log('[MOCK /find-member] enquiry:', {
      name,
      postcode,
      _isMock: true,
    });
    setStatus('acknowledged');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Escape') {
      e.stopPropagation();
      closePanel();
    }
  }

  const isOpen = status !== 'closed';
  const echoed =
    hasName && hasPostcode
      ? `${name} (postcode ${postcode})`
      : hasName
        ? name
        : `postcode ${postcode}`;

  return (
    <div ref={wrapperRef} className={cn('relative w-fit', className)}>
      <div
        aria-hidden
        className="invisible inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold"
      >
        <Search className="size-4" />
        <span>Find My SBA Representative</span>
        <ChevronDown className="size-4" />
      </div>

      <motion.div
        layout
        transition={reduce ? { duration: 0 } : { duration: 0.22, ease: 'easeOut' }}
        className="absolute right-0 top-0 z-20 overflow-hidden rounded-2xl bg-sb-accent-hot text-sb-white shadow-[0_4px_12px_rgba(8,31,52,0.06)]"
      >
        <div className="flex justify-end">
          <motion.button
            ref={pillRef}
            type="button"
            onClick={togglePanel}
            aria-controls="find-member-panel"
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Close find my SBA representative form' : 'Open find my SBA representative form'}
            whileTap={reduce ? undefined : { scale: 0.98 }}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-sb-white transition-colors hover:bg-sb-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sb-cream"
          >
            <Search aria-hidden className="size-4" />
            <span>Find My SBA Representative</span>
            <ChevronDown
              aria-hidden
              className={cn('size-4 transition-transform duration-200', isOpen && 'rotate-180')}
            />
          </motion.button>
        </div>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              id="find-member-panel"
              key="panel"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0 }}
              transition={reduce ? { duration: 0 } : { duration: 0.18, ease: 'easeOut' }}
              className="px-5 pb-5 min-[880px]:w-[32rem] min-[880px]:px-6 min-[880px]:pb-6"
              onKeyDown={handleKeyDown}
            >
              {status === 'acknowledged' ? (
                <div className="flex flex-col gap-3">
                  <h3 className="m-0 font-display text-base font-medium text-sb-white">
                    Thanks — we&rsquo;ll be in touch.
                  </h3>
                  <p className="m-0 text-sm leading-[1.55] text-sb-white/90">
                    We&rsquo;ve logged your enquiry. The member lookup goes live once the
                    membership platform is wired up &mdash; we&rsquo;ll match you to the SBA
                    member closest to {echoed} as soon as it is.
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={openPanel}
                      className="rounded-sm text-sm font-medium text-sb-white transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-cream"
                    >
                      Search again
                    </button>
                    <button
                      type="button"
                      onClick={closePanel}
                      className="rounded-sm text-sm text-sb-white/80 transition-colors hover:text-sb-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-cream"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <h3 className="m-0 font-display text-base font-medium text-sb-white">
                      Find your SBA representative
                    </h3>
                    <p className="m-0 text-xs text-sb-white/85">
                      Search by name or postcode &mdash; we&rsquo;ll match you to the SBA
                      member closest to you.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-3 min-[880px]:grid-cols-[2fr_1fr] min-[880px]:gap-4">
                    <div className="flex flex-col gap-1">
                      <label
                        htmlFor="find-member-name"
                        className="text-xs font-medium text-sb-white"
                      >
                        Name
                      </label>
                      <input
                        ref={nameInputRef}
                        id="find-member-name"
                        type="text"
                        value={state.name}
                        onChange={(e) => setState({ ...state, name: e.target.value })}
                        placeholder="e.g. Jane Citizen"
                        autoComplete="off"
                        className="rounded-md border border-transparent bg-sb-white px-3 py-2 text-sm text-sb-navy placeholder:text-sb-text-muted focus:outline-none focus:ring-2 focus:ring-sb-cream"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label
                        htmlFor="find-member-postcode"
                        className="text-xs font-medium text-sb-white"
                      >
                        Postcode
                      </label>
                      <input
                        id="find-member-postcode"
                        type="text"
                        inputMode="numeric"
                        pattern="\d{4}"
                        maxLength={4}
                        value={state.postcode}
                        onChange={(e) =>
                          setState({ ...state, postcode: e.target.value })
                        }
                        placeholder="e.g. 2000"
                        autoComplete="off"
                        aria-invalid={badPostcode || undefined}
                        aria-describedby={badPostcode ? 'find-member-postcode-error' : undefined}
                        className={cn(
                          'rounded-md bg-sb-white px-3 py-2 text-sm text-sb-navy placeholder:text-sb-text-muted focus:outline-none focus:ring-2 focus:ring-sb-cream',
                          badPostcode
                            ? 'border-2 border-sb-cream'
                            : 'border border-transparent',
                        )}
                      />
                      {badPostcode && (
                        <p
                          id="find-member-postcode-error"
                          className="m-0 text-xs font-medium text-sb-cream"
                        >
                          Postcode must be 4 digits.
                        </p>
                      )}
                    </div>
                  </div>
                  {!hasName && !hasPostcode && (
                    <p className="m-0 text-xs text-sb-white/85">
                      Enter a name or postcode.
                    </p>
                  )}
                  <div className="flex flex-col gap-2 min-[880px]:flex-row min-[880px]:items-center min-[880px]:gap-4">
                    <button
                      type="submit"
                      disabled={submitDisabled}
                      className="inline-flex items-center justify-center rounded-md bg-sb-white px-4 py-2 text-sm font-semibold text-sb-accent-hot transition-colors hover:bg-sb-cream disabled:cursor-not-allowed disabled:bg-sb-white/40 disabled:text-sb-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-cream focus-visible:ring-offset-2 focus-visible:ring-offset-sb-accent-hot"
                    >
                      Find member
                    </button>
                    <button
                      type="button"
                      onClick={closePanel}
                      className="rounded-sm text-sm text-sb-white/85 transition-colors hover:text-sb-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-cream min-[880px]:text-left"
                    >
                      Close
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
