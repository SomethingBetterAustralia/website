import type { ReactElement } from 'react';
import { BaconBoard } from '@/pages/BaconBoard';
import { Donate } from '@/pages/Donate';
import { Financials } from '@/pages/Financials';
import { Home } from '@/pages/Home';
import { Karen } from '@/pages/Karen';
import { Moonshot } from '@/pages/Moonshot';
import { People } from '@/pages/People';
import { Policies } from '@/pages/Policies';
import { Progress } from '@/pages/Progress';
import { Recognition } from '@/pages/Recognition';
import { SiteLayout } from '@/components/layout/SiteLayout';
import { RouterProvider, useRoute, type Route } from '@/lib/router';

const PAGES: Record<Route, ReactElement> = {
  '/': <Home />,
  '/people': <People />,
  '/policies': <Policies />,
  '/progress': <Progress />,
  '/financials': <Financials />,
  '/karen': <Karen />,
  '/bacon-board': <BaconBoard />,
  '/moonshot': <Moonshot />,
  '/recognition': <Recognition />,
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
