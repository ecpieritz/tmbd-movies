import type { RouteObject } from 'react-router';

import { AppLayout } from '@/presentation/layouts/AppLayout';
import { RouteErrorPage } from '@/presentation/pages/RouteErrorPage';

export const appRoutes: RouteObject[] = [
  {
    path: '/',
    Component: AppLayout,
    ErrorBoundary: RouteErrorPage,
    children: [
      {
        index: true,
        lazy: async () => {
          const { HomePage } = await import('@/presentation/pages/HomePage');

          return { Component: HomePage };
        },
      },
      {
        path: 'movie/:id',
        lazy: async () => {
          const { MovieDetailsPage } = await import('@/presentation/pages/MovieDetailsPage');

          return { Component: MovieDetailsPage };
        },
      },
      {
        path: 'favorites',
        lazy: async () => {
          const { FavoritesPage } = await import('@/presentation/pages/FavoritesPage');

          return { Component: FavoritesPage };
        },
      },
      {
        path: 'search',
        lazy: async () => {
          const { SearchPage } = await import('@/presentation/pages/SearchPage');

          return { Component: SearchPage };
        },
      },
      {
        path: '*',
        lazy: async () => {
          const { NotFoundPage } = await import('@/presentation/pages/NotFoundPage');

          return { Component: NotFoundPage };
        },
      },
    ],
  },
];
