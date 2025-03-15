---
title: "如何解決在 Astro 當中切換 theme 的時候會閃爍的問題"
enTitle: "How to solve the flashing issue when toggle dark/light theme"
description: "如何解決在 Astro 當中切換 theme 的時候會閃爍的問題 solve flashing issue when toggle theme"
pubDate: "Mar 15 2025"
heroImage: "/theme_toggler_0315.webp"
tags: ["astro"]
---

在去年的文章有提到如何加入 theme toggler 到部落格當中，但前一陣子發現其實在切換亮色以及暗色主題的時候會有閃爍的問題 (意思就是當在 light theme 的時候重新刷頁面，dark theme 會短暫的閃爍一下，最後才會真的變成亮色主題)

後來調查一下，發現可能是因為使用了不太恰當的 astro lifecycle event 的原因，今天就來重構一下之前的 code，順便解一下切換 theme 會閃爍的問題

## 改寫 `BaseLayout.astro` 內的邏輯 

以下的 code 是放在 `BaseLayout.astro` 內的 `<script is:inline></script>` 當中

```js
/** 這邊都是關於切換 theme 的 utility function，方便使用，但不一定要 follow */
const key = "theme";

const getColorPreference = () => {
    let preference = localStorage.getItem(key);
    if (!preference) {
        preference = window.matchMedia("(prefers-color-scheme: dark)")
            .matches
            ? "dark"
            : "light";
    }
    return preference;
};

const setPreference = (colorPreference, document) => {
    localStorage.setItem(key, colorPreference);
    document
        .querySelector("html")
        .setAttribute(
            "data-theme",
            getColorPreference() === "dark" ? "forest" : "cupcake",
        );
};

const togglePreference = (document) => {
    setPreference(
        getColorPreference() === "dark" ? "light" : "dark",
        document,
    );
};

/** end of utility functions */

// 這個畫面載入第一次會 load，頁面切換的時候不會
if (typeof window !== "undefined") {
    setPreference(getColorPreference(), window.document);
}

// 這個事件每次切換頁面都會跑 (但是會比 astro:page-load 還要早)
document.addEventListener("astro:before-swap", (event) => {
    // 這邊是在 astro:page-load 以前再設定一次
    setPreference(getColorPreference(), event.newDocument);
});

// 這個事件在每次切換頁面也會跑
document.addEventListener("astro:page-load", () => {
    // 載入畫面後要 align 目前 localStrage 裡面的設定和 theme-controller 的圖案
    // 要不然圖標會跟設定不一致
    const checkbox = document.getElementById("theme-controller");
    checkbox.checked = getColorPreference() === "dark";

    // theme toggler 事件
    checkbox.addEventListener("change", (e) => {
        togglePreference(window.document);
    });
});
```
這邊比較大的改變其實是我用了另外一個 ViewTransition event 叫做 `astro:before-swap`，對於 `astro:before-swap` lifecycle event 的說明如下

> An event that fires before the new document (which is populated during the preparation phase) replaces the current document. This event occurs inside of the view transition, where the user is still seeing a snapshot of the old page. This event can be used to make changes before the swap occurs. The newDocument property on the event represents the incoming document. 

在之前版本的寫法是我全部都把相關的 theme toggling 邏輯都放在 `astro:page-load` 事件裡面，猜測因為這樣所以執行的順序有點晚了，才會在我們肉眼可以看到的時候閃了一下

那這次我就在 `astro:before-swap` 的事件中先設定一次 theme，但這邊特別的地方是，我們是拿 `event.newDocument` 而不是直接拿 `window.document`，最後用這個 `newDocument` 去設定 theme

至於 theme toggler 的事件我們依然還是放在 `astro:page-load` 當中，讓使用者可以透過我部落格左下角的 theme toggler 可以切換 light or dark theme

## 參考資料

- <a target="_blank" href="https://www.tohuwabohu.io/2022/11/astrojs-theme-toggle/">Dark Theme Toggle in Astro - tohuwabohu</a>
- <a target="_blank" href="https://docs.astro.build/en/guides/view-transitions/#astrobefore-swap">Astro document - astro:before-swap</a>