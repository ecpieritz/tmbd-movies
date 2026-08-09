import { useCallback } from 'react';

import type { Movie } from '@/domain/movies/entities/Movie';
import type { MovieDetails } from '@/domain/movies/entities/MovieDetails';
import type { MovieCardAction } from '@/presentation/components/movies/MovieCard';
import { MovieGrid } from '@/presentation/components/movies/MovieGrid';
import { MovieGridSkeleton } from '@/presentation/components/movies/MovieGridSkeleton';
import { useFavorites } from '@/presentation/hooks/useFavorites';
import { useRelatedMovies } from '@/presentation/hooks/useRelatedMovies';

interface RelatedMoviesSectionProps {
  readonly movie: MovieDetails;
}

export function RelatedMoviesSection({ movie }: RelatedMoviesSectionProps) {
  const { retry, state } = useRelatedMovies(movie.id, movie.genreIds);
  const { isFavorite, toggleFavorite } = useFavorites();
  const getFavoriteAction = useCallback(
    (relatedMovie: Movie): MovieCardAction => ({
      isFavorite: isFavorite(relatedMovie.id),
      onClick: toggleFavorite,
      type: 'favorite',
    }),
    [isFavorite, toggleFavorite],
  );

  if (state.status === 'success' && state.movies.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="related-movies-title"
      className="border-t border-divider py-8 sm:py-10"
    >
      <div className="mb-6">
        <p className="text-sm font-semibold tracking-wider text-brand uppercase">Descubra também</p>
        <h2 id="related-movies-title" className="mt-1 text-2xl font-bold tracking-tight">
          Filmes dos mesmos gêneros
        </h2>
        {movie.genres.length > 0 ? (
          <p className="mt-2 text-sm text-content-muted">
            Baseado em {movie.genres.map((genre) => genre.name).join(', ')}
          </p>
        ) : null}
      </div>

      {state.status === 'loading' ? <MovieGridSkeleton itemCount={6} /> : null}

      {state.status === 'error' ? (
        <div className="rounded-card border border-divider bg-panel px-5 py-6 text-center">
          <p className="text-sm text-content-muted">
            Não foi possível carregar filmes relacionados.
          </p>
          <button
            type="button"
            onClick={retry}
            className="mt-4 rounded-control border border-brand px-4 py-2 text-sm font-semibold text-brand transition-colors hover:bg-brand/10 focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
          >
            Tentar novamente
          </button>
        </div>
      ) : null}

      {state.status === 'success' && state.movies.length > 0 ? (
        <MovieGrid
          movies={state.movies}
          ariaLabel="Filmes dos mesmos gêneros"
          getAction={getFavoriteAction}
        />
      ) : null}
    </section>
  );
}
