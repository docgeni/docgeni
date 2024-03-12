<p align="center" style="margin-bottom: -20px">
  <a href="https://docgeni.org" target="_blank"><img width="80px" height="80px" src="https://cdn.pingcode.com/open-sources/docgeni/logo.png" /></a>
</p>
<p align="center">
  <strong>Docgeni</strong>
</p>
<p align="center">
A modern, powerful and out of the box documentation generator for Angular components lib and markdown docs.
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

English | [中文文档](https://github.com/docgeni/docgeni/blob/master/README.zh-CN.md)

## ✨ Features
- 📦 Out of the box, let you quickly open the document writing and component development
- 🏡 Independent angular component preview experience, including: component overview, examples, and API
- 📋 Extend the markdown syntax and import examples directly into the document
- 💻 Multi-language support
- 🎨 Two modes(`full` and `lite`) and multiple themes(`default` and `angular`)  support
- 🚀 Powerful customization site ability (HTML, Browser support, Assets ...)

## 📖 Documentation
Get started with Docgeni, learn the fundamentals and explore advanced topics on our documentation website.
- [Introduce](https://docgeni.org/guides/intro)
- [Getting Started](https://docgeni.org/guides/getting-started)
- [Route & Nav & Menu](https://docgeni.org/guides/route-nav-menu)
- [Configuration](https://docgeni.org/guides/configuration)

### Advanced
- [Customize Site](https://docgeni.org/guides/advance/customize)
- [Multi-language](https://docgeni.org/guides/advance/locales)

## Who are using Docgeni?

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

## ☘️ Badge
Show the world you're using docgeni?
Add a README badge to show it via: 

```
[![docgeni](https://img.shields.io/badge/docs%20by-docgeni-348fe4)](https://github.com/docgeni/docgeni)
```

[![docgeni](https://img.shields.io/badge/docs%20by-docgeni-348fe4)](https://github.com/docgeni/docgeni)

## 🎉 Versions

@docgeni/*| @angular/*| Description
---| --- | --- 
<0.5.x|>=9.0 <=13.0 | -
\>0.5.x|>=10.0 <=13.0 | -
1.0.x|>=10.0 <=13.0 | -
1.1.x|>=10.0 <=13.0 | -
2.0.x|>=12.0 <=14.0 | -
2.1.x|>=15.0 <16.0 | -
2.2.x|>=16.0 <=16.0 | -
2.3.0|>=17.0 <=17.0 | -


## 💻 Development

```bash
yarn   // install dependencies for all packages
```

```bash
yarn start              // build docs, watch docs change and start site project
yarn build              // build all packages
yarn build-deps         // build all deps packages
yarn build:docs         // build docs & site project

yarn test               // run test cases
```

## 💼 Packages

Package| Version| Links
---| --- | --- 
[`@docgeni/cli`](https://npmjs.com/package/@docgeni/cli) | [![latest](https://img.shields.io/npm/v/%40docgeni%2Fcli/latest.svg)](https://npmjs.com/package/@docgeni/cli) | [![README](https://img.shields.io/badge/README--green.svg)](/packages/cli/README.md) 
[`@docgeni/core`](https://npmjs.com/package/@docgeni/core) | [![latest](https://img.shields.io/npm/v/%40docgeni%2Fcore/latest.svg)](https://npmjs.com/package/@docgeni/core) | [![README](https://img.shields.io/badge/README--green.svg)](/packages/core/README.md) 
[`@docgeni/toolkit`](https://npmjs.com/package/@docgeni/toolkit) | [![latest](https://img.shields.io/npm/v/%40docgeni%2Ftoolkit/latest.svg)](https://npmjs.com/package/@docgeni/toolkit)  | [![README](https://img.shields.io/badge/README--green.svg)](/packages/toolkit/README.md) 
[`@docgeni/template`](https://npmjs.com/package/@docgeni/template) | [![latest](https://img.shields.io/npm/v/%40docgeni%2Ftemplate/latest.svg)](https://npmjs.com/package/@docgeni/template)  | [![README](https://img.shields.io/badge/README--green.svg)](/packages/template/README.md) 

## LICENSE

[MIT LICENSE](https://github.com/docgeni/docgeni/blob/master/LICENSE)
