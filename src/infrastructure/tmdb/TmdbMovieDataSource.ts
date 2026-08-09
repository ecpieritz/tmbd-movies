import type { HttpClient } from '@/infrastructure/http/HttpClient';
import type {
  TmdbMovieDetailsDto,
  TmdbMoviePageDto,
} from '@/infrastructure/tmdb/dtos/TmdbMovieDto';
import {
  parseTmdbMovieDetails,
  parseTmdbMoviePage,
} from '@/infrastructure/tmdb/dtos/parseTmdbMovieDtos';

export interface TmdbPageOptions {
  readonly language: string;
  readonly page: number;
}

export interface TmdbSearchOptions extends TmdbPageOptions {
  readonly includeAdult: boolean;
  readonly query: string;
}

export interface TmdbDiscoverOptions extends TmdbPageOptions {
  readonly genreIds: readonly number[];
  readonly includeAdult: boolean;
  readonly includeVideo: boolean;
}

export class TmdbMovieDataSource {
  constructor(private readonly httpClient: HttpClient) {}

  async getPopularMovies(options: TmdbPageOptions): Promise<TmdbMoviePageDto> {
    const payload = await this.httpClient.get('/movie/popular', {
      query: {
        language: options.language,
        page: options.page,
      },
    });

    return parseTmdbMoviePage(payload);
  }

  async discoverMoviesByGenres(options: TmdbDiscoverOptions): Promise<TmdbMoviePageDto> {
    const payload = await this.httpClient.get('/discover/movie', {
      query: {
        include_adult: options.includeAdult,
        include_video: options.includeVideo,
        language: options.language,
        page: options.page,
        sort_by: 'popularity.desc',
        with_genres: options.genreIds.join('|'),
      },
    });

    return parseTmdbMoviePage(payload);
  }

  async searchMovies(options: TmdbSearchOptions): Promise<TmdbMoviePageDto> {
    const payload = await this.httpClient.get('/search/movie', {
      query: {
        include_adult: options.includeAdult,
        language: options.language,
        page: options.page,
        query: options.query,
      },
    });

    return parseTmdbMoviePage(payload);
  }

  async getMovieDetails(movieId: number, language: string): Promise<TmdbMovieDetailsDto> {
    const payload = await this.httpClient.get(`/movie/${movieId}`, {
      query: { language },
    });

    return parseTmdbMovieDetails(payload);
  }
}
