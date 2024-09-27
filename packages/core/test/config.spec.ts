import { Docgeni, DEFAULT_CONFIG, DocgeniConfig } from '../src';
import { toolkit, fs } from '@docgeni/toolkit';
import { createTestDocgeniFsHost } from '@docgeni/toolkit/src/testing';
import { expectThrowAsync } from '../src/testing';
import { normalize, getSystemPath } from '@angular-devkit/core';
import { DocgeniTheme } from '../src/interfaces';

describe('#config', () => {
    let docgeniHost: fs.DocgeniFsHost;
    beforeEach(() => {
        docgeniHost = createTestDocgeniFsHost({
            'docs/getting-started.md': 'Getting Started',
        });
    });

    describe('normalize', () => {
        it('should normalize default config success', async () => {
            const docgeni = new Docgeni({});
            expect(docgeni.config.defaultLocale).toEqual(DEFAULT_CONFIG.defaultLocale);
            expect(docgeni.config.title).toEqual(DEFAULT_CONFIG.title);
            expect(docgeni.config.description).toEqual(DEFAULT_CONFIG.description);
            expect(docgeni.config.mode).toEqual(DEFAULT_CONFIG.mode);
            expect(docgeni.config.theme).toEqual(DEFAULT_CONFIG.theme);
            expect(docgeni.config.docsDir).toEqual(DEFAULT_CONFIG.docsDir);
            expect(docgeni.config.siteDir).toEqual(DEFAULT_CONFIG.siteDir);
            expect(docgeni.config.publicDir).toEqual(DEFAULT_CONFIG.publicDir);
            expect(docgeni.config.outputDir).toEqual(DEFAULT_CONFIG.outputDir);
            expect(docgeni.config.libs).toEqual([]);
            expect(docgeni.config.locales).toEqual([
                {
                    name: DEFAULT_CONFIG.defaultLocale,
                    key: DEFAULT_CONFIG.defaultLocale,
                },
            ]);

            expect(docgeni.config).toEqual({
                title: 'Docgeni',
                description: '',
                mode: 'lite',
                theme: 'default',
                docsDir: 'docs',
                siteDir: '.docgeni/site',
                componentsDir: '.docgeni/components',
                outputDir: 'dist/docgeni-site',
                publicDir: '.docgeni/public',
                locales: [{ name: 'en-us', key: 'en-us' }],
                defaultLocale: 'en-us',
                switchTheme: false,
                libs: [],
                navs: [],
                toc: 'content',
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
                componentsDir: toolkit.strings.generateRandomId(),
                outputDir: `dist/${toolkit.strings.generateRandomId()}`,
                publicDir: `.docgeni/${toolkit.strings.generateRandomId()}`,
                locales: [
                    { key: 'en-us', name: 'EN' },
                    { key: 'zh-cn', name: '中文' },
                    { key: 'zh-tw', name: '繁体' },
                ],
                defaultLocale: 'zh-tw',
                switchTheme: true,
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
                                        title: 'General',
                                    },
                                },
                            },
                            {
                                id: 'layout',
                                title: '布局',
                                locales: {
                                    'en-us': {
                                        title: 'Layout',
                                    },
                                },
                            },
                        ],
                    },
                ],
                navs: [
                    {
                        title: '组件',
                        path: 'components',
                        lib: 'alib',
                        locales: {
                            'en-us': {
                                title: 'Components',
                            },
                        },
                    },
                    {
                        title: 'GitHub',
                        path: 'https://github.com/docgeni/docgeni',
                        isExternal: true,
                    },
                ],
                footer: 'Open-source MIT Licensed | Copyright © 2020-present Powered by PingCode',
                toc: 'menu',
            };
            const docgeni = new Docgeni({
                config: customConfig,
            });

            expect(docgeni.config).toEqual({
                ...customConfig,
            });
        });

        it('should use custom locales', () => {
            const docgeni = new Docgeni({
                config: {
                    locales: [
                        {
                            key: 'en-us',
                            name: 'EN',
                        },
                    ],
                },
            });
            expect(docgeni.config.locales).toEqual([
                {
                    key: 'en-us',
                    name: 'EN',
                },
            ]);
        });
    });

    describe('verify', () => {
        it('should throw error when default locale is not in locales', async () => {
            await expectThrowAsync(async () => {
                await new Docgeni({
                    config: {
                        locales: [
                            {
                                key: 'en-us',
                                name: 'EN',
                            },
                        ],
                        defaultLocale: 'zh-cn',
                    },
                }).verifyConfig();
            }, `default locale(zh-cn) is not in locales`);
        });

        it('should throw error when default locale has not in locales', async () => {
            await expectThrowAsync(async () => {
                docgeniHost.writeFile(`${process.cwd()}/docs/index.md`, 'content');
                const docgeni = new Docgeni({
                    config: {
                        locales: [
                            {
                                key: 'en-us',
                                name: 'EN',
                            },
                        ],
                        defaultLocale: 'zh-cn',
                    },
                    host: docgeniHost,
                });
                await docgeni.verifyConfig();
            }, `default locale(zh-cn) is not in locales`);
        });

        it('should throw error when doc dir has not exists', async () => {
            const notFoundPath = 'not-found/path';
            const expectFullPath = normalize(`${process.cwd()}/${notFoundPath}`);
            await expectThrowAsync(
                async () => {
                    const docgeni = new Docgeni({
                        config: {
                            docsDir: notFoundPath,
                        },
                        host: docgeniHost,
                    });
                    await docgeni.verifyConfig();
                },
                `docs dir(${notFoundPath}) has not exists, full path: ${getSystemPath(expectFullPath)}`,
            );
            docgeniHost.writeFile(`${process.cwd()}/${notFoundPath}/index.md`, 'content');
            await new Docgeni({
                config: {
                    docsDir: notFoundPath,
                },
                host: docgeniHost,
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
                        mode: 'full1' as any,
                    },
                    host: docgeniHost,
                });
                await docgeni.verifyConfig();
            }, `mode must be full or lite, current is full1`);
        });
    });
});
