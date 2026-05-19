import type { ReactElement } from 'react';
import { BaconBoard } from '@/pages/BaconBoard';
import { Donate } from '@/pages/Donate';
import { Home } from '@/pages/Home';
import { Karen } from '@/pages/Karen';
import { Moonshot } from '@/pages/Moonshot';
import { People } from '@/pages/People';
import { Policies } from '@/pages/Policies';
import { SiteLayout } from '@/components/layout/SiteLayout';
import { RouterProvider, useRoute, type Route } from '@/lib/router';

const PAGES: Record<Route, ReactElement> = {
  '/': <Home />,
  '/people': <People />,
  '/policies': <Policies />,
  '/karen': <Karen />,
  '/bacon-board': <BaconBoard />,
  '/moonshot': <Moonshot />,
  '/donate': <Donate />,
};

function CurrentPage() {
  const route = useRoute();
  return PAGES[route];
}

export function App() {
  return (
    <RouterProvider>
      <SiteLayout>
        <CurrentPage />
      </SiteLayout>
    </RouterProvider>
  );
}
