import { NgModule } from '@angular/core';
import { DocgeniTemplateSharedModule } from './shared/shared.module';
import { DocgeniTemplatePagesModule } from './pages/pages.module';
import { CONFIG_TOKEN, DEFAULT_CONFIG } from './services';

@NgModule({
    declarations: [],
    imports: [DocgeniTemplateSharedModule, DocgeniTemplatePagesModule],
    exports: [DocgeniTemplateSharedModule, DocgeniTemplatePagesModule],
    providers: [
        {
            provide: CONFIG_TOKEN,
            useValue: DEFAULT_CONFIG
        }
    ]
})
export class DocgeniTemplateModule {}
