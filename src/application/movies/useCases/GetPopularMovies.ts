import type { PaginatedResult } from '@/domain/common/PaginatedResult';
import type { Movie } from '@/domain/movies/entities/Movie';
import type { MovieRepository } from '@/domain/movies/repositories/MovieRepository';

export interface GetPopularMoviesQuery {
  readonly page: number;
}

export interface GetPopularMovies {
  execute(query: GetPopularMoviesQuery): Promise<PaginatedResult<Movie>>;
}

export class GetPopularMoviesUseCase implements GetPopularMovies {
  constructor(private readonly movieRepository: MovieRepository) {}

  execute(query: GetPopularMoviesQuery): Promise<PaginatedResult<Movie>> {
    return this.movieRepository.getPopularMovies({ page: query.page });
  }
}
