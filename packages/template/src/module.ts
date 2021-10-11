import { NgModule } from '@angular/core';
import { DocgeniSharedModule } from './shared/shared.module';
import { DocgeniPagesModule } from './pages/pages.module';
import { CONFIG_TOKEN, DEFAULT_CONFIG } from './services/public-api';
import { HttpClientModule } from '@angular/common/http';
import { DocgeniBuiltInModule } from './built-in/built-in.module';

@NgModule({
    declarations: [],
    imports: [DocgeniSharedModule, DocgeniBuiltInModule, DocgeniPagesModule, HttpClientModule],
    exports: [DocgeniSharedModule, DocgeniPagesModule, DocgeniBuiltInModule],
    providers: [
        {
            provide: CONFIG_TOKEN,
            useValue: DEFAULT_CONFIG
        }
    ]
})
export class DocgeniTemplateModule {
    constructor() {}
}
