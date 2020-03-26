import { DocGenTemplateModule, DocViewerComponent, CONFIG_TOKEN, DEFAULT_CONFIG, DocgConfig, DocRootComponent } from '@docg/template';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { config } from './config';

@NgModule({
    declarations: [],
    imports: [AppRoutingModule, DocGenTemplateModule],
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
