import type { Movie } from '@/domain/movies/entities/Movie';
import type { MovieRepository } from '@/domain/movies/repositories/MovieRepository';

const DEFAULT_RESULT_LIMIT = 6;

export interface GetRelatedMoviesQuery {
  readonly excludedMovieId: number;
  readonly genreIds: readonly number[];
  readonly limit?: number;
}

export interface GetRelatedMovies {
  execute(query: GetRelatedMoviesQuery): Promise<readonly Movie[]>;
}

export class GetRelatedMoviesUseCase implements GetRelatedMovies {
  constructor(private readonly movieRepository: MovieRepository) {}

  async execute(query: GetRelatedMoviesQuery): Promise<readonly Movie[]> {
    const limit = query.limit ?? DEFAULT_RESULT_LIMIT;

    if (!Number.isInteger(limit) || limit < 1 || limit > 20) {
      throw new RangeError('Related movie limit must be an integer between 1 and 20.');
    }

    if (query.genreIds.length === 0) {
      return [];
    }

    const result = await this.movieRepository.discoverMoviesByGenres({
      genreIds: query.genreIds,
      page: 1,
    });

    return Object.freeze(
      result.items.filter((movie) => movie.id !== query.excludedMovieId).slice(0, limit),
    );
  }
}
