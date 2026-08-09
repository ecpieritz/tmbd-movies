const PROXY_PATH_PREFIX = '/api/tmdb';
const TMDB_API_BASE_URL = 'https://api.themoviedb.org/3';
const DEFAULT_TIMEOUT_MS = 10_000;

const commonQueryParameters = ['language'] as const;

interface RouteDefinition {
  readonly matches: (pathname: string) => boolean;
  readonly queryParameters: readonly string[];
  readonly cacheControl: string;
}

const routes: readonly RouteDefinition[] = [
  {
    matches: (pathname) => pathname === '/movie/popular',
    queryParameters: [...commonQueryParameters, 'page', 'region'],
    cacheControl: 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
  },
  {
    matches: (pathname) => pathname === '/search/movie',
    queryParameters: [
      ...commonQueryParameters,
      'query',
      'page',
      'include_adult',
      'region',
      'year',
      'primary_release_year',
    ],
    cacheControl: 'no-store',
  },
  {
    matches: (pathname) => pathname === '/discover/movie',
    queryParameters: [
      ...commonQueryParameters,
      'page',
      'include_adult',
      'include_video',
      'sort_by',
      'with_genres',
    ],
    cacheControl: 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
  },
  {
    matches: (pathname) => /^\/movie\/[1-9]\d*$/.test(pathname),
    queryParameters: commonQueryParameters,
    cacheControl: 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
  },
];

interface TmdbProxyOptions {
  readonly readAccessToken: string;
  readonly fetchImplementation?: typeof globalThis.fetch;
  readonly timeoutMs?: number;
}

function errorResponse(status: number, code: string, message: string): Response {
  return Response.json(
    { error: { code, message } },
    {
      status,
      headers: {
        'cache-control': 'no-store',
        'x-content-type-options': 'nosniff',
      },
    },
  );
}

function findRoute(pathname: string): RouteDefinition | undefined {
  return routes.find((route) => route.matches(pathname));
}

function validateQueryParameters(url: URL, route: RouteDefinition): Response | undefined {
  const unsupportedParameters = [...url.searchParams.keys()].filter(
    (parameter) => !route.queryParameters.includes(parameter),
  );

  if (unsupportedParameters.length > 0) {
    return errorResponse(
      400,
      'UNSUPPORTED_QUERY_PARAMETER',
      `Unsupported query parameter: ${unsupportedParameters[0]}`,
    );
  }

  const page = url.searchParams.get('page');

  if (page && (!/^\d+$/.test(page) || Number(page) < 1 || Number(page) > 500)) {
    return errorResponse(400, 'INVALID_PAGE', 'Page must be an integer between 1 and 500.');
  }

  if (url.pathname.endsWith('/search/movie') && !url.searchParams.get('query')?.trim()) {
    return errorResponse(400, 'MISSING_QUERY', 'A non-empty search query is required.');
  }

  if (url.pathname.endsWith('/discover/movie')) {
    const genres = url.searchParams.get('with_genres');
    const sortBy = url.searchParams.get('sort_by');
    const includeAdult = url.searchParams.get('include_adult');
    const includeVideo = url.searchParams.get('include_video');

    if (!genres || !/^[1-9]\d*(\|[1-9]\d*)*$/.test(genres)) {
      return errorResponse(400, 'INVALID_GENRES', 'At least one valid genre ID is required.');
    }

    if (sortBy !== 'popularity.desc' || includeAdult !== 'false' || includeVideo !== 'false') {
      return errorResponse(
        400,
        'INVALID_DISCOVERY_FILTER',
        'The requested discovery filters are not allowed.',
      );
    }
  }

  return undefined;
}

function createUpstreamUrl(requestUrl: URL, route: RouteDefinition): URL {
  const tmdbPath = requestUrl.pathname.slice(PROXY_PATH_PREFIX.length);
  const upstreamUrl = new URL(`${TMDB_API_BASE_URL}${tmdbPath}`);

  for (const parameter of route.queryParameters) {
    for (const value of requestUrl.searchParams.getAll(parameter)) {
      upstreamUrl.searchParams.append(parameter, value);
    }
  }

  return upstreamUrl;
}

function isTimeoutError(error: unknown): boolean {
  return error instanceof DOMException && ['AbortError', 'TimeoutError'].includes(error.name);
}

export function createTmdbProxyHandler({
  readAccessToken,
  fetchImplementation = globalThis.fetch,
  timeoutMs = DEFAULT_TIMEOUT_MS,
}: TmdbProxyOptions): (request: Request) => Promise<Response> {
  return async (request) => {
    if (request.method !== 'GET') {
      return errorResponse(405, 'METHOD_NOT_ALLOWED', 'Only GET requests are supported.');
    }

    const requestUrl = new URL(request.url);
    const tmdbPath = requestUrl.pathname.slice(PROXY_PATH_PREFIX.length);
    const route = findRoute(tmdbPath);

    if (!requestUrl.pathname.startsWith(`${PROXY_PATH_PREFIX}/`) || !route) {
      return errorResponse(404, 'ROUTE_NOT_ALLOWED', 'The requested TMDB route is not available.');
    }

    const queryError = validateQueryParameters(requestUrl, route);

    if (queryError) {
      return queryError;
    }

    try {
      const upstreamResponse = await fetchImplementation(createUpstreamUrl(requestUrl, route), {
        method: 'GET',
        headers: {
          accept: 'application/json',
          authorization: `Bearer ${readAccessToken}`,
        },
        signal: AbortSignal.timeout(timeoutMs),
      });
      const headers = new Headers({
        'cache-control': route.cacheControl,
        'content-type': upstreamResponse.headers.get('content-type') ?? 'application/json',
        'x-content-type-options': 'nosniff',
      });
      const retryAfter = upstreamResponse.headers.get('retry-after');

      if (retryAfter) {
        headers.set('retry-after', retryAfter);
      }

      return new Response(upstreamResponse.body, {
        status: upstreamResponse.status,
        statusText: upstreamResponse.statusText,
        headers,
      });
    } catch (error) {
      if (isTimeoutError(error)) {
        return errorResponse(504, 'UPSTREAM_TIMEOUT', 'TMDB did not respond in time.');
      }

      return errorResponse(502, 'UPSTREAM_UNAVAILABLE', 'TMDB is temporarily unavailable.');
    }
  };
}
