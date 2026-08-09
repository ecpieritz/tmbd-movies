import { jest } from '@jest/globals';
import { act, screen } from '@testing-library/react';

import {
  createTmdbMovieDetailsDto,
  createTmdbMovieDto,
  createTmdbMoviePage,
} from '@/test/fixtures/movies';
import {
  fetchMock,
  mockApiError,
  mockApiResponse,
  mockPendingApiResponse,
} from '@/test/mocks/fetchMock';
import { renderApplication } from '@/test/renderApplication';

describe('movie application flows', () => {
  it('renders loading feedback and then popular movies from the API', async () => {
    jest.spyOn(console, 'log').mockImplementation(() => undefined);
    const pendingResponse = mockPendingApiResponse();

    renderApplication('/');

    expect(await screen.findByText('Carregando filmes...')).toBeInTheDocument();

    act(() => {
      pendingResponse.resolve(createTmdbMoviePage());
    });

    expect(await screen.findByRole('link', { name: 'Wicked' })).toBeInTheDocument();
    expect(screen.getByText('1 filmes encontrados')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/tmdb/movie/popular?language=pt-BR&page=1',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('shows an API error and recovers when the user retries', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    jest.spyOn(console, 'log').mockImplementation(() => undefined);
    mockApiError(503);
    const { user } = renderApplication('/');

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível carregar os filmes',
    );

    mockApiResponse(createTmdbMoviePage());
    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }));

    expect(await screen.findByRole('link', { name: 'Wicked' })).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('searches, highlights the query and keeps pagination in the URL', async () => {
    mockApiResponse(
      createTmdbMoviePage([createTmdbMovieDto({ id: 301, title: 'Matrix Reloaded' })], {
        total_pages: 2,
        total_results: 2,
      }),
    );
    const { router, user } = renderApplication('/search?q=Matrix');

    expect(await screen.findByRole('link', { name: 'Matrix Reloaded' })).toBeInTheDocument();
    expect(screen.getByText('Matrix').tagName).toBe('MARK');
    expect(screen.getByRole('searchbox')).toHaveValue('Matrix');

    mockApiResponse(
      createTmdbMoviePage([createTmdbMovieDto({ id: 302, title: 'Matrix Revolutions' })], {
        page: 2,
        total_pages: 2,
        total_results: 2,
      }),
    );
    await user.click(screen.getByRole('button', { name: 'Próxima página' }));

    expect(await screen.findByRole('link', { name: 'Matrix Revolutions' })).toBeInTheDocument();
    expect(router.state.location.search).toBe('?q=Matrix&page=2');
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('page=2'),
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('shows details and related movies, then completes the favorites flow', async () => {
    mockApiResponse(createTmdbMovieDetailsDto());
    mockApiResponse(
      createTmdbMoviePage([
        createTmdbMovieDto(),
        createTmdbMovieDto({ id: 202, title: 'A Noviça Rebelde' }),
      ]),
    );
    const { user } = renderApplication('/movie/101');

    expect(await screen.findByRole('heading', { level: 1, name: 'Wicked' })).toBeInTheDocument();
    expect(screen.getByText('Música')).toBeInTheDocument();
    expect(
      screen.getByText('A amizade entre Elphaba e Glinda transforma o mundo de Oz.'),
    ).toBeInTheDocument();
    expect(await screen.findByRole('link', { name: 'A Noviça Rebelde' })).toBeInTheDocument();

    const favoriteButton = screen.getByRole('button', { name: 'Adicionar aos favoritos' });
    await user.click(favoriteButton);
    expect(favoriteButton).toHaveAttribute('aria-pressed', 'true');

    await user.click(screen.getByRole('link', { name: 'Favoritos' }));
    expect(
      await screen.findByRole('heading', { name: 'Meus filmes favoritos' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Wicked' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Remover Wicked dos favoritos' }));
    expect(
      await screen.findByRole('heading', { name: 'Nenhum filme favorito ainda' }),
    ).toBeInTheDocument();

    jest.spyOn(console, 'log').mockImplementation(() => undefined);
    mockApiResponse(createTmdbMoviePage());
    await user.click(screen.getByRole('link', { name: 'Explorar filmes' }));
    expect(await screen.findByRole('heading', { name: 'Filmes populares' })).toBeInTheDocument();
  });
});
