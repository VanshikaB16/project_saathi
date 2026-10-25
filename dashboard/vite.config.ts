import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api/browser-use': {
        target: 'https://api.browser-use.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/browser-use/, '/api'),
        secure: true
      }
    }
  }
});
