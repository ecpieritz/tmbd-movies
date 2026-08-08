import { Link } from 'react-router';

export function NotFoundPage() {
  return (
    <section
      className="grid min-h-[60vh] place-content-center text-center"
      aria-labelledby="page-title"
    >
      <p className="text-sm font-semibold tracking-wider text-brand uppercase">Error 404</p>
      <h1 id="page-title" className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-3 text-content-muted">The requested page does not exist.</p>
      <Link
        to="/"
        className="mx-auto mt-6 rounded-control bg-brand px-4 py-2 font-medium text-white transition-colors hover:bg-brand-strong"
      >
        Return home
      </Link>
    </section>
  );
}
