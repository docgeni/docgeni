import { DocgeniConfig } from './interfaces';

export const DEFAULT_CONFIG: Partial<DocgeniConfig> = {
    title: 'Docgeni',
    heading: 'Doc Generator',
    description: '为 Angular 组件开发场景而生的文档工具',
    mode: 'full',
    theme: 'default',
    baseHref: '/',
    heads: [],
    docsPath: 'docs',
    siteDir: '.docgeni',
    silent: false,
    output: 'dist/docs-site',
    locales: [
        {
            key: 'en-us',
            name: 'EN'
        },
        {
            key: 'zh-cn',
            name: '中文'
        }
    ],
    defaultLocale: 'zh-cn'
};
