import { useId, useState, type FormEvent } from 'react';

interface PaginationProps {
  readonly currentPage: number;
  readonly disabled?: boolean;
  readonly onPageChange: (page: number) => void;
  readonly totalPages: number;
}

const controlClassName =
  'flex size-11 items-center justify-center rounded-control border border-divider bg-card text-sm font-semibold text-content transition-colors hover:border-brand hover:bg-panel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-page disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-divider disabled:hover:bg-card';

function getBoundaryPages(totalPages: number, position: 'end' | 'start'): readonly number[] {
  if (totalPages <= 1) {
    return [1];
  }

  return position === 'start' ? [1, 2] : [totalPages - 1, totalPages];
}

export function Pagination({
  currentPage,
  disabled = false,
  onPageChange,
  totalPages,
}: PaginationProps) {
  const pageInputId = useId();
  const [pageInput, setPageInput] = useState('');
  const isPreviousDisabled = disabled || currentPage <= 1;
  const isNextDisabled = disabled || currentPage >= totalPages;
  const showAllPages = totalPages <= 7;
  const firstPages = getBoundaryPages(totalPages, 'start');
  const lastPages = getBoundaryPages(totalPages, 'end');
  const currentPageIsInMiddle = currentPage > 2 && currentPage < totalPages - 1;

  function goToTypedPage() {
    if (!pageInput) {
      return;
    }

    const requestedPage = Number(pageInput);

    if (
      Number.isInteger(requestedPage) &&
      requestedPage >= 1 &&
      requestedPage <= totalPages &&
      requestedPage !== currentPage
    ) {
      setPageInput('');
      onPageChange(requestedPage);
    } else {
      setPageInput('');
    }
  }

  function handlePageSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    goToTypedPage();
  }

  function renderPageButton(page: number) {
    const isCurrentPage = page === currentPage;

    return (
      <button
        key={page}
        type="button"
        aria-label={`Página ${page}`}
        aria-current={isCurrentPage ? 'page' : undefined}
        disabled={disabled || isCurrentPage}
        onClick={() => onPageChange(page)}
        className={`${controlClassName} ${
          isCurrentPage ? 'border-brand-strong bg-brand-strong text-white disabled:opacity-100' : ''
        }`}
      >
        {page}
      </button>
    );
  }

  return (
    <nav aria-label="Paginação dos filmes">
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        Página {currentPage} de {totalPages}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        <button
          type="button"
          aria-label="Primeira página"
          title="Primeira página"
          disabled={isPreviousDisabled}
          onClick={() => onPageChange(1)}
          className={controlClassName}
        >
          <span aria-hidden="true">«</span>
        </button>

        <button
          type="button"
          aria-label="Página anterior"
          title="Página anterior"
          disabled={isPreviousDisabled}
          onClick={() => onPageChange(currentPage - 1)}
          className={controlClassName}
        >
          <span aria-hidden="true">‹</span>
        </button>

        {showAllPages ? (
          Array.from({ length: totalPages }, (_, index) => renderPageButton(index + 1))
        ) : (
          <>
            {firstPages.map(renderPageButton)}

            {currentPageIsInMiddle && currentPage > 3 ? (
              <span aria-hidden="true" className="px-1 text-content-muted">
                …
              </span>
            ) : null}

            {currentPageIsInMiddle ? renderPageButton(currentPage) : null}

            <span aria-hidden="true" className="px-1 text-content-muted">
              …
            </span>

            <form onSubmit={handlePageSubmit} className="flex items-center">
              <label htmlFor={pageInputId} className="sr-only">
                Ir para a página
              </label>
              <input
                id={pageInputId}
                type="number"
                inputMode="numeric"
                min={1}
                max={totalPages}
                value={pageInput}
                disabled={disabled}
                onChange={(event) => setPageInput(event.target.value)}
                onBlur={goToTypedPage}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    goToTypedPage();
                  }
                }}
                placeholder="Página"
                title={`Digite uma página entre 1 e ${totalPages} e pressione Enter`}
                className="h-11 w-20 rounded-control border border-divider bg-card px-2 text-center text-sm text-content outline-none placeholder:text-content-subtle focus:border-brand focus:ring-2 focus:ring-brand/30 disabled:cursor-not-allowed disabled:opacity-40"
              />
            </form>

            <span aria-hidden="true" className="px-1 text-content-muted">
              …
            </span>

            {lastPages.map(renderPageButton)}
          </>
        )}

        <button
          type="button"
          aria-label="Próxima página"
          title="Próxima página"
          disabled={isNextDisabled}
          onClick={() => onPageChange(currentPage + 1)}
          className={controlClassName}
        >
          <span aria-hidden="true">›</span>
        </button>

        <button
          type="button"
          aria-label="Última página"
          title="Última página"
          disabled={isNextDisabled}
          onClick={() => onPageChange(totalPages)}
          className={controlClassName}
        >
          <span aria-hidden="true">»</span>
        </button>
      </div>
    </nav>
  );
}
