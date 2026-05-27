---
title: 导航与菜单
order: 20
---

Docgeni 的导航由一棵 `NavigationItem` 树描述，同一套数据驱动顶部导航栏、左侧菜单和页面路由。理解几种导航节点类型，以及 `docs` 目录与 `navs` 配置如何配合，是定制文档站导航的基础。

## 导航节点类型

| 类型 | 说明 | 典型位置 |
| --- | --- | --- |
| **Nav（一级导航）** | 顶部导航项，拥有独立路由 | `full` 模式顶部导航栏 |
| **Category（类别）** | 分组，无独立页面内容 | 左侧菜单分组标题 |
| **DocItem（文档页）** | 普通 Markdown 文档 | 左侧菜单项 + 独立路由 |
| **ComponentDocItem（组件文档）** | 类库组件文档，含概览 / 示例 / API | 类库一级导航下的左侧菜单 |

如下例中，`guides` 是一级导航，`intro` 是类别，`getting-started` 是文档页：

```json
{
  "id": "guides",
  "path": "guides",
  "title": "指南",
  "items": [
    {
      "id": "intro",
      "title": "介绍",
      "items": [
        {
          "id": "getting-started",
          "path": "guides/getting-started",
          "title": "快速开始",
          "contentPath": "docs/guides/intro/getting-started.html"
        }
      ]
    }
  ]
}
```

## 从 docs 目录自动生成

Docgeni 会根据 `docs` 目录结构和 Front Matter 自动生成导航、菜单与路由：

- **`full` 模式**：`docs` 下一级目录 → 一级导航（顶部导航栏）
- **`full` 模式**：更深层目录 → 类别（左侧分组，无路由）
- **`lite` 模式**：所有目录 → 类别（左侧分组）
- **所有 `.md` 文件** → 文档页

### 默认路由规则

- **一级导航 / 类别**：取文件夹名，转为 Param Case，如 `GettingStarted` → `getting-started`
- **文档页**：取文件名（去掉 `.md`），转为 Param Case，并拼接所属一级导航与类别路径，如 `GettingStarted.md` → `guides/intro/getting-started`

### 默认标题规则

- **一级导航 / 类别**：取文件夹名并转为标题，如 `Guide`、`Intro`
- **文档页**：取文件名（去掉 `.md`）并转为标题，如 `Getting Started`

### 路径示例

| 文件路径 | full 模式 | lite 模式 |
| --- | --- | --- |
| `/docs/index.md` | 首页 `/` | 首页 `/` |
| `/docs/getting-started.md` | 页面 `/getting-started` | 页面 `/getting-started` |
| `/docs/guide/index.md` | 一级导航 `guide`，页面 `/guide` | 类别 `guide`，页面 `/guide` |
| `/docs/guide/hello.md` | 一级导航 `guide`，页面 `/guide/hello` | 类别 `guide`，页面 `/guide/hello` |
| `/docs/guide/basic/hello.md` | 一级导航 `guide`，类别 `basic`，页面 `/guide/basic/hello` | 类别 `basic`，页面 `/guide/basic/hello` |

### 自定义文档页

在 Markdown 文件的 Front Matter 中设置 `path`、`title`：

```markdown
---
path: getting-started
title: 快速开始
---
```

一级导航与类别的配置写在对应目录下的 `index.md` 中。若 `index.md` 本身也有正文，会额外生成一个与一级导航 / 类别同名的页面；如需单独配置，请新建非 `index.md` 的文件。

## 配置 navs（full 模式）

`full` 模式下，除 `docs` 自动识别的一级导航外，还可在 `.docgenirc.ts` 的 `navs` 中手动补充或调整顶部导航。

### 占位符 null

`docs` 下自动识别的一级导航默认追加在 `navs` 末尾。若希望它们出现在前面，在数组开头插入 `null` 占位：

```ts
export default {
    navs: [
        null, // 自动识别的 docs 一级导航插入此处
        {
            title: '组件',
            path: 'components',
            lib: 'alib',
        },
        {
            title: 'GitHub',
            path: 'https://github.com/docgeni/docgeni',
            isExternal: true,
        },
    ],
};
```

### 外部链接

设置 `isExternal: true`，`path` 填写完整 URL，会在新标签页打开：

```ts
{
    title: 'GitHub',
    path: 'https://github.com/docgeni/docgeni',
    isExternal: true,
}
```

### 下拉菜单导航 <label>2.8.0+</label>

当多个一级导航需要收拢到同一入口时，可将父级 `path` 设为空字符串，并在 `items` 中列出子项。顶部导航栏会识别为下拉菜单：父级只展示标题、不绑定路由，子项各自拥有独立路由。

满足以下条件的导航项会渲染为下拉菜单：

- `path` 为空字符串 `''`（或未设置，且不会被解析为有效路由）
- `items` 中存在至少一个子项

#### 通过 navs 配置

在 `.docgenirc.ts` 的 `navs` 中手动声明父级与子项。`docs` 下自动识别的一级导航默认追加在 `navs` 末尾；若使用 `null` 占位，未在 `navs` 中匹配到的 docs 一级导航会插入到占位处，已与 `items` 中子项 `path` 相同的 docs 导航会**合并**到对应子项（合并子目录与文档，配置中的 `title` 等字段优先保留）。

```ts
export default {
    navs: [
        null,
        {
            title: '文档',
            path: '',
            items: [
                {
                    title: '指南',
                    path: 'guides',
                },
                {
                    title: '参考',
                    path: 'reference',
                },
            ],
        },
        {
            title: '组件',
            path: 'components',
            lib: 'alib',
        },
    ],
};
```

说明：

- 父级只负责展示标题，**不生成路由**，因此 `path` 必须为空（`''` 或省略）
- `items` 中的每一项与普通一级导航配置相同，需设置有效的 `path`
- 子项同样支持 `isExternal`、`locales` 等字段

#### 通过 docs 目录自动生成

在 `full` 模式下，`docs` **下一级目录**可在该目录的 `index.md` Front Matter 中将 `path` 设为 `""`（空字符串）。构建时会生成 `path` 为空的一级导航，该目录下的子目录与文档作为 `items`，顶部导航栏同样渲染为下拉菜单。

例如 [`docs/reference/index.md`](../../reference/index.md)：

```markdown
---
title: Reference
path: ""
order: 30
---
```

`reference` 下的 `cli`、`manifest` 等子目录会作为下拉子项；子项路由规则与普通一级导航一致（默认取目录名 Param Case，也可在各自 `index.md` 中通过 `path` 覆盖）。

若未设置 `path: ""`，该目录仍按默认规则生成带路由的一级导航（如 `path: reference`）。

#### 下拉菜单中的外部链接

下拉菜单中的外部链接示例：

```ts
{
    title: '更多',
    path: '',
    items: [
        { title: '指南', path: 'guides' },
        {
            title: '更新日志',
            path: 'https://github.com/docgeni/docgeni/blob/master/CHANGELOG.md',
            isExternal: true,
        },
    ],
}
```

## 类库导航与菜单

Angular 组件库的文档与普通 Markdown 文档展示形式不同（概览、示例、API 等 Tab），需在 `navs` 中显式声明类库一级导航，并在 `libs` 中注册类库。

![Lib Component](assets/images/lib-component.png)

### 关联 navs 与 libs

```ts
export default {
    navs: [
        null,
        {
            title: '组件',
            path: 'components',
            lib: 'alib', // 对应 libs 中的 name
        },
    ],
    libs: [
        {
            name: 'alib',
            rootDir: './packages/a-lib',
            // ...
        },
    ],
};
```

`lib` 字段将一级导航与 `libs` 数组中的类库绑定。`full` 模式下，该导航项出现在顶部导航栏；进入后左侧菜单展示组件列表。

### 多类库

可同时配置多个类库，例如 Angular Material 包含 CDK 与 Components 两个库，分别对应不同的 `navs` 一级导航与 `libs` 条目。Docgeni 会扫描各 `rootDir` 下的组件目录并生成组件文档，详见 [类库配置](configuration/lib)。

```ts
libs: [
    {
        name: 'alib',
        rootDir: './packages/a-lib',
    },
    {
        name: 'blib',
        rootDir: './packages/b-lib',
    },
],
```

### 组件分类

组件较多时，可通过 `categories` 在左侧菜单中分组。每个类别需唯一 `id`，在组件文档的 Front Matter 中用 `category` 引用：

```ts
// .docgenirc.ts
categories: [
    { id: 'general', title: '通用' },
    { id: 'layout', title: '布局' },
],
```

```md
<!-- packages/a-lib/button/doc/zh-cn.md -->
---
category: general
title: Button
---
```

## 排序

默认按文件 / 文件夹名称排序。可通过 Front Matter 的 `order` 升序排列：

```markdown
---
order: 10
---
```

## 更多配置

Front Matter 的完整字段说明见 [Front Matter](configuration/front-matter)。
