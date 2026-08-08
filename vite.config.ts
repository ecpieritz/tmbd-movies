import { fileURLToPath, URL } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const DEFAULT_PROXY_PORT = '8787';

export default defineConfig(({ mode }) => {
  const environment = loadEnv(mode, process.cwd(), 'TMDB_PROXY_');
  const proxyPort = environment.TMDB_PROXY_PORT || DEFAULT_PROXY_PORT;

  if (!/^\d+$/.test(proxyPort)) {
    throw new Error('TMDB_PROXY_PORT must be a valid port number.');
  }

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      proxy: {
        '/api/tmdb': {
          target: `http://127.0.0.1:${proxyPort}`,
        },
      },
    },
  };
});
