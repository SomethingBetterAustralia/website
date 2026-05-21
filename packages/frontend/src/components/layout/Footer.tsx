import { ShieldCheck, X } from 'lucide-react';
import * as React from 'react';

export function Footer() {
  const dialogRef = React.useRef<HTMLDialogElement | null>(null);

  function openDialog() {
    dialogRef.current?.showModal();
  }
  function closeDialog() {
    dialogRef.current?.close();
  }

  return (
    <footer className="relative bg-sb-white px-4 pb-12 pt-10">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sb-accent/60 to-transparent"
      />

      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-6 min-[880px]:grid min-[880px]:grid-cols-[1fr_auto_1fr] min-[880px]:items-center min-[880px]:gap-8">
        <a
          href="mailto:hi@somethingbetteraustralia.com"
          className="inline-block max-w-full cursor-pointer rounded-full bg-sb-accent px-6 py-[1.4em] font-display text-sm font-medium leading-none tracking-[0.04em] text-sb-white capitalize no-underline transition-[background-color,transform] duration-150 hover:-translate-y-px hover:bg-sb-accent-hot hover:text-sb-white min-[880px]:col-start-2 min-[880px]:row-start-1 min-[880px]:px-12 min-[880px]:py-[1.6em] min-[880px]:text-base"
        >
          hi@somethingbetteraustralia.com
        </a>

        <div className="text-center min-[880px]:col-start-1 min-[880px]:row-start-1 min-[880px]:text-left">
          <p className="text-xs leading-relaxed text-sb-text-muted">
            © 2026 Something Better Australia
          </p>
          {/* TODO: confirm authoriser name + address before public launch
              (required under the Commonwealth Electoral Act for political
              communications). Placeholder is the founder's published
              public name + city. */}
          <p className="text-[0.7rem] italic leading-relaxed text-sb-text-muted">
            Authorised by C. Mortlock, Sydney NSW, for Something Better Australia.
          </p>
        </div>

        <div className="flex flex-col items-center gap-2 min-[880px]:col-start-3 min-[880px]:row-start-1 min-[880px]:items-end">
          <p className="text-xs leading-relaxed text-sb-text-muted">Built in Australia.</p>
          <button
            type="button"
            onClick={openDialog}
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] text-sb-text-muted transition-colors hover:text-sb-accent-hot focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-accent rounded-sm"
          >
            <ShieldCheck aria-hidden className="size-3.5" />
            Privacy
          </button>
        </div>
      </div>

      <style>{`dialog.sba-privacy-dialog::backdrop { background-color: color-mix(in srgb, var(--color-sb-navy) 40%, transparent); backdrop-filter: blur(4px); }`}</style>
      <dialog
        ref={dialogRef}
        aria-labelledby="footer-privacy-title"
        className="sba-privacy-dialog max-w-lg rounded-3xl border-0 bg-sb-white p-8 ring-1 ring-sb-cream-warm shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <h2
            id="footer-privacy-title"
            className="font-display text-xl font-medium text-sb-navy"
          >
            Privacy
          </h2>
          <button
            type="button"
            onClick={closeDialog}
            aria-label="Close"
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-sb-text-muted transition-colors hover:bg-sb-cream-warm hover:text-sb-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-accent"
          >
            <X aria-hidden className="size-4" />
          </button>
        </div>
        {/* MOCK: short-form privacy statement until the formal notice is
            posted alongside the member-data persistence platform. */}
        <div className="mt-4 flex flex-col gap-3 text-sm leading-relaxed text-sb-text">
          <p>
            We collect the bare minimum to run the movement: your name, email, and
            postcode at signup, plus anything you choose to add to the optional
            feedback fields. We use it to send you what you&rsquo;ve asked to be sent
            and to understand where our members live. We don&rsquo;t share it with
            third parties, and we don&rsquo;t sell it. You can ask us to delete your
            data at any time by emailing{' '}
            <a
              href="mailto:hi@somethingbetteraustralia.com"
              className="font-medium text-sb-accent-hot hover:underline"
            >
              hi@somethingbetteraustralia.com
            </a>
            .
          </p>
          <p>
            This is the short version. A formal privacy notice will be posted here
            once the platform that handles formal member data is in place.
          </p>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={closeDialog}
            className="inline-flex items-center justify-center rounded-full bg-sb-navy px-5 py-2 text-sm font-medium text-sb-cream transition-colors hover:bg-sb-navy-hot focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-accent"
          >
            Got it
          </button>
        </div>
      </dialog>
    </footer>
  );
}
