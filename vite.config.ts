// @ts-nocheck
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      // Allow parent workspace folder so deps resolved from parent node_modules won't be blocked
      allow: [
        process.cwd(),
        path.resolve(process.cwd(), '..'),
      ],
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
