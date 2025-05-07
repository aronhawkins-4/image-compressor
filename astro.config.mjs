// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [
      tailwindcss()
    ]
  },

  integrations: [react()],

  adapter: node({
    mode: 'standalone'
  })
});