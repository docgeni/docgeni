import { DocgeniConfig } from './interfaces';

export const DEFAULT_CONFIG: Partial<DocgeniConfig> = {
    title: 'Docgeni',
    description: '为 Angular 组件开发场景而生的文档工具',
    mode: 'lite',
    theme: 'default',
    baseHref: '/',
    docsDir: 'docs',
    siteDir: '.docgeni/site',
    outputDir: 'dist/docgeni-site',
    publicDir: '.docgeni/public',
    locales: [],
    defaultLocale: 'en-us'
};
