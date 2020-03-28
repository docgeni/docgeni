import { docgeniTemplateModule, DocViewerComponent, CONFIG_TOKEN, DEFAULT_CONFIG, DocgeniConfig, DocRootComponent } from '@docgeni/template';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { config } from './config';

@NgModule({
    declarations: [],
    imports: [AppRoutingModule, docgeniTemplateModule],
    providers: [
        {
            provide: CONFIG_TOKEN,
            useValue: config
        }
    ],
    bootstrap: [DocRootComponent]
})
export class AppModule {
    constructor() {}
}
