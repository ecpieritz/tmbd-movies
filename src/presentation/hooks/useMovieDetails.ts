import { useCallback, useEffect, useMemo, useState } from 'react';

import type { MovieDetails } from '@/domain/movies/entities/MovieDetails';
import { useMovieCatalog } from '@/presentation/hooks/useMovieCatalog';

export type MovieDetailsState =
  | Readonly<{ status: 'error' }>
  | Readonly<{ status: 'invalid' }>
  | Readonly<{ status: 'loading' }>
  | Readonly<{ movie: MovieDetails; status: 'success' }>;

interface MovieDetailsRequestState {
  readonly movieId: number | null;
  readonly state: MovieDetailsState;
}

function parseMovieId(value: string | undefined): number | null {
  if (!value || !/^[1-9]\d*$/.test(value)) {
    return null;
  }

  const movieId = Number(value);

  return Number.isSafeInteger(movieId) ? movieId : null;
}

export function useMovieDetails(routeMovieId: string | undefined) {
  const { getMovieDetails } = useMovieCatalog();
  const movieId = useMemo(() => parseMovieId(routeMovieId), [routeMovieId]);
  const [requestVersion, setRequestVersion] = useState(0);
  const [requestState, setRequestState] = useState<MovieDetailsRequestState>(() => ({
    movieId,
    state: movieId === null ? { status: 'invalid' } : { status: 'loading' },
  }));

  useEffect(() => {
    if (movieId === null) {
      return;
    }

    let isCurrentRequest = true;

    void getMovieDetails
      .execute(movieId)
      .then((movie) => {
        if (isCurrentRequest) {
          setRequestState({ movieId, state: { movie, status: 'success' } });
        }
      })
      .catch(() => {
        if (isCurrentRequest) {
          setRequestState({ movieId, state: { status: 'error' } });
        }
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [getMovieDetails, movieId, requestVersion]);

  const retry = useCallback(() => {
    if (movieId === null) {
      return;
    }

    setRequestState({ movieId, state: { status: 'loading' } });
    setRequestVersion((currentVersion) => currentVersion + 1);
  }, [movieId]);

  const state: MovieDetailsState =
    movieId === null
      ? { status: 'invalid' }
      : requestState.movieId === movieId
        ? requestState.state
        : { status: 'loading' };

  return { retry, state } as const;
}
