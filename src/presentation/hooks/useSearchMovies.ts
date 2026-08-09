import { useCallback, useEffect, useState } from 'react';

import type { Movie } from '@/domain/movies/entities/Movie';
import { useMovieCatalog } from '@/presentation/hooks/useMovieCatalog';

export type SearchMoviesState =
  | Readonly<{ status: 'error' }>
  | Readonly<{ status: 'loading' }>
  | Readonly<{
      movies: readonly Movie[];
      page: number;
      status: 'success';
      totalPages: number;
      totalResults: number;
    }>;

interface SearchMoviesRequestState {
  readonly requestKey: string;
  readonly state: SearchMoviesState;
}

export function useSearchMovies(query: string, page: number) {
  const { searchMovies } = useMovieCatalog();
  const requestKey = `${query}:${page}`;
  const [requestVersion, setRequestVersion] = useState(0);
  const [requestState, setRequestState] = useState<SearchMoviesRequestState>({
    requestKey,
    state: { status: 'loading' },
  });

  useEffect(() => {
    let isCurrentRequest = true;

    void searchMovies
      .execute({ page, query })
      .then((result) => {
        if (!isCurrentRequest) {
          return;
        }

        setRequestState({
          requestKey,
          state: {
            movies: result.items,
            page: result.page,
            status: 'success',
            totalPages: Math.max(1, result.totalPages),
            totalResults: Math.max(0, result.totalResults),
          },
        });
      })
      .catch(() => {
        if (isCurrentRequest) {
          setRequestState({ requestKey, state: { status: 'error' } });
        }
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [page, query, requestKey, requestVersion, searchMovies]);

  const retry = useCallback(() => {
    setRequestState({ requestKey, state: { status: 'loading' } });
    setRequestVersion((currentVersion) => currentVersion + 1);
  }, [requestKey]);

  const state: SearchMoviesState =
    requestState.requestKey === requestKey ? requestState.state : { status: 'loading' };

  return { retry, state } as const;
}
