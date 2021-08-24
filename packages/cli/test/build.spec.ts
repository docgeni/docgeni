import { shell, toolkit } from '@docgeni/toolkit';
import { DEFAULT_CONFIG, Docgeni, DocgeniConfig } from '@docgeni/core';
import * as path from 'path';
import { EOL } from 'os';

describe('docgeni build', () => {
    it('should build success', async () => {
        const basicFixturePath = path.resolve(__dirname, './fixtures/doc-basic');

        // shell.cd(basicFixturePath);
        // shell.exec('ts-node --project ../../../tsconfig.json ../../../bin/docgeni build --skip-site');
        // execSync(`cd ${basicFixturePath} && ts-node --project ../../../tsconfig.json ../../../bin/docgeni build --skip-site`);
        // shell.execSync(`cd ${basicFixturePath} && TS_NODE_PROJECT=../../../tsconfig.json ts-node ../../../bin/docgeni build --skip-site`);

        const config: DocgeniConfig = {
            baseHref: '/',
            mode: 'full',
            title: 'Docgeni',
            logoUrl: 'https://cdn.pingcode.com/open-sources/docgeni/logo.png',
            docsDir: 'docs',
            repoUrl: 'https://github.com/docgeni/docgeni',
            navs: [null],
            locales: [
                {
                    key: 'zh-cn',
                    name: '中文'
                }
            ],
            defaultLocale: 'zh-cn'
        };
        const docgeni = new Docgeni({
            cwd: basicFixturePath,
            config: {
                ...config
            },
            cmdArgs: {
                skipSite: true
            }
        });
        await docgeni.run();
        const expectConfig = { ...DEFAULT_CONFIG, ...config };
        const siteSrcPath = path.resolve(basicFixturePath, `./${expectConfig.siteDir}/src`);
        const assetsContentPath = path.resolve(siteSrcPath, './assets/content');
        const navigationsFilePath = path.resolve(assetsContentPath, './navigations-zh-cn.json');
        expect(toolkit.fs.pathExistsSync(siteSrcPath)).toEqual(true);
        expect(toolkit.fs.pathExistsSync(assetsContentPath)).toEqual(true);
        expect(toolkit.fs.pathExistsSync(navigationsFilePath)).toEqual(true);
        const navigations = await toolkit.fs.readFileContent(navigationsFilePath);
        const expectedNavigations = {
            navs: [
                {
                    id: 'guide',
                    path: 'guide',
                    channelPath: 'guide',
                    title: 'Guide',
                    items: [
                        {
                            id: 'guide/intro',
                            path: 'guide/intro',
                            channelPath: 'guide',
                            title: 'Intro',
                            items: [
                                {
                                    id: 'intro2',
                                    path: 'intro/intro2',
                                    channelPath: 'guide',
                                    title: 'Intro 2',
                                    order: 1,
                                    contentPath: 'docs/guide/intro/intro2.html'
                                },
                                {
                                    id: 'intro1',
                                    path: 'intro/intro1',
                                    channelPath: 'guide',
                                    title: 'Intro 1',
                                    order: 2,
                                    contentPath: 'docs/guide/intro/intro1.html'
                                }
                            ],
                            order: 1
                        },
                        {
                            id: 'getting-started',
                            path: 'getting-started',
                            channelPath: 'guide',
                            title: '快速开始',
                            order: 2,
                            contentPath: 'docs/guide/getting-started.html'
                        },
                        {
                            id: 'installation',
                            path: 'installation',
                            channelPath: 'guide',
                            title: '安装',
                            order: 2,
                            contentPath: 'docs/guide/installation.html'
                        }
                    ],
                    order: 1
                }
            ],
            docs: [
                {
                    id: 'getting-started',
                    path: 'getting-started',
                    channelPath: 'guide',
                    title: '快速开始',
                    order: 2,
                    contentPath: 'docs/guide/getting-started.html'
                },
                {
                    id: 'installation',
                    path: 'installation',
                    channelPath: 'guide',
                    title: '安装',
                    order: 2,
                    contentPath: 'docs/guide/installation.html'
                },
                {
                    id: 'intro1',
                    path: 'intro/intro1',
                    channelPath: 'guide',
                    title: 'Intro 1',
                    order: 2,
                    contentPath: 'docs/guide/intro/intro1.html'
                },
                {
                    id: 'intro2',
                    path: 'intro/intro2',
                    channelPath: 'guide',
                    title: 'Intro 2',
                    order: 1,
                    contentPath: 'docs/guide/intro/intro2.html'
                }
            ],
            homeMeta: { contentPath: 'docs/index.html' }
        };
        await expect(JSON.parse(navigations)).toEqual(
            expectedNavigations,
            `expected is:${EOL} ${JSON.stringify(expectedNavigations, null, 2)}, actual is:${EOL} ${navigations}`
        );

        const contentPath = path.resolve(siteSrcPath, './app/content');
        const configTsFilePath = path.resolve(contentPath, './config.ts');
        const exampleLoaderTsFilePath = path.resolve(contentPath, './example-loader.ts');
        const componentExamplesTsFilePath = path.resolve(contentPath, './component-examples.ts');

        expect(toolkit.fs.pathExistsSync(contentPath)).toEqual(true);
        expect(toolkit.fs.pathExistsSync(configTsFilePath)).toEqual(true);
        expect(toolkit.fs.pathExistsSync(exampleLoaderTsFilePath)).toEqual(true);
        expect(toolkit.fs.pathExistsSync(componentExamplesTsFilePath)).toEqual(true);
    });
});
