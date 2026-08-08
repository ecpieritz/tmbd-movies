import type { Movie } from '@/domain/movies/entities/Movie';
import type { FavoriteMovieRepository } from '@/domain/movies/repositories/FavoriteMovieRepository';

const FAVORITES_STORAGE_KEY = 'moviedb:favorites:v1';
const STORAGE_VERSION = 1;

interface StoredFavorites {
  readonly items: readonly Movie[];
  readonly version: typeof STORAGE_VERSION;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNullableString(value: unknown): value is string | null {
  return typeof value === 'string' || value === null;
}

function parseGenreIds(value: unknown): readonly number[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const items: readonly unknown[] = value;

  if (!items.every((genreId) => typeof genreId === 'number' && Number.isInteger(genreId))) {
    return null;
  }

  return items as readonly number[];
}

function parseStoredMovie(value: unknown): Movie | null {
  if (!isRecord(value)) {
    return null;
  }

  const { backdropPath, genreIds, id, overview, posterPath, releaseDate, title, voteAverage } =
    value;
  const parsedGenreIds = parseGenreIds(genreIds);
  const isValidMovie =
    Number.isInteger(id) &&
    Number(id) > 0 &&
    typeof title === 'string' &&
    typeof overview === 'string' &&
    isNullableString(posterPath) &&
    isNullableString(backdropPath) &&
    isNullableString(releaseDate) &&
    typeof voteAverage === 'number' &&
    Number.isFinite(voteAverage) &&
    parsedGenreIds !== null;

  if (!isValidMovie) {
    return null;
  }

  return Object.freeze({
    backdropPath,
    genreIds: Object.freeze([...parsedGenreIds]),
    id: Number(id),
    overview,
    posterPath,
    releaseDate,
    title,
    voteAverage,
  });
}

function parseStoredFavorites(value: unknown): readonly Movie[] {
  if (!isRecord(value) || value.version !== STORAGE_VERSION || !Array.isArray(value.items)) {
    return [];
  }

  const uniqueMovies = new Map<number, Movie>();

  for (const item of value.items) {
    const movie = parseStoredMovie(item);

    if (movie) {
      uniqueMovies.set(movie.id, movie);
    }
  }

  return Object.freeze([...uniqueMovies.values()]);
}

export class LocalStorageFavoriteMovieRepository implements FavoriteMovieRepository {
  constructor(
    private readonly storage: Storage,
    private readonly storageKey = FAVORITES_STORAGE_KEY,
  ) {}

  loadAll(): readonly Movie[] {
    try {
      const storedValue = this.storage.getItem(this.storageKey);

      return storedValue ? parseStoredFavorites(JSON.parse(storedValue) as unknown) : [];
    } catch {
      return [];
    }
  }

  saveAll(movies: readonly Movie[]): void {
    const storedFavorites: StoredFavorites = {
      items: movies,
      version: STORAGE_VERSION,
    };

    try {
      this.storage.setItem(this.storageKey, JSON.stringify(storedFavorites));
    } catch {
      // The in-memory state remains usable when browser storage is unavailable.
    }
  }
}
