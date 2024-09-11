import { defineConfig } from 'vite';
import reactSWC from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactSWC()],
  build: {
    outDir: path.resolve(__dirname, '../../build/client'),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    postcss: './postcss.config.js',
  },
  server: {
    proxy: { '/api': 'http://localhost:3000' },
  },
});
