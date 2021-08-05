---
title: Route Navigation & Menu
order: 20
---

# Basic concepts

In `Docgeni`, whether it is the head navigation, the left menu, or a specific page document, unified called `NavigationItem` and stored in a tree structure. For a better understanding, we have made a slight distinction between these objects.

- `Channel`: First-level navigation, head navigation bar in `full` mode, each channel will have an independent routing
- `Category`: In the left menu, it will be displayed as a group, no content
- `DocItem`: Common page document, belonging to a `Channel` or `Category`, with independent routing and content
- `ComponentDocItem`: Component document, similar to `DocItem`, but show different form and properties

The example below, `guides` is a `Channel`, `intro` is a `Category`, and `getting-started` is a common page document `DocItem`.

```json
...
{
  "id": "guides",
  "path": "guides",
  "title": "Guides",
  "items": [
    {
      "id": "intro",
      "path": "guides/intro",
      "title": "Intro",
      "items": [
        {
          "id": "getting-started",
          "path": "guides/getting-started",
          "title": "Getting Started",
          "contentPath": "/docs/guides/intro/getting-started.html"
        },
        ...
      ]
    },
    ...
  ]
}
```

# Conventional routing and menu
`Docgeni` will automatically generate corresponding document navigation, menus and routes based on the `docs` directory structure and FrontMatter.
- The first-level directories generate channels in `full` mode, which is the head navigation
- Non-first-level directories in `full` mode and all directories in `lite` mode generate categories,  which is the grouping of the left menu, without routing
- All `.md` files generate their own common page document

## Default route generation rules
- The channel takes the folder name and converts it to Param Case name, such as: `GettingStarted` => `getting-started`
- Take the file name of the page document, remove the `.md` suffix, convert it to Param Case name, then add the route of the channel and category to which it belongs, such as: `GettingStarted.md` => `/guides/intro/getting-started`

## Default title generation rules
- Channels and categories take the name of the directory and convert it to a title, such as: `Guide`, `Intro`
- The page document takes the file name, removes the `.md` suffix, then converts it to a title, such as: `Getting Started`, `Motivation`

## File path example
The file paths correspond to the navigation, categories and pages generated in the two modes as follows:

file path| full mode | lite mode 
---| --- | --- 
/docs/index.md| - Channel: none <br > - Category: none <br > - Page routing: / | - Channel: none <br > - Category: none <br > - Page routing: /
/docs/getting-started.md| - Channel: none <br > - Category: none <br > - Page routing: /getting-started | - Channel: none <br > - Category: none <br > - Page routing: /getting-started
/docs/guide/index.md| - Channel: guide <br > - Category: none <br > - Page routing: /guide | - Channel: none <br > - Category: guide <br > - Page routing: /guide
/docs/guide/hello.md| - Channel: guide <br > - Category: none <br > - Page routing: /guide/hello | - Channel: none <br > - Category: guide <br > - Page routing: /guide/hello
/docs/guide/basic/hello.md| - Channel: guide <br > - Category: basic <br > - Page routing: /guide/basic/hello | - Channel: none <br > - Category: basic <br > - Page routing: /guide/basic/hello


# Customize configuration
For common page documents, if you want to customize the route and set the title, you can use the `FrontMatter` named `path` and `title` to configure.
```markdown
---
path: getting-stared
title: Getting Started
---
```

For channels and categories, the configuration information is stored in the `index.md` under the current folder. Customize the configuration by modifying the `FrontMatter` of the file. If the `index.md` also has content, a page which title is the same as its channel or category will be generated, if you want to set different configurations separately, please re-create a non-`index.md` page file.

# Channel generation
Channels only exist in `full` mode in `Docgeni`, and there are two forms:
- The first-level data in the configuration file `navs` array
- The first-level folder automatically identified under the `docs` folder

It should be noted here that the automatically recognized channel under the `docs` folder will be inserted at the bottom of the configured `navs` array by default. If you want to control the display position, you can insert a `null` as a placeholder, as shown below example, the automatically generated channel will be inserted at the top of the navigation.
```ts
module.exports = {
    ...
    navs: [
        null,
         {
            title: 'Components',
            path: 'components',
            lib: 'alib'
        },
        {
            title: 'GitHub',
            path: 'https://github.com/docgeni/docgeni',
            isExternal: true
        }
    ],
    ...
}
```

# Sorting of channels, categories and pages
The file names of folders and files are used as sorting rules by default.

It can be configured by `FrontMatter` named `order`, in ascending order of number.
```markdown
---
order: 10
---
```

# More configuration
For more configuration, please refer to [Front Matter](configuration/front-matter)


