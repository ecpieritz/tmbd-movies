import type { Genre } from '@/domain/movies/entities/Genre';
import type { Movie } from '@/domain/movies/entities/Movie';

export interface MovieDetails extends Movie {
  readonly genres: readonly Genre[];
}
