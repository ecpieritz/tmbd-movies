import type { Movie } from '@/domain/movies/entities/Movie';

export type FavoriteSort = 'rating-desc' | 'title-asc' | 'title-desc';

const titleCollator = new Intl.Collator('pt-BR', { numeric: true, sensitivity: 'base' });

export function sortFavoriteMovies(movies: readonly Movie[], sort: FavoriteSort): readonly Movie[] {
  return [...movies].sort((firstMovie, secondMovie) => {
    if (sort === 'rating-desc') {
      return (
        secondMovie.voteAverage - firstMovie.voteAverage ||
        titleCollator.compare(firstMovie.title, secondMovie.title)
      );
    }

    const titleComparison = titleCollator.compare(firstMovie.title, secondMovie.title);

    return sort === 'title-asc' ? titleComparison : -titleComparison;
  });
}
