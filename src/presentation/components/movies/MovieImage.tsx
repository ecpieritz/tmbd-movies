import { useState } from 'react';

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export type MovieImageSize = 'w300' | 'original';

interface MovieImageProps {
  readonly alt: string;
  readonly className?: string;
  readonly imageClassName?: string;
  readonly loading?: 'eager' | 'lazy';
  readonly path: string | null;
  readonly size?: MovieImageSize;
}

function createMovieImageUrl(path: string | null, size: MovieImageSize): string | null {
  const normalizedPath = path?.trim().replace(/^\/+/, '');

  if (!normalizedPath) {
    return null;
  }

  return `${TMDB_IMAGE_BASE_URL}/${size}/${normalizedPath}`;
}

function ImageFallback({ label }: { readonly label: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      className="flex h-full w-full flex-col items-center justify-center gap-2 bg-placeholder px-4 text-center text-content-muted"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-10" fill="none">
        <path
          d="M4 9h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="m5 4 14-2 1 5-14 2-1-5Z"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </svg>
      <span className="text-xs font-medium">Imagem indisponível</span>
    </div>
  );
}

export function MovieImage({
  alt,
  className = '',
  imageClassName = '',
  loading = 'lazy',
  path,
  size = 'w300',
}: MovieImageProps) {
  const source = createMovieImageUrl(path, size);
  const [failedSource, setFailedSource] = useState<string | null>(null);

  return (
    <div className={`overflow-hidden bg-placeholder ${className}`}>
      {source && failedSource !== source ? (
        <img
          src={source}
          alt={alt}
          loading={loading}
          decoding="async"
          onError={() => setFailedSource(source)}
          className={`h-full w-full object-cover ${imageClassName}`}
        />
      ) : (
        <ImageFallback label={`${alt} indisponível`} />
      )}
    </div>
  );
}
