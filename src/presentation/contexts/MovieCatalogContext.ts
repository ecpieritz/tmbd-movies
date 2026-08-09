import { createContext } from 'react';

import type { GetMovieDetails } from '@/application/movies/useCases/GetMovieDetails';
import type { GetPopularMovies } from '@/application/movies/useCases/GetPopularMovies';
import type { GetRelatedMovies } from '@/application/movies/useCases/GetRelatedMovies';
import type { SearchMovies } from '@/application/movies/useCases/SearchMovies';

export interface MovieCatalogServices {
  readonly getMovieDetails: GetMovieDetails;
  readonly getPopularMovies: GetPopularMovies;
  readonly getRelatedMovies: GetRelatedMovies;
  readonly searchMovies: SearchMovies;
}

export const MovieCatalogContext = createContext<MovieCatalogServices | null>(null);
