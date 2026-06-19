import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Served as a GitHub Pages *project* site at /american-automations/.
// If you later point a custom domain at the repo root, change base back to '/'.
export default defineConfig({
  base: '/american-automations/',
  plugins: [react()],
});
