import { useCallback } from 'react';

import { RequestErrorState } from '@/presentation/components/feedback/RequestErrorState';
import type { MovieCardAction } from '@/presentation/components/movies/MovieCard';
import { MovieGrid } from '@/presentation/components/movies/MovieGrid';
import { MovieGridSkeleton } from '@/presentation/components/movies/MovieGridSkeleton';
import { Pagination } from '@/presentation/components/navigation/Pagination';
import { Seo } from '@/presentation/components/seo/Seo';
import { SITE_NAME, SITE_URL } from '@/presentation/components/seo/seoConfig';
import type { Movie } from '@/domain/movies/entities/Movie';
import { useFavorites } from '@/presentation/hooks/useFavorites';
import { usePopularMovies } from '@/presentation/hooks/usePopularMovies';

const movieCountFormatter = new Intl.NumberFormat('pt-BR');
const homeDescription =
  'Explore filmes populares, consulte notas e detalhes e monte sua lista de favoritos no TMDB Movies.';
const homeStructuredData = Object.freeze({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  inLanguage: 'pt-BR',
  name: SITE_NAME,
  url: SITE_URL,
});

export function HomePage() {
  const { changePage, retry, state } = usePopularMovies();
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
      <Seo
        title="Filmes populares"
        description={homeDescription}
        canonicalPath="/"
        structuredData={homeStructuredData}
      />
      <section aria-labelledby="popular-movies-title" className="py-6 sm:py-8">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold tracking-wider text-brand uppercase">Explorar</p>
            <h1
              id="popular-movies-title"
              className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl"
            >
              Filmes populares
            </h1>
          </div>

          {state.status === 'success' && state.totalResults > 0 ? (
            <p className="text-sm text-content-muted">
              {movieCountFormatter.format(state.totalResults)} filmes encontrados
            </p>
          ) : null}
        </header>

        {state.status === 'loading' ? <MovieGridSkeleton /> : null}

        {state.status === 'error' ? (
          <RequestErrorState
            title="Não foi possível carregar os filmes"
            description="Confira sua conexão e tente novamente em alguns instantes."
            onRetry={retry}
          />
        ) : null}

        {state.status === 'success' && state.movies.length === 0 ? (
          <div className="rounded-card border border-divider bg-panel px-6 py-12 text-center">
            <h2 className="text-lg font-semibold">Nenhum filme disponível</h2>
            <p className="mt-2 text-sm text-content-muted">
              Não encontramos filmes populares para exibir agora.
            </p>
          </div>
        ) : null}

        {state.status === 'success' && state.movies.length > 0 ? (
          <>
            <MovieGrid
              movies={state.movies}
              ariaLabel="Filmes populares"
              getAction={getFavoriteAction}
            />

            {state.totalPages > 1 ? (
              <div className="mt-8 border-t border-divider pt-6">
                <Pagination
                  currentPage={state.page}
                  totalPages={state.totalPages}
                  onPageChange={changePage}
                />
              </div>
            ) : null}
          </>
        ) : null}
      </section>
    </>
  );
}
