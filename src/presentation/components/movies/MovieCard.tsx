import type { ReactNode } from 'react';
import { Link } from 'react-router';

import type { Movie } from '@/domain/movies/entities/Movie';
import { MovieImage } from '@/presentation/components/movies/MovieImage';
import { MovieRatingBadge } from '@/presentation/components/movies/MovieRatingBadge';

export type MovieCardAction =
  | Readonly<{
      isFavorite: boolean;
      onClick: (movie: Movie) => void;
      type: 'favorite';
    }>
  | Readonly<{
      onClick: (movie: Movie) => void;
      type: 'remove';
    }>;

interface MovieCardProps {
  readonly action?: MovieCardAction;
  readonly movie: Movie;
  readonly titleContent?: ReactNode;
}

function HeartIcon({ filled }: { readonly filled: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
      <path
        d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.7-7.5 1.1-1.1a5.5 5.5 0 0 0 0-7.8Z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none">
      <path d="M4 7h16M9 7V4h6v3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <path
        d="m6 7 1 13h10l1-13M10 11v5M14 11v5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function MovieActionButton({
  action,
  movie,
}: {
  readonly action: MovieCardAction;
  readonly movie: Movie;
}) {
  const isFavoriteAction = action.type === 'favorite';
  const label = isFavoriteAction
    ? action.isFavorite
      ? `Remover ${movie.title} dos favoritos`
      : `Adicionar ${movie.title} aos favoritos`
    : `Remover ${movie.title} dos favoritos`;

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={isFavoriteAction ? action.isFavorite : undefined}
      title={label}
      onClick={() => action.onClick(movie)}
      className="absolute top-2 right-2 z-10 flex size-10 items-center justify-center rounded-full bg-page/90 text-danger shadow-md transition hover:scale-105 hover:bg-page focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-card focus-visible:outline-none"
    >
      {isFavoriteAction ? <HeartIcon filled={action.isFavorite} /> : <TrashIcon />}
    </button>
  );
}

export function MovieCard({ action, movie, titleContent }: MovieCardProps) {
  const detailsPath = `/movie/${movie.id}`;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-card bg-card shadow-card transition duration-200 hover:-translate-y-0.5 hover:shadow-xl">
      <div className="relative overflow-hidden">
        <Link
          to={detailsPath}
          aria-label={`Ver detalhes de ${movie.title}`}
          className="block focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none focus-visible:ring-inset"
        >
          <MovieImage
            path={movie.posterPath}
            alt={`Poster de ${movie.title}`}
            className="aspect-[2/3] w-full"
            imageClassName="transition duration-300 group-hover:scale-105"
          />
        </Link>

        {action ? <MovieActionButton action={action} movie={movie} /> : null}
      </div>

      <div className="flex flex-1 flex-col items-start gap-3 p-3">
        <Link
          to={detailsPath}
          title={movie.title}
          className="rounded-sm text-sm font-semibold text-content transition-colors hover:text-accent focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
        >
          <span className="line-clamp-2">{titleContent ?? movie.title}</span>
        </Link>

        <div className="mt-auto">
          <MovieRatingBadge rating={movie.voteAverage} />
        </div>
      </div>
    </article>
  );
}
