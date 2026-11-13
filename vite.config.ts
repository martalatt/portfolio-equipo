import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' makes the built site work under any GitHub Pages URL
// (https://user.github.io/any-repo-name/) without extra configuration.
export default defineConfig({
  plugins: [react()],
  base: './',
});
