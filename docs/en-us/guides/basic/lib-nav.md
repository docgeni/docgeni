---
title: Libraries Navigation & Menu
order: 30
---

组件文档的展现形式如下，包含概览、示例和API，同时左侧菜单展示所属类别，在`full`模式下属于某个频道。

![Lib Component](https://cdn.pingcode.com/open-sources/docgeni/lib-component.png)

# 类库导航
类库通常就是`Angular`的组件库，`Docgeni`会把组件的文档和普通的页面文档严格区分开，展示形式也会有很大的不同。
对于类库文档来说，所属频道必须要手动通过 `navs` 配置：

```ts
module.exports = {
    ...
    navs: [
        null,
         {
            title: '组件',
            path: 'components',
            lib: 'alib'
        }
    ],
    libs: [ 
      {
        name: 'alib',
        ....
      } 
    ]
    ...
}
```

# 类库配置
`Docgeni` 可以同时支持多个类库，比如 Angular 官方的[Material](https://material.angular.io/)其实就是包含 `CDK` 和`Components`两个类库的，所以多类库的配置存放在`libs`数组中。

`Docgeni`会自动扫描该类库的`rootDir`，根目录下的每个文件夹识别成一个组件模块，每个组件会生成一个组件文档，更多配置查看[类库配置](http://docgeni.org/configuration/lib)

```json
...
{
    name: 'alib',
    rootDir: './packages/a-lib'
    ...
}
```

# 组件的类别
对于组件库来说，如果有很多组件，需要一个类别把这些组件区分开，每个类别展示成一个菜单，普通页面文档来说是通过文件夹区分类别，对于组件库来说按照文件夹区分不是一个好的选择，所以`Docgeni`提供了自定义配置的方式配置类别，每个类别会设置一个唯一的 id 作为类别的 key，在对应的组件文档中通过设置名为`category`的`FrontMatter`配置上类别的id即可。

```json
...
{
    name: 'alib',
    rootDir: './packages/a-lib',
    categories: [
      {
        id: 'general',
        title: '通用'
      },
      {
        id: 'layout',
        title: '布局'
      }
  ]
}
```
