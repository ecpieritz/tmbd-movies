import type { Movie } from '@/domain/movies/entities/Movie';
import type {
  TmdbMovieDetailsDto,
  TmdbMovieDto,
  TmdbMoviePageDto,
} from '@/infrastructure/tmdb/dtos/TmdbMovieDto';

export function createMovie(overrides: Partial<Movie> = {}): Movie {
  return {
    backdropPath: '/backdrop.jpg',
    genreIds: [14, 10402],
    id: 101,
    overview: 'Uma história fantástica e musical.',
    posterPath: '/poster.jpg',
    releaseDate: '2024-11-20',
    title: 'Wicked',
    voteAverage: 8.1,
    ...overrides,
  };
}

export function createTmdbMovieDto(overrides: Partial<TmdbMovieDto> = {}): TmdbMovieDto {
  return {
    backdrop_path: '/backdrop.jpg',
    genre_ids: [14, 10402],
    id: 101,
    overview: 'Uma história fantástica e musical.',
    poster_path: '/poster.jpg',
    release_date: '2024-11-20',
    title: 'Wicked',
    vote_average: 8.1,
    ...overrides,
  };
}

export function createTmdbMovieDetailsDto(
  overrides: Partial<TmdbMovieDetailsDto> = {},
): TmdbMovieDetailsDto {
  return {
    backdrop_path: '/wicked-backdrop.jpg',
    genres: [
      { id: 14, name: 'Fantasia' },
      { id: 10402, name: 'Música' },
    ],
    id: 101,
    overview: 'A amizade entre Elphaba e Glinda transforma o mundo de Oz.',
    poster_path: '/wicked-poster.jpg',
    release_date: '2024-11-20',
    title: 'Wicked',
    vote_average: 8.1,
    ...overrides,
  };
}

export function createTmdbMoviePage(
  results: readonly TmdbMovieDto[] = [createTmdbMovieDto()],
  overrides: Partial<Omit<TmdbMoviePageDto, 'results'>> = {},
): TmdbMoviePageDto {
  return {
    page: 1,
    results,
    total_pages: 1,
    total_results: results.length,
    ...overrides,
  };
}
