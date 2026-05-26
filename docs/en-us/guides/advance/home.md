---
title: Customize Home
order: 30
---

In **`full` mode**, visiting `/` shows a dedicated home page instead of jumping straight into a doc. Use it to introduce your project and link to important pages. This page explains how to set it up.

## What does the home page include?

The home page has three sections, top to bottom:

| Section | Purpose | How to configure |
| --- | --- | --- |
| **Hero** | Main title, tagline, background image, action buttons | `hero` in Front Matter |
| **Features** | Grid of highlight cards | `features` in Front Matter |
| **Body** | Regular Markdown, same as any doc page | Content below `---` in `index.md` |

Layout sketch:

```
┌─────────────────────────────────────┐
│  Hero: title + description + CTAs   │  ← hero
├─────────────────────────────────────┤
│  Features: icon + title + blurb     │  ← features
├─────────────────────────────────────┤
│  Body: Markdown (e.g. Quick start)  │  ← file body
└─────────────────────────────────────┘
```

<alert type="info">`lite` mode has no separate home page; the site opens on the doc list instead.</alert>

## Which file do I edit?

The home page is **`docs/index.md`**. For multiple locales, use `docs/index.md` for the default locale and `docs/{locale-key}/index.md` for others (e.g. `docs/en-us/index.md`).

- **Hero & features**: YAML Front Matter between the opening and closing `---`
- **Body**: Everything after the closing `---`, using normal Markdown

This site’s [home page](/en-us/) is built from `docs/en-us/index.md` and `docs/index.md`—you can copy from those files.

## Preview

![](assets/images/home-preview.png)

## Hero configuration

`hero` controls the large banner at the top.

| Field | Description |
| --- | --- |
| `title` | Main heading |
| `description` | Subtitle or one-line pitch |
| `banner` | Background image path. Use a string, or an array `[lightImage, darkImage]` for theme switching |
| `backgroundColor` | Fallback color, default `#dae6f3`; more visible when `banner` is omitted |
| `actions` | List of buttons; each item has `text`, `link`, and optional `btnShape`, `btnType` |

**Per-button fields (inside each `actions` item):**

| Field | Description |
| --- | --- |
| `text` | Button label |
| `link` | Target URL, e.g. `/guides/intro/getting-started` |
| `btnShape` | `round` or `square` (default `square`) |
| `btnType` | `primary`, `primary-light`, `success`, `danger`, etc. (default `primary-light`). Prefix with `outline-` for outline style, e.g. `outline-primary-light` |

Example:

```yaml
---
hero:
  title: Docgeni
  description: Out-of-the-box Angular component documentation
  banner:
    - ./assets/images/home/banner.png
    - ./assets/images/home/dark-banner.png
  backgroundColor: '#dae6f3'
  actions:
    - text: Getting started
      link: /guides/intro/getting-started
      btnShape: round
    - text: Introduction
      link: /guides/intro
      btnType: outline-primary-light
      btnShape: square
---
```

Image paths are relative to the **`docs`** folder. If text covers the banner, adjust styles via [site customization](/en-us/guides/advance/customize).

## Features configuration

`features` is an array; each entry is one card:

| Field | Description |
| --- | --- |
| `icon` | Icon path (relative to `docs`) |
| `title` | Feature name |
| `description` | Short explanation |

Example:

```yaml
---
features:
  - icon: ./assets/images/home/feature1.png
    title: Out of the box
    description: Auto navigation and menus from your folder structure; CLI to get started quickly
  - icon: ./assets/images/home/feature2.png
    title: Built for Angular components
    description: Overview, live examples, APIs, and Markdown extensions in one place
  - icon: ./assets/images/home/feature3.png
    title: Modes and themes
    description: Full and lite modes; default and Angular visual styles
---
```

There is no fixed limit on cards; three to six usually reads best.

## Full example

Hero, features, and body in one file:

```yaml
---
title: Home
hero:
  title: My component library
  description: Internal UI docs for our team
  banner: ./assets/images/home/banner.png
  actions:
    - text: Read the docs
      link: /guides/intro/getting-started
features:
  - icon: ./assets/images/home/feature1.png
    title: Consistent design
    description: All components follow the same design system
  - icon: ./assets/images/home/feature2.png
    title: Live preview
    description: Run examples inside the docs
---

## Quick start

Run `npx @docgeni/cli init`, then `npm run start:docs` to preview locally.
```

Rebuild or refresh the dev server to see changes in the browser.
