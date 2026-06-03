---
title: Library Configuration
path: 'lib'
order: 20
toc: menu
---

The `libs` option configures how Docgeni scans a component library, organizes documentation, generates API docs, and groups components. Each entry in the `libs` array represents one library.

## name

- Type: `string`
- Default: `null`

The library name. It should match the `lib` field in [global navs configuration](/configuration/global#navs).

## abbrName

- Type: `string`
- Default: `{name}`

The library abbreviation prefix. Angular libraries commonly use a short prefix, such as `mat` for [Material](https://material.angular.io/components) and `nz` for [NG-ZORRO](https://ng.ant.design/components/overview/en).

If the abbreviation is `thy`, modules and components typically use that prefix, for example `ThyButtonModule` and `thyButton`. Docgeni uses it to generate component identifiers and example code:

```html
<thy-button></thy-button>
<example name="thy-button-basic-example" />
```

## rootDir

- Type: `string`
- Default: `null`

The library root directory. It must contain `package.json`. Docgeni scans first-level folders under this directory as components and looks for documentation, API definitions, and examples in each one. The default folders are `doc`, `api`, and `examples`.

## include

- Type: `string | Array<string>`
- Default: `[]`

By default, Docgeni only scans first-level folders under `rootDir`. Use `include` to scan additional nested paths when components are not placed directly under `rootDir`.

For example, with `include: 'common'`, Docgeni scans first-level folders under `common` and matches documentation, API files, and examples using the same component rules.

> We recommend placing components directly under `rootDir`. If you use Angular CLI's default `src/lib` structure, configure `include: ['src', 'src/lib']` and keep `rootDir` at the same level as `package.json`.

## exclude

- Type: `string | Array<string>`
- Default: `[]`

By default, every folder under `rootDir` is treated as a component directory. Use `exclude` to skip non-component folders. Glob syntax is supported.

## tsConfig

- Type: `string`
- Default: `tsconfig.lib.json`

The TypeScript config file name. When NgDoc generates API docs, it combines `rootDir` and `tsConfig` into `tsConfigPath`.

## labels <label>1.1.0+</label>

- Type: `{[id: string]: { text: string; color: string }} | Array<LabelDef>`
- Default: `[{ id: 'new', ... }, { id: 'deprecated', ... }, { id: 'experimental', ... }]`

Library label configuration. Built-in labels include `new`, `deprecated`, and `experimental`. You can override or extend them and reference the corresponding `id` in a component's Front Matter `label` field. Default labels:

```json
{
  "new": { "text": "New", "color": "#73D897" },
  "deprecated": { "text": "Deprecated", "color": "#AAAAAA" },
  "experimental": { "text": "Experimental", "color": "#F6C659" }
}
```

## docDir

- Type: `string`
- Default: `doc`

The component documentation directory. Docgeni looks for `{localeKey}.md` files based on `locales` and displays them in the component overview.

```
├── doc
│   ├── zh-cn.md
│   ├── en-us.md
```

## apiDir

- Type: `string`
- Default: `api`

The component API directory. Docgeni looks for `{localeKey}.suffix` files based on `locales`. Supported suffixes are `.json`, `.yaml`, `.yml`, `.js`, and `.config.js`. Example using `js`:

```js
module.exports = [
  {
    type: 'directive',
    name: 'alibButton',
    description: 'Button component, supports both alibButton directive and alib-button component forms', // Optional
    properties: [
        {
            name: 'alibType',
            type: 'string',
            default: 'primary',
            description: 'Button type, supports primary | info | warning | danger'
        },
        {
            name: 'alibSize',
            type: 'string',
            default: 'null',
            description: 'Button size, supports sm | md | lg'
        }
    ]
  }
];

```

To generate API docs automatically, configure [apiMode](/configuration/lib#apimode).

## examplesDir

- Type: `string`
- Default: `examples`

The root directory for component examples. Each first-level folder under this directory is treated as one example.

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

- Type: `Array<Category>`
- Default: `null`

Component category configuration. Docgeni groups components with the same category in the left menu. Each category includes `id`, `title`, and `locales`:

- `id`: unique category identifier, referenced by the component Front Matter `category` field
- `title`: category title
- `locales`: localized titles

```json
[
    {
        "name": "alib",
        "rootDir": "./packages/a-lib",
        "categories": [
            {
                "id": "general",
                "title": "General",
                "locales": {
                    "en-us": {
                        "title": "General"
                    }
                }
            },
            {
                "id": "layout",
                "title": "Layout",
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

- Type: `'compatible' | 'manual' | 'automatic'`
- Default: `manual`

API generation mode for components:

- `manual`: define API docs manually in configuration files; this is the default
- `automatic`: generate API docs automatically from source comments
- `compatible`: use [API definition files](/configuration/lib#apidir) when present, otherwise fall back to comment-based generation
