import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';

import type { FavoriteMovies } from '@/application/favorites/FavoriteMoviesService';
import type { Movie } from '@/domain/movies/entities/Movie';
import {
  FavoritesContext,
  type FavoritesContextValue,
} from '@/presentation/contexts/FavoritesContext';

interface FavoritesProviderProps {
  readonly children: ReactNode;
  readonly favoriteMoviesService: FavoriteMovies;
}

export function FavoritesProvider({ children, favoriteMoviesService }: FavoritesProviderProps) {
  const [favorites, setFavorites] = useState<readonly Movie[]>(() => favoriteMoviesService.load());
  const favoritesRef = useRef(favorites);

  const favoriteIds = useMemo(() => new Set(favorites.map((movie) => movie.id)), [favorites]);

  const isFavorite = useCallback((movieId: number) => favoriteIds.has(movieId), [favoriteIds]);

  const removeFavorite = useCallback(
    (movieId: number) => {
      const nextFavorites = favoriteMoviesService.remove(favoritesRef.current, movieId);

      favoritesRef.current = nextFavorites;
      setFavorites(nextFavorites);
    },
    [favoriteMoviesService],
  );

  const toggleFavorite = useCallback(
    (movie: Movie) => {
      const nextFavorites = favoriteMoviesService.toggle(favoritesRef.current, movie);

      favoritesRef.current = nextFavorites;
      setFavorites(nextFavorites);
    },
    [favoriteMoviesService],
  );

  const contextValue = useMemo<FavoritesContextValue>(
    () => ({ favorites, isFavorite, removeFavorite, toggleFavorite }),
    [favorites, isFavorite, removeFavorite, toggleFavorite],
  );

  return <FavoritesContext.Provider value={contextValue}>{children}</FavoritesContext.Provider>;
}
