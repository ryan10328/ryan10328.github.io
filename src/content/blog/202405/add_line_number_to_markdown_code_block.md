---
title: "如何在 Astro 的 markdown code block 中加入行號"
description: "本篇文章將介紹如何使用 express code 讓 code block 支援行號"
pubDate: "May 17 2024"
heroImage: "/post_img.webp"
tags: [ "astro" ]
---

最近把部落格重新用 Astro 這套框架取代原本很早以前用的 `Hexo`，在調整設定的過程當中，剛好發現 Astro markdown 裡面的 code
block 預設底下並沒有支援行號，因此本文將透過步驟、實際調整的設定來讓 Astro 支援 code block 行號。

我們會用到的套件有以下兩個

1. `astro-expressive-code`
2. `@expressive-code/plugin-line-numbers`

首先安裝 `astro-expressive-code`

```bash title="Terminal"
pnpm astro add astro-expressive-code

```

再來安裝 `@expressive-code/plugin-line-numbers`

```bash title="Terminal"
pnpm i @expressive-code/plugin
```

接下來我們需要在 `astro.config.mjs` 當中加入相關設定

```js {6-11}
// astro.config.mjs
export default defineConfig({
    // ignore...
    integrations: [
        // add expressiveCode to integrations
        expressiveCode({
            plugins: [pluginLineNumbers()], // add pluginLineNumbers() plugin
            defaultProps: {
                showLineNumbers: true, // set true to show line number by default
            }
        }),
        // ignore...
    ]
});
```

實際效果在本文章就能夠看到了，如果想要了解 `expressive code` 更細部的設定值，請參考以下網址

- <a href="https://expressive-code.com/plugins/line-numbers/" target="_blank">Express Code - Line Numbers</a>
