export type HttpQueryValue = boolean | number | string | undefined;

export interface HttpGetOptions {
  readonly query?: Readonly<Record<string, HttpQueryValue>>;
  readonly signal?: AbortSignal;
}

export interface HttpClient {
  get(path: string, options?: HttpGetOptions): Promise<unknown>;
}
