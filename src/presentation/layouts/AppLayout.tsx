import { Outlet } from 'react-router';

import { AppHeader } from '@/presentation/components/navigation/AppHeader';

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-page text-content">
      <AppHeader />

      <main id="main-content" className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
