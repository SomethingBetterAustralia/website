import type { ReactElement } from 'react';
import { BaconBoard } from '@/pages/BaconBoard';
import { Donate } from '@/pages/Donate';
import { Financials } from '@/pages/Financials';
import { Home } from '@/pages/Home';
import { Karen } from '@/pages/Karen';
import { Open } from '@/pages/Open';
import { People } from '@/pages/people';
import { Policies } from '@/pages/Policies';
import { Progress } from '@/pages/Progress';
import { Recognition } from '@/pages/Recognition';
import { Survey } from '@/pages/Survey';
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
  '/open': <Open />,
  '/recognition': <Recognition />,
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
