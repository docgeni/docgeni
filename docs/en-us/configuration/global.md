---
title: Global Configuration
path: 'global'
order: 10
toc: menu
---

## mode

- Type: `lite`｜`full`
- Default: `lite`

Sets the display mode of the documentation site.

- `lite`: Lite mode with a left menu and right content area
- `full`: Full site mode with a homepage, top navigation, left menu, and right content area

## theme

- Type: `default`｜`angular`
- Default: `default`

Sets the navbar theme style.

- `default`: Default theme with a white navbar background
- `angular`: Angular official site style with a default navbar background of <code style="color: #3f51b5">#3f51b5</code>. You can customize it via SCSS variables

## switchTheme

- Type: `boolean`
- Default: `false`

Enables light/dark theme switching. When enabled, users can choose light, dark, or system theme.

## title

- Type: `string`
- Default: `package.name`

The site title, usually the component library name, such as `Docgeni`.

## logoUrl

- Type: `string`
- Default: the default Docgeni logo URL

The logo image URL of the library.

## repoUrl

- Type: `string`
- Default: `null`

The GitHub repository URL of the library.

## docsDir

- Type: `string`
- Default: `docs`

The directory that contains Markdown documentation. Docgeni scans folders and Markdown files in this directory and generates top-level navigation, side menus, and page content according to its rules.

## siteDir

- Type: `string`
- Default: `.docgeni/site`

The generated site workspace directory. Docgeni syncs component examples and documentation into this directory. If `siteProjectName` is set, the custom site directory takes precedence and this option is ignored.

## outputDir

- Type: `string`
- Default: `dist/docgeni-site`

The build output directory of the site. If `siteProjectName` is set, the custom site's output directory takes precedence and this option is ignored.

## renderMode <label>2.8.0+</label>

- Type: `csr` | `ssg` | `ssr`
- Default: `csr`

Sets how the documentation site is rendered. Docgeni generates the corresponding Angular build options based on this value:

- `csr`: Client-Side Rendering. Pages render in the browser and the build output is static files only, suitable for CDN deployment
- `ssg`: Static Site Generation. Documentation pages are pre-rendered to HTML at build time, which improves SEO and first paint
- `ssr`: Server-Side Rendering. Requires a Node.js server at runtime, suitable when you need dynamic server capabilities

```ts
module.exports = {
    renderMode: 'ssg',
};
```

> After changing `renderMode`, run `docgeni build` again. Docgeni will sync the site template and Angular build configuration automatically.

## publicDir

- Type: `string`
- Default: `.docgeni/public`

The directory for custom site assets. Docgeni copies `index.html`, `favicon.ico`, `styles.scss`, `assets`, `.browserslistrc`, and `tsconfig.json` from this directory into the site directory to customize the site appearance and configuration. See [Customize Site](/guides/advance/customize) for details.

## componentsDir <label>1.1.0+</label>

- Type: `string`
- Default: `.docgeni/components`

The directory for custom built-in components. See [Custom Built-in Components](/guides/basic/built-in-components#custom-built-in-components).

## siteProjectName

- Type: `string`
- Default: `null`

The project name of a custom Angular site. In addition to the default documentation and examples, you can create a site project in the repository and set its name here. Docgeni will sync the generated documentation and examples into that project. See [Customize Site](/guides/advance/customize) for details.

## toc <label>1.1.0+</label>

- Type: `content | menu | false | hidden`
- Default: `content`

Controls how the table of contents (TOC) is displayed.

- `content`: shown on the right side of the content area
- `menu`: shown in the left menu
- `false` / `hidden`: TOC is hidden

## footer <label>1.1.0+</label>

- Type: `string`
- Default: `null`

Site footer content. HTML is supported, for example: `Open-source MIT Licensed | Copyright © 2020-present Powered by PingCode`.

## defaultLocale

- Type: `string`
- Default: `en-us`

The default locale, such as `zh-cn` or `en-us`.

## locales

- Type: `Array<{key: string, name: string}>`
- Default: `[]`

The list of supported locales. If you do not need multiple languages, leave this empty and only content for `defaultLocale` will be generated.

## navs

- Type: `Array<NavigationItem>`
- Default: `[]`

Customizes the top navigation bar and menu. It is commonly used for external links and top-level library navigation, for example:

```ts
module.exports = {
    ...
    navs: [
        null,
        {
            title: 'GitHub',
            path: 'https://github.com/docgeni/docgeni',
            isExternal: true
        },
        {
            title: 'Components',
            path: 'components',
            lib: 'alib'
        },
    ],
    ...
}
```

> Top-level navigation generated from the `docs` directory is appended to the end of the `navs` array by default. Insert `null` as a placeholder to control the order. In the example above, the generated navigation appears before the GitHub link.

## libs

- Type: `Array<DocgeniLibrary>`
- Default: `[]`

Component library configuration. See [configuration/lib](configuration/lib) for field details.

```ts
module.exports = {
    ...
    libs: [
        {
            name: 'alib',
            rootDir: './packages/a-lib',
            categories: [
                {
                    id: 'general',
                    title: '通用',
                    locales: {
                        'en-us': {
                            title: 'General'
                        }
                    }
                }
            ]
        }
    ],
    ...
}
```

## sitemap <label>2.0+</label>

- Type: `{ host?: string }`
- Default: `null`

When enabled, `sitemap.xml` is generated during the build. `host` specifies the domain prefix for generated URLs.

## algolia <label>2.0+</label>

- Type: `DocgeniAlgoliaConfig`
- Default: `null`

Configures Algolia [DocSearch](https://docsearch.algolia.com). You need to provide `apiKey` and `indexName`.

```js
{
  algolia: {
    apiKey: 'Your api key',  // Provided in the approval email after applying for DocSearch
    indexName: 'docgeni',    // Index name
  }
}
```

If your site does not meet DocSearch's [free eligibility criteria](https://docsearch.algolia.com/docs/who-can-apply/), you can [run your own crawler](https://docsearch.algolia.com/docs/legacy/run-your-own/) to index the site and upload the data to Algolia. In that case, you also need to provide `appId`.

```js
{
  algolia: {
    appId: 'Your app id',
    apiKey: 'Your api key',
    indexName: 'docgeni',
  }
}
```
