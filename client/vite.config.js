import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://bug-bounty-arena007.onrender.com', // dev: forward API calls to Express
    },
  },
});