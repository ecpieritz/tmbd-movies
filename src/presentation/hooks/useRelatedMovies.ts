import { useCallback, useEffect, useMemo, useState } from 'react';

import type { Movie } from '@/domain/movies/entities/Movie';
import { useMovieCatalog } from '@/presentation/hooks/useMovieCatalog';

export type RelatedMoviesState =
  | Readonly<{ status: 'error' }>
  | Readonly<{ status: 'loading' }>
  | Readonly<{ movies: readonly Movie[]; status: 'success' }>;

interface RelatedMoviesRequestState {
  readonly requestKey: string;
  readonly state: RelatedMoviesState;
}

export function useRelatedMovies(movieId: number, genreIds: readonly number[]) {
  const { getRelatedMovies } = useMovieCatalog();
  const normalizedGenreIds = useMemo(
    () => [...new Set(genreIds)].sort((firstId, secondId) => firstId - secondId),
    [genreIds],
  );
  const requestKey = `${movieId}:${normalizedGenreIds.join('|')}`;
  const [requestVersion, setRequestVersion] = useState(0);
  const [requestState, setRequestState] = useState<RelatedMoviesRequestState>(() => ({
    requestKey,
    state:
      normalizedGenreIds.length === 0 ? { movies: [], status: 'success' } : { status: 'loading' },
  }));

  useEffect(() => {
    if (normalizedGenreIds.length === 0) {
      return;
    }

    let isCurrentRequest = true;

    void getRelatedMovies
      .execute({ excludedMovieId: movieId, genreIds: normalizedGenreIds })
      .then((movies) => {
        if (isCurrentRequest) {
          setRequestState({ requestKey, state: { movies, status: 'success' } });
        }
      })
      .catch(() => {
        if (isCurrentRequest) {
          setRequestState({ requestKey, state: { status: 'error' } });
        }
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [getRelatedMovies, movieId, normalizedGenreIds, requestKey, requestVersion]);

  const retry = useCallback(() => {
    if (normalizedGenreIds.length === 0) {
      return;
    }

    setRequestState({ requestKey, state: { status: 'loading' } });
    setRequestVersion((currentVersion) => currentVersion + 1);
  }, [normalizedGenreIds.length, requestKey]);

  const state: RelatedMoviesState =
    normalizedGenreIds.length === 0
      ? { movies: [], status: 'success' }
      : requestState.requestKey === requestKey
        ? requestState.state
        : { status: 'loading' };

  return { retry, state } as const;
}
