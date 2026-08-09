import { jest } from '@jest/globals';

import { FavoriteMoviesService } from '@/application/favorites/FavoriteMoviesService';
import type { FavoriteMovieRepository } from '@/domain/movies/repositories/FavoriteMovieRepository';
import { createMovie } from '@/test/fixtures/movies';

function createRepositoryMock() {
  return {
    loadAll: jest.fn<FavoriteMovieRepository['loadAll']>(),
    saveAll: jest.fn<FavoriteMovieRepository['saveAll']>(),
  } satisfies jest.Mocked<FavoriteMovieRepository>;
}

describe('FavoriteMoviesService', () => {
  it('loads favorites from the repository', () => {
    const repository = createRepositoryMock();
    const movies = [createMovie()];
    repository.loadAll.mockReturnValue(movies);
    const service = new FavoriteMoviesService(repository);

    expect(service.load()).toBe(movies);
    expect(repository.loadAll).toHaveBeenCalledTimes(1);
  });

  it('adds a movie once and persists the new immutable list', () => {
    const repository = createRepositoryMock();
    const service = new FavoriteMoviesService(repository);
    const movie = createMovie();

    const favorites = service.toggle([], movie);

    expect(favorites).toEqual([movie]);
    expect(Object.isFrozen(favorites)).toBe(true);
    expect(repository.saveAll).toHaveBeenCalledWith(favorites);
  });

  it('removes an existing favorite when toggled again', () => {
    const repository = createRepositoryMock();
    const service = new FavoriteMoviesService(repository);
    const wicked = createMovie();
    const wonka = createMovie({ id: 202, title: 'Wonka' });

    const favorites = service.toggle([wicked, wonka], wicked);

    expect(favorites).toEqual([wonka]);
    expect(repository.saveAll).toHaveBeenCalledWith(favorites);
  });

  it('removes a favorite by ID without mutating the current list', () => {
    const repository = createRepositoryMock();
    const service = new FavoriteMoviesService(repository);
    const currentFavorites = [createMovie(), createMovie({ id: 202, title: 'Wonka' })];

    const favorites = service.remove(currentFavorites, 202);

    expect(favorites.map((movie) => movie.id)).toEqual([101]);
    expect(currentFavorites).toHaveLength(2);
    expect(repository.saveAll).toHaveBeenCalledWith(favorites);
  });
});
