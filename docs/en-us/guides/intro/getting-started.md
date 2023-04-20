---
title: Getting Started
path: 'getting-started'
order: 30
---
# Environment setup
You should have [Node](https://nodejs.org/en/) and NPM, Node >= 10.0.0.
```
$ node -v
v10.0.0
```

# Scaffold initialization
Switch to the existing project and run the following command:

```bash
$ npx @docgeni/cli init
# or 
$ docgeni init 
# or 
$ ng add @docgeni/cli
```
<alert>Initialization with `docgeni init` requires global installation of @docgeni/cli `npm install -g @docgeni/cli`<br>
  Initialization with `ng add @docgeni/cli` requires global installation of Angular CLI `npm install -g @angular/cli`</alert>

After executing any of the above command, the initial configuration of docgeni will be automatically completed, including generating configuration files, NPM startup scripts, and default documents ,etc.
- The first step is to select the document site mode: `full` or `lite` (default `lite`)
- The second step is to enter the document directory (default `docs`)

<img class="mb-2" width="90%" style="padding-left: 5%;" src="https://cdn.pingcode.com/open-sources/docgeni/cli-init.png?4" />

After initialization, use `npm run start:docs` to start the documentation site, and open `http://127.0.0.1:4600` in the browser to access it.

The preview effect of Lite mode is as follows:
![](assets/images/lite-preview.png)

# Template repository initialization
We provide a built-in GitHub template repository [docgeni-template](https://github.com/docgeni/docgeni-template).The template repository uses the `full` mode by default, and has a built-in `alib` component library and some initial configurations.Go to the [template repository homepage](https://github.com/docgeni/docgeni-template),then click the "Use this template" button in the upper right corner.
<img class="mt-2" src="https://cdn.pingcode.com/open-sources/docgeni/use-docgeni-template.png" />

The preview effect is as follows:
![](assets/images/template-preview.png)

# Manual initialization
## Installation
Create a new directory, or switch to an existing project, execute the following command to install Docgeni CLI and template:
```bash
$ npm i @docgeni/cli @docgeni/template --save-dev
# or 
$ yarn add @docgeni/cli @docgeni/template -D
```

After installation, add the following script to the `package.json`:

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
## Configuration
Create a new `.docgenirc.js` configuration file in the root directory and copy the following configuration code:

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
            isExternal: true
        }
    ]
}
```
## Start writing docs

By default, Docgeni will automatically watch the Markdown files in the `docs` directory, we can create the simplest document at first.

```base
$ mkdir docs && echo 'Hello Docgeni!' > docs/getting-started.md
```

Execute `npm run start:docs` and open your browser to `http://127.0.0.1:4600` 

## .gitignore add `.docgeni/site`
By default, Docgeni will generate documentation sites in the `.docgeni/site` folder. To avoid conflicts, please add the `.docgeni/site` folder to .gitignore.


# Component documentation
Docgeni initial scaffold will automatically detect and add the libraries in the current Angular project. If the components of the library have not been written with documentation and examples, they will not be displayed. You can write component documentation,API,and examples according to the rules of the [Overview & API & Examples](basic/component). For example: there is a `button` component under the component root directory,create an `en-us.md` document(Attention to be named after the default multi-language Key) under the `button/doc` and enter the following:

```
---
title: 按钮
subtitle: Button
---

## When To Use
A button means an immediate operation.
```
As shown below:

![Component](assets/images/component-button.png)

For more component documentation configuration,please refer to the [Overview & API & Examples](guides/basic/component).
