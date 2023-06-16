import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import node from "@astrojs/node";

const isProd = process.env.NODE_ENV === "production";

// https://astro.build/config
export default defineConfig({
    integrations: [mdx(), sitemap(), react(), tailwind()],
    site: isProd ? "https://learning-path.dev" : "http://localhost:3000",
    output: "hybrid",
    adapter: node({
        mode: "standalone",
    }),
});
