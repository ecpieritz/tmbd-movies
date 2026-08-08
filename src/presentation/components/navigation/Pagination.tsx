interface PaginationProps {
  readonly currentPage: number;
  readonly disabled?: boolean;
  readonly onPageChange: (page: number) => void;
  readonly totalPages: number;
}

const paginationButtonClassName =
  'rounded-control border border-divider bg-card px-4 py-2 text-sm font-semibold text-content transition-colors hover:border-brand hover:bg-panel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-divider disabled:hover:bg-card';

export function Pagination({
  currentPage,
  disabled = false,
  onPageChange,
  totalPages,
}: PaginationProps) {
  const isPreviousDisabled = disabled || currentPage <= 1;
  const isNextDisabled = disabled || currentPage >= totalPages;

  return (
    <nav aria-label="Paginação dos filmes" className="flex items-center justify-center gap-4">
      <button
        type="button"
        disabled={isPreviousDisabled}
        onClick={() => onPageChange(currentPage - 1)}
        className={paginationButtonClassName}
      >
        Anterior
      </button>

      <p aria-live="polite" className="min-w-24 text-center text-sm text-content-muted">
        Página <strong className="text-content">{currentPage}</strong> de {totalPages}
      </p>

      <button
        type="button"
        disabled={isNextDisabled}
        onClick={() => onPageChange(currentPage + 1)}
        className={paginationButtonClassName}
      >
        Próxima
      </button>
    </nav>
  );
}
