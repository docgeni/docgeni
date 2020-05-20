---
title: 开始
path: 'getting-started'
order: 2
---

# 快速上手

## 安装

```bash
$ npm i @docgeni/cli --save-dev
// or
$ yarn add @docgeni/cli -D
```

安装后通过

<!-- example(form-field-custom-control) -->

```js
export interface MarkdownParseResult<TAttributes = unknown> {
    attributes: TAttributes;
    body: string;
    bodyBegin: number;
    frontmatter: string;
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
