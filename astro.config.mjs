// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import alpinejs from '@astrojs/alpinejs';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({
      // Disable the nesting option that's causing the issue
      applyBaseStyles: false,
    }),
    alpinejs(),
    mdx(),
  ],
  // Enable TypeScript strict mode
  typescript: {
    strict: true,
  },
});