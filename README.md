# Docgeni (WIP)

A modern and simply documentation generator for markdown docs and Angular components lib

## Installation

```
npm i @docgeni/cli --save-dev
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

run `npm run docs:dev` and open `http://127.0.0.1:8888`
