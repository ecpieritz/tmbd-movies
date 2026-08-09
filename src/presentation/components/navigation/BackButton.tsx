import { useNavigate } from 'react-router';

interface RouterHistoryState {
  readonly idx?: unknown;
}

interface BackButtonProps {
  readonly fallbackTo?: string;
}

function hasPreviousRouterEntry(): boolean {
  const historyState = globalThis.history.state as RouterHistoryState | null;

  return typeof historyState?.idx === 'number' && historyState.idx > 0;
}

export function BackButton({ fallbackTo = '/' }: BackButtonProps) {
  const navigate = useNavigate();

  function handleBack() {
    if (hasPreviousRouterEntry()) {
      void navigate(-1);
      return;
    }

    void navigate(fallbackTo, { replace: true });
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      className="inline-flex min-h-11 items-center gap-2 rounded-control px-2 py-2 text-sm font-semibold text-brand transition-colors hover:bg-brand/10 hover:text-content focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none">
        <path
          d="m15 18-6-6 6-6M9 12h11"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
      Voltar
    </button>
  );
}
