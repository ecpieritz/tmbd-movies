export class HttpRequestError extends Error {
  readonly status: number | undefined;

  constructor(message: string, status?: number, options?: ErrorOptions) {
    super(message, options);
    this.name = 'HttpRequestError';
    this.status = status;
  }
}
