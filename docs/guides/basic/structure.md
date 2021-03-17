---
title: 目录结构
order: 10
---

# 纯文档项目

对于一个纯文档的项目(即非 Angular 类库项目)，目录结构如下所示，`docs`文件夹为 Markdown 文档存储的目录。
```
.
├── docs
│   ├── en-us
│   │   ├── guides
│   ├── guides
│   │   ├── basic
│   │   │   ├── index.md
│   │   │   └── structure.md
│   │   ├── advance
│   │   │   ├── index.md
│   │   │   └── locales.md
│   └── index.md
├── .docgenirc.js
├── package.json
```

# Angular 类库项目
对于一个 Angular 的类库项目，使用`@angular/cli`会自动生成一个类库的结构，对于只有一个类库的项目推荐使用下面的目录结构，也就是把组件类库打平放入 `src` 或者 `components` 根目录。

```
.
├── docs
│   ├── ...
├── src
│   ├── button
│   │   ├── api
│   │   │   └── en-us.js
│   │   │   └── zh-cn.js
│   │   ├── doc
│   │   │   ├── en-us.md
│   │   │   └── zh-cn.md
│   │   ├── examples
│   │   │   ├── basic
│   │   │   │   ├── basic.component.html
│   │   │   │   ├── basic.component.scss
│   │   │   │   ├── basic.component.ts
│   │   │   │   └── index.md
│   │   │   └── module.ts
│   │   ├── button.component.ts
│   │   ├── button.module.ts
│   │   ├── index.ts
│   │   └── package.json
│   ├── ...
│   ├── ng-package.json
│   ├── package.json
│   ├── public-api.ts
│   ├── test.ts
│   ├── tsconfig.json
│   ├── tsconfig.lib.json
│   ├── tsconfig.lib.prod.json
│   ├── tsconfig.spec.json
│   └── tslint.json
├── .docgenirc.js
├── tsconfig.json
├── package.json
```

# Monorepo 类库项目

如果你的项目中有多个类库，采用 monorepo 的方式组织项目，那么一般建议在 packages 文件夹下按照类库方式组织，每个类库也是建议打平结构。

```
.
├── docs
│   ├── ...
├── packages
│   ├── lib1
│   ├── lib2
├── .docgenirc.js
├── tsconfig.json
├── package.json
```
