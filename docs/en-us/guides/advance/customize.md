---
title: Customize Site
order: 20
---

# 自定义 public
Docgeni 默认会在`.docgeni/site`目录生成文档站点，这个站点完全是一个 Angular 的项目，目录结构如下：
```
.docgeni
└── site
    ├── src
    │   ├── app
    │   │   └── app.module.ts
    │   ├── assets
    │   │   ├── favicon.ico
    │   │   └── images
    │   │       └── cli-init.png
    │   ├── environments
    │   │   ├── environment.prod.ts
    │   │   └── environment.ts
    │   ├── favicon.ico
    │   ├── index.html
    │   ├── main.ts
    │   ├── polyfills.ts
    │   └── styles.scss
    ├── angular.json
    ├── .browserslistrc
    ├── karma.conf.js
    └── tsconfig.app.json
```

对于文档站点来说，常常需要一些配置，比如：`favicon.ico`、`assets`、`styles`、`scripts`等等。

那么在 Docgeni 中，并没有像其他文档站点生成工具一样提供很多参数配置，但它提供了一种全新的文件覆盖方式，提供灵活且强大的自定义能力，`publicDir`文件夹下的一些内置文件和文件夹会拷贝到站点下覆盖默认文件，`publicDir`默认目录是`.docgeni/public`，以下是自定义的文件和文件夹说明：

- `index.html`: 站点的入口 HTML 文件，可以通过修改 HTML 实现任何元素的配置，比如 `title`、`favicon.ico`、`heads`、`styles`、`scripts`，需要保证 body 下有`<dg-root></dg-root>`节点供文档渲染
- `assets`: 站点的资源文件，可直接在文档中通过 `assets/path/to.png`访问，避免使用 `content` 关键字，Docgeni 生成的资源文件会存储在`assets/content`目录下
- `.browserslistrc`: 支持的浏览器和版本，具体查看 [browserslist](https://github.com/browserslist/browserslist) 了解更多配置
- `styles.scss`: 文档站点默认使用`styles.scss`作为入口样式文件，通过覆写`styles.scss`实现一些自定义的样式，需要加上`@import '@docgeni/template/styles/index.scss';`，否则内置的样式将不会加载
- `tsconfig.json`: 自定义的TS配置文件，可以通过覆写达到高度配置目的，一般用于配置`compilerOptions.paths`便于示例中可以直接使用 `import 'mylib';`

完整的 public 示例如下：
```
.docgeni/public
├── assets
│   ├── favicon.ico
│   └── images
│       └── cli-init.png
│── favicon.ico
│── .browserslistrc
├── index.html
├── styles.scss
└── tsconfig.json
```

# 自定义站点
如果自定义 public 能力还不足以满足自定义的需求，那么 Docgeni 还支持一个完全自定义站点的模式，意思就是这个文档站点由用户自己创建和控制。
## 第一步
可以通过 `ng g application site` 生成一个ng站点，建议选择 scss，然后修改`.docgenirc.js`配置文件中的`siteProjectName: 'site'`(site 为 Angular 项目的名称，可以起任何命名)

## 第二步
去除`site/src/app`下的组件，修改 `app.module.ts`，输入如下代码：

```ts
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { DocgeniTemplateModule } from '@docgeni/template';
import { DOCGENI_SITE_PROVIDERS, RootComponent } from './content/index';

@NgModule({
    declarations: [],
    imports: [BrowserModule, DocgeniTemplateModule, RouterModule.forRoot([])],
    providers: [...DOCGENI_SITE_PROVIDERS],
    bootstrap: [RootComponent]
})
export class AppModule {
    constructor() {}
}
```
## 第三步
Docgeni 默认会生成组件和文档相关的代码和资源文件，分别存储在`site/src/app/content`和`site/src/assets/content`文件夹下，为了避免冲突，需要把这两个文件夹加入到`.gitignore`，在`site/src`文件夹下新建一个`.gitignore`文件，并输入如下内容即可：

```
app/content
assets/content
```
最后通过执行 `docgeni serve --port 4600` 启动站点即可查看。
