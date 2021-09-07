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
使用`alert`创建一个提示框，type 可选 `warning`、`info`、`success`、`danger`，默认为 `info`。

<alert>Hello Docgeni</alert>

```html
<alert>Hello Docgeni</alert>
```

<alert type="warning">Warning</alert>
<alert type="info">Info</alert>
<alert type="success">Success</alert>
<alert type="danger">Danger</alert>

```html

<alert type="warning">Warning</alert>
<alert type="info">Info</alert>
<alert type="success">Success</alert>
<alert type="danger">Danger</alert>
```

## Embed

WIP.

## 自定义内置组件
在默认的`.docgeni/components`文件夹下创建自定义内置组件，比如如下结构：

```html
.docgeni
└── components
    ├── color
    │   ├── color.component.ts    
    │   ├── color.component.html
    ├── module.ts
```

`color` 组件需要默认导出 Markdown 中使用的选择器 selector 和 component，同时需要继承 `DocgeniBuiltInComponent`并传入 ElementRef，如下示例是自定义设置文字颜色组件：

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
在 Markdown 中编写如下语法：
```html
<my-color color="red">Color</my-color>
```
展示效果：<my-color color="red">Color</my-color>
