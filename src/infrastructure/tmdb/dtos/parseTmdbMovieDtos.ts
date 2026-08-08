import type {
  TmdbGenreDto,
  TmdbMovieDetailsDto,
  TmdbMovieDto,
  TmdbMoviePageDto,
} from '@/infrastructure/tmdb/dtos/TmdbMovieDto';

export class InvalidTmdbResponseError extends Error {
  constructor(path: string, expectedType: string) {
    super(`Invalid TMDB response at ${path}: expected ${expectedType}.`);
    this.name = 'InvalidTmdbResponseError';
  }
}

function readRecord(value: unknown, path: string): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new InvalidTmdbResponseError(path, 'an object');
  }

  return value as Record<string, unknown>;
}

function readArray(value: unknown, path: string): readonly unknown[] {
  if (!Array.isArray(value)) {
    throw new InvalidTmdbResponseError(path, 'an array');
  }

  return value;
}

function readNumber(value: unknown, path: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new InvalidTmdbResponseError(path, 'a finite number');
  }

  return value;
}

function readString(value: unknown, path: string): string {
  if (typeof value !== 'string') {
    throw new InvalidTmdbResponseError(path, 'a string');
  }

  return value;
}

function readNullableString(value: unknown, path: string): string | null {
  if (value === null) {
    return null;
  }

  return readString(value, path);
}

function parseGenre(value: unknown, path: string): TmdbGenreDto {
  const record = readRecord(value, path);

  return {
    id: readNumber(record.id, `${path}.id`),
    name: readString(record.name, `${path}.name`),
  };
}

export function parseTmdbMovie(value: unknown, path = 'movie'): TmdbMovieDto {
  const record = readRecord(value, path);

  return {
    id: readNumber(record.id, `${path}.id`),
    title: readString(record.title, `${path}.title`),
    overview: readString(record.overview, `${path}.overview`),
    poster_path: readNullableString(record.poster_path, `${path}.poster_path`),
    backdrop_path: readNullableString(record.backdrop_path, `${path}.backdrop_path`),
    release_date: readString(record.release_date, `${path}.release_date`),
    vote_average: readNumber(record.vote_average, `${path}.vote_average`),
    genre_ids: readArray(record.genre_ids, `${path}.genre_ids`).map((genreId, index) =>
      readNumber(genreId, `${path}.genre_ids[${index}]`),
    ),
  };
}

export function parseTmdbMovieDetails(value: unknown): TmdbMovieDetailsDto {
  const path = 'movieDetails';
  const record = readRecord(value, path);

  return {
    id: readNumber(record.id, `${path}.id`),
    title: readString(record.title, `${path}.title`),
    overview: readString(record.overview, `${path}.overview`),
    poster_path: readNullableString(record.poster_path, `${path}.poster_path`),
    backdrop_path: readNullableString(record.backdrop_path, `${path}.backdrop_path`),
    release_date: readString(record.release_date, `${path}.release_date`),
    vote_average: readNumber(record.vote_average, `${path}.vote_average`),
    genres: readArray(record.genres, `${path}.genres`).map((genre, index) =>
      parseGenre(genre, `${path}.genres[${index}]`),
    ),
  };
}

export function parseTmdbMoviePage(value: unknown): TmdbMoviePageDto {
  const path = 'moviePage';
  const record = readRecord(value, path);

  return {
    page: readNumber(record.page, `${path}.page`),
    results: readArray(record.results, `${path}.results`).map((movie, index) =>
      parseTmdbMovie(movie, `${path}.results[${index}]`),
    ),
    total_pages: readNumber(record.total_pages, `${path}.total_pages`),
    total_results: readNumber(record.total_results, `${path}.total_results`),
  };
}
