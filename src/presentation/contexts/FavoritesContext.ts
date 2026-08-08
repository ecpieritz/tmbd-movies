import { createContext } from 'react';

import type { Movie } from '@/domain/movies/entities/Movie';

export interface FavoritesContextValue {
  readonly favorites: readonly Movie[];
  readonly isFavorite: (movieId: number) => boolean;
  readonly removeFavorite: (movieId: number) => void;
  readonly toggleFavorite: (movie: Movie) => void;
}

export const FavoritesContext = createContext<FavoritesContextValue | null>(null);
