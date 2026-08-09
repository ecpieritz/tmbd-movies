import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';

import { appRoutes } from '@/app/router/routes';
import { FavoriteMoviesService } from '@/application/favorites/FavoriteMoviesService';
import { GetMovieDetailsUseCase } from '@/application/movies/useCases/GetMovieDetails';
import { GetPopularMoviesUseCase } from '@/application/movies/useCases/GetPopularMovies';
import { GetRelatedMoviesUseCase } from '@/application/movies/useCases/GetRelatedMovies';
import { SearchMoviesUseCase } from '@/application/movies/useCases/SearchMovies';
import { LocalStorageFavoriteMovieRepository } from '@/infrastructure/storage/LocalStorageFavoriteMovieRepository';
import { createTmdbMovieRepository } from '@/infrastructure/tmdb/createTmdbMovieRepository';
import { FavoritesProvider } from '@/presentation/providers/FavoritesProvider';
import { MovieCatalogProvider } from '@/presentation/providers/MovieCatalogProvider';

export function renderApplication(initialEntry = '/') {
  const movieRepository = createTmdbMovieRepository();
  const services = Object.freeze({
    getMovieDetails: new GetMovieDetailsUseCase(movieRepository),
    getPopularMovies: new GetPopularMoviesUseCase(movieRepository),
    getRelatedMovies: new GetRelatedMoviesUseCase(movieRepository),
    searchMovies: new SearchMoviesUseCase(movieRepository),
  });
  const favoriteMoviesService = new FavoriteMoviesService(
    new LocalStorageFavoriteMovieRepository(globalThis.localStorage),
  );
  const testRoutes = appRoutes.map((route) => ({ ...route, HydrateFallback: () => null }));
  const router = createMemoryRouter(testRoutes, { initialEntries: [initialEntry] });
  const user = userEvent.setup();
  const view = render(
    <FavoritesProvider favoriteMoviesService={favoriteMoviesService}>
      <MovieCatalogProvider services={services}>
        <RouterProvider router={router} />
      </MovieCatalogProvider>
    </FavoritesProvider>,
  );

  return { ...view, router, user } as const;
}
