---
title: 类库导航的生成
order: 30
---

## 类库频道
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

## 类库配置
`Docgeni`中可以同时支持多个类库文档，比如Angular官方的[Material](https://material.angular.io/)其实就是包含 `CDK` 和`Components`两个类库的，所以多余类库的配置存放在`libs`数组中。

`Docgeni`会自动扫描该类库的`rootDir`，每个文件夹当作一个组件，每个组件会生成一个组件文档，具体的配置可以查看类库配置

```json
...
{
    name: 'alib',
    rootDir: './packages/a-lib'
    ...
}
```

## 组件的分类
对于组件库来说，如果有很多组件，需要一个分类把这些组件区分开，对于普通文档来说，我们通过文件夹区分分类，但是对于组件库来说按照文件夹区分不是一个好的选择，所以`Docgeni`提供了配置的方式配置分类，每个分类会设置一个唯一的 id 作为分类的 key，在对应的组件文档中通过设置名为category的FrontMatter配置上分类的id即可。

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