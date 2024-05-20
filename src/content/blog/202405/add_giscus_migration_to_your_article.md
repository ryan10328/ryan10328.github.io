---
title: "在 Astro Astrofy 樣板為每篇文章加入 giscus 留言功能"
description: "本篇文章將介紹如何使用 giscus 為每篇文章加入留言功能"
pubDate: "May 20 2024"
heroImage: "/post_img.webp"
tags: [ "astro" ]
---

## giscus 是什麼?

相信有在使用 Static Site Generator 這種方式寫 Blog 的人很多，以前很多人其實都是用 `Disqus`
這類的服務來串接部落格文章的留言板。但最近在各大部落格閒逛的時候發現到一個新玩具叫做 `giscus`，這個 app
也是用來串接留言板用的，只是機制跟 `Disqus` 有點不太一樣，`giscus` 的留言事實上是在 `giscus` 背後透過 Github API
和 `Github Discussion` 進行串接，也因為這樣，在設定及套用上也變得相當單純，僅有最後幾個步驟需要摸到 `javascript` (
但你不需要自己寫 `javascript`)。

## 如何串接?

首先，請大家點選 https://giscus.app/ 連結，在 `giscus` 網站中，其實已經有很完整的說明，不過這邊還是再列出一次

- `Github` 上面你需要建立一個新的 Repository (請特別注意: 建出來的 `Repository`
  需要是公開的，不能是私有的)
- 需要在 `Github` 當中安裝 `giscus` 的 app，這個 app 可以選擇只裝在你剛開的 Repository 上面
- 為第一個步驟開好的 Repository 開啟 Discussion 的功能
    - 設定路徑如右 (第一步驟開好的 Repository → General → Features → Discussion)
- 接下來請找到 https://giscus.app/ 底下有 Configuration 區塊，`giscus` 已經很貼心的幫你做好互動的
  UI，只要貼上第一個步驟開好的 `Github Repository` 網址，還有依據需求選擇好設定值，他就會在下方產生 `javascript`
  讓你直接貼到你的部落格當中

前面提到的 `javascript` 大概會長這樣

```js
<script src="https://giscus.app/client.js"
        data-repo="[ENTER REPO HERE]"
        data-repo-id="[ENTER REPO ID HERE]"
        data-category="[ENTER CATEGORY NAME HERE]"
        data-category-id="[ENTER CATEGORY ID HERE]"
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="bottom"
        data-theme="preferred_color_scheme"
        data-lang="en"
        crossorigin="anonymous"
        async>
</script>
```

- 回頭到 Astro 站台上找到文章所在的 `*.astro` 頁面上，把他貼到文章的最下方 (實際情況還是需要依照你自己 blog
  的設計選擇要貼到哪邊去)，以下單純就我這個 Blog 的例子來說明

```html {11-25}
<!-- PostLayout.astro -->
<BaseLayout title={title} description={description} image={heroImage} ogType="article">
    <main class="md:flex md:justify-center">
        <article class="prose prose-lg max-w-[850px] prose-img:mx-auto">
            <!-- 省略一堆沒有很重要的東西 ~ -->
            <div class="divider my-2"></div>
            <slot/>
            <div class="divider my-2"></div>
            <div class="p-2">
                <!-- 這邊是文章最下方，你的頁面設計跟我不一定一樣，所以這邊只是參考用 -->
                <script src="https://giscus.app/client.js"
                        data-repo="[ENTER REPO HERE]"
                        data-repo-id="[ENTER REPO ID HERE]"
                        data-category="[ENTER CATEGORY NAME HERE]"
                        data-category-id="[ENTER CATEGORY ID HERE]"
                        data-mapping="pathname"
                        data-strict="0"
                        data-reactions-enabled="1"
                        data-emit-metadata="0"
                        data-input-position="bottom"
                        data-theme="preferred_color_scheme"
                        data-lang="en"
                        crossorigin="anonymous"
                        async>
                </script>
            </div>
        </article>
    </main>
</BaseLayout>

```

實際結果大家可以拉到這個部落格的文章底下都會看到，不嫌棄就幫我按個 `reactions` 好了，感謝大家撥冗閱讀此篇文章 :)

## 參考資料

- <a href="https://giscus.app/">giscus</a>
