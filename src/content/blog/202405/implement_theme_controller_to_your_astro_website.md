---
title: "在 Astro Astrofy 樣板中實作具有記憶功能的 Theme Controller 功能"
description: "本篇文章將透過實際步驟，介紹如何在 Astrofy 的 Astro Template 當中，實作 theme 的切換功能，並且將設定值保留到 localStorage 當中"
pubDate: "May 18 2024"
heroImage: "/post_img.webp"
tags: [ "astro" ]
---

本篇文章使用 Astro 的 Template 叫做 <a href="https://github.com/manuelernestog/astrofy" target="_blank">Astrofy</a>
，這個樣板底下套用的 UI Framework 是 `DaisyUI`，所以文章內將會以此 UI 框架為基底，實作主題切換 (Theme Switch) 的功能。

首先我們要先看這個樣板是如何設定主題的，我們可以在 `BaseLayout.astro` 這個 Layout 當中找到 `html` 有 `data-theme` 屬性

```html
<!-- BaseLayout.astro -->
<html lang="en" data-theme="business"></html>
```

這個 `data-theme` 可以設定預設套用的 theme 名稱，`DaisyUI`
提供了很多樣化的主題可以讓使用者自行更改主題配色，以下列出 `DaisyUI` 支援的主題配色清單

```js
module.exports = {
    //...
    daisyui: {
        themes: [
            "light",
            "dark",
            "cupcake",
            "bumblebee",
            "emerald",
            "corporate",
            "synthwave",
            "retro",
            "cyberpunk",
            "valentine",
            "halloween",
            "garden",
            "forest",
            "aqua",
            "lofi",
            "pastel",
            "fantasy",
            "wireframe",
            "black",
            "luxury",
            "dracula",
            "cmyk",
            "autumn",
            "business",
            "acid",
            "lemonade",
            "night",
            "coffee",
            "winter",
            "dim",
            "nord",
            "sunset",
        ],
    },
}
```

接下來我們就要在畫面中加上 `Theme Controller` component，讓使用者有地方可以切換主題，我這邊選擇的是加入到 sidebar footer
，當然，也可以加在其他適合的區塊當中

```html
<!-- SideBarFooter.astro -->
<label class="swap swap-rotate mx-3">
    <input type="checkbox" id="theme-controller" class="theme-controller" value="cupcake"/>
    <svg class="swap-off fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/>
    </svg>
    <svg class="swap-on fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/>
    </svg>
</label>
```

這邊我把 `Theme Controller` 的 input 加上 `id="theme-controller` 方便寫 javascript 可以抓到，而 input 上面的 value
代表的是當這個 checkbox 被勾選的時候會套用的主題名稱

所以在這個架構底下，可以稍微先整理一下如果今天要用 javascript 實作具有記憶功能的 `Theme Switch` 功能，我們先簡單列出預期的功能

1. 讀取目前瀏覽器設定值 (`prefers-color-scheme`)，如果是 dark 就套用顏色深的主題，反之，則套用淺色的主題
2. `Theme Controller` 在切換主題時，要能夠將目前的主題名稱儲存到 `localStorage` 當中
3. 切換頁面、刷新頁面時，主題不會跑掉 (路由切換時不會跑掉)

```html
<!-- BaseLayout.astro -->
<script is:inline>
    (function () {
        const themes = {dark: "business", light: "cupcake"};
        // 取得目前瀏覽器的設定
        const sysColor = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

        // astro:page-load 在每次路由變更的時候都會觸發，這就是在這裡沒有用 DOMContentLoaded 的原因
        // 說明: 如果 user 改變路由，astro 不會刷新 (這行為跟 SPA 是一樣的)
        document.addEventListener("astro:page-load", () => {
            const controller = document.getElementById("theme-controller");
            // 第一次沒有設定存在 local storage 裡面時，先用瀏覽器設定寫入到 local storage 當中
            if (localStorage.getItem("theme") === null) localStorage.setItem("theme", sysColor);
            document.querySelector("html").setAttribute("data-theme", themes[localStorage.getItem("theme")]);

            // 同步 theme controller 的外觀，如果沒有這樣設定的話，theme controller 在切換成 light 主題並且路由變更後會是呈現太陽符號
            if (localStorage.getItem("theme") === "light") controller.click();

            // 監聽 theme controller 異動 (true = 亮色主題，false = 暗色主題)，並且把設定寫到 local storage (記憶功能)
            // 最後再把他設定到 `<html lang="en" data-theme="..."></html>` 上面
            controller.addEventListener("change", (e) => {
                localStorage.setItem("theme", e.target.checked ? "light" : "dark");
                document.querySelector("html").setAttribute("data-theme", themes[localStorage.getItem("theme")]);
            });
        });
    })();
</script>
```

以上就是如何在 Astro Astrofy Template 當中實作具有記憶功能的 `Theme Controller`

## 參考資料

- <a href="https://github.com/manuelernestog/astrofy" target="_blank">Astrofy (Github)</a>
- <a href="https://stackoverflow.com/questions/56393880/how-do-i-detect-dark-mode-using-javascript" target="_blank">How
  do I detect dark mode using JavaScript? (Stackoverflow)</a>
- <a href="https://docs.astro.build/en/reference/directives-reference/#isinline" target="_blank">Astro (is:inline)</a>
