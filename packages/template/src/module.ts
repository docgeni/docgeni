import { NgModule } from '@angular/core';
import { DocgeniSharedModule } from './shared/shared.module';
import { DocgeniPagesModule } from './pages/pages.module';
import { CONFIG_TOKEN, DEFAULT_CONFIG } from './services';

@NgModule({
    declarations: [],
    imports: [DocgeniSharedModule, DocgeniPagesModule],
    exports: [DocgeniSharedModule, DocgeniPagesModule],
    providers: [
        {
            provide: CONFIG_TOKEN,
            useValue: DEFAULT_CONFIG
        }
    ]
})
export class DocgeniTemplateModule {}
