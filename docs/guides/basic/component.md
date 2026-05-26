---
title: 组件文档
path: 'component'
order: 40
---

类库配置中的 `rootDir` 指向组件库根目录。Docgeni 会扫描其下**一级子文件夹**，每个文件夹对应站点里的一个组件，通常包含三块内容：

| 目录 | 作用 |
| --- | --- |
| `doc` | 概览说明（Markdown） |
| `examples` | 可运行的示例 |
| `api` | API 定义（手动配置时需要；一般根据注释自动生成，无需配置） |

若组件不在一级目录下，可通过 [include](configuration/lib#include) 指定额外扫描路径。

## 目录结构示例

以 `button` 组件为例：

```
├── button
│   ├── button.component.ts
│   ├── button.module.ts
│   ├── doc                   # 概览文档（多语言）
│   │   ├── en-us.md
│   │   └── zh-cn.md
│   ├── api                   # API（手动模式时配置）
│   │   ├── en-us.js
│   │   └── zh-cn.js
│   ├── examples              # 示例
│   │   ├── basic
│   │   └── advance
│   └── index.ts
```

各目录默认名称可通过 [docDir](configuration/lib#docDir)、[apiDir](configuration/lib#apiDir)、[examplesDir](configuration/lib#examplesDir) 修改。

## 概览文档

默认在 `doc` 目录下按语言放置 Markdown 文件（如 `zh-cn.md`），渲染为组件页的「概览」Tab。

在文件头部用 Front Matter 配置组件在导航中的展示信息：

```markdown
---
category: general
title: Button
subtitle: 按钮
name: 'a-button'
order: 1
---
```

| 字段 | 说明 |
| --- | --- |
| `category` | 所属分类，对应类库配置里 `categories` 的 `id` |
| `title` | 组件标题 |
| `subtitle` | 副标题 |
| `name` | 组件标识，用于示例命名等；默认取文件夹名，一般不必改 |
| `order` | 排序 |

`category`、`order` 为**全局配置**，只写在默认语言的 Front Matter 中，不随语言文件变化。

## 组件示例

Docgeni 扫描 `examples` 下的每个子文件夹为一个示例（如 `basic`、`advance`）。

### 目录结构

```
├── button
│   └── examples
│       ├── basic
│       │   ├── basic.component.ts
│       │   ├── basic.component.html
│       │   └── basic.component.scss
│       └── advance
│           ├── advance.component.ts
│           ├── advance.component.html
│           └── advance.component.scss
```

非 standalone 示例时，可在 `examples` 下额外放置 `module.ts`（见下文）。

### 命名规则

- **示例文件**：`{文件夹名}.component.ts`（如 `basic.component.ts`、`advance-title.component.ts`）
- **示例类名**：`{类库缩写}{组件名}{示例名}ExampleComponent`（如 `AlibButtonBasicExampleComponent`）；`1.2+` 也可直接导出任意类名，由 Docgeni 读取
- **示例模块**：`{类库缩写}{组件名}ExamplesModule`（如 `AlibButtonExamplesModule`）；`1.2+` 可自动生成
- <label type="success">推荐</label> `2.1.0+` 支持 **standalone 示例**；若全部为 standalone，可不建 `module.ts`

### 配置 module.ts

<alert>非 standalone 示例需要 `module.ts`；全部为 standalone 时可省略（写了也不影响）。</alert>

从 `1.2` 起只需 `export default` 声明要导入的模块，不必手写完整 `NgModule`：

```ts
import { CommonModule } from '@angular/common';
import { AlibButtonModule } from '@docgeni/alib/button';

export default {
  imports: [CommonModule, AlibButtonModule],
  providers: [],
  declarations: [],
};
```

Docgeni 会解析上述配置，自动把各示例组件填入生成的 `AlibButtonExamplesModule`：

```ts
@NgModule({
    declarations: [
      AlibButtonBasicExampleComponent,
      AlibButtonAdvanceExampleComponent,
    ],
    imports: [CommonModule, AlibButtonModule],
    exports: [
      AlibButtonBasicExampleComponent,
      AlibButtonAdvanceExampleComponent,
    ],
})
export class AlibButtonExamplesModule {}
```

<alert type="info">若 `module.ts` 里已手写完整 `@NgModule`，则以手写为准，不再自动生成。</alert>

### 引用配置（tsconfig paths）

构建时示例会拷贝到文档站点中运行，**不要用相对路径**引用类库源码，建议在 `tsconfig.json` 配置 `paths`，按包名导入：

```ts
import { AlibButtonModule } from '@docgeni/alib/button';
```

```json
{
  "compilerOptions": {
    "paths": {
      "@docgeni/alib": ["packages/alib/public-api.ts"],
      "@docgeni/alib/*": ["packages/alib/*"]
    }
  }
}
```

也可通过 [自定义 public 目录](guides/advance/customize#自定义-public-目录) 覆盖站点 `tsconfig.json`。

### 在 Markdown 中引用示例

每个示例有唯一标识：`{类库缩写}-{组件名}-{示例名}-example`，例如 `alib-button-basic-example`。

```html
<example name="alib-button-basic-example" />
```

<example name="alib-button-basic-example"></example>

去掉外层容器、直接嵌入页面：

```html
<example name="alib-button-basic-example" inline />
```

<example name="alib-button-basic-example" inline />

### 概览中展示全部示例 <label>2.0+</label>

在概览文档中插入：

```html
<examples />
```

会按顺序插入当前组件的所有示例，并出现在页面目录（Toc）中。

![](assets/images/overview-examples.png)

### 单个示例的配置

一个组件往往有多个示例（如 `basic`、`advance`）。默认用文件夹名作为示例标识；若需要自定义**侧边栏 / 示例列表中的标题**或**排序**，在该示例目录下增加 `index.md`，通过 Front Matter 配置：

```markdown
---
title: 基础用法
name: basic
order: 1
---
```

- `title`：示例在文档中显示的标题（如「基础用法」）
- `name`：示例标识，参与生成 `<example name="...">` 的 key；默认与文件夹名一致，仅在需要与文件夹名不同时填写
- `order`：多个示例时的展示顺序，数字越小越靠前

### 新建示例（示例：loading 状态）

1. 在 `button/examples/loading` 下新增组件文件：

```
├── button/examples/loading
│   ├── loading.component.ts
│   ├── loading.component.html
│   └── loading.component.scss
```

2. `loading.component.ts` 示例：

```ts
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'alib-button-loading-example',
    templateUrl: './loading.component.html',
})
export class AlibButtonLoadingExampleComponent implements OnInit {
    ngOnInit(): void {}
}
```

3. `1.2+` 若使用自动模块，无需改 `module.ts`；手写模块时需把新组件加入 `declarations` / `exports`。

### StackBlitz 在线示例 <label>2.0+</label>

在 `.docgeni/public/assets/stack-blitz` 配置在线运行环境：

```
.docgeni/public/assets/stack-blitz
├── angular.json
├── package.json
└── src/styles.scss
```

- `angular.json`：可复用 [模板仓库中的配置](https://github.com/docgeni/docgeni-template/blob/master/.docgeni/public/assets/stack-blitz/angular.json)
- `src/styles.scss`：引入组件库样式
- `package.json`：只配置 `dependencies` 即可，例如：

```json
{
  "dependencies": {
    "@angular/core": "~18.2.0",
    "@docgeni/alib": "0.0.1"
  }
}
```

## 组件 API

通过类库配置的 [apiMode](configuration/lib#apimode-<label>1-2-0+</label>) 选择生成方式：

| 模式 | 说明 |
| --- | --- |
| `manual` | 在 `api` 目录手写配置文件（默认） |
| `automatic` | 根据 TypeScript 与 JSDoc 注释自动生成，无需 `api` 目录 |
| `compatible` | 存在 `api` 配置则用手动，否则自动 |

### 自动生成 API

在 `automatic` 或 `compatible` 下，Docgeni 扫描组件目录中的 TypeScript，识别组件/指令/服务/管道及公开的类型，并按注释生成文档。注释写法见 [API 注释](configuration/api)。

示例组件：

```ts
/**
 * General Button Component description.
 */
@Component({
    selector: 'thy-button',
    templateUrl: './button.component.html',
    exportAs: 'thyButton',
})
export class ButtonComponent {
    /** Button Type */
    @Input() thyType: 'primary' | 'info' | 'success' = 'primary';

    /** @deprecated */
    @Input() thySize: string;

    @Output() thyLoadingEvent = new EventEmitter<boolean>();
}
```

对**接口、类**等需在注释中加 `@public` 或 `@publicApi` 才会出现在 API 中：

```ts
/**
 * Dialog Config
 * @public
 */
export interface DialogConfig {
  param1: string;
}
```

### 手动配置 API

<label type="warning">新项目更推荐自动模式；手动配置仅在不便于从源码生成时使用。</label>

`manual` 或 `compatible` 下，在 `api` 目录放置按语言命名的文件：`zh-cn.js`、`en-us.json` 等（支持 `.json` / `.yaml` / `.js`，见 [apiDir](configuration/lib#apiDir)）。

配置为**数组**，每项对应一个组件、指令或服务。JS 示例：

```js
module.exports = [
  {
    type: 'component',
    name: 'alibButton',
    description: '按钮组件',
    properties: [
      {
        name: 'alibType',
        type: 'string',
        default: 'primary',
        description: '类型：`primary | info | warning | danger`',
      },
    ],
  },
];
```

YAML / JSON 格式等价，字段含义如下：

| 字段 | 说明 |
| --- | --- |
| `type` | `directive` \| `component` \| `service` \| `class` \| `interface` |
| `name` | 名称 |
| `description` | 描述（支持 Markdown） |
| `properties` | 属性列表 |
| `properties.name` / `type` / `default` / `description` | 各属性定义 |

完整 YAML、JSON 示例与旧版文档一致，可按项目选用格式。
