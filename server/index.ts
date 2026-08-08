import 'dotenv/config';

import { createServer, type ServerResponse } from 'node:http';

import { loadServerEnvironment } from './config/serverEnvironment.js';
import { createTmdbProxyHandler } from './tmdb/createTmdbProxyHandler.js';

const environment = loadServerEnvironment();
const handleTmdbRequest = createTmdbProxyHandler({
  readAccessToken: environment.tmdbReadAccessToken,
});

async function writeResponse(webResponse: Response, nodeResponse: ServerResponse): Promise<void> {
  nodeResponse.statusCode = webResponse.status;

  webResponse.headers.forEach((value, name) => {
    nodeResponse.setHeader(name, value);
  });

  nodeResponse.end(Buffer.from(await webResponse.arrayBuffer()));
}

const server = createServer((nodeRequest, nodeResponse) => {
  void (async () => {
    try {
      const requestUrl = new URL(nodeRequest.url ?? '/', 'http://localhost');
      const webRequest = new Request(requestUrl, {
        method: nodeRequest.method ?? 'GET',
      });
      const webResponse = await handleTmdbRequest(webRequest);

      await writeResponse(webResponse, nodeResponse);
    } catch {
      await writeResponse(
        Response.json(
          {
            error: { code: 'INTERNAL_ERROR', message: 'The proxy could not process the request.' },
          },
          { status: 500 },
        ),
        nodeResponse,
      );
    }
  })();
});

server.listen(environment.port, environment.host, () => {
  console.info(`TMDB proxy listening on http://${environment.host}:${environment.port}`);
});

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.once(signal, () => {
    server.close(() => process.exit(0));
  });
}
