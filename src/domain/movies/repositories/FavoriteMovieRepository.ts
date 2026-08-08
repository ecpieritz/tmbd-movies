import type { Movie } from '@/domain/movies/entities/Movie';

export interface FavoriteMovieRepository {
  loadAll(): readonly Movie[];
  saveAll(movies: readonly Movie[]): void;
}
