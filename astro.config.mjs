import {defineConfig} from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
    site: 'https://blog.ryantseng.me/',
    markdown: {
        shikiConfig: {
            theme: 'one-dark-pro'
        },
    },
    integrations: [
        mdx(),
        sitemap(),
        tailwind(),
    ]
});
