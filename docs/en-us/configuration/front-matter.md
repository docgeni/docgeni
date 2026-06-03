---
title: Front Matter
order: 40
toc: menu
---

Front Matter is YAML metadata at the top of a Markdown file. It controls the title, route, sort order, and display behavior of top-level navigation, categories, pages, and components.

## title

- Type: `string`
- Default: folder name or file name

The title of a top-level nav item, category, page, or component. If omitted, Docgeni converts the folder or file name using `titleCase`.

## subtitle

- Type: `string`
- Default: `null`

The subtitle of a top-level nav item, category, page, or component. It is shown after the title.

## order

- Type: `number`
- Default: `null`

Sort order for top-level nav items, categories, pages, or components. Lower values appear first.

## path

- Type: `string`
- Default: folder name or file name

The route path of a top-level nav item, page, or component. If omitted, Docgeni converts the folder or file name using `paramCase`. The final URL also includes the category and top-level nav path.

## hidden

- Type: `boolean`
- Default: `false`

Whether to hide the current top-level nav item, category, component, or page. Commonly used for draft content.

## name

- Type: `string`
- Default: folder name

The component name used to generate the component identifier. Usually no manual configuration is needed.

## category

- Type: `string`
- Default: `null`

The component category. It must match a `categories` `id` in the library configuration.

## toc <label>1.1.0+</label>

- Type: `content | menu | hidden | false`
- Default: `content`

Controls how the table of contents (TOC) is displayed. This overrides the [global toc configuration](/configuration/global#toc).

- `content`: shown on the right side of the content area
- `menu`: shown in the left menu
- `hidden` / `false`: TOC is hidden

## label <label>1.1.0+</label>

- Type: `string`
- Default: `null`

A component label shown in the documentation. Built-in values:

- `new`: new component
- `deprecated`: deprecated component
- `experimental`: experimental component

You can also use any custom `id` defined in the library [labels](/configuration/lib#labels) configuration.

## background <label>2.0+</label>

- Type: `string`
- Default: `null`

Background color of the component example area.

## compact <label>2.0+</label>

- Type: `boolean`
- Default: `false`

Whether to remove padding from the component example area.

## className <label>2.0+</label>

- Type: `string`
- Default: `null`

Custom CSS class name for the component example area, used for special styling.
