import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'dumiol.vercel.app',
      // Add any other hosts you need to allow
      'localhost',
    ],
  },
}); 