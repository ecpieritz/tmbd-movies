import { useCallback, useEffect, useState } from 'react';

import type { Movie } from '@/domain/movies/entities/Movie';
import { useMovieCatalog } from '@/presentation/hooks/useMovieCatalog';

export type PopularMoviesRequestStatus = 'error' | 'loading' | 'success';

export interface PopularMoviesState {
  readonly movies: readonly Movie[];
  readonly page: number;
  readonly status: PopularMoviesRequestStatus;
  readonly totalPages: number;
  readonly totalResults: number;
}

const INITIAL_STATE: PopularMoviesState = {
  movies: [],
  page: 1,
  status: 'loading',
  totalPages: 1,
  totalResults: 0,
};

export function usePopularMovies() {
  const { getPopularMovies } = useMovieCatalog();
  const [state, setState] = useState<PopularMoviesState>(INITIAL_STATE);
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    let isCurrentRequest = true;

    void getPopularMovies
      .execute({ page: state.page })
      .then((result) => {
        if (!isCurrentRequest) {
          return;
        }

        console.log('[Popular movies] API response:', {
          movies: result.items,
          page: result.page,
          totalPages: result.totalPages,
          totalResults: result.totalResults,
        });

        setState((currentState) => ({
          ...currentState,
          movies: result.items,
          status: 'success',
          totalPages: Math.max(1, result.totalPages),
          totalResults: Math.max(0, result.totalResults),
        }));
      })
      .catch((error: unknown) => {
        if (!isCurrentRequest) {
          return;
        }

        console.error('[Popular movies] API request failed:', error);

        setState((currentState) => ({
          ...currentState,
          movies: [],
          status: 'error',
        }));
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [getPopularMovies, requestVersion, state.page]);

  const changePage = useCallback((page: number) => {
    setState((currentState) => {
      const isValidPage = Number.isInteger(page) && page >= 1 && page <= currentState.totalPages;

      if (!isValidPage || page === currentState.page || currentState.status === 'loading') {
        return currentState;
      }

      return {
        ...currentState,
        movies: [],
        page,
        status: 'loading',
      };
    });
  }, []);

  const retry = useCallback(() => {
    setState((currentState) => ({
      ...currentState,
      status: 'loading',
    }));
    setRequestVersion((currentVersion) => currentVersion + 1);
  }, []);

  return { changePage, retry, state } as const;
}
