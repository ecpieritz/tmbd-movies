import { jest } from '@jest/globals';

type FetchImplementation = typeof globalThis.fetch;

interface MockApiResponseOptions {
  readonly status?: number;
}

interface PendingApiResponse {
  readonly reject: (error?: Error) => void;
  readonly resolve: (body: unknown, options?: MockApiResponseOptions) => void;
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

export function mockPendingApiResponse(): PendingApiResponse {
  let resolveRequest!: (response: Response) => void;
  let rejectRequest!: (error: Error) => void;
  const responsePromise = new Promise<Response>((resolve, reject) => {
    resolveRequest = resolve;
    rejectRequest = reject;
  });

  fetchMock.mockReturnValueOnce(responsePromise);

  return {
    reject: (error = new TypeError('Failed to fetch')) => rejectRequest(error),
    resolve: (body, { status = 200 } = {}) => resolveRequest(createMockResponse(body, status)),
  };
}
