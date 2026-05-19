import { AnimatePresence, motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import * as React from 'react';
import logoUrl from '@/assets/logo_header.webp';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link, NAV_ITEMS, type NavItem, useRoute } from '@/lib/router';

export function Header() {
  const route = useRoute();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  React.useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  React.useEffect(() => {
    setMobileOpen(false);
  }, [route]);

  return (
    <motion.header
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'sticky top-0 z-50 w-full transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300',
        scrolled
          ? 'border-b border-sb-cream-warm bg-sb-white/90 shadow-[0_2px_10px_rgba(8,31,52,0.05)] backdrop-blur-md'
          : 'border-b border-transparent bg-sb-white'
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 min-[880px]:px-8">
        <Link
          to="/"
          aria-label="Something Better Australia — home"
          className="flex items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-accent focus-visible:ring-offset-2 focus-visible:ring-offset-sb-white"
        >
          <img
            src={logoUrl}
            alt="Something Better Australia"
            className="block h-10 w-auto min-[880px]:h-12"
          />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 min-[880px]:flex">
          {NAV_ITEMS.map((item) => (
            <HeaderNavLink key={item.path} item={item} active={route === item.path} />
          ))}
        </nav>

        <div className="hidden min-[880px]:flex">
          <Button
            asChild
            className="rounded-full bg-sb-accent text-sb-white shadow-[0_4px_12px_rgba(212,166,73,0.35)] hover:bg-sb-accent-hot focus-visible:ring-sb-accent focus-visible:ring-offset-sb-white"
          >
            <Link to="/donate">Donate</Link>
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          className="flex size-10 items-center justify-center rounded-full text-sb-navy transition-colors hover:bg-sb-cream-warm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-accent min-[880px]:hidden"
        >
          {mobileOpen ? (
            <X aria-hidden className="size-6" />
          ) : (
            <Menu aria-hidden className="size-6" />
          )}
          <span className="sr-only">{mobileOpen ? 'Close menu' : 'Open menu'}</span>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {mobileOpen && (
          <motion.div
            id="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden border-t border-sb-cream-warm bg-sb-white/95 backdrop-blur-md min-[880px]:hidden"
          >
            <nav
              aria-label="Mobile"
              className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4"
            >
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'rounded-md px-3 py-3 font-display text-xl font-bold tracking-[-0.02em] text-sb-accent transition-colors hover:bg-sb-cream-warm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-accent',
                    route === item.path && 'italic text-sb-accent-hot'
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <Button
                asChild
                className="mt-3 self-start rounded-full bg-sb-accent text-sb-white hover:bg-sb-accent-hot focus-visible:ring-sb-accent"
              >
                <Link to="/donate">Donate</Link>
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function HeaderNavLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      to={item.path}
      className={cn(
        'group relative rounded-md px-3 py-2 text-base font-bold tracking-wide text-sb-accent transition-colors hover:text-sb-accent-hot focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-accent',
        active && 'font-display italic text-sb-accent-hot'
      )}
    >
      {item.label}
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-x-3 -bottom-[2px] h-[2px] origin-left scale-x-0 rounded-full bg-sb-accent transition-transform duration-200 group-hover:scale-x-100',
          active && 'scale-x-100'
        )}
      />
    </Link>
  );
}
