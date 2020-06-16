---
title: 导航菜单的生成
order: 20
---

## 频道的生成
`Docgeni`中的频道有两种形式存在：
- `navs`配置树中的一级数据
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

## 页面导航的自动生成

`Docgeni`默认会根据配置的`docsPath`目录下自定查找 Markdown 文档文件，每一个 Markdown 文件会生成一个`DocItem`，文件夹会自动生成一个`Category`。

如下的目录结构：
```
docs
├── configuration
│   ├── index.md
│   └── lib.md
├── guide
│   ├── index.md
│   ├── writing.md
│   ├── intro
│   │   ├── getting-started.md
│   │   └── motivation.md
└── index.md
```

- `Docgeni`会生成`Guide`和`Configuration`两个`Channel`
- `Guide` 下会有 `index.md` 和 `writing.md` 两个文档和一个`Category` 
- `intro` 下会有2个文档，分别为 `getting-started.md` 和 `motivation.md`

## 页面的名称
页面名称的默认生成规则如下：
- `Channel` 和 `Category` 取目录的名称，并转换成标题，如：`Guide`、`Intro`
- `DocItem` 取文件名，去除.md后缀，并转换成标题，如：`Getting Started`、`Motivation`

手动控制页面名称，可以使用名为`title`的`FrontMatter`进行配置。

```markdown
---
title: 快速开始
---
```

## 路由的生成
页面路由的默认生成规则如下：
- `Channel`会以文件夹的名称作为路由
- `DocItem`取文件名，去除.md后缀作为路由

可以使用名为`path`的`FrontMatter`进行配置。
```markdown
---
path: getting-stared
---
```

## 页面的排序
默认以文件夹和文件的文件名作为排序规则。

可以使用名为`order`的`FrontMatter`进行配置，按照数字大小升序。
```markdown
---
order: 10
---
```

## 频道和分类的自定义配置
`Channel`和`Category`都是以文件夹的形式存在，如何对频道和分类的`title`、`path`、`order`等进行自定义配置，`Docgeni`会默认把文件夹下`index.md`文件的`FrontMatter`当作频道和分类的自定义配置信息。

如果`index.md`下除了`FrontMatter`配置外还有内容，那么同时也会在频道和分类下生成一个页面，页面的`FrontMatter`和频道和分类相同，如果想要单独设置不同的配置，请重新创建一个`.md`页面文件。
