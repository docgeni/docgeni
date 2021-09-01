import { NgModule } from '@angular/core';
import { DocgeniSharedModule } from './shared/shared.module';
import { DocgeniPagesModule } from './pages/pages.module';
import { CONFIG_TOKEN, DEFAULT_CONFIG } from './services/public-api';
import { HttpClientModule } from '@angular/common/http';
import { DocgeniBuiltInModule } from './built-in/built-in.module';
import { setBuiltInComponents } from './shared/content-viewer/content-viewer.component';
import { BUILT_IN_COMPONENTS } from './built-in';

@NgModule({
    declarations: [],
    imports: [DocgeniSharedModule, DocgeniBuiltInModule, DocgeniPagesModule, HttpClientModule],
    exports: [DocgeniSharedModule, DocgeniPagesModule],
    providers: [
        {
            provide: CONFIG_TOKEN,
            useValue: DEFAULT_CONFIG
        }
    ]
})
export class DocgeniTemplateModule {
    constructor() {
        setBuiltInComponents(BUILT_IN_COMPONENTS);
    }
}
