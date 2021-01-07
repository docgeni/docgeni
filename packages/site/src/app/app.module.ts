import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { DOCGENI_SITE_PROVIDERS, RootComponent, EXAMPLE_MODULES } from './content/index';
import { DocgeniTemplateModule } from "@docgeni/template";
@NgModule({
    declarations: [],
    imports: [BrowserModule, DocgeniTemplateModule, RouterModule.forRoot([]), ...EXAMPLE_MODULES],
    providers: [...DOCGENI_SITE_PROVIDERS],
    bootstrap: [RootComponent]
})
export class AppModule {
    constructor() {}
}
