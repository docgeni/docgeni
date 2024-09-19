---
title: Customize Home
order: 30
---

when `mode` is `full`, it includes the home page, which includes three parts:
- Hero area: show the title, one sentence description and quick operation links of the current site, and supports the setting of banner
- Feature area: show what features are available, each with a name, description, and icon 
- Content area: show markdown content like markdown doc


`index.md` file on root directory is the markdown content of the home page, and the hero and features are configured through the `FrontMatter` of the home page.

## Preview

![](assets/images/home-preview.png)


## Hero

- `title:` title of site
- `description:` description of site
- `banner:` the background image, title and description are centered by default. If the background image is obscured, the position can be modified through custom styles
- `backgroundColor`: background color, default is `#dae6f3`
- `actions:` shortcut button actions
- `actions.text:` button text for every action
- `actions.link:` button link for every action
- `actions.btnShape:` button shape，can be set to `round | square`，default is `square`
- `actions.btnType:` button type for every action, can be set to `primary | primary-light | success | danger`，default is `primary-light`, outline style needs add prefix `outline`, e.g. `outline-primary-light`

Example:
```
---
hero:
  title: Docgeni
  description: Out of the box angular component document generation tool
  banner: [./assets/images/home/banner.png, ./assets/images/home/dark-banner.png]
  actions:
    - text: Getting Started
      link: /guides/intro/getting-started
      btnShape: round,
      btnType: outline-primary-light
---
```

## Features
- `title:` title of feature
- `description:` description of feature
- `icon:` icon url of feature

Example:
```
---
features:
  - icon: ./assets/images/home/feature1.png
    title: Out of the box
    description: Automatically generate navigation and menus according to the directory structure, and help developers get started at zero cost through command-line tools, so that you can quickly start  writing document and development component
  - icon: ./assets/images/home/feature2.png
    title: Born for Angular Component Development
    description: Independent angular component preview experience that contains component overview, examples, APIs and rich markdown extensions make it easier to write documents and support multiple libraries at one site
  - icon: ./assets/images/home/feature3.png
    title: Two modes and multiple styles support
    description: Full and Lite modes are supported to meet different needs. At the same time, default and angular styles are supported to allow users to choose their own themes
  - icon: ./assets/images/home/feature4.png
    title: Powerful Customization
    description: It provides publicDir to realize features such as custom HTML, resources and styles, and supports fully customized site
  - icon: ./assets/images/home/feature5.png
    title: Automatic Generation of Component API (WIP)
    description: Automatically generate component APIs based on typescript type definitions and comments, and maintain the consistency of code and documents
  - icon: ./assets/images/home/feature6.png
    title: Multilingual
    description: Support flexible multilingual configuration
---
```
