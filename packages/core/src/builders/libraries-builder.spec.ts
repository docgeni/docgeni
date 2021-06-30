import { DocgeniLibrary } from './../interfaces/library';
import { createTestDocgeniHost, expectThrowAsync } from '../testing';
import { DocgeniHost } from '../docgeni-host';
import { LibrariesBuilder } from './libraries-builder';
import { DocgeniContext } from '../docgeni.interface';
import { DocgeniPaths } from '../docgeni-paths';
import { toolkit } from '@docgeni/toolkit';

describe('libraries-builder', () => {
    let docgeniHost: DocgeniHost;
    beforeEach(() => {
        docgeniHost = createTestDocgeniHost();
    });

    function createDocgeniContext(libs: DocgeniLibrary[] | DocgeniLibrary): DocgeniContext {
        return {
            host: docgeniHost,
            config: {
                libs: toolkit.utils.coerceArray(libs)
            },
            watch: false,
            paths: new DocgeniPaths(process.cwd(), 'docs', 'dist/docgeni-site'),
            hooks: null,
            logger: null,
            librariesBuilders: null,
            docsBuilder: null,
            fs: null,
            enableIvy: null
        };
    }

    describe('verify', () => {
        it('should throw error when name is undefined or null or empty', async () => {
            await expectThrowAsync(async () => {
                const context = createDocgeniContext({
                    name: toolkit.utils.sample([null, undefined, '']),
                    rootDir: './packages/mylib'
                } as DocgeniLibrary);
                const librariesBuilder = new LibrariesBuilder(context);
                await librariesBuilder.initialize();
            }, `lib's name is required`);
        });

        it('should throw error when rootDir is undefined or null or empty', async () => {
            await expectThrowAsync(async () => {
                const context = createDocgeniContext({
                    name: 'mylib',
                    rootDir: toolkit.utils.sample([null, undefined, ''])
                } as DocgeniLibrary);
                const librariesBuilder = new LibrariesBuilder(context);
                await librariesBuilder.initialize();
            }, `mylib lib's rootDir is required`);
        });

        it('should throw error when rootDir is not exists', async () => {
            await expectThrowAsync(async () => {
                const context = createDocgeniContext({
                    name: 'mylib',
                    rootDir: 'not-found-lib-dir'
                } as DocgeniLibrary);
                const librariesBuilder = new LibrariesBuilder(context);
                await librariesBuilder.initialize();
            }, `mylib lib's rootDir(not-found-lib-dir) has not exists`);
        });

        it('should throw error when lib category id is undefined or null or empty', async () => {
            await expectThrowAsync(async () => {
                const context = createDocgeniContext({
                    name: 'mylib',
                    abbrName: 'alib',
                    rootDir: './packages/mylib',
                    include: ['src'],
                    exclude: ['test'],
                    categories: [
                        {
                            id: toolkit.utils.sample([null, undefined, '']),
                            title: ''
                        }
                    ]
                });
                const librariesBuilder = new LibrariesBuilder(context);
                await librariesBuilder.initialize();
            }, `mylib lib's category id is required`);
        });

        it('should throw error when lib category title is undefined or null or empty', async () => {
            await expectThrowAsync(async () => {
                const context = createDocgeniContext({
                    name: 'mylib',
                    abbrName: 'alib',
                    rootDir: './packages/mylib',
                    include: ['src'],
                    exclude: ['test'],
                    categories: [
                        {
                            id: toolkit.strings.generateRandomId(),
                            title: toolkit.utils.sample([null, undefined, ''])
                        }
                    ]
                });
                const librariesBuilder = new LibrariesBuilder(context);
                await librariesBuilder.initialize();
            }, `mylib lib's category title is required`);
        });

        it('should throw error when lib category id duplicate', async () => {
            const duplicateId = toolkit.strings.generateRandomId();
            await expectThrowAsync(async () => {
                const context = createDocgeniContext({
                    name: 'mylib',
                    abbrName: 'alib',
                    rootDir: './packages/mylib',
                    categories: [
                        {
                            id: duplicateId,
                            title: duplicateId
                        },
                        {
                            id: duplicateId,
                            title: duplicateId
                        }
                    ]
                });
                const librariesBuilder = new LibrariesBuilder(context);
                await librariesBuilder.initialize();
            }, `mylib lib's category id(${duplicateId}) duplicate`);
        });
    });
});
