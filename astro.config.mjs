import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://maroayman.com', // Update with your actual domain
  integrations: [react(), tailwind(), sitemap()],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport'
  },
  vite: {
    build: {
      cssCodeSplit: true,
      assetsInlineLimit: 4096
    }
  }
});

