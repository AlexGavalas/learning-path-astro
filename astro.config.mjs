import 'dotenv/config';
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';
import vercel from '@astrojs/vercel/serverless';
import { REHYPE_PLUGINS } from './src/config/markdown';

const isProd = import.meta.env.PROD;
const isLocalBuild = process.env.LOCAL === 'true';

// https://astro.build/config
export default defineConfig({
    integrations: [mdx(), sitemap(), react(), tailwind()],
    site: isProd ? 'https://learning-path.dev' : 'http://localhost:3000',
    markdown: {
        rehypePlugins: REHYPE_PLUGINS,
    },
    output: 'server',
    adapter: isLocalBuild
        ? node({
              mode: 'standalone',
          })
        : vercel(),
});
