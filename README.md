# Docgeni (WIP)

a documentation site generator for markdown docs, Angular components.

## Installation

```
npm i @docgeni/cli --save-dev
```

Add scripts to package.json as followings:

```
{
  scripts: {
    ...
    "docs:start": "docgeni serve",
    "docs:build": "docgeni build"
    ...
  }
}
```
Add `docs` folder and add `index.md` file to docs.

run `npm run docs:dev` and open `http://127.0.0.1:8888`
