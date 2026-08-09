import { createContext } from 'react';

import type { GetMovieDetails } from '@/application/movies/useCases/GetMovieDetails';
import type { GetPopularMovies } from '@/application/movies/useCases/GetPopularMovies';
import type { GetRelatedMovies } from '@/application/movies/useCases/GetRelatedMovies';

export interface MovieCatalogServices {
  readonly getMovieDetails: GetMovieDetails;
  readonly getPopularMovies: GetPopularMovies;
  readonly getRelatedMovies: GetRelatedMovies;
}

export const MovieCatalogContext = createContext<MovieCatalogServices | null>(null);
