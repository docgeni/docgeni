import {
    DocgeniTemplateModule,
    DocViewerComponent,
    CONFIG_TOKEN,
    DEFAULT_CONFIG,
    DocgeniConfig,
    DocRootComponent,
    routes
} from '@docgeni/template';
import { NgModule } from '@angular/core';
import { config } from './content/config';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [],
    imports: [DocgeniTemplateModule, RouterModule.forRoot(routes)],
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
