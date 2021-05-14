---
title: Route Navigation & Menu
order: 20
---

# 基本概念

`Docgeni` 中，不管是头部的导航，左侧的菜单，还是具体某个页面文档，统一叫 `NavigationItem`, 存储在一个树形结构中，那么为了更好的理解，我们把这些对象稍微做了一些区分。

- `Channel`: 频道，一级导航，`full`模式下的头部导航栏，每个频道都会有个独立的路由
- `Category`: 类别，在左侧菜单中会展示成一个分组，没有内容
- `DocItem`: 普通页面文档，属于某个 `Channel` 或者 `Category`，有独立的路由和内容
- `ComponentDocItem`: 组件文档，和 `DocItem` 类似，但是展示的形态和属性不同

如下示例中，`guides`是一个频道`Channel`，`intro`是一个类别`Category`，`getting-started`是一个普通页面文档`DocItem`。

```json
...
{
  "id": "guides",
  "path": "guides",
  "channel_path": "guides",
  "title": "指南",
  "items": [
    {
      "id": "intro",
      "path": "guides/intro",
      "channel_path": "guides",
      "title": "介绍",
      "items": [
        {
          "id": "getting-started",
          "path": "guides/getting-started",
          "channel_path": "guides/intro",
          "title": "快速开始",
          "contentPath": "/docs/guides/intro/getting-started.html"
        },
        ...
      ]
    },
    ...
  ]
}
```

# 约定路由和菜单
`Docgeni`会自动根据`docs`目录结构和 FrontMatter 生成对应的文档导航、菜单和路由。
- `full`模式下一级目录生成频道，也就是头部导航
- `full`模式下非一级目录以及`lite`模式下的所有目录生成类别，也就是左侧菜单的分组，无路由
- 所有`.md`文件生成一个普通页面文档

## 默认路由生成规则
- 频道取文件夹的命名，并转换成 Param Case 命名，如：`GettingStarted` => `getting-started`
- 页面文档取文件名，去除`.md`后缀，并转换成 Param Case 命名，同时会加上所属频道和类别的路由，如：`GettingStarted.md` => `/guides/intro/getting-started`

## 默认标题生成规则
- 频道和类别取目录的名称，并转换成标题，如：`Guide`、`Intro`
- 页面文档取文件名，去除`.md`后缀，并转换成标题，如：`Getting Started`、`Motivation`

## 文件路径示例
如下文件路径对应两种模式下生成的导航、类别和页面如下:

文件路径| full 模式 | lite 模式 
---| --- | --- 
/docs/index.md| - 频道: 无 <br > - 类别: 无 <br > - 页面路由: / | - 频道: 无 <br > - 类别: 无 <br > - 页面路由: /
/docs/getting-started.md| - 频道: 无 <br > - 类别: 无 <br > - 页面路由: /getting-started | - 频道: 无 <br > - 类别: 无 <br > - 页面路由: /getting-started
/docs/guide/index.md| - 频道: guide <br > - 类别: 无 <br > - 页面路由: /guide | - 频道: 无 <br > - 类别: guide <br > - 页面路由: /guide
/docs/guide/hello.md| - 频道: guide <br > - 类别: 无 <br > - 页面路由: /guide/hello | - 频道: 无 <br > - 类别: guide <br > - 页面路由: /guide/hello
/docs/guide/basic/hello.md| - 频道: guide <br > - 类别: basic <br > - 页面路由: /guide/basic/hello | - 频道: 无 <br > - 类别: basic <br > - 页面路由: /guide/basic/hello


# 自定义配置
对于普通页面文档，想要自定义路由，设置标题，可以使用名为`path`和`title`的`FrontMatter`进行配置。
```markdown
---
path: getting-stared
title: 快速开始
---
```

对于频道和类别来说，配置信息存储在当前文件夹下的`index.md`，通过修改该文件的`FrontMatter`进行自定义配置，如果`index.md`也有内容，则会生成一个标题和所属频道或者类别相同的页面，如果想要单独设置不同的配置，请重新创建一个非`index.md`页面文件。

# 频道的生成
`Docgeni`中的频道只有在`full`模式下才会存在，有两种形式存在：
- 配置文件`navs`数组中的一级数据
- `docs`文件夹下自动识别的一级文件夹

这里需要注意的是，`docs`文件夹下自动识别的频道会默认插入到配置的`navs`数组的底部，如果想要控制展示的位置，可以插入一个`null`进行占位，如下面的示例，自动生成的频道会插入到导航的顶部。
```ts
module.exports = {
    ...
    navs: [
        null,
         {
            title: '组件',
            path: 'components',
            lib: 'alib'
        },
        {
            title: 'GitHub',
            path: 'https://github.com/docgeni/docgeni',
            isExternal: true
        }
    ],
    ...
}
```

# 频道、类别和页面的排序
默认以文件夹和文件的文件名作为排序规则。

可以使用名为`order`的`FrontMatter`进行配置，按照数字大小升序。
```markdown
---
order: 10
---
```


