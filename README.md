<p align="center" style="margin-bottom: -20px">
  <a href="https://docgeni.org" target="_blank"><img width="80px" height="80px" src="https://cdn.worktile.com/open-sources/docgeni/logos/docgeni.png" /></a>
</p>
<p align="center">
  <strong>Docgeni(WIP)</strong>
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

## ✨ Features
- 📦 Out of the box, enabling you to quickly open documentation and component development
- 🏡 Independent angular component preview experience component overview, including examples, API
- 📋 Extend markdown syntax and import example directly into the document
- 💻 Multilingual support
- 🚀 Support `full` and `lite` mode and multiple theme(`default` and `angular`) support

## 📦 Installation

```bash
$ npm i @docgeni/cli --save-dev
# or 
$ yarn add @docgeni/cli -D
```

Add scripts to package.json as followings:

```json
{
  "scripts": {
    ...
    "start:docs": "docgeni serve --port 4600",
    "build:docs": "docgeni build"
    ...
  }
}
```
Add `docs` folder and add `index.md` file to docs.

run `npm run start:docs` and open `http://127.0.0.1:4600`

## ☘️ Badge
Show the world you're using docgeni?
Add a README badge to show it via: 

```
[![docgeni](https://img.shields.io/badge/docs%20by-docgeni-348fe4)](https://github.com/docgeni/docgeni)
```

[![docgeni](https://img.shields.io/badge/docs%20by-docgeni-348fe4)](https://github.com/docgeni/docgeni)

## 🔗 Links
- [ngx-planet](https://github.com/worktile/ngx-planet)
- [PingCode](https://pingcode.com?utm_source=github-docgeni)

## 💻 Development

```bash
yarn   // install dependencies for all packages
```

```bash
yarn build-deps   // build all packages
yarn build:docs   // build docs & lib demo
yarn start        // build docs, watch docs change and start site project
yarn start:site   // Ony start site project use ng serve

yarn test         // run test cases
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
