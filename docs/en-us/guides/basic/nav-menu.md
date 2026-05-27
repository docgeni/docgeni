---
title: Navigation & Menu
order: 20
---

Docgeni describes navigation as an `NavigationItem` tree. The same data drives the top navbar, the sidebar, and page routes. Understanding the node types and how the `docs` folder works with `navs` is the foundation for customizing your site navigation.

## Navigation item types

| Type | Description | Typical location |
| --- | --- | --- |
| **Nav (top-level nav)** | Top navbar entry with its own route | Top navbar in `full` mode |
| **Category** | Grouping only, no page content | Sidebar section title |
| **DocItem** | Regular Markdown page | Sidebar item + route |
| **ComponentDocItem** | Library component doc (overview / examples / API) | Sidebar under a library top-level nav |

In the example below, `guides` is a top-level nav, `intro` is a category, and `getting-started` is a doc page:

```json
{
  "id": "guides",
  "path": "guides",
  "title": "Guides",
  "items": [
    {
      "id": "intro",
      "title": "Intro",
      "items": [
        {
          "id": "getting-started",
          "path": "guides/getting-started",
          "title": "Getting Started",
          "contentPath": "docs/guides/intro/getting-started.html"
        }
      ]
    }
  ]
}
```

## Auto-generation from the docs folder

Docgeni builds navigation, menus, and routes from the `docs` directory structure and Front Matter:

- **`full` mode**: first-level folders under `docs` → top-level nav (navbar)
- **`full` mode**: deeper folders → categories (sidebar groups, no route)
- **`lite` mode**: all folders → categories (sidebar groups)
- **Every `.md` file** → a doc page

### Default route rules

- **Top-level nav / categories**: folder name in Param Case, e.g. `GettingStarted` → `getting-started`
- **Doc pages**: file name without `.md` in Param Case, prefixed with top-level nav and category paths, e.g. `GettingStarted.md` → `guides/intro/getting-started`

### Default title rules

- **Top-level nav / categories**: folder name as title, e.g. `Guide`, `Intro`
- **Doc pages**: file name without `.md` as title, e.g. `Getting Started`

### Path examples

| File path | full mode | lite mode |
| --- | --- | --- |
| `/docs/index.md` | Home `/` | Home `/` |
| `/docs/getting-started.md` | Page `/getting-started` | Page `/getting-started` |
| `/docs/guide/index.md` | Top-level nav `guide`, page `/guide` | Category `guide`, page `/guide` |
| `/docs/guide/hello.md` | Top-level nav `guide`, page `/guide/hello` | Category `guide`, page `/guide/hello` |
| `/docs/guide/basic/hello.md` | Top-level nav `guide`, category `basic`, page `/guide/basic/hello` | Category `basic`, page `/guide/basic/hello` |

### Custom doc pages

Set `path` and `title` in Front Matter:

```markdown
---
path: getting-started
title: Getting Started
---
```

Top-level nav and category settings live in each folder's `index.md`. If that file has body content, an extra page is generated with the same title as the nav or category; create a non-`index.md` file when you need separate settings.

## Configuring navs (full mode)

In `full` mode, top-level nav entries discovered under `docs` can be supplemented or reordered via the `navs` array in `.docgenirc.ts`.

### Placeholder null

Auto-detected top-level nav from `docs` is appended to the end of `navs` by default. Insert `null` at the beginning to place them first:

```ts
export default {
    navs: [
        null, // auto-detected docs top-level nav goes here
        {
            title: 'Components',
            path: 'components',
            lib: 'alib',
        },
        {
            title: 'GitHub',
            path: 'https://github.com/docgeni/docgeni',
            isExternal: true,
        },
    ],
};
```

### External links

Set `isExternal: true` and use a full URL in `path`:

```ts
{
    title: 'GitHub',
    path: 'https://github.com/docgeni/docgeni',
    isExternal: true,
}
```

### Dropdown navigation <label>2.8.0+</label>

To group several top-level entries under one navbar item, set the parent `path` to an empty string and list children in `items`. The navbar treats this as a dropdown: the parent is display-only with no route; each child keeps its own route.

A nav item renders as a dropdown when:

- `path` is `''` (or unset in a way that does not resolve to a routable path)
- `items` has at least one child

#### Configure in `navs`

Declare the parent and children in `.docgenirc.ts` `navs`. Docs-derived top-level navs are appended by default; with a `null` placeholder, unmatched docs navs insert at that position. Docs navs whose `path` matches a child in `items` are **merged** into that child (subfolders and pages; config fields such as `title` win on conflict).

```ts
export default {
    navs: [
        null,
        {
            title: 'Docs',
            path: '',
            items: [
                {
                    title: 'Guides',
                    path: 'guides',
                },
                {
                    title: 'Reference',
                    path: 'reference',
                },
            ],
        },
        {
            title: 'Components',
            path: 'components',
            lib: 'alib',
        },
    ],
};
```

Notes:

- The parent is display-only and **has no route**, so `path` must be empty (`''` or omitted)
- Each item in `items` uses the same shape as a regular top-level nav and needs a valid `path`
- Child items also support `isExternal`, `locales`, and other fields

#### Generate from the `docs` folder

In `full` mode, a **first-level** folder under `docs` can set `path: ""` in its `index.md` front matter. The build emits a top-level nav with an empty `path` and puts subfolders and pages in `items`, which the navbar renders as a dropdown.

Example [`docs/reference/index.md`](../../../reference/index.md):

```markdown
---
title: Reference
path: ""
order: 30
---
```

Subfolders such as `cli` and `manifest` under `reference` become dropdown children; routing follows the same rules as other top-level navs (folder name in Param Case by default, overridable per `index.md`).

Without `path: ""`, the folder becomes a normal top-level nav with its own route (e.g. `path: reference`).

#### External links in a dropdown

External link inside a dropdown:

```ts
{
    title: 'More',
    path: '',
    items: [
        { title: 'Guides', path: 'guides' },
        {
            title: 'Changelog',
            path: 'https://github.com/docgeni/docgeni/blob/master/CHANGELOG.md',
            isExternal: true,
        },
    ],
}
```

## Library navigation & menu

Angular component libraries use a different layout (overview, examples, API tabs). Declare the library top-level nav in `navs` and register the library in `libs`.

![Lib Component](assets/images/lib-component.png)

### Link navs and libs

```ts
export default {
    navs: [
        null,
        {
            title: 'Components',
            path: 'components',
            lib: 'alib', // matches name in libs
        },
    ],
    libs: [
        {
            name: 'alib',
            rootDir: './packages/a-lib',
            // ...
        },
    ],
};
```

The `lib` field binds the top-level nav to a library in `libs`. In `full` mode it appears in the navbar; the sidebar lists components when you enter it.

### Multiple libraries

You can configure several libraries (e.g. CDK and Components in Angular Material), each with its own `navs` top-level nav and `libs` entry. Docgeni scans each `rootDir` and generates component docs. See [Library configuration](configuration/lib).

```ts
libs: [
    {
        name: 'alib',
        rootDir: './packages/a-lib',
    },
    {
        name: 'blib',
        rootDir: './packages/b-lib',
    },
],
```

### Component categories

Use `categories` to group components in the sidebar. Each category needs a unique `id`; reference it from component Front Matter with `category`:

```ts
// .docgenirc.ts
categories: [
    { id: 'general', title: 'General' },
    { id: 'layout', title: 'Layout' },
],
```

```md
<!-- packages/a-lib/button/doc/en-us.md -->
---
category: general
title: Button
---
```

## Sorting

Items sort by file / folder name by default. Use `order` in Front Matter for ascending numeric order:

```markdown
---
order: 10
---
```

## More configuration

See [Front Matter](configuration/front-matter) for all supported fields.
