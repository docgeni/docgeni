---
title: Markdown Syntax
order: 25
---

Docgeni parses Markdown with [Marked](https://marked.js.org/) and enables GFM (GitHub Flavored Markdown) by default. This page covers common standard syntax and Docgeni-specific extensions for writing documentation.

## Headings

Use `#` for heading levels 1–6:

```markdown
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
```

Headings level 1–4 get automatic anchor IDs and appear in the on-page table of contents. IDs are derived from the heading text (lowercased; spaces and punctuation become `-`).

## Links

### Internal links

Use relative paths to link to other pages or assets in the site:

```markdown
[Getting started](../intro/getting-started)
[Navigation & menu](./nav-menu)
```

### External links

Links starting with `http://` or `https://` open in a new tab (`target="_blank"`):

```markdown
[Docgeni on GitHub](https://github.com/docgeni/docgeni)
```

## Front Matter

YAML Front Matter at the top of each file configures page metadata. Separate it from the body with `---`:

```markdown
---
title: Getting started
path: getting-started
order: 10
hidden: false
toc: content
---

Body content starts here…
```

Common fields include `title`, `path`, `order`, `hidden`, and `toc`. See [Front Matter](/en-us/configuration/front-matter) for the full reference.

Docgeni reads Front Matter at build time for navigation, menus, routes, and titles. Only the body is passed to the Markdown renderer.

## Tables

GFM table syntax:

```markdown
| Column A | Column B |
| --- | --- |
| Cell 1 | Cell 2 |
| Cell 3 | Cell 4 |
```

| Column A | Column B |
| --- | --- |
| Cell 1 | Cell 2 |
| Cell 3 | Cell 4 |

## Code blocks

Fenced code blocks with a language identifier enable highlighting and copy:

````markdown
```typescript
const greeting = 'Hello Docgeni';
console.log(greeting);
```
````

Rendered:

```typescript
const greeting = 'Hello Docgeni';
console.log(greeting);
```

The block shows a language label and copy button. Supported languages depend on your [Prism](https://prismjs.com/) setup.

## Code group

Wrap multiple fenced blocks in a `code-group` container. Add `[Tab label]` after the language on each fence:

<pre><code>::: code-group

```bash [npm]
npm install -D @docgeni/cli
```

```bash [yarn]
yarn add -D @docgeni/cli
```

```bash [pnpm]
pnpm add -D @docgeni/cli
```

:::</code></pre>

Rendered:

::: code-group

```bash [npm]
npm install -D @docgeni/cli
```

```bash [yarn]
yarn add -D @docgeni/cli
```

```bash [pnpm]
pnpm add -D @docgeni/cli
```

:::

Internally this becomes `<tabs mode="code-group">`, same as [built-in components](/en-us/guides/basic/built-in-components).

## Embed

The `<embed>` tag inlines another Markdown file relative to the current file:

```html
<embed src="../../../guides/basic/foo.md"></embed>
```

Example:

<embed src="../../../guides/basic/foo.md"></embed>

You can import line ranges:

```html
<!-- Full file -->
<embed src="../../../guides/basic/foo.md"></embed>

<!-- Line 1 only -->
<embed src="../../../guides/basic/foo.md#L1"></embed>

<!-- Lines 5–10 -->
<embed src="../../../guides/basic/foo.md#L5-L10"></embed>
```

<alert type="info">You cannot embed the current file. If the target is missing, the page shows a path resolution error.</alert>

Front Matter in the embedded file is stripped; only the body is rendered.

## Custom Markdown extensions

Besides built-in extensions (`embed`, `code-group`, `tabs`, etc.), configure Marked in `.docgenirc.js` / `.docgenirc.ts`:

```ts
import { markedEmoji } from 'marked-emoji';

export default {
    markdown: {
        config: (marked) => {
            // Third-party marked extension
            marked.use(
                markedEmoji({
                    emojis: { heart: '❤️', tada: '🎉' },
                    renderer: (token) => token.emoji,
                }),
            );

            // Or a custom extension
            marked.use({
                extensions: [
                    {
                        name: 'callout',
                        level: 'block',
                        start(src) {
                            return src.match(/^:::\s*tip\b/m)?.index;
                        },
                        tokenizer(src) {
                            const rule = /^:::\s*tip\s*\n([\s\S]*?)\n:::\s*(?:\n|$)/;
                            const match = rule.exec(src);
                            if (!match) return;
                            return { type: 'callout', raw: match[0], text: match[1].trim() };
                        },
                        renderer(token) {
                            return `<div class="callout tip">${token.text}</div>\n`;
                        },
                    },
                ],
            });
        },
    },
};
```

Notes:

- `config` runs when Docgeni initializes Marked, after GFM and built-in extensions are registered.
- Use `marked.use()` to add packages from the [marked ecosystem](https://www.npmjs.com/search?q=marked-) or implement [Marked extensions](https://marked.js.org/using_pro#extensions) (`name`, `level`, `start`, `tokenizer`, `renderer`, etc.).
- Avoid syntax clashes with built-in extensions; richer UI can use [built-in components](/en-us/guides/basic/built-in-components) or Angular components under `.docgeni/components`.

With `marked-emoji` configured, `:heart:` in prose renders as ❤️.
