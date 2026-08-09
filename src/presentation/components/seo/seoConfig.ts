export const SITE_NAME = 'TMDB Movies';
export const SITE_URL = 'https://tmbd-movies-gold.vercel.app';
export const DEFAULT_SOCIAL_IMAGE_URL = `${SITE_URL}/og-image.png`;

export type StructuredData = Readonly<Record<string, unknown>>;

export function createTmdbImageUrl(path: string | null): string | undefined {
  const normalizedPath = path?.trim().replace(/^\/+/, '');

  return normalizedPath ? `https://image.tmdb.org/t/p/original/${normalizedPath}` : undefined;
}
