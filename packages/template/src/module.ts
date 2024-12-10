import { NgModule } from '@angular/core';
import { DocgeniSharedModule } from './shared/shared.module';
import { DocgeniPagesModule } from './pages/pages.module';
import { CONFIG_TOKEN, DEFAULT_CONFIG } from './services/public-api';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { DocgeniBuiltInModule } from './built-in/built-in.module';

@NgModule({
    declarations: [],
    exports: [DocgeniSharedModule, DocgeniPagesModule, DocgeniBuiltInModule],
    imports: [DocgeniSharedModule, DocgeniBuiltInModule, DocgeniPagesModule],
    providers: [
        {
            provide: CONFIG_TOKEN,
            useValue: DEFAULT_CONFIG,
        },
        provideHttpClient(withInterceptorsFromDi()),
    ],
})
export class DocgeniTemplateModule {
    constructor() {}
}
