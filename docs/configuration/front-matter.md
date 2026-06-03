---
title: Front Matter
order: 40
toc: menu
---

Front Matter 是 Markdown 文件头部的 YAML 元数据，用于控制一级导航、类别、页面或组件的标题、路由、排序与展示行为。

## title

- 类型：`string`
- 默认：文件夹名或文件名

一级导航、类别、页面或组件的标题。未设置时，Docgeni 会对文件夹名或文件名做 `titleCase` 转换。

## subtitle

- 类型：`string`
- 默认：`null`

一级导航、类别、页面或组件的副标题，显示在标题之后。

## order

- 类型：`number`
- 默认：`null`

一级导航、类别、页面或组件的排序权重，按数值升序排列。

## path

- 类型：`string`
- 默认：文件夹名或文件名

一级导航、页面或组件的路由路径。未设置时，Docgeni 会对文件夹名或文件名做 `paramCase` 转换。文档的实际访问路径会包含所属类别与一级导航的 `path`。

## hidden

- 类型：`boolean`
- 默认：`false`

是否隐藏当前一级导航、类别、组件或页面，常用于草稿文档。

## name

- 类型：`string`
- 默认：文件夹名

组件名称，Docgeni 据此生成组件标识，一般无需手动设置。

## category

- 类型：`string`
- 默认：`null`

组件所属类别，需与类库配置中 `categories` 的 `id` 对应。

## toc <label>1.1.0+</label>

- 类型：`content | menu | hidden | false`
- 默认：`content`

文档目录（TOC）的展示方式，可覆盖 [全局 toc 配置](/configuration/global#toc)。

- `content`：显示在内容区域右侧
- `menu`：显示在左侧菜单中
- `hidden` / `false`：不显示目录

## label <label>1.1.0+</label>

- 类型：`string`
- 默认：`null`

组件标签，用于在文档中展示状态标识。内置支持：

- `new`：新组件
- `deprecated`：已废弃
- `experimental`：实验性组件

也可设置为类库 [labels](/configuration/lib#labels) 中自定义的任意 `id`。

## background <label>2.0+</label>

- 类型：`string`
- 默认：`null`

组件示例区域的背景色。

## compact <label>2.0+</label>

- 类型：`boolean`
- 默认：`false`

是否去除组件示例区域的内边距。

## className <label>2.0+</label>

- 类型：`string`
- 默认：`null`

组件示例区域的自定义 CSS 类名，用于特殊样式处理。
