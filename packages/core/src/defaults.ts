import { DocgeniConfig } from './interfaces';

export const DEFAULT_CONFIG: Partial<DocgeniConfig> = {
    title: 'Docgeni',
    description: '为 Angular 组件开发场景而生的文档工具',
    mode: 'lite',
    theme: 'default',
    baseHref: '/',
    docsDir: 'docs',
    siteDir: '.docgeni/site',
    output: 'dist/docgeni-site',
    publicDir: '.docgeni/public',
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
