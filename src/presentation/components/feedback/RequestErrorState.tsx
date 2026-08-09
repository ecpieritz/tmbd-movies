interface RequestErrorStateProps {
  readonly description: string;
  readonly onRetry: () => void;
  readonly title: string;
}

export function RequestErrorState({ description, onRetry, title }: RequestErrorStateProps) {
  return (
    <section
      role="alert"
      aria-labelledby="request-error-title"
      className="mx-auto flex max-w-lg flex-col items-center rounded-card border border-danger/40 bg-panel px-6 py-10 text-center shadow-card"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-12 text-danger" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 7v6" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        <circle cx="12" cy="17" r="1" fill="currentColor" />
      </svg>

      <h2 id="request-error-title" className="mt-4 text-xl font-semibold text-content">
        {title}
      </h2>
      <p className="mt-2 text-sm text-content-muted">{description}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 min-h-11 rounded-control bg-brand-strong px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-panel focus-visible:outline-none"
      >
        Tentar novamente
      </button>
    </section>
  );
}
