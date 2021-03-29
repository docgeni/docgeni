import { Docgeni, DEFAULT_CONFIG, DocgeniConfig } from '../src';
import { expect } from 'chai';
import { toolkit } from '@docgeni/toolkit';

describe('#config', () => {
    it('should normalize default config success', () => {
        const docgeni = new Docgeni({});
        expect(docgeni.config)
            .deep.eq({
                ...DEFAULT_CONFIG,
                libs: []
            })
            .eq({
                title: 'Docgeni',
                description: '为 Angular 组件开发场景而生的文档工具',
                mode: 'lite',
                theme: 'default',
                baseHref: '/',
                docsDir: 'docs',
                siteDir: '.docgeni/site',
                publicDir: '.docgeni/public',
                outputDir: 'dist/docgeni-site',
                locales: [{ key: 'en-us', name: 'EN' }],
                defaultLocale: 'en-us',
                libs: []
            });
    });

    it('should get correct config when input custom config', () => {
        const customConfig: DocgeniConfig = {
            title: toolkit.strings.generateRandomId(),
            description: toolkit.strings.generateRandomId(),
            mode: 'full',
            theme: 'angular',
            baseHref: '/',
            docsDir: toolkit.strings.generateRandomId(),
            siteDir: toolkit.strings.generateRandomId(),
            outputDir: `dist/${toolkit.strings.generateRandomId()}`,
            publicDir: `.docgeni/${toolkit.strings.generateRandomId()}`,
            locales: [
                { key: 'en-us', name: 'EN' },
                { key: 'zh-cn', name: '中文' },
                { key: 'zh-tw', name: '繁体' }
            ],
            defaultLocale: 'zh-tw'
        };
        const docgeni = new Docgeni({
            config: customConfig
        });

        expect(docgeni.config).deep.eq({
            ...customConfig,
            libs: []
        });
    });
});
