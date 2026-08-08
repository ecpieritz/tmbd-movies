import { createContext } from 'react';

import type { GetPopularMovies } from '@/application/movies/useCases/GetPopularMovies';

export interface MovieCatalogServices {
  readonly getPopularMovies: GetPopularMovies;
}

export const MovieCatalogContext = createContext<MovieCatalogServices | null>(null);
