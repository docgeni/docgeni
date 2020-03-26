import { NgModule } from '@angular/core';
import { DocGenTemplateSharedModule } from './shared/shared.module';
import { DocGenTemplatePagesModule } from './pages/pages.module';
import { CONFIG_TOKEN, DEFAULT_CONFIG } from './services';

@NgModule({
    declarations: [],
    imports: [DocGenTemplateSharedModule, DocGenTemplatePagesModule],
    exports: [DocGenTemplateSharedModule, DocGenTemplatePagesModule],
    providers: [
        {
            provide: CONFIG_TOKEN,
            useValue: DEFAULT_CONFIG
        }
    ]
})
export class DocGenTemplateModule {}
