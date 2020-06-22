---
title: 组件文档
path: 'docs'
order: 1
---


`Docgeni`会动态识别每个类库下的子文件夹，每个子文件夹相当于一个组件，每个组件包含对应的文档、API和示例。
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

## 概览文档

`doc` 文件夹下存放每个多语言对应的组件文档，会展示在组件的概览中。

## 示例
`examples` 文件夹存放当前组件的所有示例，每个类型的示例以独立文件夹的方式存在，`Docgeni`会按照约定的命名识别示例组件。
- module.ts 为当前组件所有示例的入口模块，命名规则按照`类库缩写+组件名+ExamplesModule` 如：`AlibButtonExamplesModule`
- 示例名为文件夹的名称，并以 - 分割多个单词，示例入口组件文件命名规则为`示例名.component.ts` 如：`basic.component.ts`
- 对应组件的命名规则为`类库缩写+组件名+示例名+ExampleComponent` 如：`AlibButtonBasicExampleComponent`

## 在文档中使用示例
`Docgeni`会给每个示例生成一个唯一的 Key, 命名规则为：`类库缩写-组件名-示例名-example`，如：`alib-button-basic-example`

那么不管是在普通的文档中还是在组件的文档中，都可以按照下面的语法在Markdown中引入某个示例，name为示例的唯一key。

```html
<example name="alib-button-basic-example" />
```
运行效果：
<example name="alib-button-basic-example" />

默认的示例是包裹在一个示例容器中，并可以查看示例的源代码，`Docgeni`支持`inline`模式引入示例：

```html
<example name="alib-button-basic-example" inline />
```
运行效果：
<example name="alib-button-basic-example" inline />

## 示例的配置

某个组件下可能有很多示例，每个示例会有示例的标题，排序等字段，如果需要自定义配置，需要在对应的示例文件夹下创建一个`index.md`文件，并配置 FrontMatter：
```markdown
---
title: Button Base
order: 1
---
```

## 新建一个示例
下面介绍一下如何为按钮新增一个展示`loading`状态的示例：

1. 在`button/examples`文件夹下新增一个`loading`文件夹，并新增响应的示例组件

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


