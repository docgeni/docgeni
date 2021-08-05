---
title: Library Navigation & Menu
order: 30
---

The component documentation is presented as follows, including overview, examples, and API. At the same time, the left menu shows its category, which belongs to a channel in `full` mode.

![Lib Component](https://cdn.pingcode.com/open-sources/docgeni/lib-component.png)

# Library navigation
The library is usually the component library of `Angular`. `Docgeni` will strictly distinguish the document of the component from the common page document, and the presentation form will be very different.
For library documents, the channel must be manually configured through `navs`:

```ts
module.exports = {
    ...
    navs: [
        null,
         {
            title: 'Components',
            path: 'components',
            lib: 'alib'
        }
    ],
    libs: [ 
      {
        name: 'alib',
        ....
      } 
    ]
    ...
}
```

# Library configuration
`Docgeni` can support multiple libraries at the same time. For example, the official Angular [Material](https://material.angular.io/) actually contains two libraries `CDK` and `Components`, so the configuration of the multiple libraries is stored in the `libs` array.

`Docgeni` will automatically scan the `rootDir` of the library configuration. Each folder in the root directory is identified as a component module, and each component module will generate a component document. For more configuration, please refer to [Lab Configuration](configuration/lib).

```json
...
{
    name: 'alib',
    rootDir: './packages/a-lib'
    ...
}
```

# Component category
For the component library, the category which displayed as a menu is needed to distinguish components if there are many components. Common page documents are classified by folders, but it is not a good choice for component libraries to distinguish by folders. `Docgeni` provides a custom way to configure categories, you should configure the id of the category by setting the `FrontMatter` named `category` in the corresponding component document.

```json
...
{
    name: 'alib',
    rootDir: './packages/a-lib',
    categories: [
      {
        id: 'general',
        title: 'General'
      },
      {
        id: 'layout',
        title: 'Layout'
      }
  ]
}
```

Component overview document `/../../button/doc/en-us.md`
```md
---
category: general
title: Button
---
```
