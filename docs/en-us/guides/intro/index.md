---
title: Introduction
path: 'intro'
order: 10
toc: hidden
---

## What is Docgeni?

Docgeni is a static site generator for **Angular component libraries and documentation sites**. You can use it to:

- Write regular **Markdown** guides and configuration docs
- Generate **overview, live examples, and API** pages for components, and embed examples in Markdown

Place files in the expected folders, configure `.docgenirc.js`, and Docgeni **builds navigation, sidebar menus, and routes** from your directory structure and Front Matter. It also supports custom top nav, locales, and `<example />` tags in Markdown.

## Features

- 📦 **Out of the box**: CLI init and local preview
- 🏡 **Component preview**: Overview, examples, and API in one place
- 📋 **Markdown extensions**: Code groups, embed, built-in components, example tags
- 💻 **i18n**: Split docs and config by locale
- 🎨 **Two modes**: `full` (with home page) and `lite`; themes `default` / `angular`
- 🚀 **Extensible**: Override the site via `public`, `components`, `app`, and more

## Why we built it

Since 2018, [Worktile](https://worktile.com/?utm_source=docgeni) has maintained a large Angular component library (50+ components). Like many teams, we hosted a custom demo app in the repo—every new component meant more example modules, routes, and doc pages. A second business library in 2019 duplicated that work, and the result still did not feel like a unified doc product.

React and Vue have many doc tools; **Angular lacked a reusable “component library doc site” generator**. Libraries such as Material, ng-zorro, and ngx-bootstrap mostly ship in-repo demo apps. [Storybook](https://github.com/storybookjs/storybook) supports Angular but did not match the directory-driven doc-site workflow we wanted. Docgeni was our answer; prior research is listed in [awesome-docgen](https://github.com/docgeni/awesome-docgen).

## Use cases

| Type | Description | Docgeni |
| --- | --- | --- |
| General docs | Guides, config, changelog | ✅ |
| Component docs | Usage, API, runnable examples | ✅ |
| Standalone API site | angular.io-style API only | Not the main focus; API ships with component pages |

## Contributing

Contributions are welcome: [github.com/docgeni/docgeni](https://github.com/docgeni/docgeni)
