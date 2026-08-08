import type { Movie } from '@/domain/movies/entities/Movie';
import type { FavoriteMovieRepository } from '@/domain/movies/repositories/FavoriteMovieRepository';

export interface FavoriteMovies {
  load(): readonly Movie[];
  remove(currentMovies: readonly Movie[], movieId: number): readonly Movie[];
  toggle(currentMovies: readonly Movie[], movie: Movie): readonly Movie[];
}

export class FavoriteMoviesService implements FavoriteMovies {
  constructor(private readonly favoriteMovieRepository: FavoriteMovieRepository) {}

  load(): readonly Movie[] {
    return this.favoriteMovieRepository.loadAll();
  }

  remove(currentMovies: readonly Movie[], movieId: number): readonly Movie[] {
    const nextMovies = Object.freeze(currentMovies.filter((movie) => movie.id !== movieId));

    this.favoriteMovieRepository.saveAll(nextMovies);

    return nextMovies;
  }

  toggle(currentMovies: readonly Movie[], movie: Movie): readonly Movie[] {
    const isAlreadyFavorite = currentMovies.some((favorite) => favorite.id === movie.id);
    const nextMovies = isAlreadyFavorite
      ? Object.freeze(currentMovies.filter((favorite) => favorite.id !== movie.id))
      : Object.freeze([...currentMovies, movie]);

    this.favoriteMovieRepository.saveAll(nextMovies);

    return nextMovies;
  }
}
