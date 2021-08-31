---
title: Multi-language
order: 100
---

# Configure multi-languages

The supported multi-languages and default languages are configured through the `locales` and `defaultLocale` fields.
```
{
  locales: [ { key: 'en-us', name: 'English'}, { key: 'zh-cn', name: '中文'} ],
  defaultLocale: 'zh-cn'
}
```

# Multilingual documentation

All pages in the `docs` directory are pages in the default language. If you need to add documents in other languages, you need to create a separate folder named with the multilingual `key`, such as the contents of the following `en-us` folder will be automatically generated into English documents, including channels, categories and pages.
```
├── en-us
│   ├── guides
│   │   ├── index.md
│   │   └── intro
│   │       ├── getting-started.md
│   │       ├── index.md
│   │       └── motivation.md
│   └── index.md
```

# Multilingual configuration items

All configuration item fields are the default language. You need to add a property with a multi-language key as the name under `locales` to configure other languages and related multi-language fields, such as:

```ts
module.exports = {
    ...
    navs: [
        null,
         {
            title: 'Components',
            path: 'components',
            lib: 'alib',
            locales: {
              'en-us': {
                title: 'Components'
              }
            }
        }
        ...
    ],
    ...
}
```

# Multilingual components

The documentation and API of the component are stored in the `doc` and `api` directories by default, named after the multilingual `key`.
```
button
├── doc
│   ├── zh-cn.md
│   ├── en-us.md
├── api
│   ├── zh-cn.js
│   ├── en-us.js
```
