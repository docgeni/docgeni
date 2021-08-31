---
title: Overview & API & Examples
path: 'component'
order: 40
---


`Docgeni` will dynamically identify the first-level subfolders under the root directory (`rootDir`) of each library. Each first-level subfolder is equivalent to a component, and each component contains corresponding documents, APIs and examples. Please check the [include](configuration/lib#include) configuration item to configure a multi-level folder.
The folder structure of the component is as follows:
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

# Overview document

The component documents corresponding to each multi-language are stored in the default `doc` folder, which will be displayed in the component overview. Please check the [docDir](configuration/lib#docDir) configuration item to configure a different directory.

## Component configuration item

```markdown
---
category: general
title: Button
subtitle: Button
name: 'a-button'
order: 1
---
```

- `category`: The category of the current component module needs to be set to the id property in the `categories` of the corresponding lib configuration
- `title`: The title of the current component module
- `subtitle`: The subtitle of the current component module
- `name`: The name of the current component module, which is the name of the folder by default. The naming rules of the example module and the example component will use `name` as the splicing, and it will be configured only when the folder name does not represent the meaning of the component
- `order`: Ordering of components

`category` and `order` are global configuration, which do not follow multiple languages. The global configuration items are stored in the `FrontMatter` of the default language document.

# Component example
Docgeni will scan all subfolders under the examples folder by default. Each subfolder is equivalent to a type of example. Docgeni will identify the example components according to the conventional naming. Please check the [examplesDir](configuration/lib#examplesDir) configuration item to configure the directory.

The file structure is as follows:
```
├── button
│   ├── examples
│   │   ├── basic
│   │   │   ├── basic.component.html
│   │   │   ├── basic.component.scss
│   │   │   └── basic.component.ts
│   │   ├── advance
│   │   │   ├── advance.component.html
│   │   │   ├── advance.component.scss
│   │   │   └── advance.component.ts
│   │   └── module.ts
```

- `module.ts` is the entry module for all examples of the current component, and the naming rules follow the `library abbreviation + component name + ExamplesModule`, such as: `AlibButtonExamplesModule`
- The example name is the name of the folder by default, and multiple words are separated by -. The example entry component file naming rule is `example name.component.ts`, such as: `basic.component.ts`
- The naming rule of the corresponding component by default is `library abbreviation + component name + example name + ExampleComponent`, such as: `AlibButtonBasicExampleComponent`

## Import configuration
When Docgeni runs, it will copy all the example files under `examples` to the site to start. In the component examples, relative paths cannot be used to import component modules. It is recommended to import directly through the package path. At the same time, you need to configure paths in tsconfig.json to point to the source code path of the library, so that you can directly copy the example code to use. For example, the component library is called `alib`, and the components are configured and imported in the following way:
```ts
// button/examples/module.ts
import { AlibButtonModule } from 'alib/button';

@NgModule({
    declarations: [AlibButtonBasicExampleComponent],
    imports: [CommonModule, AlibButtonModule, FormsModule],
    entryComponents: [],
    exports: [AlibButtonBasicExampleComponent],
    providers: []
})
export class AlibButtonExamplesModule {}
```

```json
// tsconfig.json
 {
   "paths": {
      "alib": [
        "packages/alib/public-api.ts"
      ],
      "alib/*": [
        "packages/alib/*"
      ]
 }
```

## Use examples in the documentation
`Docgeni` generates a unique Key for each example, the naming rule is: `library abbreviation-component name-example name-example`, such as: `alib-button-basic-example`

You can introduce an example in Markdown according to the following code in both a common page document and a component overview document, and `name` is the unique identifier of the example.

```html
<example name="alib-button-basic-example" />
```
Running result:
<example name="alib-button-basic-example" />

The default example is wrapped in an example container, and you can view the source code of the example. If you need to remove the wrapped container, you can introduce the example through the `inline` mode:

```html
<example name="alib-button-basic-example" inline />
```
Running result:
<example name="alib-button-basic-example" inline />

## Example configuration

There may be many examples under a certain component. Each example has fields such as title and sort. If you need to customize the configuration, you need to create an `index.md` file in the corresponding example folder and configure FrontMatter:
```markdown
---
title: Button Base
order: 1
---
```

## Create a new example
Here's how to add an example showing the state of `loading` to the button:

1. Add a `loading` folder under the `button/examples` folder, and add the corresponding example component

```
├── button
│   ├── examples
│   │   ├── loading
│   │   │   ├── loading.component.html
│   │   │   ├── loading.component.scss
│   │   │   └── loading.component.ts
│   │   └── module.ts
```

2. The code of the `loading.component.ts` file is as follows:

```ts
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'alib-button-loading-example',
    templateUrl: './loading.component.html'
})
export class AlibButtonLoadingExampleComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}

```
3. Import `AlibButtonLoadingExampleComponent` to `button/examples/module.ts`

```
...
import { AlibButtonLoadingExampleComponent } from './loading/loading.component';

const COMPONENTS = [
  ...
  AlibButtonLoadingExampleComponent
]
@NgModule({
    declarations: COMPONENTS,
    imports: [CommonModule, AlibButtonModule],
    entryComponents: COMPONENTS,
    exports: COMPONENTS,
    providers: []
})
export class AlibButtonExamplesModule {}

```

Pay attention: all examples are dynamically loaded at runtime, and need to be imported in `entryComponents` when the Ivy rendering engine is not turned on.

# Component API

Docgeni will scan the configuration files in the `api` folder by default. The file name is the `Key` of multi-language, such as `zh-cn.js`. Please check the [apiDir](configuration/lib#apiDir) configuration item to configure the directory.

The configuration file naming rule is: `{localeKey}.<json|yaml|yml|js|config.js>`, currently supports the following three formats:
- `json` format, named after `.json` suffix
- `yaml` format, named after `.yaml` or `yml` suffix
- `js` format, named after `.js` or `.config.js` suffix

## API configuration
A component module may contain multiple components or directives whatever the format, so the configuration of the API is an array. Each item in the array represents a component, a directive, a service, an interface, etc.

JS format example is as follows:
```js
module.exports = [
  {
    type: 'directive',
    name: 'alibButton',
    description: 'Button component, supports two forms: alibButton directive and alib-button component',
    properties: [
        {
            name: 'alibType',
            type: 'string',
            default: 'primary',
            description: 'The type of button, support \`primary | info | warning | danger\`' 
        },
        {
            name: 'alibSize',
            type: 'string',
            default: 'null', 
            description: 'The size of button, support \`sm | md | lg\`'
        }
    ]
  }
];

```

YAML format example is as follows:

```yaml
- type: directive
  name: alibButton
  description: 'Button component, supports two forms: alibButton directive and alib-button component'
  properties:
      - name: alibType
        type: string
        description: The type of button, support `primary | info | warning | danger`
        default: primary
      - name: alibSize
        type: string
        description: The size of button, support `sm | md | lg`
        default: md
```

JSON format example is as follows:
```json
[
  {
    "type": "directive",
    "name": "alibButton",
    "description": "Button component, supports two forms: alibButton directive and alib-button component",
    "properties": [
      {
        "name": "alibType",
        "type": "string",
        "default": "primary",
        "description": "The type of button, support `primary | info | warning | danger`"
      },
      {
        "name": "alibSize",
        "type": "string",
        "default": "null",
        "description": "The size of button, support `sm | md | lg`"
      }
    ]
  }
]
```

## Parameter description

- `type`: The type of the component, support `directive`, `component`, `class`, `interface`
- `name`: The name of the component
- `description`: The description of the component, support Markdown syntax
- `properties`: The property list of the component
- `properties.name`: The name of the property
- `properties.type`:  The type of the property
- `properties.default`: The default value of the property
- `properties.description`: The description of the property, support Markdown syntax
