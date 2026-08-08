import { useContext } from 'react';

import {
  MovieCatalogContext,
  type MovieCatalogServices,
} from '@/presentation/contexts/MovieCatalogContext';

export function useMovieCatalog(): MovieCatalogServices {
  const services = useContext(MovieCatalogContext);

  if (!services) {
    throw new Error('useMovieCatalog must be used within a MovieCatalogProvider.');
  }

  return services;
}
