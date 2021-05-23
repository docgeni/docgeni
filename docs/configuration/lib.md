---
title: 类库配置
path: 'lib'
order: 30
---

## name

- 类型：`string`
- 默认：`null`

组件库的名称。

## abbrName

- 类型：`string`
- 默认：`{name}`

组件库的名称缩写，Angular 组件库一般都会有一个缩写，比如 [Material](https://material.angular.io/components) 组件库简写叫 `mat`，[NG-ZORRO](https://ng.ant.design/components/overview/zh) 组件库的简写叫`nz`，假设我们类库的简写为`thy`, 一般模块和组件都会使用此前缀，如：`ThyButtonModule`，`thyButton`，那么 Docgeni 会根据此缩写自动生成组件唯一标识和示例代码。

```html
<thy-button></thy-button>
<example name="thy-button-basic-example" />
```

## rootDir

- 类型：`string`
- 默认：`null`

组件类库的根路径，确保类库的`package.json`在此目录，`Docgeni` 会扫描此配置的下的文件夹，所有一级文件夹当作一个组件，自动查找组件下的文档、API和示例，默认文档、API、示例存放的目录为 `doc`, `api`和`examples`

## include

- 类型：`string | Array<string>`
- 默认：`[]`

`Docgeni` 默认只会扫描 `rootDir` 下的一级文件夹当作组件，如果你的组件库比较特殊，某个深层的文件夹也需要生成组件文档，可以通过 include 单独配置。

如配置：`include: 'common'`, `Docgeni` 会查找 common 文件夹下的所有一级文件夹，按照组件的规则匹配文档、API和示例。

> 我们建议组件库`rootDir`文件夹直接存放组件即可，但是 Angular CLI 生成的类库项目会带有`src/lib`目录结构，如果希望采用此目录结构，需要配置 `include: ['src', 'src/lib']`，`rootDir`保持和`package.json`同级。

## exclude

- 类型：`string | Array<string>`
- 默认：`[]`

`Docgeni` 默认会把 `rootDir` 下所有的文件夹当作组件进行扫描，如果某些文件夹不是组件，可以手动设置排除，支持 `glob` 格式。

## docDir

- 类型：`string`
- 默认：`doc`

组件的文档目录，`Docgeni` 会根据配置的`locales`查找`{localeKey}.md`文件，当作组件的文档，会展示在组件的概览中。
```
├── doc
│   ├── zh-cn.md
│   ├── en-us.md
```

## apiDir

- 类型：`string`
- 默认：`api`

组件的API目录，`Docgeni`会根据配置的`locales`查找`{localeKey}.后缀名`文件，目前支持 `.json`、`.yaml`、`.yml`、`.js`、`.config.js` 五种后缀，`json`、`yaml`、`js`三种格式，以下以`js`举例：

```js
module.exports = [
  {
    type: 'directive',
    name: 'alibButton',
    description: '按钮组件，支持 alibButton 指令和 alib-button 组件两种形式', // Optional
    properties: [
        {
            name: 'alibType',
            type: 'string',
            default: 'primary',
            description: '按钮的类型，支持 primary | info | warning | danger' 
        },
        {
            name: 'alibSize',
            type: 'string',
            default: 'null', 
            description: '按钮的大小，支持 sm | md | lg'
        }
    ]
  }
];

```

## examplesDir

- 类型：`string`
- 默认：`examples`

组件示例根目录，`Docgeni` 会把该目录下的每一个一级文件夹当作一个示例。

```
├── examples
│   ├── basic
│   │   ├── basic.component.html
│   │   ├── basic.component.scss
│   │   └── basic.component.ts
│   ├── advance
│   │   ├── advance.component.html
│   │   ├── advance.component.scss
│   │   └── advance.component.ts
```

## categories

- 类型：`Array<Category>`
- 默认：`null`

组件类别，`Docgeni`会在左侧菜单中把相同类别的组件放在一起，便于统一管理和查看。
包含 `id`、`title`和`locales`属性，`id`为当前类别的唯一标识，组件概览文档中会使用名为`category`的 FrontMatter 进行配置，`title` 为类别的标题。
```json
[
    {
        "name": "alib",
        "rootDir": "./packages/a-lib",
        "categories": [
            {
                "id": "general",
                "title": "通用",
                "locales": {
                    "en-us": {
                        "title": "General"
                    }
                }
            },
            {
                "id": "layout",
                "title": "布局",
                "locales": {
                    "en-us": {
                        "title": "Layout"
                    }
                }
            }
        ]
    }
]
```
