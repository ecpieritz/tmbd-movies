import { Link, isRouteErrorResponse, useRouteError } from 'react-router';

import { Seo } from '@/presentation/components/seo/Seo';

export function RouteErrorPage() {
  const error = useRouteError();
  const status = isRouteErrorResponse(error) ? error.status : 500;

  return (
    <>
      <Seo
        title={`Erro ${status}`}
        description="Não foi possível carregar esta página do TMDB Movies."
        canonicalPath="/error"
        noIndex
      />
      <main className="grid min-h-screen place-content-center bg-page px-4 text-center text-content">
        <p className="text-sm font-semibold tracking-wider text-danger uppercase">Erro {status}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Algo deu errado</h1>
        <p className="mt-3 text-content-muted">
          Não foi possível carregar a página. Tente novamente.
        </p>
        <Link
          to="/"
          className="mx-auto mt-6 inline-flex min-h-11 items-center rounded-control bg-brand-strong px-4 py-2 font-medium text-white transition-colors hover:bg-brand-hover focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-page focus-visible:outline-none"
        >
          Voltar para o início
        </Link>
      </main>
    </>
  );
}
