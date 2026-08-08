const DEFAULT_HOST = '127.0.0.1';
const DEFAULT_PORT = 8787;
const TOKEN_PLACEHOLDER = 'replace_with_your_tmdb_read_access_token';
const API_KEY_PLACEHOLDER = 'replace_with_your_tmdb_api_key';

export interface ServerEnvironment {
  readonly host: string;
  readonly port: number;
  readonly tmdbApiKey: string;
  readonly tmdbReadAccessToken: string;
}

export class EnvironmentConfigurationError extends Error {
  constructor(messages: readonly string[]) {
    super(`Invalid server environment:\n- ${messages.join('\n- ')}`);
    this.name = 'EnvironmentConfigurationError';
  }
}

function parsePort(value: string | undefined, errors: string[]): number {
  if (!value) {
    return DEFAULT_PORT;
  }

  const port = Number(value);

  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    errors.push('PORT or TMDB_PROXY_PORT must be an integer between 1 and 65535.');
    return DEFAULT_PORT;
  }

  return port;
}

export function loadServerEnvironment(source: NodeJS.ProcessEnv = process.env): ServerEnvironment {
  const errors: string[] = [];
  const token = source.TMDB_READ_ACCESS_TOKEN?.trim();
  const apiKey = source.TMDB_API_KEY?.trim();

  if (!token || token === TOKEN_PLACEHOLDER) {
    errors.push('TMDB_READ_ACCESS_TOKEN is required and must not contain the example value.');
  }

  if (!apiKey || apiKey === API_KEY_PLACEHOLDER) {
    errors.push('TMDB_API_KEY is required and must not contain the example value.');
  }

  const configuredHost = source.TMDB_PROXY_HOST?.trim();
  const host = configuredHost?.length ? configuredHost : DEFAULT_HOST;
  const port = parsePort(source.PORT ?? source.TMDB_PROXY_PORT, errors);

  if (errors.length > 0) {
    throw new EnvironmentConfigurationError(errors);
  }

  return Object.freeze({
    host,
    port,
    tmdbApiKey: apiKey!,
    tmdbReadAccessToken: token!,
  });
}
