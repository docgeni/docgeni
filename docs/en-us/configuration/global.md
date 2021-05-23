---
title: Global Configuration
path: 'global'
order: 30
---

## mode

- Type: `lite`｜`full`
- Default: `lite`

It's used to set the document display mode. The default is lite mode(left menu + right content), `full` is site mode, including: homepage + head nav + left menu + right content.

## theme

- Type: `default`｜`angular`
- Default: `default`

Theme settings:
- `default`: default theme, navigation background color is white
- `angular`：`Angular` official website style, default navigation background color is: <code style="color: #3f51b5">#3f51b5</code>, SCSS color variables can be modified to change the navigation background color

## title

- Type: `string`
- Default: `package.name`

The title of the document. Usually the name of the component library, such as `Docgeni`.

## logoUrl
- Type: `string`
- Default: the Logo Url of Docgeni

Logo URL of the library.

## repoUrl
- Type: `string`
- Default: `null`

Github repository URL of the library.

## docsDir
- Type: `string`
- Default: `docs`

Markdown document directory URL, Docgeni will scan the folders and Markdown files in this directory, and generate channels, menus and page documents according to certain rules.

## siteDir
- Type: `string`
- Default: `.docgeni/site`

Automatically generated site directory. Docgeni will copy the generated component examples and documents to the site. After `siteProjectName` is set, the directory of the custom site is the main one. This configuration is invalid.

## outputDir
- Type: `string`
- Default: `dist/docgeni-site`

The output directory of site construction. When the `siteProjectName` is set, the output directory of the custom site is the main one. This configuration is invalid.

## publicDir
- Type: `string`
- Default: `.docgeni/public`

The configuration directory of the document site, Docgeni will copy the `index.html`, `favicon.ico`, `styles.scss`, `assets`, `.browserslistrc` and `tsconfig.json` files in the folder and overwrite the site directory to implement custom configuration features. For more configuration, please refer to [Customize Site](/guides/advance/customize).

## siteProjectName
- Type: `string`
- Default: `null`

The project name of Angular custom site. In addition to the default documentation and examples to presentation features, component library development may also need to do some custom features. You can create a new site project in the repository, and then configure the name of the project, Docgeni will copy the generated documents and examples to the project.
## defaultLocale
- Type: `string`
- Default: `en-us`

Default multi-language.

## locales
- Type: `Array<{key: string, name: string}>`
- Default: `[]`

Supported multi-language, if you don't need to support multiple languages, no configuration, only the `defaultLocale` language will be generated.

## navs
- Type: `Array<NavigationItem>`
- Default: `[]`

This configuration item is used to customize the display of the navigation bar and menu, and generally configure some external links and library channels, such as:
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
            title: '组件',
            path: 'components',
            lib: 'alib'
        },
    ],
    ...
}
```
> Here are some things to note, the automatically recognized channel under the `docs` folder will be inserted at the bottom of the configured `navs` array by default. If you want to control the display position, you can insert a `null` as a placeholder. As the above example, the automatically generated channel will be inserted to the top navigation.

## libs
- Type: `Array<DocgeniLibrary>`
- Default: `[]`

Component library configuration, see [configuration/lib](configuration/lib) for the configuration of each library.

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
