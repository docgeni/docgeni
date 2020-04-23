import {
    DocgeniTemplateModule,
    CONFIG_TOKEN,
    routes,
    RootComponent
} from '@docgeni/template';
import { NgModule } from '@angular/core';
import { config } from './content/config';
import { RouterModule } from '@angular/router';
import { LIB_EXAMPLE_LOADER_PROVIDER } from './content/example-loader';

@NgModule({
    declarations: [],
    imports: [DocgeniTemplateModule, RouterModule.forRoot(routes)],
    providers: [
        LIB_EXAMPLE_LOADER_PROVIDER,
        {
            provide: CONFIG_TOKEN,
            useValue: config
        }
    ],
    bootstrap: [RootComponent]
})
export class AppModule {
    constructor() {}
}
