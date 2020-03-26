# Docg (on the way)

a documentation site generator for markdown docs, Angular components.

## Installation

```
npm i @docg/cli --save-dev
```

Add scripts to package.json as followings:

```
{
  scripts: {
    ...
    "docs:dev": "docg dev",
    "docs:build": "docg build"
    ...
  }
}
```
Add `docs` folder and add `index.md` file to docs.

run `npm run docs:dev` and open `http://127.0.0.1:8888`
