---
title: "FAQ"
---
## How to deploy to a non-root directory of domain?
By passing in `base-href` when executing the build command, or by configuring the `baseHref` attribute in the configuration.

`docgeni build --base-href=/xxx/`

## Does Docgeni support other frameworks?
Sorry, it is not supported yet. Docgeni is currently a document generation tool tailored for the Angular framework.

## A new `zh-cn.md` is created under the component `doc` folder, but the component does not show in the document?
Docgeni will scan the first-level folders under the library `rootDir` and `include` as a component. The `doc` folder under each component stores component documents with multiple languages as the key. For more reference [Lib Configuration](configuration/lib#rootdir).
- Confirm whether the component is included in `rootDir` or `include`
- Confirm whether the [docDir](configuration/lib#docdir) specifies another folder
- Confirm whether [defaultLocal](configuration/global#defaultlocale) (default language) is `zh-cn`
