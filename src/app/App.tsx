import { RouterProvider } from 'react-router/dom';

import { appRouter } from '@/app/router/appRouter';
import { FavoriteMoviesService } from '@/application/favorites/FavoriteMoviesService';
import { GetMovieDetailsUseCase } from '@/application/movies/useCases/GetMovieDetails';
import { GetPopularMoviesUseCase } from '@/application/movies/useCases/GetPopularMovies';
import { GetRelatedMoviesUseCase } from '@/application/movies/useCases/GetRelatedMovies';
import { LocalStorageFavoriteMovieRepository } from '@/infrastructure/storage/LocalStorageFavoriteMovieRepository';
import { createTmdbMovieRepository } from '@/infrastructure/tmdb/createTmdbMovieRepository';
import { FavoritesProvider } from '@/presentation/providers/FavoritesProvider';
import { MovieCatalogProvider } from '@/presentation/providers/MovieCatalogProvider';

const movieRepository = createTmdbMovieRepository();
const movieCatalogServices = Object.freeze({
  getMovieDetails: new GetMovieDetailsUseCase(movieRepository),
  getPopularMovies: new GetPopularMoviesUseCase(movieRepository),
  getRelatedMovies: new GetRelatedMoviesUseCase(movieRepository),
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
