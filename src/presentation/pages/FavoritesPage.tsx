import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router';

import type { MovieCardAction } from '@/presentation/components/movies/MovieCard';
import { MovieGrid } from '@/presentation/components/movies/MovieGrid';
import { useFavorites } from '@/presentation/hooks/useFavorites';
import {
  sortFavoriteMovies,
  type FavoriteSort,
} from '@/presentation/pages/favorites/sortFavoriteMovies';

function EmptyFavoritesState() {
  return (
    <section className="flex min-h-[55vh] flex-col items-center justify-center px-4 text-center">
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-16 text-content-muted"
        fill="none"
      >
        <path
          d="M4 9h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="m5 4 14-2 1 5-14 2-1-5Z"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </svg>
      <h1 className="mt-5 text-2xl font-bold">Nenhum filme favorito ainda</h1>
      <p className="mt-2 max-w-md text-content-muted">
        Explore os filmes populares e use o coração para montar sua lista.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex min-h-11 items-center rounded-control bg-brand-strong px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-hover focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-page focus-visible:outline-none"
      >
        Explorar filmes
      </Link>
    </section>
  );
}

export function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites();
  const [sort, setSort] = useState<FavoriteSort>('title-asc');
  const sortedFavorites = useMemo(() => sortFavoriteMovies(favorites, sort), [favorites, sort]);
  const getRemoveAction = useCallback(
    (): MovieCardAction => ({
      onClick: (movie) => removeFavorite(movie.id),
      type: 'remove',
    }),
    [removeFavorite],
  );

  if (favorites.length === 0) {
    return <EmptyFavoritesState />;
  }

  return (
    <section aria-labelledby="favorites-title" className="py-6 sm:py-8">
      <header className="mb-6">
        <p className="text-sm font-semibold tracking-wider text-brand uppercase">Sua lista</p>
        <h1 id="favorites-title" className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          Meus filmes favoritos
        </h1>
      </header>

      <div className="mb-6 flex flex-wrap items-center gap-3 border-y border-divider py-4">
        <label htmlFor="favorite-sort" className="text-sm font-medium">
          Ordenar por:
        </label>
        <select
          id="favorite-sort"
          value={sort}
          onChange={(event) => setSort(event.target.value as FavoriteSort)}
          className="min-h-11 rounded-control border border-divider bg-card px-3 py-2 text-sm text-content outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
        >
          <option value="title-asc">Título (A–Z)</option>
          <option value="title-desc">Título (Z–A)</option>
          <option value="rating-desc">Nota (maior–menor)</option>
        </select>
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {favorites.length} {favorites.length === 1 ? 'filme favorito' : 'filmes favoritos'} na
        lista.
      </p>

      <MovieGrid
        movies={sortedFavorites}
        ariaLabel="Filmes favoritos"
        getAction={getRemoveAction}
      />
    </section>
  );
}
