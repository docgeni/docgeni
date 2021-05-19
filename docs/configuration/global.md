---
title: 全局配置
path: 'global'
order: 30
---

## mode

- 类型：`lite`｜`full`
- 默认：`lite`

用于设定文档的展现模式，默认为简易模式（左侧菜单 + 右侧内容），`full` 为站点模式，包含：首页 + 头部导航 + 左侧菜单 + 右侧内容。

## theme

- 类型：`default`｜`angular`
- 默认：`default`

主题设置：
- `default`: 默认主题，导航背景色为白色
- `angular`：`Angular`官网风格，默认导航背景色为: <code style="color: #3f51b5">#3f51b5</code>，可以修改 SCSS 颜色变量修改


## title

- 类型：`string`
- 默认：`package.name`

文档的标题，通常为类库名，比如`Docgeni`。

## logoUrl
- 类型：`string`
- 默认：Docgeni 的 Logo Url

类库 Logo 地址。

## repoUrl
- 类型：`string`
- 默认：`null`

类库 GitHub 仓储地址。

## docsDir
- 类型：`string`
- 默认：`docs`

Markdown 文档目录地址，Docgeni 会扫描该目录下的文件夹和 Markdown 文件，按照一定的规则生成频道、菜单和页面文档。

## siteDir
- 类型：`string`
- 默认：`.docgeni/site`

自动生成的站点目录，Docgeni 会把生成的组件示例和文档拷贝到该站点下，当`siteProjectName`设置后以自定义站点的所在目录，此配置无效。

## outputDir
- 类型：`string`
- 默认：`dist/docgeni-site`

站点构建输出目录，当`siteProjectName`设置后以自定义站点的输出目录为主，此配置无效。

## publicDir
- 类型：`string`
- 默认：`.docgeni/public`

文档站点的配置目录，Docgeni会把该文件夹下的`index.html`、`favicon.ico`、`styles.scss`、`assets`、`.browserslistrc`和`tsconfig.json`文件拷贝并覆盖站点目录实现自定义配置功能，更多配置参考 [自定义站点](/guides/advance/customize)

## siteProjectName
- 类型：`string`
- 默认：`null`

Angular 自定义站点的项目名称，组件库开发除了默认的文档和示例展示功能外，可能还需要做一些自定义的功能，那么可以在仓储中新建一个 site 项目，然后配置此项目的名字，Docgeni 会把生成的文档和示例拷贝到该项目下，自定义站点的更多配置参考 [自定义站点](/guides/advance/customize)

## defaultLocale
- 类型：`string`
- 默认：`en-us`

默认多语言。

## locales
- 类型：`Array<{key: string, name: string}>`
- 默认：`[]`

支持的多语言，如果不需要支持多种语言，无序配置，会只生成 `defaultLocale` 的语言。

## navs
- 类型：`Array<NavigationItem>`
- 默认：`[]`

该配置项用于自定义导航栏和菜单的展示，一般会配置一些外部的链接和类库频道，如：
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
> 这里需要注意的是，`docs`文件夹下自动识别的频道会默认插入到配置的`navs`数组的底部，如果想要控制展示的位置，可以插入一个`null`进行占位，如上示例，自动生成的频道会插入到导航的顶部。

## libs
- 类型：`Array<DocgeniLibrary>`
- 默认：`[]`

组件类库配置，每个类库的配置查看 [configuration/lib](configuration/lib)

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
