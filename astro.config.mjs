import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";
import rehypeSlug from "rehype-slug";
import node from "@astrojs/node";

const isProd = process.env.NODE_ENV === "production";

// https://astro.build/config
export default defineConfig({
    integrations: [mdx(), sitemap(), react(), tailwind()],
    site: isProd ? "https://learning-path.dev" : "http://localhost:3000",
    markdown: {
        rehypePlugins: [
            [
                rehypeExternalLinks,
                {
                    target: "_blank",
                },
            ],
            rehypeSlug,
            [
                rehypeAutolinkHeadings,
                {
                    behavior: "wrap",
                },
            ],
        ],
    },
    output: "server",
    adapter: node({
        mode: "standalone",
    }),
});
