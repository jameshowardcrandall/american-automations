import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Served from the custom domain root (american-automations.com).
// CNAME lives in public/ so the Pages deploy keeps the custom domain.
export default defineConfig({
  base: '/',
  plugins: [react()],
});
