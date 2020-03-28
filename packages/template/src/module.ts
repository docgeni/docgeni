import { NgModule } from '@angular/core';
import { docgeniTemplateSharedModule } from './shared/shared.module';
import { docgeniTemplatePagesModule } from './pages/pages.module';
import { CONFIG_TOKEN, DEFAULT_CONFIG } from './services';

@NgModule({
    declarations: [],
    imports: [docgeniTemplateSharedModule, docgeniTemplatePagesModule],
    exports: [docgeniTemplateSharedModule, docgeniTemplatePagesModule],
    providers: [
        {
            provide: CONFIG_TOKEN,
            useValue: DEFAULT_CONFIG
        }
    ]
})
export class docgeniTemplateModule {}
