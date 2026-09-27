import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// `vite build --mode singlefile` inlines everything into one HTML file (used for the shareable preview).
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), mode === 'singlefile' && viteSingleFile()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  build: mode === 'singlefile' ? { outDir: 'dist-singlefile' } : undefined,
}));
