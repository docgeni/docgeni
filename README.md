<p align="center" style="margin-bottom: -20px">
  <img width="80px" height="80px" src="https://cdn.worktile.com/open-sources/docgeni/logos/docgeni.png">
</p>
<p align="center">
  <strong>Docgeni(WIP)</strong>
</p>
<p align="center">
A modern, powerful and out of the box documentation generator for Angular components lib and markdown docs.
</p>

[![Docgeni](https://img.shields.io/badge/docgeni-welcome-blue)](https://github.com/docgeni/docgeni)
[![CircleCI](https://circleci.com/gh/docgeni/docgeni.svg?style=shield)](https://circleci.com/gh/docgeni/docgeni)
[![Coverage Status][coveralls-image]][coveralls-url]
[![npm (scoped)](https://img.shields.io/npm/v/@docgeni/cli?style=flat)](https://www.npmjs.com/package/@docgeni/cli)
[![npm](https://img.shields.io/npm/dm/@docgeni/cli)](https://www.npmjs.com/package/@docgeni/cli)

[coveralls-image]: https://coveralls.io/repos/github/docgeni/docgeni/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/docgeni/docgeni?branch=master
## Installation

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

## Development

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

## Packages

Package| Version| Links
---| --- | --- 
[`@docgeni/cli`](https://npmjs.com/package/@docgeni/cli) | [![latest](https://img.shields.io/npm/v/%40docgeni%2Fcli/latest.svg)](https://npmjs.com/package/@docgeni/cli) | [![README](https://img.shields.io/badge/README--green.svg)](/packages/cli/README.md) 
[`@docgeni/core`](https://npmjs.com/package/@docgeni/core) | [![latest](https://img.shields.io/npm/v/%40docgeni%2Fcore/latest.svg)](https://npmjs.com/package/@docgeni/core) | [![README](https://img.shields.io/badge/README--green.svg)](/packages/core/README.md) 
[`@docgeni/toolkit`](https://npmjs.com/package/@docgeni/toolkit) | [![latest](https://img.shields.io/npm/v/%40docgeni%2Ftoolkit/latest.svg)](https://npmjs.com/package/@docgeni/toolkit)  | [![README](https://img.shields.io/badge/README--green.svg)](/packages/toolkit/README.md) 
[`@docgeni/template`](https://npmjs.com/package/@docgeni/template) | [![latest](https://img.shields.io/npm/v/%40docgeni%2Ftemplate/latest.svg)](https://npmjs.com/package/@docgeni/template)  | [![README](https://img.shields.io/badge/README--green.svg)](/packages/template/README.md) 
