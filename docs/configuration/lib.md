---
title: 类库配置
path: 'lib'
order: 20
toc: menu
---

`libs` 用于配置组件类库的扫描路径、文档结构、API 生成方式与分类信息。每个类库对应 `libs` 数组中的一项。

## name

- 类型：`string`
- 默认：`null`

组件库名称，需与 [全局配置 navs](/configuration/global#navs) 中的 `lib` 字段对应。

## abbrName

- 类型：`string`
- 默认：`{name}`

组件库名称缩写。Angular 组件库通常有固定前缀，例如 [Material](https://material.angular.io/components) 为 `mat`，[NG-ZORRO](https://ng.ant.design/components/overview/zh) 为 `nz`。

假设类库缩写为 `thy`，模块与组件通常使用该前缀，如 `ThyButtonModule`、`thyButton`。Docgeni 会据此自动生成组件标识与示例代码：

```html
<thy-button></thy-button>
<example name="thy-button-basic-example" />
```

## rootDir

- 类型：`string`
- 默认：`null`

组件类库根目录，需确保该目录下存在 `package.json`。Docgeni 会扫描此目录下的一级文件夹作为组件，并自动查找各组件下的文档、API 与示例。默认目录分别为 `doc`、`api`、`examples`。

## include

- 类型：`string | Array<string>`
- 默认：`[]`

Docgeni 默认只扫描 `rootDir` 下的一级文件夹。若组件位于更深层目录，可通过 `include` 指定额外扫描路径。

例如配置 `include: 'common'` 时，Docgeni 会扫描 `common` 下的一级文件夹，并按组件规则匹配文档、API 与示例。

> 建议将组件直接放在 `rootDir` 下。若使用 Angular CLI 默认的 `src/lib` 结构，可配置 `include: ['src', 'src/lib']`，并保持 `rootDir` 与 `package.json` 同级。

## exclude

- 类型：`string | Array<string>`
- 默认：`[]`

Docgeni 默认将 `rootDir` 下所有文件夹视为组件目录。若某些文件夹不是组件，可通过 `exclude` 排除，支持 `glob` 语法。

## tsConfig

- 类型：`string`
- 默认：`tsconfig.lib.json`

TypeScript 配置文件名。NgDoc 生成 API 文档时会根据 `rootDir` 与 `tsConfig` 组合出 `tsConfigPath`。

## labels <label>1.1.0+</label>

- 类型：`{[id: string]: { text: string; color: string }} | Array<LabelDef>`
- 默认：`[{ id: 'new', ... }, { id: 'deprecated', ... }, { id: 'experimental', ... }]`

类库标签配置。默认支持 `new`、`deprecated`、`experimental`，可通过配置覆写或扩展，并在组件 Front Matter 的 `label` 字段中引用对应 `id`。默认标签如下：

```json
{
  "new": { "text": "New", "color": "#73D897" },
  "deprecated": { "text": "Deprecated", "color": "#AAAAAA" },
  "experimental": { "text": "Experimental", "color": "#F6C659" }
}
```

## docDir

- 类型：`string`
- 默认：`doc`

组件文档目录。Docgeni 会根据 `locales` 查找 `{localeKey}.md` 文件，并展示在组件概览中。

```
├── doc
│   ├── zh-cn.md
│   ├── en-us.md
```

## apiDir

- 类型：`string`
- 默认：`api`

组件 API 目录。Docgeni 会根据 `locales` 查找 `{localeKey}.后缀名` 文件，支持 `.json`、`.yaml`、`.yml`、`.js`、`.config.js` 五种后缀。以下以 `js` 为例：

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

如需自动生成 API，请配置 [apiMode](/configuration/lib#apimode)。

## examplesDir

- 类型：`string`
- 默认：`examples`

组件示例根目录。Docgeni 会将该目录下每个一级文件夹视为一个示例。

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

组件分类配置。Docgeni 会在左侧菜单中将相同类别的组件分组展示。每项包含 `id`、`title` 和 `locales`：

- `id`：类别唯一标识，与组件 Front Matter 中的 `category` 对应
- `title`：类别标题
- `locales`：多语言标题

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

## apiMode <label>2.0+</label>

- 类型：`'compatible' | 'manual' | 'automatic'`
- 默认：`manual`

组件 API 生成模式：

- `manual`：手动模式，通过配置文件定义 API，为默认模式
- `automatic`：自动模式，通过组件注释自动生成 API
- `compatible`：兼容模式，若存在 [API 定义文件](/configuration/lib#apidir) 则优先使用配置，否则通过注释自动生成
