import { useEffect, useRef, useState, type FormEvent } from 'react';
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
  useSearchParams,
  type NavLinkRenderProps,
} from 'react-router';

import { createMovieSearchPath } from '@/presentation/navigation/createMovieSearchPath';

interface GlobalSearchFormProps {
  initialQuery: string;
  isSearchPage: boolean;
}

const AUTO_SEARCH_MIN_LENGTH = 2;
const SEARCH_DEBOUNCE_MS = 350;

function getNavigationClassName({ isActive }: NavLinkRenderProps): string {
  const baseClassName =
    'inline-flex min-h-11 items-center rounded-control px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-panel';

  return isActive
    ? `${baseClassName} bg-brand-strong text-white`
    : `${baseClassName} text-content-muted hover:bg-card hover:text-content`;
}

function MovieIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none">
      <path
        d="M4 9h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="m5 4 14-2 1 5-14 2-1-5Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path d="m8 3.6 3 4M14 2.8l3 4" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2" />
      <path d="m16 16 4 4" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

function GlobalSearchForm({ initialQuery, isSearchPage }: GlobalSearchFormProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialQuery);
  const lastAutomaticQuery = useRef<string | null>(null);

  useEffect(() => {
    if (lastAutomaticQuery.current === initialQuery) {
      lastAutomaticQuery.current = null;
      return;
    }

    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const normalizedQuery = query.trim();
    const queryDidNotChange = normalizedQuery === initialQuery;
    const canStartSearch = normalizedQuery.length >= AUTO_SEARCH_MIN_LENGTH;

    if (queryDidNotChange || (!canStartSearch && !isSearchPage)) {
      return;
    }

    const timeoutId = globalThis.setTimeout(() => {
      const searchPath = createMovieSearchPath(normalizedQuery) ?? '/search';

      lastAutomaticQuery.current = normalizedQuery;
      void navigate(searchPath, {
        replace: true,
        state: { preserveFocus: true },
      });
    }, SEARCH_DEBOUNCE_MS);

    return () => globalThis.clearTimeout(timeoutId);
  }, [initialQuery, isSearchPage, navigate, query]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedQuery = query.trim();

    if (normalizedQuery.length < AUTO_SEARCH_MIN_LENGTH) {
      return;
    }

    const searchPath = createMovieSearchPath(normalizedQuery);

    if (!searchPath) {
      setQuery('');
      return;
    }

    void navigate(searchPath);
  }

  return (
    <form role="search" onSubmit={handleSubmit} className="w-full">
      <label htmlFor="global-movie-search" className="sr-only">
        Buscar filmes. Digite pelo menos dois caracteres.
      </label>

      <div className="relative">
        <input
          id="global-movie-search"
          name="q"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar filmes..."
          autoComplete="off"
          enterKeyHint="search"
          minLength={AUTO_SEARCH_MIN_LENGTH}
          maxLength={100}
          className="w-full rounded-full border border-divider bg-card py-2.5 pr-11 pl-4 text-sm text-content transition outline-none placeholder:text-content-subtle focus:border-brand focus:ring-2 focus:ring-brand/30"
        />

        <button
          type="submit"
          aria-label="Buscar"
          className="absolute inset-y-0 right-0 flex min-h-11 w-11 items-center justify-center rounded-full text-content-muted transition-colors hover:text-content focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-card focus-visible:outline-none"
        >
          <SearchIcon />
        </button>
      </div>
    </form>
  );
}

export function AppHeader() {
  const location = useLocation();
  const [searchParameters] = useSearchParams();
  const searchQuery =
    location.pathname === '/search' ? (searchParameters.get('q')?.trim() ?? '') : '';

  return (
    <header className="sticky top-0 z-50 border-b border-divider bg-panel/95 backdrop-blur">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-[1fr_auto] items-center gap-x-3 gap-y-3 px-4 py-3 sm:px-6 md:grid-cols-[auto_minmax(16rem,32rem)_auto] md:gap-x-6 lg:px-8">
        <Link
          to="/"
          aria-label="MovieDB - Início"
          className="flex min-h-11 w-fit items-center gap-2 rounded-control text-xl font-bold text-accent focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-panel focus-visible:outline-none"
        >
          <MovieIcon />
          <span>MovieDB</span>
        </Link>

        <div className="col-span-2 row-start-2 md:col-span-1 md:col-start-2 md:row-start-1">
          <GlobalSearchForm
            initialQuery={searchQuery}
            isSearchPage={location.pathname === '/search'}
          />
        </div>

        <nav
          aria-label="Navegação principal"
          className="col-start-2 row-start-1 flex items-center gap-1 md:col-start-3"
        >
          <NavLink to="/" end className={getNavigationClassName}>
            Home
          </NavLink>
          <NavLink to="/favorites" className={getNavigationClassName}>
            Favoritos
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
