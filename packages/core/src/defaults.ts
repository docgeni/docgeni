import { DocgeniConfig, DocgeniTheme } from './interfaces';

export const DEFAULT_CONFIG: Partial<DocgeniConfig> = {
    title: 'Docgeni',
    description: '',
    mode: 'lite',
    theme: 'default',
    docsDir: 'docs',
    siteDir: '.docgeni/site',
    componentsDir: '.docgeni/components',
    outputDir: 'dist/docgeni-site',
    publicDir: '.docgeni/public',
    locales: [],
    defaultLocale: 'en-us',
    enableThemes: false,
    defaultTheme: DocgeniTheme.light,
    toc: 'content'
};
