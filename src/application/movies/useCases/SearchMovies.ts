import type { PaginatedResult } from '@/domain/common/PaginatedResult';
import type { Movie } from '@/domain/movies/entities/Movie';
import type { MovieRepository } from '@/domain/movies/repositories/MovieRepository';

export interface SearchMoviesQuery {
  readonly page: number;
  readonly query: string;
}

export interface SearchMovies {
  execute(query: SearchMoviesQuery): Promise<PaginatedResult<Movie>>;
}

export class SearchMoviesUseCase implements SearchMovies {
  constructor(private readonly movieRepository: MovieRepository) {}

  execute(query: SearchMoviesQuery): Promise<PaginatedResult<Movie>> {
    return this.movieRepository.searchMovies({
      page: query.page,
      query: query.query,
    });
  }
}
