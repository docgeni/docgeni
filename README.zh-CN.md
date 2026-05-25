<p align="center" style="margin-bottom: -20px">
  <a href="http://docgeni.com" target="_blank"><img width="80px" height="80px" src="https://github.com/docgeni/docgeni/blob/master/.docgeni/public/assets/images/logo.png?raw=true" /></a>
</p>
<p align="center">
  <strong>Docgeni</strong>
</p>
<p align="center">
一个现代化，强大且开箱即用的 Angular 组件文档生成器，用于 Angular 组件库和普通的 Markdown 文档生成。
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

[English](https://github.com/docgeni/docgeni/blob/master/README.md) | 中文文档

## ✨ 特性
- 📦 开箱即用，让你快速开启文档编写和组件开发
- 🏡 独立的 Angular 组件预览体验，包含：组件概览，示例，API
- 📋 对 Markdown 语法进行扩展，在文档中直接导入 Example
- 💻 多语言支持
- 🎨 两种模式(`full`和`lite`)以及多种风格(`default`和`angular`)支持
- 🚀 强大的自定义能力

## 📖 文档
开始使用 Docgeni，可以去官网学习基础知识并搜索高级功能。
- [介绍](http://docgeni.com/guides/intro)
- [快速开始](http://docgeni.com/guides/getting-started)
- [路由导航和菜单](http://docgeni.com/guides/route-nav-menu)
- [配置](http://docgeni.com/guides/configuration)

### 高级
- [自定义站点](http://docgeni.com/guides/advance/customize)
- [多语言](http://docgeni.com/guides/advance/locales)

## 谁在使用 Docgeni?
<table style="margin-top: 20px;">
  <tr>
    <td width="160" align="center" style="padding: 20px">
      <a target="_blank" href="https://pingcode.com?utm_source=github-docgeni">
        <img src="https://cdn.worktile.com/static/portal/assets/images/logos/square.png" height="40"/>
        <br />
        <strong>PingCode</strong>
      </a>
    </td>
    <td width="160" align="center" style="padding: 20px">
       <a target="_blank" href="https://worktile.com?utm_source=github-docgeni">
        <img src="https://cdn.worktile.com/static/charm/assets/images/team_logo.png" height="40"/>
        <br />
        <strong>Worktile</strong>
      </a>
    </td>
    <td width="160" align="center"  style="padding: 20px">
      <a target="_blank" href="https://github.com/worktile/ngx-planet">
        <img src="https://cdn.worktile.com/open-sources/ngx-tethys/logos/tethys.png" height="40" />
        <br />
        <strong>ngx-planet</strong>
      </a>
    </td> 
  </tr>
</table>

## ☘️ 徽章
展示使用 docgeni 的徽章，可以添加如下的语法到 README 中：

```
[![docgeni](https://img.shields.io/badge/docs%20by-docgeni-348fe4)](https://github.com/docgeni/docgeni)
```

[![docgeni](https://img.shields.io/badge/docs%20by-docgeni-348fe4)](https://github.com/docgeni/docgeni)

## 🎉 版本

@docgeni/*| @angular/*| Description
---| --- | --- 
<0.5.x|>=9.0 <=13.0 | -
\>0.5.x|>=10.0 <=13.0 | -
1.0.x|>=10.0 <=13.0 | -
1.1.x|>=10.0 <=13.0 | -
2.0.x|>=12.0 <=14.0 | -
2.1.x|>=15.0 <16.0 | -
2.2.x|>=16.0 <17.0 | -
2.3.0|>=17.0 <18.0 | -
2.4.0|>=18.0 <19.0 | -
2.5.0|>=19.0 <20.0 | -

## 💻 开发

```bash
pnpm install   // 安装所有依赖
```

```bash
pnpm start              // 启动站点，监控文档和组件文件夹的修改重新生成站点
pnpm build              // 构建所有的包
pnpm build-deps         // 构建所有底层依赖的包
pnpm build:docs         // 构建文档站点

pnpm test               // 执行单元测试
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
