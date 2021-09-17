import { config } from './config';
import { LIB_EXAMPLE_LOADER_PROVIDER } from './example-loader';
import { CustomComponentsModule } from './components/custom';
import {
    CONFIG_TOKEN,
    DOCGENI_INITIALIZER_PROVIDERS
} from '@docgeni/template';

import './navigations.json';

export const DOCGENI_SITE_PROVIDERS = [
    ...DOCGENI_INITIALIZER_PROVIDERS,
    LIB_EXAMPLE_LOADER_PROVIDER,
    {
        provide: CONFIG_TOKEN,
        useValue: config
    }
];

export const IMPORT_MODULES = [ CustomComponentsModule ];

export { RootComponent, DocgeniTemplateModule } from '@docgeni/template';
