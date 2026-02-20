import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://chetankotak.github.io',
  base: '/realestate-portfolio',
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
