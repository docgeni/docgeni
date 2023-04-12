---
title: 内置组件
path: 'built-in-components'
order: 50
---

除了在文档中使用示例`<example name="{name}" />`组件外，Docgeni 还提供了如下内置组件作为 Markdown 语法的扩展：

## Label
使用`label`可以创建一个标签: <label>Hello Docgeni</label>

```html
<label>Hello Docgeni</label>
```
标签提供了如下多种类型：

<label type="primary">Label</label>
<label type="info">Label</label>
<label type="default">Label</label>
<label type="light">Label</label>
<label type="success">Label</label>
<label type="warning">Label</label>
<label type="danger">Label</label>

<label type="outline-primary">Label</label>
<label type="outline-info">Label</label>
<label type="outline-default">Label</label>
<label type="outline-light">Label</label>
<label type="outline-success">Label</label>
<label type="outline-warning">Label</label>
<label type="outline-danger">Label</label>

```html
<label type="primary">Label</label>
<label type="info">Label</label>
<label type="default">Label</label>
<label type="light">Label</label>
<label type="success">Label</label>
<label type="warning">Label</label>
<label type="danger">Label</label>

<label type="outline-primary">Label</label>
<label type="outline-info">Label</label>
<label type="outline-default">Label</label>
<label type="outline-light">Label</label>
<label type="outline-success">Label</label>
<label type="outline-warning">Label</label>
<label type="outline-danger">Label</label>
```

## Alert
使用`alert`创建一个提示框，type 可选 `primary`、`info`、`success`、`warning`、`danger`，默认为 `info`。

<alert>Hello Docgeni</alert>

```html
<alert>Hello Docgeni</alert>
```

<alert type="primary">Primary</alert>
<alert type="info">Info</alert>
<alert type="success">Success</alert>
<alert type="warning">Warning</alert>
<alert type="danger">Danger</alert>

```html

<alert type="primary">Primary</alert>
<alert type="info">Info</alert>
<alert type="success">Success</alert>
<alert type="warning">Warning</alert>
<alert type="danger">Danger</alert>

```

## Embed

Embed 组件可以在一个 Markdown 文档中嵌入另一个 Markdown 文档的内容：
```html
<embed src="./foo.md"></embed>
```
展示效果如下：
<embed src="./foo.md"></embed>

除了全量引入外还支持指定行号和区间:
```html
<!-- 引入 Markdown 文件全部内容 -->
<embed src="/path/to/some.md"></embed>

<!-- 引入指定行号的 Markdown 文件内容 -->
<embed src="/path/to/some.md#L1"></embed>

<!-- 引入指定行号区间的 Markdown 文件部分内容 -->
<embed src="/path/to/some.md#L5-L10"></embed>
```
## 自定义内置组件
在默认的`.docgeni/components`文件夹下创建自定义内置组件，文件结构如下：

```html
.docgeni
└── components
    ├── color
    │   ├── color.component.ts    
    │   ├── color.component.html
    ├── module.ts
```
自定义组件需要继承`DocgeniBuiltInComponent`基类并在构造函数注入`ElementRef`并通过调用`supper(elementRef)`传入父类。
<alert type="info">Markdown 中使用的渲染组件默认取文件中定义的第一个组件，使用的选择器为组件的 selector, 如需自定义，可以通过 `export default { selector: '', component: xx}` 自定义设置。</alert>

```ts
import { Component, ElementRef, HostBinding, Input, OnInit } from '@angular/core';
import { DocgeniBuiltInComponent } from '@docgeni/template';

@Component({
    selector: 'my-color',
    templateUrl: './color.component.html'
})
export class MyColorComponent extends DocgeniBuiltInComponent implements OnInit {
    @Input() set color(value: string) {
        this.hostElement.style.color = value;
    }

    constructor(elementRef: ElementRef<unknown>) {
        super(elementRef);
    }
}

export default {
    selector: 'my-color',
    component: MyColorComponent
};
```
在 Markdown 中使用组件的选择器`my-color`编写如下语法：
```html
<my-color color="red">Color</my-color>
```
展示效果：<my-color color="red">Color</my-color>

内置组件配置第三方依赖，在`.docgeni/components`文件夹中新建`module.ts`，输入如下代码即可:

```ts
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export default {
    imports: [FormsModule, CommonModule],
    providers: []
};
```
这样就可以在自定义内置组件中使用`CommonModule`和`FormsModule`导出的组件和服务。
当然如果自定义组件是一个独立组件，无需定义`module.ts`，直接在独立组件中导入需要的模块即可。
