import type { PaginatedResult } from '@/domain/common/PaginatedResult';
import type { Movie } from '@/domain/movies/entities/Movie';
import type { MovieDetails } from '@/domain/movies/entities/MovieDetails';

export interface MoviePageRequest {
  readonly page: number;
}

export interface MovieDiscoveryRequest extends MoviePageRequest {
  readonly genreIds: readonly number[];
}

export interface MovieSearchRequest extends MoviePageRequest {
  readonly query: string;
}

export interface MovieRepository {
  discoverMoviesByGenres(request: MovieDiscoveryRequest): Promise<PaginatedResult<Movie>>;
  getMovieDetails(movieId: number): Promise<MovieDetails>;
  getPopularMovies(request: MoviePageRequest): Promise<PaginatedResult<Movie>>;
  searchMovies(request: MovieSearchRequest): Promise<PaginatedResult<Movie>>;
}
