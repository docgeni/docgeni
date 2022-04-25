import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DocgeniTemplateModule } from '@docgeni/template';
import { DOCGENI_SITE_PROVIDERS, IMPORT_MODULES, RootComponent } from './content/index';
@NgModule({
    declarations: [],
    imports: [BrowserModule, BrowserAnimationsModule, DocgeniTemplateModule, RouterModule.forRoot([]), ...IMPORT_MODULES],
    providers: [...DOCGENI_SITE_PROVIDERS],
    bootstrap: [RootComponent]
})
export class AppModule {
    constructor() {}
}
