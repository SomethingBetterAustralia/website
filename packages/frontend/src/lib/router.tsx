// NOTE: The 'People', 'Progress', and 'Recognition' ideas are currently
// abandoned and not being progressed. Their pages and routes are retained, but
// they are intentionally omitted from NAV_ITEMS so they no longer appear as tabs.
import * as React from 'react';

export type Route =
  | '/'
  | '/people'
  | '/policies'
  | '/progress'
  | '/financials'
  | '/karen'
  | '/bacon-board'
  | '/open'
  | '/recognition'
  | '/survey'
  | '/donate';

export const ROUTES: readonly Route[] = [
  '/',
  '/people',
  '/policies',
  '/progress',
  '/financials',
  '/karen',
  '/bacon-board',
  '/open',
  '/recognition',
  '/survey',
  '/donate',
];

export interface NavItem {
  readonly path: Route;
  readonly label: string;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { path: '/policies', label: 'Policies' },
  { path: '/financials', label: 'Financials' },
  { path: '/karen', label: 'Karen' },
  { path: '/bacon-board', label: 'Bacon Board' },
  { path: '/open', label: 'Open' },
];

function isRoute(path: string): path is Route {
  return (ROUTES as readonly string[]).includes(path);
}

interface RouterContextValue {
  route: Route;
  navigate: (to: Route) => void;
}

const RouterContext = React.createContext<RouterContextValue | null>(null);

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = React.useState<Route>(() => {
    if (typeof window === 'undefined') return '/';
    const path = window.location.pathname;
    return isRoute(path) ? path : '/';
  });

  React.useEffect(() => {
    function onPopState() {
      const path = window.location.pathname;
      setRoute(isRoute(path) ? path : '/');
    }
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = React.useCallback((to: Route) => {
    if (window.location.pathname !== to) {
      window.history.pushState({}, '', to);
    }
    setRoute(to);
    window.scrollTo(0, 0);
  }, []);

  return (
    <RouterContext.Provider value={{ route, navigate }}>{children}</RouterContext.Provider>
  );
}

function useRouter(): RouterContextValue {
  const ctx = React.useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used within <RouterProvider>');
  return ctx;
}

export function useRoute(): Route {
  return useRouter().route;
}

export interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: Route;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ to, onClick, children, ...rest }, ref) => {
    const { navigate } = useRouter();
    function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
      if (e.defaultPrevented) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      navigate(to);
      onClick?.(e);
    }
    return (
      <a ref={ref} href={to} onClick={handleClick} {...rest}>
        {children}
      </a>
    );
  }
);
Link.displayName = 'Link';
