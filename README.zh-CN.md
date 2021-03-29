<p align="center" style="margin-bottom: -20px">
  <a href="https://docgeni.org" target="_blank"><img width="80px" height="80px" src="https://cdn.worktile.com/open-sources/docgeni/logos/docgeni.png" /></a>
</p>
<p align="center">
  <strong>Docgeni</strong>
</p>
<p align="center">
一个现代化，强大且开箱即用的 Angular 组件文档生成器，用于 Angular 组件库和普通的 Markdown 文档。
</p>

[![docgeni](https://img.shields.io/badge/docs%20by-docgeni-348fe4)](https://github.com/docgeni/docgeni)
[![CircleCI](https://circleci.com/gh/docgeni/docgeni.svg?style=shield)](https://circleci.com/gh/docgeni/docgeni)
[![Coverage Status][coveralls-image]][coveralls-url]
[![npm (scoped)](https://img.shields.io/npm/v/@docgeni/cli?style=flat)](https://www.npmjs.com/package/@docgeni/cli)
[![npm](https://img.shields.io/npm/dm/@docgeni/cli)](https://www.npmjs.com/package/@docgeni/cli)
[![npm](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
)](https://github.com/prettier/prettier)


[coveralls-image]: https://coveralls.io/repos/github/docgeni/docgeni/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/docgeni/docgeni?branch=master

[English](https://github.com/docgeni/docgeni/blob/master/README.md)

## ✨ Features
- 📦 开箱即用，让你快速开启文档编写和组件开发
- 🏡 独立的 Angular 组件预览体验，包含：组件概览，示例，API
- 📋 对 Markdown 语法进行扩展，在文档中直接导入 Example
- 💻 多语言支持
- 🚀 两种模式(`full`和`lite`))以及多种风格((`default`和`angular`)支持


## 📖 文档
开始使用 Docgeni，可以去官网学习基础知识并搜索高级功能。
- [介绍](https://docgeni.org/guides/intro)
- [快速开始](https://docgeni.org/guides/getting-started)
- [路由导航和菜单](https://docgeni.org/guides/route-nav-menu)
- [配置](https://docgeni.org/guides/configuration)

### 高级
- [自定义站点](https://docgeni.org/guides/advance/customize)
- [多语言](https://docgeni.org/guides/advance/locales)

## ☘️ 徽章
展示使用 docgeni 的徽章，可以添加如下的语法到 README 中：

```
[![docgeni](https://img.shields.io/badge/docs%20by-docgeni-348fe4)](https://github.com/docgeni/docgeni)
```

[![docgeni](https://img.shields.io/badge/docs%20by-docgeni-348fe4)](https://github.com/docgeni/docgeni)

## 🔗 链接
- [ngx-planet](https://github.com/worktile/ngx-planet)
- [PingCode](https://pingcode.com?utm_source=github-docgeni)

## 💻 开发

```bash
yarn   // 安装所有依赖
```

```bash
yarn build-deps   // build all packages
yarn build:docs   // build docs & lib demo
yarn start        // build docs, watch docs change and start site project
yarn start:site   // Ony start site project use ng serve

yarn test         // run test cases
```

## 💼 包

Package| Version| Links
---| --- | --- 
[`@docgeni/cli`](https://npmjs.com/package/@docgeni/cli) | [![latest](https://img.shields.io/npm/v/%40docgeni%2Fcli/latest.svg)](https://npmjs.com/package/@docgeni/cli) | [![README](https://img.shields.io/badge/README--green.svg)](/packages/cli/README.md) 
[`@docgeni/core`](https://npmjs.com/package/@docgeni/core) | [![latest](https://img.shields.io/npm/v/%40docgeni%2Fcore/latest.svg)](https://npmjs.com/package/@docgeni/core) | [![README](https://img.shields.io/badge/README--green.svg)](/packages/core/README.md) 
[`@docgeni/toolkit`](https://npmjs.com/package/@docgeni/toolkit) | [![latest](https://img.shields.io/npm/v/%40docgeni%2Ftoolkit/latest.svg)](https://npmjs.com/package/@docgeni/toolkit)  | [![README](https://img.shields.io/badge/README--green.svg)](/packages/toolkit/README.md) 
[`@docgeni/template`](https://npmjs.com/package/@docgeni/template) | [![latest](https://img.shields.io/npm/v/%40docgeni%2Ftemplate/latest.svg)](https://npmjs.com/package/@docgeni/template)  | [![README](https://img.shields.io/badge/README--green.svg)](/packages/template/README.md) 

## 许可证

[MIT LICENSE](https://github.com/docgeni/docgeni/blob/master/LICENSE)
