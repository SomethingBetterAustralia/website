import type { ReactElement } from 'react';
import { BaconBoard } from '@/pages/baconboard';
import { Donate } from '@/pages/donate';
import { Financials } from '@/pages/financials';
import { Home } from '@/pages/home';
import { Karen } from '@/pages/karen';
import { Open } from '@/pages/open';
import { Policies } from '@/pages/policies';
import { Survey } from '@/pages/survey';
import { SiteLayout } from '@/components/layout/SiteLayout';
import { RouterProvider, useRoute, type Route } from '@/lib/router';

const PAGES: Record<Route, ReactElement> = {
  '/': <Home />,
  '/policies': <Policies />,
  '/financials': <Financials />,
  '/karen': <Karen />,
  '/bacon-board': <BaconBoard />,
  '/open': <Open />,
  '/survey': <Survey />,
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
