import { Outlet } from 'react-router';

import { AppHeader } from '@/presentation/components/navigation/AppHeader';
import { RouteFocusManager } from '@/presentation/components/navigation/RouteFocusManager';
import { SkipLink } from '@/presentation/components/navigation/SkipLink';

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-page text-content">
      <SkipLink />
      <RouteFocusManager />
      <AppHeader />

      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto w-full max-w-7xl flex-1 scroll-mt-28 px-4 focus:outline-none sm:px-6 lg:px-8"
      >
        <Outlet />
      </main>
    </div>
  );
}
