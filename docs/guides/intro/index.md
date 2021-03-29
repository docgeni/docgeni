---
title: 介绍
path: 'intro'
order: 10
---

# 什么是 Docgeni？

`Docgeni` 是一款为 Angular 组件开发场景而生的文档工具，支持组件文档和普通的 Markdown 文档生成。

Docgeni 会自动根据目录结构和 FrontMatter 生成对应的文档导航、菜单和路由，同时也支持配置式路由以满足自定义需要；另外，为了便于开发组件和展示组件示例, Docgeni 支持在 Markdown 语法中导入示例。

# 特性
- 📦 开箱即用，让你快速开启文档编写和组件开发
- 🏡 独立的 Angular 组件预览体验，包含：组件概览，示例，API
- 📋 对 Markdown 语法进行扩展，在文档中直接导入 Example
- 💻 多语言支持
- 🚀 两种模式以及多种风格支持

# 动机
2018年，[Worktile](https://worktile.com/?utm_source=docgeni) 开始使用 Angular 搭建自己的组件库，经过了2-3年的时间我们的组件库已经有50+个组件了。 那么对于组件库开发来说，文档和示例是非常重要的一环，我们一开始也是和其他组件库一样直接在仓储中写一个 Demo 站点作为文档和示例展示，每当新增一个组件就需要在示例中新增这个组件对应的示例模块，示例组件等等，写组件的示例和文档非常的繁琐，同时加上我们2019年开始搭建业务组件库，意味着同样的示例基础功能我还要再次写一遍，特别麻烦，另外就是之前的文档站点很不专业，所以就开始寻找 一款 Angular 组件开发生成文档和组件示例的工具。

寻找和研究了很多组件文档生成工具，发现 React 和 Vue 框架的方案有很多，Angular 框架居然没有一个开箱即用的组件文档的生成工具，大家比较熟悉的 Angular 组件库（比如：[Material Design](https://github.com/angular/components)、[ng-zorro-antd](https://github.com/NG-ZORRO/ng-zorro-antd)、[ngx-bootstrap](https://github.com/valor-software/ngx-bootstrap) 等）都是在仓储内部搭建的示例站点，无法直接被其他组件库复用，所以最终就萌生了我们要自己写一个为 Angular 组件开发而生的文档工具的想法。

[awesome-docgen](https://github.com/docgeni/awesome-docgen) 这个仓储列举出了我们当时调研的一些文档生成工具，[storybook](https://github.com/storybookjs/storybook) 可能是唯一一个支持 Angular 框架的文档生成工具，但是它的展示形态和写法挺繁琐了，最终没有选择使用它。

# 文档工具的类别

1. 普通文档：纯 Markdown 语法的文档，前后端通用，主要展示入门指南，配置说明文档使用，这样的工具有无数个
1. 组件文档：基本和前端框架绑定，展示组件的使用说明，组件的参数，组件的示例（Examples）
1. API文档：类似 Angular 官方的 API，当然大部分组件库是不需要这个功能的

对于 Docgeni 以及类似的组件文档生成工具来说，普通文档和组件文档都是支持的，当然对于一些纯文档的场景，使用 Docgeni 只生成 Markdown 文档也是可以的。

# 参与贡献
Docgeni 目前还处于开发中，欢迎一起参与贡献 Docgeni: https://github.com/docgeni/docgeni

