import { Docgeni, DEFAULT_CONFIG, DocgeniConfig } from '../src';
import { expect } from 'chai';
import { toolkit } from '@docgeni/toolkit';
import { createTestDocgeniHost, expectThrowAsync } from './utils';
import { DocgeniHost } from '../src/docgeni-host';
import path from 'path';
import { virtualFs, normalize } from '@angular-devkit/core';

describe('#config', () => {
    let docgeniHost: DocgeniHost;
    beforeEach(() => {
        const host = new virtualFs.ScopedHost(
            new virtualFs.test.TestHost({
                'docs/getting-started.md': 'Getting Started'
            })
        );
        docgeniHost = createTestDocgeniHost(host);
    });

    describe('normalize', () => {
        it('should normalize default config success', async () => {
            const docgeni = new Docgeni({});
            expect(docgeni.config.defaultLocale).eq(DEFAULT_CONFIG.defaultLocale);
            expect(docgeni.config.title).eq(DEFAULT_CONFIG.title);
            expect(docgeni.config.description).eq(DEFAULT_CONFIG.description);
            expect(docgeni.config.mode).eq(DEFAULT_CONFIG.mode);
            expect(docgeni.config.theme).eq(DEFAULT_CONFIG.theme);
            expect(docgeni.config.baseHref).eq(DEFAULT_CONFIG.baseHref);
            expect(docgeni.config.docsDir).eq(DEFAULT_CONFIG.docsDir);
            expect(docgeni.config.siteDir).eq(DEFAULT_CONFIG.siteDir);
            expect(docgeni.config.publicDir).eq(DEFAULT_CONFIG.publicDir);
            expect(docgeni.config.outputDir).eq(DEFAULT_CONFIG.outputDir);
            expect(docgeni.config.libs).deep.eq([]);
            expect(docgeni.config.locales).deep.eq([
                {
                    name: DEFAULT_CONFIG.defaultLocale,
                    key: DEFAULT_CONFIG.defaultLocale
                }
            ]);

            expect(docgeni.config).deep.eq({
                title: 'Docgeni',
                description: '为 Angular 组件开发场景而生的文档工具',
                mode: 'lite',
                theme: 'default',
                baseHref: '/',
                docsDir: 'docs',
                siteDir: '.docgeni/site',
                outputDir: 'dist/docgeni-site',
                publicDir: '.docgeni/public',
                locales: [{ name: 'en-us', key: 'en-us' }],
                defaultLocale: 'en-us',
                libs: [],
                navs: []
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
                defaultLocale: 'zh-tw',
                libs: [
                    {
                        name: 'alib',
                        rootDir: './packages/a-lib',
                        include: ['common'],
                        exclude: '',
                        categories: [
                            {
                                id: 'general',
                                title: '通用',
                                locales: {
                                    'en-us': {
                                        title: 'General'
                                    }
                                }
                            },
                            {
                                id: 'layout',
                                title: '布局',
                                locales: {
                                    'en-us': {
                                        title: 'Layout'
                                    }
                                }
                            }
                        ]
                    }
                ],
                navs: [
                    {
                        title: '组件',
                        path: 'components',
                        lib: 'alib',
                        locales: {
                            'en-us': {
                                title: 'Components'
                            }
                        }
                    },
                    {
                        title: 'GitHub',
                        path: 'https://github.com/docgeni/docgeni',
                        isExternal: true
                    }
                ]
            };
            const docgeni = new Docgeni({
                config: customConfig
            });

            expect(docgeni.config).deep.eq({
                ...customConfig
            });
        });

        it('should use custom locales', () => {
            const docgeni = new Docgeni({
                config: {
                    locales: [
                        {
                            key: 'en-us',
                            name: 'EN'
                        }
                    ]
                }
            });
            expect(docgeni.config.locales).deep.eq([
                {
                    key: 'en-us',
                    name: 'EN'
                }
            ]);
        });
    });

    describe('verify', () => {
        it('should throw error when default locale is not in locales', async () => {
            expectThrowAsync(async () => {
                await new Docgeni({
                    config: {
                        locales: [
                            {
                                key: 'en-us',
                                name: 'EN'
                            }
                        ],
                        defaultLocale: 'zh-cn'
                    }
                }).verifyConfig();
            }, `default locale(zh-cn) is not in locales`);
        });

        it('should throw error when default locale has not in locales', async () => {
            expectThrowAsync(async () => {
                await new Docgeni({
                    config: {
                        locales: [
                            {
                                key: 'en-us',
                                name: 'EN'
                            }
                        ],
                        defaultLocale: 'zh-cn'
                    },
                    host: docgeniHost
                }).verifyConfig();
            }, `default locale(zh-cn) is not in locales`);
        });

        it('should throw error when doc dir has not exists', async () => {
            const notFoundPath = 'not-found/path';
            expectThrowAsync(async () => {
                const docgeni = new Docgeni({
                    config: {
                        docsDir: notFoundPath
                    },
                    host: docgeniHost
                });
                await docgeni.verifyConfig();
            }, `docs dir(${notFoundPath}) has not exists`);
            docgeniHost.writeFile(`${notFoundPath}/index.md`, 'content');
            await new Docgeni({
                config: {
                    docsDir: notFoundPath
                },
                host: docgeniHost
            }).verifyConfig();
        });

        // it('should throw error when siteProject is not found', async () => {
        //     const notFoundProject = 'not-found-project-name';

        //     await expectThrowAsync(async () => {
        //         const docgeni = new Docgeni({
        //             config: {
        //                 siteProjectName: notFoundProject
        //             },
        //             host: docgeniHost
        //         });
        //         await docgeni.run();
        //     }, `site project name(${notFoundProject}) is not exists`);
        // });

        it('should throw error when mode is not match', async () => {
            await expectThrowAsync(async () => {
                const docgeni = new Docgeni({
                    config: {
                        mode: 'full1' as any
                    },
                    host: docgeniHost
                });
                await docgeni.verifyConfig();
            }, `mode must be full or lite, current is full1`);
        });
    });
});
