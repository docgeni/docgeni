import { execSync } from 'child_process';
import { shell, toolkit } from '@docgeni/toolkit';
import * as path from 'path';
import { expect } from 'chai';

describe('docgeni build', () => {
    it('should build success', async () => {
        const basicFixturePath = path.resolve(__dirname, './fixtures/doc-basic');
        shell.cd(basicFixturePath);
        shell.exec('ts-node --project ../../../tsconfig.json ../../../bin/docgeni build --skip-site');

        const siteSrcPath = path.resolve(basicFixturePath, './_site/src');
        const assetsContentPath = path.resolve(siteSrcPath, './assets/content');
        const navigationsFilePath = path.resolve(assetsContentPath, './navigations.json');
        expect(toolkit.fs.pathExistsSync(siteSrcPath)).equals(true);
        expect(toolkit.fs.pathExistsSync(assetsContentPath)).equals(true);
        expect(toolkit.fs.pathExistsSync(navigationsFilePath)).equals(true);
        const navigations = await toolkit.fs.readFileContent(navigationsFilePath);
        expect(JSON.parse(navigations)).deep.equals({
            'en-us': [],
            'zh-cn': [
                {
                    id: 'guide',
                    path: 'guide',
                    title: 'Guide',
                    subtitle: '',
                    items: [
                        {
                            id: 'intro',
                            path: 'intro',
                            title: 'Intro',
                            subtitle: '',
                            items: [
                                {
                                    id: 'intro2',
                                    path: 'intro2',
                                    title: 'Intro 2',
                                    subtitle: '',
                                    contentPath: '/docs/guide/intro/intro2.html'
                                },
                                {
                                    id: 'intro1',
                                    path: 'intro1',
                                    title: 'Intro 1',
                                    subtitle: '',
                                    contentPath: '/docs/guide/intro/intro1.html'
                                }
                            ]
                        },
                        {
                            id: 'getting-started',
                            path: 'getting-started',
                            title: '快速开始',
                            subtitle: '',
                            contentPath: '/docs/guide/getting-started.html'
                        },
                        {
                            id: 'installation',
                            path: 'installation',
                            title: '安装',
                            subtitle: '',
                            contentPath: '/docs/guide/installation.html'
                        }
                    ]
                }
            ]
        });

        const contentPath = path.resolve(siteSrcPath, './app/content');
        const configTsFilePath = path.resolve(contentPath, './config.ts');
        const exampleLoaderTsFilePath = path.resolve(contentPath, './example-loader.ts');
        const componentExamplesTsFilePath = path.resolve(contentPath, './component-examples.ts');

        expect(toolkit.fs.pathExistsSync(contentPath)).equals(true);
        expect(toolkit.fs.pathExistsSync(configTsFilePath)).equals(true);
        expect(toolkit.fs.pathExistsSync(exampleLoaderTsFilePath)).equals(true);
        expect(toolkit.fs.pathExistsSync(componentExamplesTsFilePath)).equals(true);
    });
});
