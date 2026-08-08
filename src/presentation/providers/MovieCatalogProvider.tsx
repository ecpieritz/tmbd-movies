import type { ReactNode } from 'react';

import {
  MovieCatalogContext,
  type MovieCatalogServices,
} from '@/presentation/contexts/MovieCatalogContext';

interface MovieCatalogProviderProps {
  readonly children: ReactNode;
  readonly services: MovieCatalogServices;
}

export function MovieCatalogProvider({ children, services }: MovieCatalogProviderProps) {
  return <MovieCatalogContext.Provider value={services}>{children}</MovieCatalogContext.Provider>;
}
