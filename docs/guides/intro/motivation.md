---
title: 动机
path: 'motivation'
order: 2
---

2018年，我们开始使用`Angular`搭建自己的组件库，起初为了快速的响应业务，组件库底层依赖了 [ngx-bootstrap](https://github.com/valor-software/ngx-bootstrap)，然后在这个基础上逐步封装一些组件，比如按钮(Button)、导航(Nav)、徽标(Badge)、头像(Avatar)、表格(Table) 等，一些来不及做的组件直接使用 ngx-bootstrap, 经过了2年的时间我们的组件库已经有50+个组件了。
那么对于组件库开发来说，示例和文档是非常重要的一环，我们一开始也是和其他组件库一样在组件库仓储中写一个 Demo 的示例项目，每当新增一个组件就需要在示例中新增这个组件对应的示例模块，示例组件等等，写组件的示例和文档非常的繁琐，同时加上我们2019年开始搭建内部的业务组件库，意味着同样的示例基础功能我还要再次写一遍，很是麻烦，再加上之前的文档很不专业，所以就开始寻找一个为 Angular 组件开发生成文档和组件示例的工具。

寻找和研究了很多组件文档生成工具，发现 React 和 Vue 框架的方案有很多，Angular 框架居然没有一个开箱即用的组件文档的生成工具。大家比较熟悉的 Angular 组件库（比如：[Material Design](https://github.com/angular/components)、[ng-zorro-antd](https://github.com/NG-ZORRO/ng-zorro-antd)、[ngx-bootstrap](https://github.com/valor-software/ngx-bootstrap) 等）都是在仓储内部搭建的 Demo，无法直接被其他组件库复用，所以最终就萌生了我们要自己写一个为 Angular 组件开发而生的文档工具的想法。


[awesome-docgen](https://github.com/why520crazy/awesome-docgen) 这个仓储列举出了我们调研的文档生成工具。

## 组件文档分类
- 纯 Markdown 语法的文档：主要为 Guide，Configuration 说明文档使用，这样的工具有无数个
- Angular 组件文档：既有组件的使用说明，还要有组件参数说明文档，最重要的是需要有使用示例（Examples）
- 当然对于一些纯服务的模块，可能还需要API文档，类似 Angular 官方的 API，当然大部分组件库是不需要这个功能的

## 为 Angular 量身打造

Angular 是一款非常优秀的前端框架，苦于一个组件库文档生成工具都没有，为了回馈社区，我们专门为 Angular 框架打造一款文档生成工具。
