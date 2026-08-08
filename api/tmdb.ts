import { loadServerEnvironment } from '../server/config/serverEnvironment.js';
import { createTmdbProxyHandler } from '../server/tmdb/createTmdbProxyHandler.js';

type TmdbProxyHandler = ReturnType<typeof createTmdbProxyHandler>;

let tmdbProxyHandler: TmdbProxyHandler | undefined;

function getTmdbProxyHandler(): TmdbProxyHandler {
  if (!tmdbProxyHandler) {
    const environment = loadServerEnvironment();

    tmdbProxyHandler = createTmdbProxyHandler({
      readAccessToken: environment.tmdbReadAccessToken,
    });
  }

  return tmdbProxyHandler;
}

function createProxyRequest(request: Request): Request {
  const requestUrl = new URL(request.url);
  const requestedPath = requestUrl.searchParams.get('path')?.replace(/^\/+/, '') ?? '';

  requestUrl.searchParams.delete('path');
  requestUrl.pathname = `/api/tmdb/${requestedPath}`;

  return new Request(requestUrl, {
    headers: request.headers,
    method: request.method,
    signal: request.signal,
  });
}

function configurationErrorResponse(): Response {
  return Response.json(
    {
      error: {
        code: 'SERVER_MISCONFIGURED',
        message: 'The movie service is not configured.',
      },
    },
    {
      status: 500,
      headers: {
        'cache-control': 'no-store',
        'x-content-type-options': 'nosniff',
      },
    },
  );
}

export default {
  async fetch(request: Request): Promise<Response> {
    try {
      return await getTmdbProxyHandler()(createProxyRequest(request));
    } catch {
      return configurationErrorResponse();
    }
  },
};
