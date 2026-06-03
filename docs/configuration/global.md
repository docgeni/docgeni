---
title: 全局配置
path: 'global'
order: 10
toc: menu
---

## mode

- 类型：`lite`｜`full`
- 默认：`lite`

设定文档站点的展示模式。

- `lite`：简易模式，左侧菜单 + 右侧内容
- `full`：站点模式，包含首页、顶部导航、左侧菜单与右侧内容

## theme

- 类型：`default`｜`angular`
- 默认：`default`

设置导航栏主题样式。

- `default`：默认主题，导航背景为白色
- `angular`：Angular 官网风格，默认导航背景色为 <code style="color: #3f51b5">#3f51b5</code>，可通过修改 SCSS 变量自定义

## switchTheme

- 类型：`boolean`
- 默认：`false`

是否启用明暗主题切换。开启后支持亮色、暗色与跟随系统三种模式。

## title

- 类型：`string`
- 默认：`package.name`

文档站点标题，通常为组件库名称，例如 `Docgeni`。

## logoUrl

- 类型：`string`
- 默认：Docgeni 默认 Logo 地址

组件库 Logo 的图片地址。

## repoUrl

- 类型：`string`
- 默认：`null`

组件库的 GitHub 仓库地址。

## docsDir

- 类型：`string`
- 默认：`docs`

Markdown 文档所在目录。Docgeni 会扫描其中的文件夹与 Markdown 文件，并按规则生成一级导航、侧边菜单与页面内容。

## siteDir

- 类型：`string`
- 默认：`.docgeni/site`

自动生成的站点工作目录。Docgeni 会将组件示例与文档同步到该目录。若已配置 `siteProjectName`，则以自定义站点目录为准，此项不生效。

## outputDir

- 类型：`string`
- 默认：`dist/docgeni-site`

站点构建产物输出目录。若已配置 `siteProjectName`，则以自定义站点的输出目录为准，此项不生效。

## renderMode <label>2.8.0+</label>

- 类型：`csr` | `ssg` | `ssr`
- 默认：`csr`

设定文档站点的渲染模式。Docgeni 会根据该配置生成对应的 Angular 构建选项：

- `csr`：客户端渲染（Client-Side Rendering），页面在浏览器端渲染，构建产物为纯静态文件，适合 CDN 部署
- `ssg`：静态站点生成（Static Site Generation），构建时预渲染文档页面为 HTML，有利于 SEO 与首屏加载
- `ssr`：服务端渲染（Server-Side Rendering），需在 Node.js 环境中运行服务端，适合需要动态服务端能力的场景

```ts
module.exports = {
    renderMode: 'ssg',
};
```

> 切换 `renderMode` 后需重新执行 `docgeni build`，Docgeni 会自动同步站点模板与 Angular 构建配置。

## publicDir

- 类型：`string`
- 默认：`.docgeni/public`

自定义站点资源的配置目录。Docgeni 会将该目录下的 `index.html`、`favicon.ico`、`styles.scss`、`assets`、`.browserslistrc` 和 `tsconfig.json` 拷贝并覆盖到站点目录，用于自定义站点外观与配置。详见 [自定义站点](/guides/advance/customize)。

## componentsDir <label>1.1.0+</label>

- 类型：`string`
- 默认：`.docgeni/components`

自定义内置组件的存放目录。详见 [自定义内置组件](/guides/basic/built-in-components#自定义内置组件)。

## siteProjectName

- 类型：`string`
- 默认：`null`

Angular 自定义站点的项目名称。除默认的文档与示例展示外，若还需扩展站点功能，可在仓库中新建 site 项目并填写其名称，Docgeni 会将生成的文档与示例同步到该项目。更多信息见 [自定义站点](/guides/advance/customize)。

## toc <label>1.1.0+</label>

- 类型：`content | menu | false | hidden`
- 默认：`content`

文档目录（TOC）的展示方式。

- `content`：显示在内容区域右侧
- `menu`：显示在左侧菜单中
- `false` / `hidden`：不显示目录

## footer <label>1.1.0+</label>

- 类型：`string`
- 默认：`null`

站点页脚内容，支持 HTML，例如：`Open-source MIT Licensed | Copyright © 2020-present Powered by PingCode`。

## defaultLocale

- 类型：`string`
- 默认：`en-us`

默认语言 locale，例如 `zh-cn`、`en-us`。

## locales

- 类型：`Array<{key: string, name: string}>`
- 默认：`[]`

站点支持的语言列表。若不需要多语言，可留空，此时仅生成 `defaultLocale` 对应的内容。

## navs

- 类型：`Array<NavigationItem>`
- 默认：`[]`

用于自定义顶部导航栏与菜单，通常配置外部链接或组件库的一级导航，例如：

```ts
module.exports = {
    ...
    navs: [
        null,
        {
            title: 'GitHub',
            path: 'https://github.com/docgeni/docgeni',
            isExternal: true
        },
        {
            title: '组件',
            path: 'components',
            lib: 'alib'
        },
    ],
    ...
}
```

> `docs` 目录下自动生成的一级导航默认追加到 `navs` 数组末尾。如需调整顺序，可在数组中插入 `null` 占位。如上例所示，自动生成的导航会出现在 GitHub 链接之前。

## libs

- 类型：`Array<DocgeniLibrary>`
- 默认：`[]`

组件库配置，各字段说明见 [configuration/lib](configuration/lib)。

```ts
module.exports = {
    ...
    libs: [
        {
            name: 'alib',
            rootDir: './packages/a-lib',
            categories: [
                {
                    id: 'general',
                    title: '通用',
                    locales: {
                        'en-us': {
                            title: 'General'
                        }
                    }
                }
            ]
        }
    ],
    ...
}
```

## sitemap <label>2.0+</label>

- 类型：`{ host?: string }`
- 默认：`null`

启用后，构建时会自动生成 `sitemap.xml`。`host` 用于指定生成链接的域名前缀。

## algolia <label>2.0+</label>

- 类型：`DocgeniAlgoliaConfig`
- 默认：`null`

配置 Algolia [DocSearch](https://docsearch.algolia.com) 搜索服务，需填写 `apiKey` 与 `indexName`。

```js
{
  algolia: {
    apiKey: 'Your api key',  // 申请 DocSearch 通过后，邮件中会提供站点专属 Key
    indexName: 'docgeni',    // 索引名称
  }
}
```

若网站不符合 DocSearch [免费申请条件](https://docsearch.algolia.com/docs/who-can-apply/)，可自行 [部署爬虫](https://docsearch.algolia.com/docs/legacy/run-your-own/) 抓取站点内容并上传至 Algolia，此时还需提供 `appId`。

```js
{
  algolia: {
    appId: 'Your app id',
    apiKey: 'Your api key',
    indexName: 'docgeni',
  }
}
```
