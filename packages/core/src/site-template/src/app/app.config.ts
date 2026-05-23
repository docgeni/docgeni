import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { DocgeniTemplateModule } from '@docgeni/template';
import { DOCGENI_SITE_PROVIDERS, IMPORT_MODULES } from './content/index';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter([]),
        provideAnimations(),
        importProvidersFrom(DocgeniTemplateModule, ...IMPORT_MODULES),
        ...DOCGENI_SITE_PROVIDERS,
    ],
};
