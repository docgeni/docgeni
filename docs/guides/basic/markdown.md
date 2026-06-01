---
title: Markdown 语法
order: 25
---

Docgeni 使用 [Marked](https://marked.js.org/) 解析 Markdown，默认开启 GFM（GitHub Flavored Markdown）。本文介绍编写文档时常用的标准语法，以及 Docgeni 内置的扩展语法。

## 标题

使用 `#` 表示标题，数量对应级别（1–6）：

```markdown
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题
```

一级至四级标题会自动生成锚点 ID，并在页面右侧目录中展示，便于页内跳转。锚点 ID 由标题文本转换而来（小写、空格与标点替换为 `-`）。

## 链接

### 内部链接

引用站点内其他文档或相对资源时，使用相对路径：

```markdown
[快速开始](../intro/getting-started)
[导航与菜单](./nav-menu)
```

### 外部链接

以 `http://` 或 `https://` 开头的链接会自动添加 `target="_blank"`，在新标签页打开：

```markdown
[Docgeni GitHub](https://github.com/docgeni/docgeni)
```

## Front Matter

每个 Markdown 文件顶部可使用 YAML Front Matter 配置页面元数据，与正文之间用 `---` 分隔：

```markdown
---
title: 快速开始
path: getting-started
order: 10
hidden: false
toc: content
---

正文从这里开始……
```

常用字段包括 `title`、`path`、`order`、`hidden`、`toc` 等。完整说明见 [Front Matter 配置](/configuration/front-matter)。

Docgeni 在构建时会解析 Front Matter，用于生成导航、菜单、路由与页面标题；正文部分才参与 Markdown 渲染。

## 表格

GFM 表格语法：

```markdown
| 列 A | 列 B |
| --- | --- |
| 单元格 1 | 单元格 2 |
| 单元格 3 | 单元格 4 |
```

| 列 A | 列 B |
| --- | --- |
| 单元格 1 | 单元格 2 |
| 单元格 3 | 单元格 4 |

## 代码块

使用围栏代码块（fenced code block）并指定语言，便于语法高亮与复制：

````markdown
```typescript
const greeting = 'Hello Docgeni';
console.log(greeting);
```
````

渲染效果：

```typescript
const greeting = 'Hello Docgeni';
console.log(greeting);
```

代码块右上角会显示语言标签与复制按钮。支持的语言取决于 [Prism](https://prismjs.com/) 主题配置。

## 代码组（code-group）<label>2.8.0+</label>

需要将多段代码以 Tab 形式分组展示时，可使用 `code-group` 容器。语法为用 `::: code-group` 包裹多个围栏代码块，在语言标识后用 `[标签名]` 指定 Tab 标题：

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

渲染效果：

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

`code-group` 在内部会渲染为 `mode="code-group"` 的 Tabs 组件，与 [内置组件](/guides/basic/built-in-components) 中的 `<tabs mode="code-group">` 效果一致。

## Embed 内嵌文件

使用 `<embed>` 标签可将同目录或相对路径下的另一个 Markdown 文件内容嵌入当前页面：

```html
<embed src="./foo.md"></embed>
```

效果示例：

<embed src="./foo.md"></embed>

路径相对于当前 Markdown 文件所在目录解析。还支持按行号引入部分内容：

```html
<!-- 引入全部内容 -->
<embed src="./foo.md"></embed>

<!-- 仅第 1 行 -->
<embed src="./foo.md#L1"></embed>

<!-- 第 5–10 行 -->
<embed src="./foo.md#L5-L10"></embed>
```

<alert type="info">不能嵌入当前文件自身；目标文件不存在时，页面会显示路径解析错误提示。</alert>

被嵌入文件中的 Front Matter 会被剥离，只渲染正文部分。

## Markdown 自定义扩展

除内置的 `embed`、`code-group`、`tabs` 等扩展外，可在 `.docgenirc.js` / `.docgenirc.ts` 中通过 `markdown.config` 对 Marked 实例做进一步配置：

```ts
import { markedEmoji } from 'marked-emoji';

export default {
    markdown: {
        config: (marked) => {
            // 使用第三方 marked 扩展
            marked.use(
                markedEmoji({
                    emojis: { heart: '❤️', tada: '🎉' },
                    renderer: (token) => token.emoji,
                }),
            );

            // 或注册自定义扩展
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

说明：

- `config` 回调在 Docgeni 初始化 Marked 时调用，参数为已启用 GFM 并注册内置扩展后的 `Marked` 实例。
- 可在回调中调用 `marked.use()` 安装 [marked 生态](https://www.npmjs.com/search?q=marked-) 的第三方包，或按 [Marked 扩展 API](https://marked.js.org/using_pro#extensions) 编写 `extensions`（`name`、`level`、`start`、`tokenizer`、`renderer` 等）。
- 自定义扩展请避免与内置扩展的语法冲突；复杂交互仍建议使用 [内置组件](/guides/basic/built-in-components) 或 `.docgeni/components` 下的 Angular 组件。

配置 `:heart:` 后，文档中即可渲染为 ❤️（需已安装并配置 `marked-emoji`）。
