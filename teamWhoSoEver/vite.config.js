import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';  // <-- import path to use resolve
import svgr from 'vite-plugin-svgr'; // <-- import SVGR plugin

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    svgr(), // <-- add SVGR plugin here
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // <-- alias for src
    },
  },
});
