---
title: 自定义首页
order: 10
---

在 **`full` 模式**下，访问站点根路径 `/` 时会展示首页，而不是直接进入某篇文档。首页适合用来介绍产品、放快速入口，下面说明如何配置。

## 首页由哪几个部分组成？

从上到下，首页大致分为三块：

| 区域 | 作用 | 配置方式 |
| --- | --- | --- |
| **Hero** | 大标题、一句话介绍、背景图、操作按钮 | Front Matter 里的 `hero` |
| **特性（Features）** | 多列卡片，展示产品亮点 | Front Matter 里的 `features` |
| **正文** | 和普通文档一样的 Markdown 内容 | `index.md` 中 `---` 以下的正文 |

示意：

```
┌─────────────────────────────────────┐
│  Hero：标题 + 描述 + 按钮 + 背景图   │  ← hero
├─────────────────────────────────────┤
│  Features：图标 + 标题 + 说明        │  ← features
├─────────────────────────────────────┤
│  正文：Markdown（如「快速上手」）     │  ← 文件正文
└─────────────────────────────────────┘
```

<alert type="info">`lite` 模式没有独立首页，打开站点会直接进入文档列表。</alert>

## 从哪个文件改？

首页对应 **`docs/index.md`**（多语言时，默认语言用 `docs/index.md`，其他语言用 `docs/{语言 key}/index.md`，例如 `docs/en-us/index.md`）。

- **Hero、特性**：写在文件顶部的 YAML Front Matter（`---` 之间）
- **正文**：写在第二个 `---` 之后，语法与普通 `.md` 文档相同

本仓库的 [首页示例](/) 就是 `docs/index.md`，可直接对照修改。

## 预览效果

![](assets/images/home-preview.png)

## 配置 Hero

`hero` 控制页面最上方的大图区域。

| 字段 | 说明 |
| --- | --- |
| `title` | 主标题 |
| `description` | 副标题 / 一句话介绍 |
| `banner` | 背景图路径。可写字符串，或写数组 `[浅色图, 深色图]` 以适配主题切换 |
| `backgroundColor` | 背景色，默认 `#dae6f3`；未设置 `banner` 时更明显 |
| `actions` | 按钮列表，每项包含 `text`、`link`，以及可选的 `btnShape`、`btnType` |

**按钮相关字段（写在每个 `actions` 项里）：**

| 字段 | 说明 |
| --- | --- |
| `text` | 按钮文字 |
| `link` | 跳转地址，站内路径如 `/guides/intro/getting-started` |
| `btnShape` | 形状：`round`（圆角）或 `square`（方角），默认 `square` |
| `btnType` | 样式：`primary`、`primary-light`、`success`、`danger` 等，默认 `primary-light`；线框样式加前缀 `outline-`，如 `outline-primary-light` |

示例：

```yaml
---
hero:
  title: Docgeni
  description: 开箱即用的 Angular 组件文档生成工具
  banner:
    - ./assets/images/home/banner.png
    - ./assets/images/home/dark-banner.png
  backgroundColor: '#dae6f3'
  actions:
    - text: 快速上手
      link: /guides/intro/getting-started
      btnShape: round
    - text: 介绍
      link: /guides/intro
      btnType: outline-primary-light
      btnShape: square
---
```

图片路径相对于 **`docs` 目录**。若标题挡住背景图，可通过 [自定义样式](/guides/advance/customize) 覆盖 Hero 区域样式。

## 配置特性（Features）

`features` 是一个数组，每一项展示一张「特性卡片」：

| 字段 | 说明 |
| --- | --- |
| `icon` | 图标路径（相对 `docs` 目录） |
| `title` | 特性名称 |
| `description` | 简短说明 |

示例：

```yaml
---
features:
  - icon: ./assets/images/home/feature1.png
    title: 开箱即用
    description: 根据目录结构自动生成导航和菜单，通过命令行零成本上手
  - icon: ./assets/images/home/feature2.png
    title: 为 Angular 组件开发而生
    description: 组件概览、示例、API 与 Markdown 扩展，让文档更好写
  - icon: ./assets/images/home/feature3.png
    title: 两种模式与多种风格
    description: 支持 full / lite 模式，以及默认与 Angular 两套主题风格
---
```

卡片数量没有硬性限制，一般 3～6 个为宜，过多会显得拥挤。

## 完整示例

下面把 Hero、特性和正文写在一起（正文在 Front Matter 之后）：

```yaml
---
title: 首页
hero:
  title: 我的组件库
  description: 团队内部 UI 组件文档
  banner: ./assets/images/home/banner.png
  actions:
    - text: 查看文档
      link: /guides/intro/getting-started
features:
  - icon: ./assets/images/home/feature1.png
    title: 设计统一
    description: 所有组件遵循同一套设计规范
  - icon: ./assets/images/home/feature2.png
    title: 在线预览
    description: 文档内直接运行示例，所见即所得
---

## 快速开始

在项目中执行 `npx @docgeni/cli init`，然后运行 `npm run start:docs` 即可本地预览。
```

保存后重新构建或刷新开发服务器，即可在浏览器中看到更新后的首页。
