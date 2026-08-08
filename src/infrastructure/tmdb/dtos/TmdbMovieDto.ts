export interface TmdbGenreDto {
  readonly id: number;
  readonly name: string;
}

export interface TmdbMovieDto {
  readonly id: number;
  readonly title: string;
  readonly overview: string;
  readonly poster_path: string | null;
  readonly backdrop_path: string | null;
  readonly release_date: string;
  readonly vote_average: number;
  readonly genre_ids: readonly number[];
}

export interface TmdbMovieDetailsDto {
  readonly id: number;
  readonly title: string;
  readonly overview: string;
  readonly poster_path: string | null;
  readonly backdrop_path: string | null;
  readonly release_date: string;
  readonly vote_average: number;
  readonly genres: readonly TmdbGenreDto[];
}

export interface TmdbPaginatedResponseDto<T> {
  readonly page: number;
  readonly results: readonly T[];
  readonly total_pages: number;
  readonly total_results: number;
}

export type TmdbMoviePageDto = TmdbPaginatedResponseDto<TmdbMovieDto>;
