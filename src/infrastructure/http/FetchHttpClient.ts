import type { HttpClient, HttpGetOptions, HttpQueryValue } from '@/infrastructure/http/HttpClient';
import { HttpRequestError } from '@/infrastructure/http/HttpRequestError';

type FetchImplementation = typeof globalThis.fetch;

function appendQueryParameter(
  searchParameters: URLSearchParams,
  name: string,
  value: HttpQueryValue,
): void {
  if (value !== undefined) {
    searchParameters.set(name, String(value));
  }
}

export class FetchHttpClient implements HttpClient {
  private readonly baseUrl: string;

  constructor(
    baseUrl: string,
    private readonly fetchImplementation: FetchImplementation = globalThis.fetch,
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  async get(path: string, options: HttpGetOptions = {}): Promise<unknown> {
    const url = this.createUrl(path, options.query);
    let response: Response;

    try {
      response = await this.fetchImplementation(url, {
        method: 'GET',
        headers: { accept: 'application/json' },
        signal: options.signal,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw error;
      }

      throw new HttpRequestError('The API request could not be completed.', undefined, {
        cause: error,
      });
    }

    const payload = await this.parseResponse(response);

    if (!response.ok) {
      throw new HttpRequestError(
        `The API request failed with status ${response.status}.`,
        response.status,
      );
    }

    return payload;
  }

  private createUrl(path: string, query: HttpGetOptions['query']): string {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const searchParameters = new URLSearchParams();

    for (const [name, value] of Object.entries(query ?? {})) {
      appendQueryParameter(searchParameters, name, value);
    }

    const queryString = searchParameters.toString();

    return `${this.baseUrl}${normalizedPath}${queryString ? `?${queryString}` : ''}`;
  }

  private async parseResponse(response: Response): Promise<unknown> {
    try {
      return await response.json();
    } catch (error) {
      throw new HttpRequestError('The API returned an invalid JSON response.', response.status, {
        cause: error,
      });
    }
  }
}
