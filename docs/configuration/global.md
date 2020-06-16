---
title: 全局配置
path: 'global'
order: 30
---

## mode

- 类型：`lite`｜`full`
- 默认：`lite`

用于设定文档的展现模式，默认为简易模式（左侧菜单 + 右侧内容），`full` 为站点模式，包含：首页 + 头部导航 + 左侧菜单 + 右侧内容。

## title

- 类型：`string`
- 默认：`package.name`

文档的标题，通常是所开发的组件库名。

## logoUrl
- 类型：`string`
- 默认：Docgeni 的 Logo

文档 Logo 地址。

## repoUrl
- 类型：`string`
- 默认：`null`

GitHub 仓储地址。

## docsPath
- 类型：`string`
- 默认：`docs`

Markdown 文档目录地址，Docgeni 会在配置的目录中递归寻找 markdown 文件，生成菜单和文档内容。

## siteProjectName
- 类型：`string`
- 默认：`null`

Angular 自定义站点的项目名称，组件库开发除了默认的文档和示例展示功能外，可能还需要做一些自定义的功能，那么可以在仓储中新建一个 site 项目，然后配置此项目的名字，Docgeni 会把生成的文档和示例拷贝到该项目下。

## defaultLocale
- 类型：`string`
- 默认：`zh-cn`

默认多语言。

## locales
- 类型：`Array<{key: string, name: string}>`
- 默认：`[ { key: 'zh-cn', name: '中文' }, { key: 'en-us', name: 'English' } ]`

支持的多语言。

## navs
- 类型：`Array<NavigationItem>`
- 默认：`自动生成导航`

该配置项用于自定义导航栏和菜单的展示，一般会配置一些外部的链接和类库，如：
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

## libs
- 类型：`Array<Library>`
- 默认：`null`

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
