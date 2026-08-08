export interface PaginatedResult<T> {
  readonly items: readonly T[];
  readonly page: number;
  readonly totalPages: number;
  readonly totalResults: number;
}
