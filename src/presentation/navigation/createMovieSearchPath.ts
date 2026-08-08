import { createSearchParams } from 'react-router';

export function createMovieSearchPath(value: string): string | null {
  const query = value.trim();

  if (!query) {
    return null;
  }

  return `/search?${createSearchParams({ q: query }).toString()}`;
}
