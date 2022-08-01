---
title: Front Matter
order: 40
toc: menu
---

## title

- Type: `string`
- Default: `folder name, file name`

The title of the channel, category, page or component, will use `titleCase` nomenclature to convert the folder name or file name by default.

## subtitle

- Type: `string`
- Default: `null`

The subtitle of the channel, category, page or component, will be displayed behind the title. 

## order

- Type: `number`
- Default: `null`

The sorting of channels, categories, pages or components, is in ascending order of numbers.

## path
- Type: `string`
- Default: `folder name, file name`

The routing of the channel or page, will use `paramCase` nomenclature to convert the folder name or file name by default, the actual access route of the document will bring the path of the category and channel.

## hidden
- Type: `boolean`
- Default: `false`

Whether to hide the current channel, category, component or page, generally used for documents in drafts.

## name
- Type: `string`
- Default: `folder name`

The name of the component, from which the component name is generated, generally do not need to set.

## category
- Type: `string`
- Default: `null`

The category of the component needs to correspond to the `categories` id attribute of the corresponding library configuration.

## toc <label>1.1.0+</label>
- Type: `content | menu | hidden | false`
- Default: `content`

Display mode of table of content, `content` indicates display on the right side of the content area, `menu` indicates that toc will be displayed in the left menu, other values indicate that the toc is not displayed, default is [global toc configuration](/configuration/global#toc)。

## label <label>1.1.0+</label>
- Type: `string`
- Default: `null`

Component label, if the component is a new, set it to `new`, if the component has been deprecated, set it to `deprecated`, if the component is an experimental, set it to `experimental`. it can be set to any id configured in the library labels. for the configuration label, refer to: [labels] (configuration/lib#labels).

## background <label>1.2.0+</label>
- Type: `string`
- Default: `null`

Background of component example rendering.

## compact <label>1.2.0+</label>
- Type: `boolean`
- Default: `false`

Remove component example spacing.

## className <label>1.2.0+</label>
- Type: `string`
- Default: `null`

The style class of component example rendering, which controls special style processing.

