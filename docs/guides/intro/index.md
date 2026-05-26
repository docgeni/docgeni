---
title: 介绍
path: 'intro'
order: 10
toc: hidden
---

## 什么是 Docgeni？

Docgeni 是面向 **Angular 组件库与文档站** 的静态站点生成工具。你可以用它做两件事：

- 写普通的 **Markdown 文档**（指南、配置说明等）
- 为组件库生成 **概览、在线示例、API** 页面，并在文档里嵌入可运行的 Example

把 Markdown 放在约定好的目录里，配置好 `.docgenirc.js`，Docgeni 会根据目录结构和 Front Matter **自动生成导航、侧边菜单和路由**。也支持自定义顶部导航、多语言，以及在 Markdown 里用 `<example />` 引用组件示例。

## 主要特性

- 📦 **开箱即用**：CLI 初始化即可本地预览文档站
- 🏡 **组件预览**：独立示例区，支持概览、示例、API
- 📋 **Markdown 扩展**：代码组、Embed、内置组件、示例引用等
- 💻 **多语言**：文档与配置项均可按语言拆分
- 🎨 **两种模式**：`full`（含首页）与 `lite`；主题支持 `default` / `angular`
- 🚀 **可扩展**：`public`、`components`、`app` 等目录覆盖站点能力

## 为什么做 Docgeni？

2018 年起，[Worktile](https://worktile.com/?utm_source=docgeni) 用 Angular 搭建内部组件库，几年间组件数量超过 50 个。当时和其他库一样，在仓库里维护一个 Demo 站：每加一个组件就要手写示例模块、路由和文档页，成本高；2019 年再做业务组件库时，同类工作又要重复一遍，且站点形态也不够统一。

调研后发现，React / Vue 生态文档工具很多，而 **Angular 缺少一款可直接复用的「组件库文档站」方案**。Material、ng-zorro、ngx-bootstrap 等多在仓库内自建示例站，难以抽成通用工具。[Storybook](https://github.com/storybookjs/storybook) 虽支持 Angular，但与我们希望的「类文档站 + 目录驱动」体验差异较大。因此我们做了 Docgeni，调研记录见 [awesome-docgen](https://github.com/docgeni/awesome-docgen)。

## 适用场景

| 类型 | 说明 | Docgeni 是否支持 |
| --- | --- | --- |
| 普通文档 | 入门、配置、changelog 等 Markdown | ✅ 支持 |
| 组件文档 | 用法说明、参数、可运行示例 | ✅ 支持 |
| 独立 API 站 | 类似 angular.io 的纯 API 浏览 | 非主要场景；组件 API 随组件页生成 |

## 参与贡献

欢迎参与共建：[github.com/docgeni/docgeni](https://github.com/docgeni/docgeni) :heart: :tada:
