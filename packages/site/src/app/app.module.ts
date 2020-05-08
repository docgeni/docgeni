import { DocgeniTemplateModule, CONFIG_TOKEN, routes, RootComponent, initializeDocgeniSite, GlobalContext } from '@docgeni/template';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { config } from './content/config';
import { RouterModule } from '@angular/router';
import { LIB_EXAMPLE_LOADER_PROVIDER } from './content/example-loader';

@NgModule({
    declarations: [],
    imports: [DocgeniTemplateModule, RouterModule.forRoot(routes)],
    providers: [
        { provide: APP_INITIALIZER, useFactory: initializeDocgeniSite, deps: [GlobalContext], multi: true },
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
