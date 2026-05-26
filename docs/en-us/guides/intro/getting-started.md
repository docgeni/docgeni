---
title: Getting Started
path: 'getting-started'
order: 30
toc: menu
---

This page shows how to run a Docgeni doc site in an existing or new project. See other guides for advanced configuration.

## Requirements

Install [Node.js](https://nodejs.org/) (LTS recommended) and npm, **≥ 10**:

```bash
node -v
```

## Option 1: CLI init (recommended)

In an **existing Angular project** or empty folder, run one of:

<tabs mode="code-group">
 <tab label="npx">
```bash
npx @docgeni/cli init
```
 </tab>
  <tab label="docgeni">
```bash
docgeni init
```
 </tab>
 <tab label="ng">
```bash
ng add @docgeni/cli
```
 </tab>
</tabs>

<alert>`docgeni init` requires a global CLI: `npm install -g @docgeni/cli`<br>
`ng add @docgeni/cli` requires global Angular CLI: `npm install -g @angular/cli`</alert>

You will typically:

1. Choose site mode: `full` (home page) or `lite` (default, docs only)
2. Set the docs folder (default `docs`)

<img class="mb-2" width="90%" style="padding-left: 5%;" src="./assets/images/cli-init.png?4" />

Then:

```bash
npm run start:docs
```

Open [http://127.0.0.1:4600](http://127.0.0.1:4600).

Lite mode preview:

![](assets/images/lite-preview.png)

<alert type="info">The site you are reading now (official Docgeni docs) runs in `full` mode. The screenshot above shows `lite` mode only.</alert>

## Option 2: GitHub template

For a full demo out of the box, use [docgeni-template](https://github.com/docgeni/docgeni-template) (`full` mode, sample library `alib`):

1. Open the [template repo](https://github.com/docgeni/docgeni-template)
2. Click **Use this template**
3. Clone, `npm install`, then `npm run start:docs`

<img class="mt-2" src="./assets/images/use-docgeni-template.png" />

![](assets/images/template-preview.png)

## Option 3: Manual setup

For full control over dependencies and config.

### Install

::: code-group

```bash [npm]
npm i @docgeni/cli @docgeni/template --save-dev
```

```bash [yarn]
yarn add @docgeni/cli @docgeni/template -D
```

:::

Add scripts to `package.json`:

```json
{
  "scripts": {
    "start:docs": "docgeni serve --port 4600",
    "build:docs": "docgeni build"
  }
}
```

### Configuration

Create a config file at the project root. Supported names include `.docgenirc.js`, `.docgenirc.ts`, `.docgenirc.yaml`, `.docgenirc.yml`, `.docgenirc.json`, and more—use any one format. Example with `.docgenirc.js`:

```ts
/**
 * @type {import('@docgeni/core').DocgeniConfig}
 */
module.exports = {
    mode: 'lite',
    title: 'Docgeni',
    repoUrl: 'https://github.com/docgeni/docgeni',
    navs: [
        null,
        {
            title: 'GitHub',
            path: 'https://github.com/docgeni/docgeni',
            isExternal: true,
        },
    ],
};
```

### Start writing docs

By default, Docgeni watches Markdown files in the `docs` directory. Create a minimal page first:

```bash
mkdir -p docs
echo '# Hello Docgeni' > docs/getting-started.md
```

Run `npm run start:docs` and open [http://127.0.0.1:4600](http://127.0.0.1:4600).

### Ignore generated output

Add to `.gitignore`:

```
.docgeni/site
```

## Component documentation

If your repo has an Angular library, init will try to wire it in. **Components without overview or examples are hidden from the nav.**

Minimal example: for a `button` folder, add `button/doc/{locale}.md` (match your `defaultLocale`, e.g. `en-us.md`):

```markdown
---
title: Button
subtitle: Button
---

## When to use

A button triggers an immediate action.
```

Preview:

![Component](assets/images/component-button.png)

See [Component documentation](../basic/component) for overview, examples, `api`, and `<example />`.
