import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      // Vite chuyển yêu cầu đến Sneaker News 
      '/rss-proxy': {
        target: 'https://sneakernews.com',
        changeOrigin: true,
        proxyTimeout: 7000,
        rewrite: (path) => path.replace(/^\/rss-proxy/, ''),
      },
    },
  },
});