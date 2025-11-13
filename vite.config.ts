import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable Fast Refresh
      fastRefresh: true,
      // Optimize React imports
      jsxImportSource: 'react',
    }),
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
    fs: {
      // Allow parent workspace folder so deps resolved from parent node_modules won't be blocked
      allow: [
        process.cwd(),
        path.resolve(process.cwd(), '..'),
      ],
    },
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
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
  },
});
