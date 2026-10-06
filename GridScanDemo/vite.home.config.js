import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  cacheDir: '../.vite-gridscan-cache',
  build: {
    emptyOutDir: true,
    outDir: '../js/gridscan-home',
    lib: {
      entry: 'src/home-main.jsx',
      formats: ['es'],
      fileName: () => 'gridscan-home.js'
    },
    rollupOptions: {
      output: {
        assetFileNames: 'gridscan-home.css'
      }
    }
  }
});
