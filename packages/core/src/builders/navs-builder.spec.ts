import { DocgeniContext } from '../docgeni.interface';
import {
    createTestDocgeniContext,
    createTestDocgeniHost,
    DEFAULT_TEST_ROOT_PATH,
    FixtureResult,
    loadFixture,
    updateContext
} from '../testing';
import { NavsBuilder } from './navs-builder';
import * as path from 'path';
import { DocSourceFile } from './doc-file';
import { DocType } from '../enums';
import { toolkit } from '@docgeni/toolkit';

describe('#navs-builder', () => {
    let context: DocgeniContext;
    let initialFiles: Record<string, string>;
    let fixture: FixtureResult;

    beforeEach(async () => {
        fixture = await loadFixture('docs-full');
        initialFiles = {
            [`${DEFAULT_TEST_ROOT_PATH}/docs/index.md`]: fixture.src['index.md'],
            [`${DEFAULT_TEST_ROOT_PATH}/docs/guides/index.md`]: fixture.src['guides/index.md'],
            [`${DEFAULT_TEST_ROOT_PATH}/docs/guides/intro.md`]: fixture.src['guides/intro.md'],
            [`${DEFAULT_TEST_ROOT_PATH}/docs/zh-cn/guides/intro.md`]: fixture.src['guides/intro.md']
        };
        context = createTestDocgeniContext({
            initialFiles: initialFiles
        });
    });

    it('should build success', async () => {
        spyOn(toolkit.fs, 'globSync').and.callFake((pattern, options) => {
            expect(pattern).toEqual(`/**/*.md`);
            return Object.keys(initialFiles);
        });
        await context.docsBuilder.run();
        const navsBuilder = new NavsBuilder(context);
        await navsBuilder.run();

        const zhJSONStr = await context.host.readFile(`${context.paths.absSiteAssetsContentPath}/navigations-zh-cn.json`);
        const enJSONStr = await context.host.readFile(`${context.paths.absSiteAssetsContentPath}/navigations-en-us.json`);
        expect(JSON.parse(enJSONStr)).toEqual({
            navs: [
                {
                    id: 'guides',
                    path: 'guides',
                    channelPath: 'guides',
                    title: 'Guide',
                    items: [
                        {
                            id: 'intro',
                            path: 'guides/intro',
                            channelPath: 'guides',
                            title: 'Introduce',
                            order: 10,
                            contentPath: 'docs/guides/intro.html',
                            originPath: 'docs/guides/intro.md'
                        }
                    ],
                    order: 1
                },
                {
                    id: 'index',
                    path: '',
                    channelPath: '',
                    title: 'Home',
                    order: 10,
                    contentPath: 'docs/index.html',
                    originPath: 'docs/index.md'
                }
            ],
            docs: [
                {
                    id: 'index',
                    path: '',
                    channelPath: '',
                    title: 'Home',
                    order: 10,
                    contentPath: 'docs/index.html',
                    originPath: 'docs/index.md'
                },
                {
                    id: 'intro',
                    path: 'guides/intro',
                    channelPath: 'guides',
                    title: 'Introduce',
                    order: 10,
                    contentPath: 'docs/guides/intro.html',
                    originPath: 'docs/guides/intro.md'
                }
            ]
        });
        expect(JSON.parse(zhJSONStr)).toEqual({
            navs: [
                {
                    id: 'guides',
                    path: 'guides',
                    channelPath: 'guides',
                    title: 'Guides',
                    items: [
                        {
                            id: 'intro',
                            path: 'guides/intro',
                            channelPath: 'guides',
                            title: 'Introduce',
                            order: 10,
                            contentPath: 'docs/zh-cn/guides/intro.html',
                            originPath: 'docs/zh-cn/guides/intro.md'
                        }
                    ],
                    order: 9007199254740991
                }
            ],
            docs: [
                {
                    id: 'intro',
                    path: 'guides/intro',
                    channelPath: 'guides',
                    title: 'Introduce',
                    order: 10,
                    contentPath: 'docs/zh-cn/guides/intro.html',
                    originPath: 'docs/zh-cn/guides/intro.md'
                }
            ]
        });
    });

    it('should build success with one local', async () => {
        initialFiles = {
            [`${DEFAULT_TEST_ROOT_PATH}/docs/index.md`]: fixture.src['index.md']
        };
        spyOn(toolkit.fs, 'globSync').and.callFake((pattern, options) => {
            expect(pattern).toEqual(`/**/*.md`);
            return Object.keys(initialFiles);
        });
        const host = createTestDocgeniHost(initialFiles);
        updateContext(context, { host: host });
        await context.docsBuilder.run();
        const navsBuilder = new NavsBuilder(context);
        await navsBuilder.run();

        const zhJSONStr = await context.host.readFile(`${context.paths.absSiteAssetsContentPath}/navigations-zh-cn.json`);
        const enJSONStr = await context.host.readFile(`${context.paths.absSiteAssetsContentPath}/navigations-en-us.json`);
        expect(JSON.parse(enJSONStr)).toEqual({
            navs: [
                {
                    id: 'index',
                    path: '',
                    channelPath: '',
                    title: 'Home',
                    order: 10,
                    contentPath: 'docs/index.html',
                    originPath: 'docs/index.md'
                }
            ],
            docs: [
                {
                    id: 'index',
                    path: '',
                    channelPath: '',
                    title: 'Home',
                    order: 10,
                    contentPath: 'docs/index.html',
                    originPath: 'docs/index.md'
                }
            ]
        });
        expect(JSON.parse(zhJSONStr)).toEqual({
            navs: [],
            docs: []
        });
    });
});
