import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';
import { REHYPE_PLUGINS } from './src/config/markdown';

const isProd = import.meta.env.PROD;

// https://astro.build/config
export default defineConfig({
    integrations: [mdx(), sitemap(), react(), tailwind()],
    site: isProd ? 'https://learning-path.dev' : 'http://localhost:3000',
    output: 'hybrid',
    markdown: {
        rehypePlugins: REHYPE_PLUGINS,
    },
    adapter: node({
        mode: 'standalone',
    }),
});
