---
title: 组件文档、API和示例
path: 'component'
order: 40
---


`Docgeni`会动态识别每个类库根目录(`rootDir`)下的一级子文件夹，每个一级子文件夹相当于一个组件模块，每个组件包含对应的文档、API和示例，如需配置某个多级文件夹，请查看 [include](configuration/lib#include) 配置项。
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

默认`doc`文件夹下存放每种多语言对应的组件文档，会展示在组件的概览中。如需配置不同目录，请查看 [docDir](configuration/lib#docDir) 配置项。

## 组件配置项

```markdown
---
category: general
title: Button
subtitle: 按钮
name: 'a-button'
order: 1
---
```

- `category`: 当前组件模块的所属类别，需要设置为对应lib配置的`categories`中的id属性
- `title`: 当前组件模块的标题
- `subtitle`: 当前组件模块的子标题
- `name`: 当前组件模块的名称，默认取文件夹的名称，示例模块以及示例组件的命名规则会使用`name`作为拼接，只有文件夹名称代表不了组件的含义时才会配置
- `order`: 组件的排序

对于`category`和`order`是全局配置，不跟随多语言，全局配置项是存放在默认语言文档的`FrontMatter`中。

# 组件示例
Docgeni 默认会扫描`examples`文件夹下的所有子文件夹，每个子文件夹相当一种类型的示例，Docgeni 会按照约定的命名识别示例组件。如需配置目录，请查看 [examplesDir](configuration/lib#examplesDir) 配置项。

文件结构如下：
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

命名规则
- 示例组件文件名: `{取文件夹的名称，并以 - 分割}.component.ts` (如: `basic.component.ts`、`advance-title.component.ts`)
- 示例组件名: `{类库缩写}+{组件名}+{示例名}+ExampleComponent` (如: `AlibButtonBasicExampleComponent`, `1.2`版本后组件名支持自定义，Docgeni 会动态读取导出的组件名称)
- `module`模块名: `{类库缩写}+{组件名}+ExamplesModule`(如: `AlibButtonExamplesModule`)，`1.2`版本后模块名支持自定义且支持动态生成

`module.ts`为当前组件所有示例的入口模块，从`1.2`版本开始 Docgeni 会自动生成`module.ts`，可以不需要配置`module.ts`，同时支持通过`export default {}`模式配置导入的模块和其他模块元数据，无需导入每个示例组件，配置示例如下:

```ts
// module.ts
import { CommonModule } from '@angular/common';
import { AlibButtonModule } from '@docgeni/alib/button';

export default {
  imports: [ CommonModule, AlibButtonModule ],
  providers: [],
  declarations: []
}
```

Docgeni 会解析`module.ts`中`default`导出的对象并动态解析所有示例组件自动生成`AlibButtonExamplesModule`并组合元数据，生成后的代码如下：
```ts
// module.ts
...
@NgModule({
    declarations: [ 
      AlibButtonBasicExampleComponent, 
      AlibButtonAdvanceExampleComponent 
    ],
    entryComponents: [ 
      AlibButtonBasicExampleComponent, 
      AlibButtonAdvanceExampleComponent 
    ],
    providers: [ ],
    imports: [ CommonModule, AlibButtonModule ],
    exports: [ 
      AlibButtonBasicExampleComponent, 
      AlibButtonAdvanceExampleComponent 
    ]
})
export class AlibButtonExamplesModule {}
```

<alert type="info">为了保持兼容性，如果`module.ts`中有定义 Angular 的模块以自定义的模块为主，不会自动生成模块。</alert>

## 引用配置
Docgeni 运行时会把`examples`下的所有示例文件拷贝到站点下启动，在组件示例中不能采用相对路径引入组件模块，建议直接通过包路径引用，同时需要在 tsconfig.json 配置`paths`指向类库源代码路径，这样可以直接复制示例代码使用，比如：组件库叫`@docgeni/alib`，采用如下的方式配置和引入组件：
```ts
// button/examples/module.ts
import { AlibButtonModule } from '@docgeni/alib/button';

@NgModule({
    declarations: [AlibButtonBasicExampleComponent],
    imports: [CommonModule, AlibButtonModule, FormsModule],
    entryComponents: [],
    exports: [AlibButtonBasicExampleComponent],
    providers: []
})
export class AlibButtonExamplesModule {}
```
tsconfig 配置如下，如何配置参考: [自定义配置 tsconfig.json](guides/advance/customize#自定义-public)
```json
// tsconfig.json
 {
   "paths": {
      "@docgeni/alib": [
        "packages/alib/public-api.ts"
      ],
      "@docgeni/alib/*": [
        "packages/alib/*"
      ]
 }
```

## 在文档中使用示例
`Docgeni`为每个示例生成一个唯一的 Key, 命名规则为：`类库缩写-组件名-示例名-example`，如：`alib-button-basic-example`

那么不管是在普通的页面文档还是在组件的概览文档中，都可以按照下面的语法在 Markdown 中引入某个示例，`name`为示例的唯一标识。

```html
<example name="alib-button-basic-example" />
```

运行效果：

<example name="alib-button-basic-example"></example>

默认的示例是包裹在一个示例容器中，并可以查看示例的源代码，如需要去除包裹的容器，通过`inline`模式引入示例：

```html
<example name="alib-button-basic-example" inline />
```

运行效果：

<example name="alib-button-basic-example" inline />

## 示例的配置

某个组件下可能有很多示例，每个示例会有标题和排序等字段，如果需要自定义配置，需要在对应的示例文件夹下创建一个`index.md`文件，并配置 FrontMatter：
```markdown
---
title: Button Base
name: basic
order: 1
---
```

## 新建一个示例
下面介绍一下如何为按钮新增一个展示`loading`状态的示例：

1. 在`button/examples`文件夹下新增一个`loading`文件夹，并新增相应的示例组件

```
├── button
│   ├── examples
│   │   ├── loading
│   │   │   ├── loading.component.html
│   │   │   ├── loading.component.scss
│   │   │   └── loading.component.ts
│   │   └── module.ts
```

2. `loading.component.ts` 文件的代码如下：

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
3. 自定义模块需要修改 `button/examples/module.ts` 引入`AlibButtonLoadingExampleComponent`组件，`1.2`版本后自动生成模块引入示例组件，无需手动添加

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

<alert type="info">注意：所有的示例在运行时都是动态加载的，在没有开启 Ivy 渲染引擎的情况下需要在`entryComponents`中导入。</alert>

## StackBlitz 示例 <label>1.2.0+</label>
Docgeni 支持组件示例直接在 StackBlitz 平台展示, StackBlitz 在线示例需要配置示例的依赖，样式和`angular.json`，通过在 `.docgeni/public/assets/stack-blitz` 文件夹配置，文件结构如下：
```
.docgeni
├── public
│   ├── assets
│   │   ├── ...
│   │   └── stack-blitz
│   │       ├── angular.json
│   │       ├── package.json
│   │       └── src
│   │           └── styles.scss
│   ├── ...
```
- `angular.json`: Angular 运行的配置文件，无特殊配置可以拷贝 [angular.json](https://github.com/docgeni/docgeni-template/blob/master/.docgeni/public/assets/stack-blitz/angular.json) 文件
- `src/styles.scss`: 示例组件依赖的样式，一般需要引入组件库的样式
- `package.json`: 示例运行的依赖，只需配置`dependencies`即可，比如:
```json
{
    "dependencies": { 
        "@angular/animations": "~10.2.4",
        "@angular/cdk": "^10.2.7",
        "@angular/common": "~10.2.4",
        "@angular/compiler": "~10.2.4",
        "@angular/core": "~10.2.4",
        "@angular/forms": "~10.2.4",
        "@angular/platform-browser": "~10.2.4",
        "@angular/platform-browser-dynamic": "~10.2.4",
        "rxjs": "~6.5.4",
        "zone.js": "~0.10.2",
        "@docgeni/alib": "0.0.1"
    }
}
```


# 组件 API

Docgeni 组件 API 支持三种模式，分别为: `'compatible' | 'manual' | 'automatic'`，如何配置参考类库 [apiMode](configuration/lib#apimode-<label>1-2-0+</label>)

- `manual`: 手动模式，以配置的形式定义组件 API，默认模式
- `automatic`: 自动模式，通过组件的注释自动生成 API
- `compatible`: 兼容模式，如果存在 API 定义文件配置优先，否则通过注释自动生成

## 自动生成 API
`automatic`或者`compatible`模式下，Docgeni 会加载组件所有的 TypeScript 文件，动态读取 Angular 组件/指令/服务并通过 JS Doc 注释生成对应的 API 文档。

比如定义如下组件:

```ts
/**
 * General Button Component description.
 */
@Component({
    selector: 'thy-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss'],
    exportAs: 'thyButton'
})
export class ButtonComponent implements OnInit {

    /**
     * Button Type
     * @description Button Type for Description
     */
    @Input() thyType: 'primary' | 'info' | 'success' = 'primary';

     /**
     * Button Size
     * @deprecated
     * @default md
     */
    @Input() thySize: LoadingComponent;

     /**
     * Button loading status
     * @default false
     */
    @Input() set thyLoading(loading: boolean){
        this.loading = loading;
    }

    /**
     * Loading Event
     */
    @Output() thyLoadingEvent = new EventEmitter<boolean>();
}

```
生成的 API 定义为:
```js
[
  {
    "type": "component",
    "name": "ButtonComponent",
    "description": "General Button Component description.",
    "selector": "thy-button",
    "templateUrl": "./button.component.html",
    "template": null,
    "styleUrls": [
      "./button.component.scss"
    ],
    "styles": null,
    "exportAs": "thyButton",
    "properties": [
      {
        "kind": "Input",
        "name": "thyType",
        "type": {
          "name": "\"primary\" | \"info\" | \"success\"",
          "options": [
            "primary",
            "info",
            "success"
          ],
          "kindName": "UnionType"
        },
        "description": "Button Type for Description",
        "default": "primary",
        "tags": {
          "description": {
            "name": "description",
            "text": "Button Type for Description"
          }
        }
      },
      {
        "kind": "Input",
        "name": "thySize",
        "aliasName": "",
        "type": {
          "name": "any",
          "options": null,
          "kindName": "TypeReference"
        },
        "description": "Button Size",
        "default": "md",
        "tags": {
          "deprecated": {
            "name": "deprecated"
          },
          "default": {
            "name": "default",
            "text": "md"
          }
        }
      },
      {
        "kind": "Input",
        "name": "thyLoading",
        "aliasName": "",
        "type": {
          "name": "boolean",
          "options": null
        },
        "description": "",
        "default": null,
        "tags": {}
      },
      {
        "kind": "Output",
        "name": "thyLoadingEvent",
        "aliasName": "",
        "type": {
          "name": "EventEmitter<boolean>",
          "options": null
        },
        "description": "Loading Event",
        "default": "",
        "tags": {}
      }
    ]
  }
]
```

## 配置定义 API

`manual`或者`compatible`模式下，Docgeni 默认会扫描组件`api`文件夹下的配置文件，文件名为多语言的`Key`（比如：`zh-cn.js`、`en-us.js`），读取文件并生成 API 文档，如需配置目录，请查看 [apiDir](configuration/lib#apiDir) 配置项。

配置文件命名规则为：`{localeKey}.<json|yaml|yml|js|config.js>`，目前支持以下三种格式：
- `json`格式，以`.json`后缀命名
- `yaml`格式，以`.yaml`或者`yml`后缀命名
- `js`格式，以`.js`或者`.config.js`后缀命名

### API 格式
不管是哪种格式，一个组件模块可能会包含多个组件或者指令，所以 API 的配置是一个数组，数组中的每一项代表一个组件、一个指令、一个服务或者一个接口等。

JS 格式示例如下：
```js
module.exports = [
  {
    type: 'directive' | 'component' | 'service',
    name: 'alibButton',
    description: '按钮组件，支持 alibButton 指令和 alib-button 组件两种形式',
    properties: [
        {
            name: 'alibType',
            type: 'string',
            default: 'primary',
            description: '按钮的类型，支持 \`primary | info | warning | danger\`' 
        },
        {
            name: 'alibSize',
            type: 'string',
            default: 'null', 
            description: '按钮的大小，支持 \`sm | md | lg\`'
        }
    ]
  }
];

```

YAML 格式示例如下：

```yaml
- type: directive
  name: alibButton
  description: '按钮组件，支持 alibButton 指令和 alib-button 组件两种形式'
  properties:
      - name: alibType
        type: string
        description: 按钮的类型，支持 `primary | info | warning | danger`
        default: primary
      - name: alibSize
        type: string
        description: 按钮的大小，支持 `sm | md | lg`
        default: md
```

JSON格式示例如下：
```json
[
  {
    "type": "directive",
    "name": "alibButton",
    "description": "按钮组件，支持 alibButton 指令和 alib-button 组件两种形式",
    "properties": [
      {
        "name": "alibType",
        "type": "string",
        "default": "primary",
        "description": "按钮的类型，支持 `primary | info | warning | danger`"
      },
      {
        "name": "alibSize",
        "type": "string",
        "default": "null",
        "description": "按钮的大小，支持 `sm | md | lg`"
      }
    ]
  }
]
```

### 参数说明

- `type`: 组件的类型，支持`directive`、`component`、`class`、`interface`
- `name`: 组件的名称
- `description`: 组件的描述，支持 Markdown 语法
- `properties`: 组件的属性列表
- `properties.name`: 属性名称
- `properties.type`: 属性类型
- `properties.default`: 属性的默认值
- `properties.description`: 属性的描述，支持 Markdown 语法
