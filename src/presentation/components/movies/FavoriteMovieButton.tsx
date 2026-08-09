import type { Movie } from '@/domain/movies/entities/Movie';

interface FavoriteMovieButtonProps {
  readonly isFavorite: boolean;
  readonly movie: Movie;
  readonly onToggle: (movie: Movie) => void;
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

export function FavoriteMovieButton({ isFavorite, movie, onToggle }: FavoriteMovieButtonProps) {
  const label = isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos';

  return (
    <button
      type="button"
      aria-pressed={isFavorite}
      onClick={() => onToggle(movie)}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-control px-5 py-3 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-2 focus-visible:ring-offset-page focus-visible:outline-none ${
        isFavorite
          ? 'border border-danger bg-danger/10 text-danger hover:bg-danger/20'
          : 'bg-danger text-white hover:bg-danger/90'
      }`}
    >
      <HeartIcon filled={isFavorite} />
      {label}
    </button>
  );
}
