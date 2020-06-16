---
title: 概念
order: 10
---

## 概念

`Docgeni` 中，不管是头部导航，左侧菜单，还是具体的文档，统一叫 `NavigationItem`, 存储在一个树形结构中。那么为了更好的理解，我们把这些对象稍微做了一些区分。

- `Channel`: 频道，一级导航，如果是 `full` 模式其实就是在头部导航栏，每个频道都会有个独立的路由
- `Category`: 类别，属于一个 `Channel`，没有内容和路由，在菜单中仅仅会展示成一个分组
- `DocItem`: 文档，一般属于某个 `Channel` 或者 `Category`
- `ComponentDocItem`: 组件的文档，和 `DocItem` 类似，但是展示的属性不同

如下示例中，`guides`是一个`Channel`，`intro`是一个`Category`，`getting-started`，是一个`DocItem`。
```json
...
{
  "id": "guides",
  "path": "guides",
  "title": "指南",
  "subtitle": "",
  "items": [
    {
      "id": "intro",
      "path": "intro",
      "title": "介绍",
      "subtitle": "",
      "items": [
        {
          "id": "getting-started",
          "path": "",
          "title": "快速开始",
          "subtitle": "",
          "contentPath": "/docs/guides/intro/getting-started.html"
        },
        ...
      ]
    },
    ...
  ]
}
```


