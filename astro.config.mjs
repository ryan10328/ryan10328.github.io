import {defineConfig} from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";

import expressiveCode from "astro-expressive-code";
import {pluginLineNumbers} from "@expressive-code/plugin-line-numbers";

// https://astro.build/config
export default defineConfig({
    site: 'https://blog.ryantseng.me/',
    integrations: [
        expressiveCode({
            plugins: [pluginLineNumbers()],
            defaultProps: {
                showLineNumbers: true,
            },
            themes: ["github-dark"],
        }),
        mdx(),
        sitemap(),
        tailwind(),
    ]
});
