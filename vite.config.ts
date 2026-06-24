/**
 * Core build-time compilation assembly profile for Vite.
 * Integrates React component rendering and Tailwind CSS utility compiling.
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 3000,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Prevent mapping structure leakage in production bundles
    reportCompressedSize: false,
  },
});