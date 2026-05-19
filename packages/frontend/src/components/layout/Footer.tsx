export function Footer() {
  return (
    <footer className="relative bg-sb-white px-4 pb-12 pt-10 text-center">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sb-accent/60 to-transparent"
      />
      <a
        href="mailto:hi@somethingbetteraustralia.com"
        className="inline-block max-w-full cursor-pointer rounded-full bg-sb-accent px-6 py-[1.4em] font-display text-sm font-medium leading-none tracking-[0.04em] text-sb-white capitalize no-underline transition-[background-color,transform] duration-150 hover:-translate-y-px hover:bg-sb-accent-hot hover:text-sb-white min-[880px]:px-12 min-[880px]:py-[1.6em] min-[880px]:text-base"
      >
        hi@somethingbetteraustralia.com
      </a>
    </footer>
  );
}
