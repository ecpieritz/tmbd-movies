import {
  mapTmdbMovie,
  mapTmdbMovieDetails,
  mapTmdbMoviePage,
} from '@/infrastructure/tmdb/mappers/tmdbMovieMapper';
import {
  createTmdbMovieDetailsDto,
  createTmdbMovieDto,
  createTmdbMoviePage,
} from '@/test/fixtures/movies';

describe('tmdbMovieMapper', () => {
  it('maps and normalizes a movie without mutating its DTO', () => {
    const dto = createTmdbMovieDto({
      backdrop_path: null,
      genre_ids: [14, 10402],
      poster_path: 'poster.jpg',
      release_date: '   ',
    });

    const movie = mapTmdbMovie(dto);

    expect(movie).toEqual({
      backdropPath: null,
      genreIds: [14, 10402],
      id: 101,
      overview: dto.overview,
      posterPath: '/poster.jpg',
      releaseDate: null,
      title: 'Wicked',
      voteAverage: 8.1,
    });
    expect(Object.isFrozen(movie)).toBe(true);
    expect(Object.isFrozen(movie.genreIds)).toBe(true);
    expect(movie.genreIds).not.toBe(dto.genre_ids);
  });

  it('maps details and creates immutable genre collections', () => {
    const dto = createTmdbMovieDetailsDto();

    const movie = mapTmdbMovieDetails(dto);

    expect(movie.genres).toEqual([
      { id: 14, name: 'Fantasia' },
      { id: 10402, name: 'Música' },
    ]);
    expect(movie.genreIds).toEqual([14, 10402]);
    expect(Object.isFrozen(movie)).toBe(true);
    expect(Object.isFrozen(movie.genres)).toBe(true);
    expect(Object.isFrozen(movie.genres[0])).toBe(true);
  });

  it('maps pagination metadata and every result', () => {
    const dto = createTmdbMoviePage(
      [createTmdbMovieDto(), createTmdbMovieDto({ id: 202, title: 'Wonka' })],
      { page: 2, total_pages: 4, total_results: 62 },
    );

    const result = mapTmdbMoviePage(dto);

    expect(result).toMatchObject({ page: 2, totalPages: 4, totalResults: 62 });
    expect(result.items.map((movie) => movie.title)).toEqual(['Wicked', 'Wonka']);
    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result.items)).toBe(true);
  });
});
