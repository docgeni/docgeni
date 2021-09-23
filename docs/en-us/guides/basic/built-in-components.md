---
title: Built-in Components
path: 'built-in-components'
order: 50
---

In addition to using the example `<example name="{name}" />` component in the document, Docgeni also provides the following built-in components as extensions of markdown syntax:

## Label
Use 'label' to create a label: <label>Hello Docgeni</label>

```html
<label>Hello Docgeni</label>
```
The following types of labels are available:

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
Use `alert` to create a alert box. the type can be `primary`, `info`, `success`,`warning`,`danger`, the default type is `info`.

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

The `embed` component can embed the contents of another markdown document in one markdown document:

```html
<embed src="./foo.md"></embed>
```
Preview as below:
<embed src="./foo.md"></embed>

It also supports specifying line numbers and intervals:

```html
<!-- Import all contents of markdown file -->
<embed src="/path/to/some.md"></embed>

<!-- Import the contents of the markdown file with the specified line number -->
<embed src="/path/to/some.md#L1"></embed>

<!-- Import some contents of the markdown file in the specified line number range -->
<embed src="/path/to/some.md#L5-L10"></embed>
```

## Custom Built-in Components
Create custom built-in components in the default dir `.docgeni/components`, such as the following structure:

```html
.docgeni
└── components
    ├── color
    │   ├── color.component.ts    
    │   ├── color.component.html
    ├── module.ts
```

The `color` component needs to export the selector used in markdown and component by default, and inherit the `DocgeniBuiltInComponent` and pass it in to elementRef. The following example is the custom text color component:

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

Write the following syntax in markdown:
```html
<my-color color="red">Color</my-color>
```
Preview: <my-color color="red">Color</my-color>
