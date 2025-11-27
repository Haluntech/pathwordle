import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  build: {
    // Optimize build for production
    target: 'esnext',
    minify: 'terser',
    sourcemap: false,

    // Code splitting strategy
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries
          'vendor': ['react', 'react-dom'],
          // Split UI components
          'ui': ['lucide-react'],
        },
      },
    },

    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 4096,
  },
  server: {
    // Enable HMR
    hmr: true,
  },
  preview: {
    headers: {
      // Security headers for development
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['react', 'react-dom'],
  },
  // Define global constants
  define: {
    __DEV__: JSON.stringify(true),
  },
});
