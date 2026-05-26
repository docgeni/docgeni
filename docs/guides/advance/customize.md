---
title: 自定义站点
order: 20
---

Docgeni 会在构建时自动生成文档站点（默认输出到 `.docgeni/site`），你**不必**从零搭建 Angular 工程。若需扩展站点能力，在 **`.docgeni`** 下准备三个可选目录即可，分别对应三类自定义：

```
.docgeni/
├── public/       → 站点外观与静态资源（配置项 publicDir，默认路径 public）
├── components/   → Markdown 自定义内置组件（配置项 componentsDir）
└── app/          → 全站级 Angular 配置（如 providers）
```

## 自动生成的站点目录

执行 `docgeni build` 或 `docgeni serve` 时，若未配置 `siteProjectName`，Docgeni 会在 **`.docgeni/site`** 生成一个完整的 Angular 应用（结构与 [Angular CLI 生成的 application 项目](https://angular.dev/tools/cli) 类似，随 Angular 版本可能略有差异）：

```
.docgeni/site/
├── angular.json
├── karma.conf.js
├── .browserslistrc
├── tsconfig*.json
└── src/
    ├── index.html          # 入口 HTML，body 内为 <dg-root>
    ├── main.ts             # bootstrapApplication 启动
    ├── main.server.ts      # 启用 SSR/SSG 时存在
    ├── server.ts
    ├── styles.scss
    ├── .gitignore          # 默认忽略 app/content、assets/content
    ├── environments/
    ├── assets/
    └── app/
        ├── app.config.ts
        ├── app.config.server.ts
        └── content/        # 文档与示例构建产物，请勿手改
```

`src/app/content`、`src/assets/content` 由 Docgeni 每次构建写入，已在 `src/.gitignore` 中忽略。也可在仓库根目录的 `.gitignore` 中忽略整个 `.docgeni/site`，无需纳入版本库。

## 自定义 public 目录

通过 **同名文件覆盖** 定制生成站点：将 `publicDir` 下的文件拷贝到 `.docgeni/site` 并覆盖默认值（默认目录 **`.docgeni/public`**）。可覆盖项如下：

| 文件 / 目录 | 说明 |
| --- | --- |
| `index.html` | 站点入口 HTML，可配置 `title`、额外 `<head>`、`scripts` 等；**`body` 内须保留 `<dg-root></dg-root>`** |
| `assets/` | 静态资源，文档中通过 `assets/xxx.png` 引用；勿占用 `assets/content`（构建产物目录） |
| `favicon.ico` | 站点图标（也可放在 `assets` 中并在 `index.html` 引用） |
| `styles.scss` | 全局样式入口，**须保留** `@import '@docgeni/template/styles/index.scss';`，否则内置样式不加载 |
| `.browserslistrc` | 浏览器兼容范围，见 [browserslist](https://github.com/browserslist/browserslist) |
| `tsconfig.json` | 覆盖站点的 `tsconfig.app.json`，常用于配置 `compilerOptions.paths`，便于示例中 `import 'mylib'` |

`publicDir` 示例结构：

```
.docgeni/public/
├── assets/
│   └── images/
│       └── logo.png
├── favicon.ico
├── .browserslistrc
├── index.html
├── styles.scss
└── tsconfig.json
```

## 自定义根应用 providers

向文档站点的 Angular 应用注入**全局 `providers`**，例如在所有**组件示例**中共享 Service，或为文档演示提供全局单例。

在 **`.docgeni/app/module.ts`** 中 `export default { providers: [...] }`，Docgeni 会合并进站点的 `app.config.ts`。**仅支持 `providers`**，不支持 `imports`；第三方模块请在对应示例或内置组件中自行 `import`。

示例：

```ts
import { SomeService } from './some.service';

export default {
    providers: [SomeService],
};
```

Docgeni 会将上述 `providers` 合并进站点 `app.config.ts` 的 `providers` 数组，示例里即可正常注入 `SomeService`。

`.docgeni/app` 下的其他文件会同步到站点 `src/app/`，修改 `module.ts` 后开发模式下会自动重建 `app.config.ts`。

## 自定义内置组件

在文档中使用**自定义 HTML 标签**（如 `<my-badge>`），与 Alert、Tabs 等内置组件用法类似，常用于展示设计令牌、色板、图标，或封装团队反复使用的文档块。

在 **`.docgeni/components`**（或 `componentsDir` 配置的路径）下添加组件即可。Tabs、Embed 等更多内置能力见 [内置组件](/guides/basic/built-in-components)。

典型结构：

```
.docgeni/components/
├── color/
│   ├── color.component.ts
│   └── color.component.html
└── module.ts          # 可选，为内置组件统一 import 第三方模块
```

组件需继承 `DocgeniBuiltInComponent`，**推荐使用 Signal `input()`**：

```ts
import { ChangeDetectionStrategy, Component, effect, input } from '@angular/core';
import { DocgeniBuiltInComponent } from '@docgeni/template';

@Component({
    selector: 'my-color',
    templateUrl: './color.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyColorComponent extends DocgeniBuiltInComponent {
    readonly color = input<string>('');

    private readonly colorEffect = effect(() => {
        if (this.color()) {
            this.hostElement.style.color = this.color();
        }
    });
}

export default {
    selector: 'my-color',
    component: MyColorComponent,
};
```

Markdown 中写法：

```html
<my-color color="red">Color</my-color>
```

<alert type="info">默认使用文件中导出的 `selector`；也可通过 `export default { selector: 'my-color', component: MyColorComponent }` 显式指定。</alert>

## 完全自定义站点（不推荐）

当 `publicDir` 与 `.docgeni/app` 仍无法满足需求时，可在 monorepo 中用 Angular CLI 新建 `application`，并在配置中设置 **`siteProjectName`**，让 Docgeni 把文档与示例输出到该项目的 `src/app/content` 等目录。

<alert type="warning">该模式需自行维护 `angular.json`、依赖版本与构建配置，升级 Docgeni / Angular 时成本较高。**更推荐**使用默认生成的 `.docgeni/site`，仅通过 `publicDir` 与 providers 扩展。以下内容仅供必须自建站点时参考。</alert>

### 第一步：创建站点项目

```bash
ng generate application site --style=scss
```

在 `.docgenirc.js` 中配置：

```ts
export default {
    siteProjectName: 'site', // 与 angular.json 中 projects 的 key 一致
};
```

### 第二步：改为独立应用启动

删除 `site/src/app` 下脚手架自带的示例组件，使用 **Standalone + `bootstrapApplication`**（与 Docgeni 生成的站点一致）。

`src/main.ts`：

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { RootComponent } from './app/content/index';

bootstrapApplication(RootComponent, appConfig).catch((err) => console.error(err));
```

`src/app/app.config.ts`：

```ts
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { DocgeniTemplateModule } from '@docgeni/template';
import { DOCGENI_SITE_PROVIDERS, IMPORT_MODULES } from './content/index';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter([]),
        provideAnimations(),
        importProvidersFrom(DocgeniTemplateModule, ...IMPORT_MODULES),
        ...DOCGENI_SITE_PROVIDERS,
    ],
};
```

<alert type="info">不再使用 `NgModule` + `AppModule` 引导。根级 `providers` 仍可通过 `.docgeni/app/module.ts` 配置。</alert>

### 第三步：忽略 content 目录

在 `site/src/.gitignore` 中加入：

```
app/content
assets/content
```

### 第四步：入口 HTML 与样式

- `index.html`：将 `app-root` 改为 **`dg-root`**
- `styles.scss`：引入 `@import '@docgeni/template/styles/index.scss';`

```html
<!doctype html>
<html lang="zh-cn">
  <head>
    <meta charset="utf-8" />
    <title>Docgeni</title>
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/x-icon" href="favicon.ico" />
  </head>
  <body>
    <dg-root></dg-root>
  </body>
</html>
```

```scss
@import '@docgeni/template/styles/index.scss';
```

若出现 TypeScript 严格模式报错，可在 `tsconfig.app.json` 的 `compilerOptions` 中设置 `"strict": false` 作为临时方案。

最后执行 `docgeni serve --port 4600`（或项目中的 `npm run start:docs`）预览。
