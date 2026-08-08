import type { MovieRepository } from '@/domain/movies/repositories/MovieRepository';
import { FetchHttpClient } from '@/infrastructure/http/FetchHttpClient';
import { TmdbMovieDataSource } from '@/infrastructure/tmdb/TmdbMovieDataSource';
import { TmdbMovieRepository } from '@/infrastructure/tmdb/TmdbMovieRepository';

const TMDB_PROXY_BASE_URL = '/api/tmdb';

export function createTmdbMovieRepository(): MovieRepository {
  const httpClient = new FetchHttpClient(TMDB_PROXY_BASE_URL);
  const dataSource = new TmdbMovieDataSource(httpClient);

  return new TmdbMovieRepository(dataSource);
}
