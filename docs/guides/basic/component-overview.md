---
title: 组件概览
path: 'component-overview'
order: 40
---


`Docgeni`会动态识别每个类库下的一级子文件夹，每个子文件夹相当于一个组件，每个组件包含对应的文档、API和示例，如需配置某个多级文件夹，请查看 [include](https://docgeni.org/configuration/lib#include) 配置项。
组件的文件夹结构如下：
```
├── button
│   ├── button.component.ts
│   ├── button.module.ts
│   ├── doc
│   │   ├── en-us.md
│   │   └── zh-cn.md
│   ├── api
│   │   ├── en-us.js
│   │   └── zh-cn.js
│   ├── examples
│   │   ├── advance
│   │   │   ├── advance.component.html
│   │   │   ├── advance.component.scss
│   │   │   └── advance.component.ts
│   │   ├── basic
│   │   │   ├── basic.component.html
│   │   │   ├── basic.component.scss
│   │   │   ├── basic.component.ts
│   │   │   └── index.md
│   │   └── module.ts
│   ├── index.ts
```

# 概览文档

默认`doc`文件夹下存放每个多语言对应的组件文档，会展示在组件的概览中。如需配置，请查看 [docDir](https://docgeni.org/configuration/lib#docDir) 配置项。

# 组件配置项
组件自定义配置项是存放在默认语言文档的`FrontMatter`中。

```markdown
---
category: general
title: Button
subtitle: 按钮
name: 'a-button'
order: 1
---
```

- `category`: 当前组件模块的所属类别，需要设置对应lib配置的`categories`中的id属性
- `title`: 当前组件模块的标题
- `subtitle`: 当前组件模块的子标题
- `name`: 当前组件模块的名称，默认取文件夹的名称，示例模块以及示例组件的命名规则会使用`name`作为拼接，只有文件夹名称代表不了组件的含义时才会配置
- `order`: 组件模块的排序
