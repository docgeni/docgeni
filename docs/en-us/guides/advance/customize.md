---
title: Customize Site
order: 20
---

Docgeni generates the documentation site at build time (by default under `.docgeni/site`). You do **not** need to scaffold a full Angular app yourself. To extend the site, use three optional folders under **`.docgeni`**:

```
.docgeni/
├── public/       → Site look & static assets (config: publicDir)
├── components/   → Custom Markdown built-in components (config: componentsDir)
└── app/          → Site-wide Angular setup (e.g. providers)
```

## Generated site layout

When `siteProjectName` is not set, `docgeni build` / `docgeni serve` creates **`.docgeni/site`**: a full Angular app shaped like an [Angular CLI application project](https://angular.dev/tools/cli). Exact files may vary with the Angular version:

```
.docgeni/site/
├── angular.json
├── karma.conf.js
├── .browserslistrc
├── tsconfig*.json
└── src/
    ├── index.html          # entry HTML; body uses <dg-root>
    ├── main.ts             # bootstrapApplication
    ├── main.server.ts      # present when SSR/SSG is enabled
    ├── server.ts
    ├── styles.scss
    ├── .gitignore          # ignores app/content, assets/content
    ├── environments/
    ├── assets/
    └── app/
        ├── app.config.ts
        ├── app.config.server.ts
        └── content/        # build output; do not edit by hand
```

`src/app/content` and `src/assets/content` are regenerated on each build and listed in `src/.gitignore`. You can also add `.docgeni/site` to the repo root `.gitignore` and omit the whole folder from version control.

## Customize public directory

Customize the generated site by **overwriting files with the same path**. Files under **`publicDir`** (default **`.docgeni/public`**) are copied into `.docgeni/site` and replace defaults:

| File / folder | Description |
| --- | --- |
| `index.html` | Entry HTML; keep **`<dg-root></dg-root>`** in `body` |
| `assets/` | Static files; reference as `assets/...` in docs. Avoid `assets/content` (build output) |
| `favicon.ico` | Site icon |
| `styles.scss` | Global styles; must include `@import '@docgeni/template/styles/index.scss';` |
| `.browserslistrc` | Browser targets; see [browserslist](https://github.com/browserslist/browserslist) |
| `tsconfig.json` | Overwrites `tsconfig.app.json`; often used for `compilerOptions.paths` |

Example layout:

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

## Custom root application providers

Register **global `providers`** for the doc site—for example services shared by all **component examples**, or singletons for interactive demos.

Add **`.docgeni/app/module.ts`** with `export default { providers: [...] }`; Docgeni merges it into `app.config.ts`. **Only `providers` are supported**, not `imports` (import NgModules in examples or built-in `module.ts`).

Example:

```ts
import { SomeService } from './some.service';

export default {
    providers: [SomeService],
};
```

Docgeni merges these into the site `app.config.ts` `providers` array.

Other files under `.docgeni/app` are copied to `src/app/`. Changing `module.ts` in watch mode rebuilds `app.config.ts`.

## Custom built-in components

Use **custom HTML tags** in Markdown (e.g. `<my-badge>`), similar to built-in Alert and Tabs—for design tokens, palettes, icons, or reusable doc blocks.

Place components under **`.docgeni/components`** (or `componentsDir`) and extend `DocgeniBuiltInComponent`. See [Built-in components](/en-us/guides/basic/built-in-components) for Tabs, Embed, and conventions.

```
.docgeni/components/
├── color/
│   ├── color.component.ts
│   └── color.component.html
└── module.ts          # optional shared imports for built-ins
```

Extend `DocgeniBuiltInComponent` and prefer **Signal `input()`**:

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

In Markdown:

```html
<my-color color="red">Color</my-color>
```

## Fully custom site (not recommended)

Set **`siteProjectName`** to an existing Angular `application` in your repo so Docgeni writes docs and examples into `src/app/content`.

<alert type="warning">You own `angular.json`, dependencies, and upgrades. **Prefer** the default `.docgeni/site` plus `publicDir` and providers unless you have a hard requirement.</alert>

### Step 1: Create the application

```bash
ng generate application site --style=scss
```

```ts
export default {
    siteProjectName: 'site',
};
```

### Step 2: Bootstrap as a standalone app

Remove sample components under `site/src/app`. Use **`bootstrapApplication`** (same as the generated site).

`src/main.ts`:

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { RootComponent } from './app/content/index';

bootstrapApplication(RootComponent, appConfig).catch((err) => console.error(err));
```

`src/app/app.config.ts`:

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

<alert type="info">Do not use `NgModule` / `AppModule` bootstrap. Root `providers` can still come from `.docgeni/app/module.ts`.</alert>

### Step 3: Ignore content folders

In `site/src/.gitignore`:

```
app/content
assets/content
```

### Step 4: Entry HTML and styles

- `index.html`: use **`dg-root`** instead of `app-root`
- `styles.scss`: `@import '@docgeni/template/styles/index.scss';`

Run `docgeni serve --port 4600` or your `start:docs` script to preview.
