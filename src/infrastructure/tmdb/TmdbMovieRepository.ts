import type { PaginatedResult } from '@/domain/common/PaginatedResult';
import type { Movie } from '@/domain/movies/entities/Movie';
import type { MovieDetails } from '@/domain/movies/entities/MovieDetails';
import type {
  MoviePageRequest,
  MovieRepository,
  MovieSearchRequest,
} from '@/domain/movies/repositories/MovieRepository';
import type { TmdbMovieDataSource } from '@/infrastructure/tmdb/TmdbMovieDataSource';
import {
  mapTmdbMovieDetails,
  mapTmdbMoviePage,
} from '@/infrastructure/tmdb/mappers/tmdbMovieMapper';

const DEFAULT_LANGUAGE = 'pt-BR';

function assertPositiveInteger(value: number, fieldName: string): void {
  if (!Number.isInteger(value) || value < 1) {
    throw new RangeError(`${fieldName} must be a positive integer.`);
  }
}

export class TmdbMovieRepository implements MovieRepository {
  constructor(
    private readonly dataSource: TmdbMovieDataSource,
    private readonly language = DEFAULT_LANGUAGE,
  ) {}

  async getPopularMovies(request: MoviePageRequest): Promise<PaginatedResult<Movie>> {
    assertPositiveInteger(request.page, 'Page');

    return mapTmdbMoviePage(
      await this.dataSource.getPopularMovies({
        language: this.language,
        page: request.page,
      }),
    );
  }

  async searchMovies(request: MovieSearchRequest): Promise<PaginatedResult<Movie>> {
    assertPositiveInteger(request.page, 'Page');

    const query = request.query.trim();

    if (!query) {
      throw new TypeError('Search query must not be empty.');
    }

    return mapTmdbMoviePage(
      await this.dataSource.searchMovies({
        includeAdult: false,
        language: this.language,
        page: request.page,
        query,
      }),
    );
  }

  async getMovieDetails(movieId: number): Promise<MovieDetails> {
    assertPositiveInteger(movieId, 'Movie ID');

    return mapTmdbMovieDetails(await this.dataSource.getMovieDetails(movieId, this.language));
  }
}
