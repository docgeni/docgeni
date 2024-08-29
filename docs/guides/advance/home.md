---
title: 自定义首页
order: 30
---

`mode`为`full`模式时包含首页，首页包含三部分内容，分别为：
- Hero 区域: 展示当前站点的标题和一句话描述以及快速操作链接，同时支持`banner`图设置
- 功能区域: 展示有哪些特性，每个特性包含名称、描述和图标
- 内容区域: 和普通的文档一样，展示 Markdown 内容

根目录下的`index.md`为首页的 Markdown 内容，通过首页文档的`FrontMatter`配置 Hero 和特性。

## 首页预览

![](assets/images/home-preview.png)


## Hero

- `title:` 标题
- `description:` 描述
- `banner:` 背景图，标题和描述默认居中，如果遮住了背景图，可以通过自定义样式修改位置
- `backgroundColor:` 背景色，默认为`#dae6f3`
- `actions:` 快捷按钮列表
- `actions.text:` 按钮文字
- `actions.link:` 按钮链接
- `actions.btnShape:` 按钮形状，可以设置为`round | square`，默认为`square`
- `actions.btnType:` 按钮类型，可以设置为`primary | primary-light | success | danger`，默认为`primary-light`，线框按钮需要加前缀 `outline`，比如 `outline-primary-light`

示例:
```
---
hero:
  title: Docgeni
  description: 开箱即用的 Angular 组件文档生成工具
  banner: https://cdn.pingcode.com/open-sources/docgeni/home/banner.png
  actions:
    - text: 快速上手
      link: /guides/intro/getting-started
      btnShape: round,
      btnType: outline-primary-light
---
```

## 特性
- `title:` 特性标题
- `description:` 特性描述
- `icon:` 特性图标地址

示例:
```
---
features:
  - icon: https://cdn.pingcode.com/open-sources/docgeni/home/feature1.png
    title: Out of the box
    description: Automatically generate navigation and menus according to the directory structure, and help developers get started at zero cost through command-line tools, so that you can quickly start  writing document and development component
  - icon: https://cdn.pingcode.com/open-sources/docgeni/home/feature2.png
    title: Born for Angular Component Development
    description: Independent angular component preview experience that contains component overview, examples, APIs and rich markdown extensions make it easier to write documents and support multiple libraries at one site
  - icon: https://cdn.pingcode.com/open-sources/docgeni/home/feature3.png
    title: Two modes and multiple styles support
    description: Full and Lite modes are supported to meet different needs. At the same time, default and angular styles are supported to allow users to choose their own themes
  - icon: https://cdn.pingcode.com/open-sources/docgeni/home/feature4.png
    title: Powerful Customization
    description: It provides publicDir to realize features such as custom HTML, resources and styles, and supports fully customized site
  - icon: https://cdn.pingcode.com/open-sources/docgeni/home/feature5.png
    title: Automatic Generation of Component API (WIP)
    description: Automatically generate component APIs based on typescript type definitions and comments, and maintain the consistency of code and documents
  - icon: https://cdn.pingcode.com/open-sources/docgeni/home/feature6.png
    title: Multilingual
    description: Support flexible multilingual configuration
---
```
