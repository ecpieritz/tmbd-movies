import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router';

import type { MovieDetails } from '@/domain/movies/entities/MovieDetails';
import { RequestErrorState } from '@/presentation/components/feedback/RequestErrorState';
import { FavoriteMovieButton } from '@/presentation/components/movies/FavoriteMovieButton';
import { MovieImage } from '@/presentation/components/movies/MovieImage';
import { MovieRatingBadge } from '@/presentation/components/movies/MovieRatingBadge';
import { RelatedMoviesSection } from '@/presentation/components/movies/RelatedMoviesSection';
import { BackButton } from '@/presentation/components/navigation/BackButton';
import { useFavorites } from '@/presentation/hooks/useFavorites';
import { useMovieDetails } from '@/presentation/hooks/useMovieDetails';

const releaseDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
  year: 'numeric',
});

function formatReleaseDate(releaseDate: string | null): string {
  if (!releaseDate || !/^\d{4}-\d{2}-\d{2}$/.test(releaseDate)) {
    return 'Não informada';
  }

  const date = new Date(`${releaseDate}T00:00:00Z`);

  return Number.isNaN(date.getTime()) ? 'Não informada' : releaseDateFormatter.format(date);
}

function MovieDetailsSkeleton() {
  return (
    <div role="status" aria-live="polite" aria-busy="true" className="py-6 sm:py-8">
      <span className="sr-only">Carregando detalhes do filme...</span>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,1fr)]">
        <div className="aspect-video rounded-card bg-placeholder motion-safe:animate-pulse" />
        <div className="space-y-5 py-2 motion-safe:animate-pulse">
          <div className="h-10 w-4/5 rounded bg-placeholder" />
          <div className="flex gap-2">
            <div className="h-7 w-20 rounded-full bg-placeholder" />
            <div className="h-7 w-24 rounded-full bg-placeholder" />
          </div>
          <div className="h-5 w-3/5 rounded bg-placeholder" />
          <div className="space-y-3 pt-4">
            <div className="h-5 w-24 rounded bg-placeholder" />
            <div className="h-4 w-full rounded bg-placeholder" />
            <div className="h-4 w-11/12 rounded bg-placeholder" />
            <div className="h-4 w-3/4 rounded bg-placeholder" />
          </div>
        </div>
      </div>
    </div>
  );
}

function InvalidMovieState() {
  return (
    <section className="mx-auto flex min-h-[55vh] max-w-lg flex-col items-center justify-center text-center">
      <p className="text-sm font-semibold tracking-wider text-danger uppercase">Filme inválido</p>
      <h1 className="mt-2 text-2xl font-bold">Não foi possível identificar este filme</h1>
      <p className="mt-3 text-content-muted">
        Confira o endereço ou volte para explorar o catálogo.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-control bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-strong focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-page focus-visible:outline-none"
      >
        Explorar filmes
      </Link>
    </section>
  );
}

function MovieDetailsContent({ movie }: { readonly movie: MovieDetails }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const movieIsFavorite = isFavorite(movie.id);
  const imagePath = movie.backdropPath ?? movie.posterPath;

  return (
    <article className="grid gap-8 py-6 sm:py-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,1fr)] lg:gap-10">
      <MovieImage
        path={imagePath}
        size="original"
        loading="eager"
        alt={`Imagem de ${movie.title}`}
        className="aspect-video w-full rounded-card shadow-card lg:sticky lg:top-28"
      />

      <div className="self-center py-1">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{movie.title}</h1>

        {movie.genres.length > 0 ? (
          <ul aria-label="Gêneros" className="mt-4 flex flex-wrap gap-2">
            {movie.genres.map((genre) => (
              <li
                key={genre.id}
                className="rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white"
              >
                {genre.name}
              </li>
            ))}
          </ul>
        ) : null}

        <dl className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
          <div className="flex items-center gap-2">
            <dt className="font-semibold text-content-muted">Lançamento:</dt>
            <dd>{formatReleaseDate(movie.releaseDate)}</dd>
          </div>
          <div className="flex items-center gap-2">
            <dt className="font-semibold text-content-muted">Nota TMDB:</dt>
            <dd>
              <MovieRatingBadge rating={movie.voteAverage} />
            </dd>
          </div>
        </dl>

        <section aria-labelledby="synopsis-title" className="mt-8">
          <h2 id="synopsis-title" className="text-lg font-semibold">
            Sinopse
          </h2>
          <p className="mt-2 leading-7 text-content-muted">
            {movie.overview.trim() || 'Sinopse não disponível.'}
          </p>
        </section>

        <div className="mt-7">
          <FavoriteMovieButton
            movie={movie}
            isFavorite={movieIsFavorite}
            onToggle={toggleFavorite}
          />
        </div>
      </div>
    </article>
  );
}

export function MovieDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { retry, state } = useMovieDetails(id);
  let pageContent: ReactNode;

  if (state.status === 'invalid') {
    pageContent = <InvalidMovieState />;
  } else if (state.status === 'loading') {
    pageContent = <MovieDetailsSkeleton />;
  } else if (state.status === 'error') {
    pageContent = (
      <div className="py-10 sm:py-16">
        <RequestErrorState
          title="Não foi possível carregar o filme"
          description="Confira sua conexão ou tente novamente em alguns instantes."
          onRetry={retry}
        />
      </div>
    );
  } else {
    pageContent = (
      <>
        <MovieDetailsContent movie={state.movie} />
        <RelatedMoviesSection movie={state.movie} />
      </>
    );
  }

  return (
    <>
      <div className="pt-4 sm:pt-5">
        <BackButton />
      </div>
      {pageContent}
    </>
  );
}
