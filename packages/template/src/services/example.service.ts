import { Injectable } from '@angular/core';

@Injectable()
export abstract class ExampleService {
    protected generateEntryFile(module: { name: string; importSpecifier: string }, component: { name: string; selector: string }) {
        return [
            this.generateAppModuleTs(module, component),
            this.generateIndexHtml(),
            this.generateMainTs(),
            this.generateAppComponentTs(component.selector),
        ];
    }
    private generateAppModuleTs(module: { name: string; importSpecifier: string }, component: { name: string }) {
        return {
            path: `src/app.module.ts`,
            content: `import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ${module.name} } from './examples.module';
import { AppComponent } from './app.component'
@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule,${module.name}],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor() {}
}
`,
        };
    }
    private generateMainTs() {
        return {
            path: `src/main.ts`,
            content: `import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';
import 'zone.js';
platformBrowserDynamic().bootstrapModule(AppModule);
            `,
        };
    }
    private generateIndexHtml() {
        return {
            path: `src/index.html`,
            content: `<!DOCTYPE html>
<html lang="zh-cn">
  <head>
    <meta charset="utf-8" />
    <title>Docgeni</title>
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/x-icon" href="assets/favicon.ico" />
  </head>
  <body>
    <app-root></app-root>
  </body>
</html>
`,
        };
    }
    private generateAppComponentTs(selector: string) {
        return {
            path: `src/app.component.ts`,
            content: `import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  template: '<${selector}></${selector}>',
})
export class AppComponent {}`,
        };
    }
}
