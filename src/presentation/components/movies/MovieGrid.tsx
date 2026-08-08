import type { ReactNode } from 'react';

import type { Movie } from '@/domain/movies/entities/Movie';
import { MovieCard, type MovieCardAction } from '@/presentation/components/movies/MovieCard';

interface MovieGridProps {
  readonly ariaLabel?: string;
  readonly className?: string;
  readonly getAction?: (movie: Movie) => MovieCardAction | undefined;
  readonly movies: readonly Movie[];
  readonly renderTitle?: (movie: Movie) => ReactNode;
}

export function MovieGrid({
  ariaLabel = 'Filmes',
  className = '',
  getAction,
  movies,
  renderTitle,
}: MovieGridProps) {
  return (
    <ul
      aria-label={ariaLabel}
      className={`grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 ${className}`}
    >
      {movies.map((movie) => (
        <li key={movie.id}>
          <MovieCard
            movie={movie}
            action={getAction?.(movie)}
            titleContent={renderTitle?.(movie)}
          />
        </li>
      ))}
    </ul>
  );
}
