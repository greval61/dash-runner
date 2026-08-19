import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  base: './',
  root: path.resolve(__dirname, 'public'),
  server: {
    port: 3000,
    open: true
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true
  }
});
