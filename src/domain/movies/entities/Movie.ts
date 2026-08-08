export interface Movie {
  readonly id: number;
  readonly title: string;
  readonly overview: string;
  readonly posterPath: string | null;
  readonly backdropPath: string | null;
  readonly releaseDate: string | null;
  readonly voteAverage: number;
  readonly genreIds: readonly number[];
}
