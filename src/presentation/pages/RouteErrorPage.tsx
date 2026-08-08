import { Link, isRouteErrorResponse, useRouteError } from 'react-router';

export function RouteErrorPage() {
  const error = useRouteError();
  const status = isRouteErrorResponse(error) ? error.status : 500;

  return (
    <main className="grid min-h-screen place-content-center bg-page px-4 text-center text-content">
      <p className="text-sm font-semibold tracking-wider text-danger uppercase">Error {status}</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Something went wrong</h1>
      <p className="mt-3 text-content-muted">The page could not be loaded. Please try again.</p>
      <Link
        to="/"
        className="mx-auto mt-6 rounded-control bg-brand px-4 py-2 font-medium text-white transition-colors hover:bg-brand-strong"
      >
        Return home
      </Link>
    </main>
  );
}
