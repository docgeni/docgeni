# Docgeni (WIP)

A modern and simply documentation generator for markdown docs and Angular components lib

## Installation

```
npm i @docgeni/cli --save-dev
or 
yarn add @docgeni/cli -D
```

Add scripts to package.json as followings:

```json
{
  "scripts": {
    ...
    "docs:start": "docgeni serve",
    "docs:build": "docgeni build"
    ...
  }
}
```
Add `docs` folder and add `index.md` file to docs.

run `npm run docs:start` and open `http://127.0.0.1:8888`

## Development

```
yarn   // install dependencies for all packages
```

```
yarn docs:build   // build docs for test
yarn docs:start   // build docs for test and watch
```

## Packages

Package| Version| Links
---| --- | --- 
[`@docgeni/cli`](https://npmjs.com/package/@docgeni/cli) | [![latest](https://img.shields.io/npm/v/%40docgeni%2Fcli/latest.svg)](https://npmjs.com/package/@docgeni/cli) | [![README](https://img.shields.io/badge/README--green.svg)](/packages/cli/README.md) 
[`@docgeni/core`](https://npmjs.com/package/@docgeni/core) | [![latest](https://img.shields.io/npm/v/%40docgeni%2Fcore/latest.svg)](https://npmjs.com/package/@docgeni/core) | [![README](https://img.shields.io/badge/README--green.svg)](/packages/core/README.md) 
[`@docgeni/toolkit`](https://npmjs.com/package/@docgeni/toolkit) | [![latest](https://img.shields.io/npm/v/%40docgeni%2Ftoolkit/latest.svg)](https://npmjs.com/package/@docgeni/toolkit)  | [![README](https://img.shields.io/badge/README--green.svg)](/packages/toolkit/README.md) 
[`@docgeni/template`](https://npmjs.com/package/@docgeni/template) | [![latest](https://img.shields.io/npm/v/%40docgeni%template/latest.svg)](https://npmjs.com/package/@docgeni/template)  | [![README](https://img.shields.io/badge/README--green.svg)](/packages/template/README.md) 
