---
title: 示例
path: 'demo'
order: 10
---

示例开始


Inline 方式展示示例组件

```html
<example name="alib-foo-basic-example" inline />
```
<example name="alib-foo-basic-example" />
完整展示一个示例组件

```html
<example name="alib-foo-basic-example" />
```
<example name="alib-foo-basic-example" />

<!-- example(alib-foo-basic-example) -->

```js
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'alib-foo-basic-example',
    template: `<button alibButton class="btn-primary">Basic Button</button>`
})
export class AlibButtonBasicExampleComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}

```

```css
.dg-icon {
    font-size: 1rem;
    line-height: 0;
    svg {
        width: 1em;
        height: 1em;
        fill: currentColor;
        vertical-align: -.125em;
        background-repeat: no-repeat;
    }
}
```
