import { sortFavoriteMovies } from '@/presentation/pages/favorites/sortFavoriteMovies';
import { createMovie } from '@/test/fixtures/movies';

const favorites = [
  createMovie({ id: 1, title: 'Filme 10', voteAverage: 8.2 }),
  createMovie({ id: 2, title: 'Árvore', voteAverage: 9.1 }),
  createMovie({ id: 3, title: 'filme 2', voteAverage: 9.1 }),
];

describe('sortFavoriteMovies', () => {
  it('sorts titles from A to Z using Portuguese and numeric comparison', () => {
    const sortedMovies = sortFavoriteMovies(favorites, 'title-asc');

    expect(sortedMovies.map((movie) => movie.title)).toEqual(['Árvore', 'filme 2', 'Filme 10']);
    expect(sortedMovies).not.toBe(favorites);
  });

  it('sorts titles from Z to A', () => {
    const sortedMovies = sortFavoriteMovies(favorites, 'title-desc');

    expect(sortedMovies.map((movie) => movie.title)).toEqual(['Filme 10', 'filme 2', 'Árvore']);
  });

  it('sorts by descending rating and uses title as a stable tie-breaker', () => {
    const sortedMovies = sortFavoriteMovies(favorites, 'rating-desc');

    expect(sortedMovies.map((movie) => movie.title)).toEqual(['Árvore', 'filme 2', 'Filme 10']);
  });
});
