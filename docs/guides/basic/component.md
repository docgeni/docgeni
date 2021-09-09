---
title: 组件文档、API和示例
path: 'component'
order: 40
---


`Docgeni`会动态识别每个类库根目录(`rootDir`)下的一级子文件夹，每个一级子文件夹相当于一个组件，每个组件包含对应的文档、API和示例，如需配置某个多级文件夹，请查看 [include](configuration/lib#include) 配置项。
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

- `module.ts`为当前组件所有示例的入口模块，命名规则按照`类库缩写+组件名+ExamplesModule` 如：`AlibButtonExamplesModule`
- 默认示例名取文件夹的名称，并以 - 分割多个单词，示例入口组件文件命名规则为`示例名.component.ts` 如：`basic.component.ts`
- 对应组件的默认命名规则为`类库缩写+组件名+示例名+ExampleComponent` 如：`AlibButtonBasicExampleComponent`

## 引用配置
Docgeni 运行时会把`examples`下的所有示例文件拷贝到站点下启动，在组件示例中不能采用相对路径引入组件模块，建议直接通过包路径引用，同时需要在 tsconfig.json 配置 paths 指向类库源代码路径，这样可以直接复制示例代码使用，比如：组件库叫`alib`，采用如下的方式配置和引入组件：
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
3. 修改 `button/examples/module.ts` 引入`AlibButtonLoadingExampleComponent`组件

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

这里需要注意的是：所有的示例在运行时都是动态加载的，在没有开启Ivy渲染引擎的情况下需要在`entryComponents`中导入。


# 组件 API

Docgeni 默认会扫描`api`文件夹下的配置文件，文件名为多语言的`Key`，比如`zh-cn.js`。如需配置目录，请查看 [apiDir](configuration/lib#apiDir) 配置项。

配置文件命名规则为：`{localeKey}.<json|yaml|yml|js|config.js>`，目前支持以下三种格式：
- `json`格式，以`.json`后缀命名
- `yaml`格式，以`.yaml`或者`yml`后缀命名
- `js`格式，以`.js`或者`.config.js`后缀命名

## API 配置
不管是哪种格式，一个组件模块可能会包含多个组件或者指令，所以API的配置是一个数组，数组中的每一项代表一个组件、一个指令、一个服务或者一个接口等。

JS 格式示例如下：
```js
module.exports = [
  {
    type: 'directive',
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

## 参数说明

- `type`: 组件的类型，支持`directive`、`component`、`class`、`interface`
- `name`: 组件的名称
- `description`: 组件的描述，支持 Markdown 语法
- `properties`: 组件的属性列表
- `properties.name`: 属性名称
- `properties.type`: 属性类型
- `properties.default`: 属性的默认值
- `properties.description`: 属性的描述，支持 Markdown 语法
