import type { PaginatedResult } from '@/domain/common/PaginatedResult';
import type { Movie } from '@/domain/movies/entities/Movie';
import type { MovieDetails } from '@/domain/movies/entities/MovieDetails';
import type {
  TmdbMovieDetailsDto,
  TmdbMovieDto,
  TmdbMoviePageDto,
} from '@/infrastructure/tmdb/dtos/TmdbMovieDto';

function normalizeImagePath(path: string | null): string | null {
  if (!path) {
    return null;
  }

  return path.startsWith('/') ? path : `/${path}`;
}

function normalizeReleaseDate(releaseDate: string): string | null {
  const normalizedDate = releaseDate.trim();

  return normalizedDate || null;
}

export function mapTmdbMovie(dto: TmdbMovieDto): Movie {
  return Object.freeze({
    id: dto.id,
    title: dto.title,
    overview: dto.overview,
    posterPath: normalizeImagePath(dto.poster_path),
    backdropPath: normalizeImagePath(dto.backdrop_path),
    releaseDate: normalizeReleaseDate(dto.release_date),
    voteAverage: dto.vote_average,
    genreIds: Object.freeze([...dto.genre_ids]),
  });
}

export function mapTmdbMovieDetails(dto: TmdbMovieDetailsDto): MovieDetails {
  const genres = Object.freeze(dto.genres.map((genre) => Object.freeze({ ...genre })));

  return Object.freeze({
    id: dto.id,
    title: dto.title,
    overview: dto.overview,
    posterPath: normalizeImagePath(dto.poster_path),
    backdropPath: normalizeImagePath(dto.backdrop_path),
    releaseDate: normalizeReleaseDate(dto.release_date),
    voteAverage: dto.vote_average,
    genreIds: Object.freeze(genres.map((genre) => genre.id)),
    genres,
  });
}

export function mapTmdbMoviePage(dto: TmdbMoviePageDto): PaginatedResult<Movie> {
  return Object.freeze({
    items: Object.freeze(dto.results.map(mapTmdbMovie)),
    page: dto.page,
    totalPages: dto.total_pages,
    totalResults: dto.total_results,
  });
}
