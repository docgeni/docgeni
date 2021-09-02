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

<alert>xxxx</alert>

WIP.

## Embed

WIP.

## 自定义内置组件
WIP.

<my-color color="red">Color</my-color>