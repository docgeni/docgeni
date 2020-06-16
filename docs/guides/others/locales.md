---
title: 多语言
order: 10
---

## 配置多语言

目前支持的多语言和默认语言通过`locales`和`defaultLocale`字段配置。
```
{
  locales: [ { key: 'en-us', name: 'English'}, { key: 'zh-cn', name: '中文'} ],
  defaultLocale: 'zh-cn'
}
```

## 文档的多语言

`docs`目录下的所有页面都是默认多语言下的页面，如果需要添加其他语言的文档，需要单独创建一个以多语言key为名称的文件夹，比如下面的`en-us`文件夹下的内容会自动生成为英文的文档，包括频道，分类和页面。
```
├── en-us
│   ├── guides
│   │   ├── index.md
│   │   └── intro
│   │       ├── getting-started.md
│   │       ├── index.md
│   │       └── motivation.md
│   └── index.md
```

## 配置项的多语言

所有配置项字段都是默认多语言，配置其他的语言需要在`locales`下新增一个以多语言key为name的属性，配置相关多语言的字段，比如：
```
```ts
module.exports = {
    ...
    navs: [
        null,
         {
            title: '组件',
            path: 'components',
            lib: 'alib',
            locales: {
              'en-us': {
                title: 'Components'
              }
            }
        }
        ...
    ],
    ...
}
```

## 组件的多语言

组件的文档存储在`doc`目录，以多语言key命名。
```
button
├── doc
│   ├── zh-cn.md
│   ├── en-us.md
```