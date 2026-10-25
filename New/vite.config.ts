import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { legacyMiddleware } from './js/scripts/static-files.mjs';

export default defineConfig({
  base: '/Portfolio-YoungSliker/New/',
  plugins: [react(), {
    name: 'legacy-local-preview',
    configureServer(server) { server.middlewares.use(legacyMiddleware); },
    configurePreviewServer(server) { server.middlewares.use(legacyMiddleware); },
  }],
  server: { port: 5173, strictPort: true },
  preview: { port: 4173, strictPort: true },
  build: { assetsInlineLimit: 0, outDir: 'dist', assetsDir: 'assets', emptyOutDir: true },
});
