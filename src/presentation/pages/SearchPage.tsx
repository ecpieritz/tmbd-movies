import { useCallback } from 'react';
import { useSearchParams } from 'react-router';

import type { Movie } from '@/domain/movies/entities/Movie';
import { RequestErrorState } from '@/presentation/components/feedback/RequestErrorState';
import { HighlightedMovieTitle } from '@/presentation/components/movies/HighlightedMovieTitle';
import type { MovieCardAction } from '@/presentation/components/movies/MovieCard';
import { MovieGrid } from '@/presentation/components/movies/MovieGrid';
import { MovieGridSkeleton } from '@/presentation/components/movies/MovieGridSkeleton';
import { Pagination } from '@/presentation/components/navigation/Pagination';
import { useFavorites } from '@/presentation/hooks/useFavorites';
import { useSearchMovies } from '@/presentation/hooks/useSearchMovies';

const movieCountFormatter = new Intl.NumberFormat('pt-BR');

function parsePage(value: string | null): number {
  if (!value || !/^\d+$/.test(value)) {
    return 1;
  }

  const page = Number(value);

  return Number.isSafeInteger(page) && page > 0 ? page : 1;
}

interface SearchResultsProps {
  readonly page: number;
  readonly query: string;
  readonly onPageChange: (page: number) => void;
}

function SearchResults({ onPageChange, page, query }: SearchResultsProps) {
  const { retry, state } = useSearchMovies(query, page);
  const { isFavorite, toggleFavorite } = useFavorites();
  const getFavoriteAction = useCallback(
    (movie: Movie): MovieCardAction => ({
      isFavorite: isFavorite(movie.id),
      onClick: toggleFavorite,
      type: 'favorite',
    }),
    [isFavorite, toggleFavorite],
  );

  return (
    <>
      <header className="mb-6 border-b border-divider pb-5">
        <h1 id="search-results-title" className="text-2xl font-bold tracking-tight sm:text-3xl">
          Resultados para: <span className="text-accent">“{query}”</span>
        </h1>

        {state.status === 'success' ? (
          <p className="mt-1 text-sm text-content-muted" aria-live="polite">
            {movieCountFormatter.format(state.totalResults)} filmes encontrados
          </p>
        ) : null}
      </header>

      {state.status === 'loading' ? <MovieGridSkeleton /> : null}

      {state.status === 'error' ? (
        <RequestErrorState
          title="Não foi possível realizar a busca"
          description="Confira sua conexão e tente novamente em alguns instantes."
          onRetry={retry}
        />
      ) : null}

      {state.status === 'success' && state.movies.length === 0 ? (
        <div className="rounded-card border border-divider bg-panel px-6 py-12 text-center">
          <h2 className="text-lg font-semibold">Nenhum filme encontrado</h2>
          <p className="mt-2 text-sm text-content-muted">
            Tente buscar outro título ou verifique a escrita do termo informado.
          </p>
        </div>
      ) : null}

      {state.status === 'success' && state.movies.length > 0 ? (
        <>
          <MovieGrid
            movies={state.movies}
            ariaLabel={`Resultados da busca por ${query}`}
            getAction={getFavoriteAction}
            renderTitle={(movie) => <HighlightedMovieTitle title={movie.title} query={query} />}
          />

          {state.totalPages > 1 ? (
            <div className="mt-8 border-t border-divider pt-6">
              <Pagination
                currentPage={state.page}
                totalPages={state.totalPages}
                onPageChange={onPageChange}
              />
            </div>
          ) : null}
        </>
      ) : null}
    </>
  );
}

export function SearchPage() {
  const [searchParameters, setSearchParameters] = useSearchParams();
  const query = searchParameters.get('q')?.trim() ?? '';
  const page = parsePage(searchParameters.get('page'));

  const changePage = useCallback(
    (nextPage: number) => {
      const nextParameters = new URLSearchParams({ q: query });

      if (nextPage > 1) {
        nextParameters.set('page', String(nextPage));
      }

      setSearchParameters(nextParameters);
      globalThis.scrollTo({ top: 0 });
    },
    [query, setSearchParameters],
  );

  return (
    <section aria-labelledby="search-results-title" className="py-6 sm:py-8">
      {query ? (
        <SearchResults key={query} query={query} page={page} onPageChange={changePage} />
      ) : (
        <div className="rounded-card border border-divider bg-panel px-6 py-12 text-center">
          <h1 id="search-results-title" className="text-xl font-semibold">
            Busque um filme
          </h1>
          <p className="mt-2 text-sm text-content-muted">
            Digite um título na barra de busca para encontrar filmes.
          </p>
        </div>
      )}
    </section>
  );
}
