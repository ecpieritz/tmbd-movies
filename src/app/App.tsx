import { RouterProvider } from 'react-router/dom';

import { appRouter } from '@/app/router/appRouter';
import { FavoriteMoviesService } from '@/application/favorites/FavoriteMoviesService';
import { GetPopularMoviesUseCase } from '@/application/movies/useCases/GetPopularMovies';
import { LocalStorageFavoriteMovieRepository } from '@/infrastructure/storage/LocalStorageFavoriteMovieRepository';
import { createTmdbMovieRepository } from '@/infrastructure/tmdb/createTmdbMovieRepository';
import { FavoritesProvider } from '@/presentation/providers/FavoritesProvider';
import { MovieCatalogProvider } from '@/presentation/providers/MovieCatalogProvider';

const movieRepository = createTmdbMovieRepository();
const movieCatalogServices = Object.freeze({
  getPopularMovies: new GetPopularMoviesUseCase(movieRepository),
});
const favoriteMoviesService = new FavoriteMoviesService(
  new LocalStorageFavoriteMovieRepository(globalThis.localStorage),
);

export function App() {
  return (
    <FavoritesProvider favoriteMoviesService={favoriteMoviesService}>
      <MovieCatalogProvider services={movieCatalogServices}>
        <RouterProvider router={appRouter} />
      </MovieCatalogProvider>
    </FavoritesProvider>
  );
}
