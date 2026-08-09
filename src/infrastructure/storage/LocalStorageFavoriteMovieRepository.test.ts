import { LocalStorageFavoriteMovieRepository } from '@/infrastructure/storage/LocalStorageFavoriteMovieRepository';
import { createMovie } from '@/test/fixtures/movies';

const STORAGE_KEY = 'test:favorite-movies';

describe('LocalStorageFavoriteMovieRepository', () => {
  it('persists favorites so another repository instance can restore them', () => {
    const movie = createMovie();
    new LocalStorageFavoriteMovieRepository(localStorage, STORAGE_KEY).saveAll([movie]);

    const restoredMovies = new LocalStorageFavoriteMovieRepository(
      localStorage,
      STORAGE_KEY,
    ).loadAll();

    expect(restoredMovies).toEqual([movie]);
    expect(Object.isFrozen(restoredMovies)).toBe(true);
    expect(Object.isFrozen(restoredMovies[0])).toBe(true);
  });

  it('ignores corrupted and incompatible cached values', () => {
    const repository = new LocalStorageFavoriteMovieRepository(localStorage, STORAGE_KEY);

    localStorage.setItem(STORAGE_KEY, 'invalid-json');
    expect(repository.loadAll()).toEqual([]);

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: [createMovie()], version: 2 }));
    expect(repository.loadAll()).toEqual([]);
  });

  it('filters invalid entries and removes duplicate movie IDs', () => {
    const movie = createMovie();
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        items: [movie, { ...movie, title: 'Wicked atualizado' }, { id: 'invalid' }],
        version: 1,
      }),
    );

    const favorites = new LocalStorageFavoriteMovieRepository(localStorage, STORAGE_KEY).loadAll();

    expect(favorites).toHaveLength(1);
    expect(favorites[0]?.title).toBe('Wicked atualizado');
  });
});
