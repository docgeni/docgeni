---
title: 动机
path: 'motivation'
order: 20
hidden: true
---

# 动机
2018年，[Worktile](https://worktile.com/?utm_source=docgeni) 开始使用 Angular 搭建自己的组件库，经过了2-3年的时间我们的组件库已经有50+个组件了。 那么对于组件库开发来说，文档和示例是非常重要的一环，我们一开始也是和其他组件库一样直接在仓储中写一个 Demo 站点作为文档和示例展示，每当新增一个组件就需要在示例中新增这个组件对应的示例模块，示例组件等等，写组件的示例和文档非常的繁琐，同时加上我们2019年开始搭建业务组件库，意味着同样的示例基础功能我还要再次写一遍，特别麻烦，另外就是之前的文档站点很不专业，所以就开始寻找 一款 Angular 组件开发生成文档和组件示例的工具。

寻找和研究了很多组件文档生成工具，发现 React 和 Vue 框架的方案有很多，Angular 框架居然没有一个开箱即用的组件文档的生成工具。大家比较熟悉的 Angular 组件库（比如：[Material Design](https://github.com/angular/components)、[ng-zorro-antd](https://github.com/NG-ZORRO/ng-zorro-antd)、[ngx-bootstrap](https://github.com/valor-software/ngx-bootstrap) 等）都是在仓储内部搭建的示例站点，无法直接被其他组件库复用，所以最终就萌生了我们要自己写一个为 Angular 组件开发而生的文档工具的想法。

[awesome-docgen](https://github.com/docgeni/awesome-docgen) 这个仓储列举出了我们当时调研的一些文档生成工具，[storybook](https://github.com/storybookjs/storybook) 可能是唯一一个支持 Angular 框架的文档生成工具，但是它的展示形态和写法挺繁琐了，最终没有选择使用它。

# 文档工具的分类
- 纯 Markdown 语法的文档：前后端通用，主要展示入门指南，配置说明文档使用，这样的工具有无数个
- 组件文档：基本和前端框架绑定，展示组件的使用说明，组件的参数，组件的示例（Examples）
- API文档：类似 Angular 官方的 API，当然大部分组件库是不需要这个功能的
对于 Docgeni 以及类似的组件文档生成工具来说，1和2可能都是需要支持的，当然对于一些纯文档的场景，使用 Docgeni 只生成 Markdown 文档也是可以的。

# 为 Angular 量身打造

Angular 是一款非常优秀的前端框架，苦于一个组件库文档生成工具都没有，为了回馈社区，我们专门为 Angular 框架打造一款文档生成工具。
