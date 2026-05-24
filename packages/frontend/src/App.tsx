import type { ReactElement } from 'react';
import { BaconBoard } from '@/pages/baconboard';
import { Donate } from '@/pages/donate';
import { Financials } from '@/pages/financials';
import { Home } from '@/pages/home';
import { Karen } from '@/pages/karen';
import { Open } from '@/pages/open';
import { People } from '@/pages/people';
import { Policies } from '@/pages/policies';
import { Progress } from '@/pages/progress';
import { Recognition } from '@/pages/recognition';
import { Survey } from '@/pages/survey';
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
