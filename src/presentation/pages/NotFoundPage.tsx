import { Link } from 'react-router';

export function NotFoundPage() {
  return (
    <section
      className="grid min-h-[60vh] place-content-center text-center"
      aria-labelledby="page-title"
    >
      <p className="text-sm font-semibold tracking-wider text-brand uppercase">Erro 404</p>
      <h1 id="page-title" className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
        Página não encontrada
      </h1>
      <p className="mt-3 text-content-muted">A página solicitada não existe.</p>
      <Link
        to="/"
        className="mx-auto mt-6 inline-flex min-h-11 items-center rounded-control bg-brand-strong px-4 py-2 font-medium text-white transition-colors hover:bg-brand-hover focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-page focus-visible:outline-none"
      >
        Voltar para o início
      </Link>
    </section>
  );
}
