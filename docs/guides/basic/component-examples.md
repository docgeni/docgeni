---
title: 组件示例
path: 'component-examples'
order: 50
---

# 示例默认规则
Docgeni 默认会扫描`examples`文件夹下的所有子文件夹，每个子文件夹相当一种类型的示例，Docgeni 会按照约定的命名识别示例组件。如需配置，请查看 [examplesDir](https://docgeni.org/configuration/lib#examplesDir) 配置项。

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


# 在文档中使用示例
`Docgeni`会给每个示例生成一个唯一的 Key, 命名规则为：`类库缩写-组件名-示例名-example`，如：`alib-button-basic-example`

那么不管是在普通的页面文档中还是在组件的概览文档中，都可以按照下面的语法在 Markdown 中引入某个示例，`name`为示例的唯一标识。

```html
<example name="alib-button-basic-example" />
```
运行效果：
<example name="alib-button-basic-example" />

默认的示例是包裹在一个示例容器中，并可以查看示例的源代码，如需要去除包裹的容器，通过`inline`模式引入示例：

```html
<example name="alib-button-basic-example" inline />
```
运行效果：
<example name="alib-button-basic-example" inline />

# 示例的配置

某个组件下可能有很多示例，每个示例会有标题和排序等字段，如果需要自定义配置，需要在对应的示例文件夹下创建一个`index.md`文件，并配置 FrontMatter：
```markdown
---
title: Button Base
order: 1
---
```

# 新建一个示例
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


