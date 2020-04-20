import { DocgeniConfig } from './interfaces';

export const DEFAULT_CONFIG: Partial<DocgeniConfig> = {
    title: 'Docgeni',
    silent: false,
    docsPath: 'docs',
    sitePath: 'site',
    output: 'docs-built',
    locales: [
        {
            key: 'en-us',
            name: 'EN'
        },
        {
            key: 'zh-cn',
            name: '中文'
        }
    ]
};
