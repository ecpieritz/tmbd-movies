import { jest } from '@jest/globals';

type FetchImplementation = typeof globalThis.fetch;

interface MockApiResponseOptions {
  readonly status?: number;
}

export const fetchMock = jest.fn<FetchImplementation>();

function createMockResponse(body: unknown, status: number): Response {
  return {
    json: () => Promise.resolve(body),
    ok: status >= 200 && status < 300,
    status,
  } as Response;
}

export function mockApiResponse(
  body: unknown,
  { status = 200 }: MockApiResponseOptions = {},
): void {
  fetchMock.mockResolvedValueOnce(createMockResponse(body, status));
}

export function mockApiError(
  status = 500,
  body: unknown = { message: 'API request failed' },
): void {
  mockApiResponse(body, { status });
}

export function mockApiNetworkError(error: Error = new TypeError('Failed to fetch')): void {
  fetchMock.mockRejectedValueOnce(error);
}
