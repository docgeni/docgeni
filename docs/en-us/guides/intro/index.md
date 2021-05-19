---
title: Introduce
path: 'intro'
order: 10
---

# What is Docgeni？

`Docgeni` is a document generator for angular component lib development scenarios, which supports the generation of component documents and markdown documents.

`Docgeni` will automatically generate the corresponding document navigation, menu and route according to the directory structure and FrontMatter, and it also supports the configuration of first-level navigation and route to meet the custom requirements. In addition, in order to facilitate the development of component and display component example, Docgeni supports the import of example in markdown syntax.

# Features
- 📦 Out of the box, let you quickly open the document writing and component development
- 🏡 Independent angular component preview experience, including:component overview, examples, and API
- 📋 Extend the markdown syntax and import examples directly into the document
- 💻 Multi-language support
- 🚀 Two modes(`full` and `lite`) and multiple themes(`default` and `angular`) support
- 🚀 Powerful customization site ability (HTML, Browser support, Assets ...)

# Motivation
In 2018, [Worktile](https://worktile.com/?utm_source=docgeni) started to build our own component library using Angular, and after 2-3 years our component library already has 50+ components. So for component library development, documentation and examples is a very important part. At the beginning, we wrote a Demo site directly in the repository as documentation and examples display  like other component libraries. Whenever a new component is added, the sample module, sample component and so on which corresponding to this component need to be added to the example. It is very cumbersome to write component examples and documents. At the same time, we started to build a business component library in 2019, which means that I have to write the same basic function of the example again, which is particularly troublesome. In addition, the previous documentation site is very unprofessional, so we  began to look for a tool for Angular component development to generate documentation and component examples.

After looking for and studying many component document generation tools, we found that there are many solutions for React and Vue frameworks, but Angular framework does not have an out-of-the-box component document generation tool, and the more familiar Angular component libraries (such as [Material Design](https://github.com/angular/components), [ng-zorro-antd](https://github.com/NG-ZORRO/ng-zorro-antd), [ngx-bootstrap](https://github.com/valor-software/ngx-bootstrap), etc.) are sample sites built inside the repository and cannot be directly reused by other component libraries, so the idea of writing our own documentation tool for Angular component development eventually emerged.

The [awesome-docgen](https://github.com/docgeni/awesome-docgen) repository lists some of the document generation tools we researched at the time. [storybook](https://github.com/storybookjs/storybook) may be the only document generation tool that supports the Angular framework, but its presentation and writing method are quite cumbersome, so we didn't choose to use it in the end.

# Categories of documentation tools
For documentation tools, there are three types:
1. Common documents: pure Markdown syntax documents, common to both front and back ends, mainly showing getting started guide, configuration instructions for the use of documents, there are countless such tools
1. Component documentation: it binds front-end framework basically, showing component instructions for use, component parameters, component examples (Examples)
1. API documentation: similar to the official Angular API. Of course, most component libraries don’t need this feature

Docgeni supports the generation of common documents and component documents. Of course, for some pure document scenarios, it is also possible to use Docgeni to generate only common Markdown documents.
# Contributing
Docgeni is still in development, welcome to all contributions. Docgeni: https://github.com/docgeni/docgeni
