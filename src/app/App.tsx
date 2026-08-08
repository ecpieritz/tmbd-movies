import { RouterProvider } from 'react-router/dom';

import { appRouter } from '@/app/router/appRouter';
import { GetPopularMoviesUseCase } from '@/application/movies/useCases/GetPopularMovies';
import { createTmdbMovieRepository } from '@/infrastructure/tmdb/createTmdbMovieRepository';
import { MovieCatalogProvider } from '@/presentation/providers/MovieCatalogProvider';

const movieRepository = createTmdbMovieRepository();
const movieCatalogServices = Object.freeze({
  getPopularMovies: new GetPopularMoviesUseCase(movieRepository),
});

export function App() {
  return (
    <MovieCatalogProvider services={movieCatalogServices}>
      <RouterProvider router={appRouter} />
    </MovieCatalogProvider>
  );
}
