import { DocgeniLibrary } from './../interfaces/library';
import {
    assertExpectedFiles,
    createTestDocgeniContext,
    createTestDocgeniHost,
    DEFAULT_TEST_ROOT_PATH,
    expectThrowAsync,
    FixtureResult,
    loadFixture,
    writeFilesToHost
} from '../testing';
import { DocgeniHost } from '../docgeni-host';
import { LibrariesBuilder } from './libraries-builder';
import { DocgeniContext } from '../docgeni.interface';
import { DocgeniPaths } from '../docgeni-paths';
import { toolkit } from '@docgeni/toolkit';
import { normalizeLibConfig } from './normalize';
import { normalize, resolve } from '../fs';
import * as systemPath from 'path';
import { EmitFiles, LibraryBuilder } from '../types';

class LibrariesBuilderSpectator {
    private spyLibBuilds = new Map<LibraryBuilder, jasmine.Spy<() => Promise<void>>>();
    private spyLibEmits = new Map<LibraryBuilder, jasmine.Spy<() => Promise<EmitFiles>>>();
    private spyLibWatches = new Map<LibraryBuilder, jasmine.Spy<() => Promise<void>>>();

    constructor(private librariesBuilder: LibrariesBuilder) {
        librariesBuilder.libraries.forEach(libraryBuilder => {
            const buildSpy = spyOn(libraryBuilder, 'build');
            buildSpy.and.callFake(() => {
                return Promise.resolve();
            });
            this.spyLibBuilds.set(libraryBuilder, buildSpy);

            const emitSpy = spyOn(libraryBuilder, 'emit');
            emitSpy.and.callFake(() => {
                return Promise.resolve({});
            });
            this.spyLibEmits.set(libraryBuilder, emitSpy);

            const watchSpy = spyOn(libraryBuilder, 'watch');
            watchSpy.and.callFake(() => {
                return Promise.resolve();
            });
            this.spyLibWatches.set(libraryBuilder, watchSpy);
        });
    }

    assetBuildLibraries(libs: LibraryBuilder[] = this.librariesBuilder.libraries) {
        libs.forEach(lib => {
            expect(this.spyLibBuilds.get(lib)).toHaveBeenCalled();
        });
    }

    assetEmitLibraries(libs: LibraryBuilder[] = this.librariesBuilder.libraries) {
        libs.forEach(lib => {
            expect(this.spyLibEmits.get(lib)).toHaveBeenCalled();
        });
    }

    assetWatchLibrariesNotCalled(libs: LibraryBuilder[] = this.librariesBuilder.libraries) {
        libs.forEach(lib => {
            expect(this.spyLibWatches.get(lib)).not.toHaveBeenCalled();
        });
    }

    assetWatchLibrariesCalled(libs: LibraryBuilder[] = this.librariesBuilder.libraries) {
        libs.forEach(lib => {
            expect(this.spyLibWatches.get(lib)).toHaveBeenCalled();
        });
    }
}

describe('libraries-builder', () => {
    describe('basic', () => {
        const libDirPath = `${DEFAULT_TEST_ROOT_PATH}/a-lib`;
        const library = {
            name: 'alib',
            rootDir: libDirPath,
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
        };

        let context: DocgeniContext;
        let fixture: FixtureResult;

        beforeAll(async () => {
            toolkit.initialize({
                baseDir: systemPath.resolve(__dirname, '../')
            });
            fixture = await loadFixture('library-builder-alib');
        });

        beforeEach(async () => {
            context = createTestDocgeniContext({
                libs: library,
                initialFiles: {
                    [`${libDirPath}/button/doc/zh-cn.md`]: fixture.src['button/doc/zh-cn.md'],
                    [`${libDirPath}/button/examples/module.ts`]: fixture.src['button/examples/module.ts'],
                    [`${libDirPath}/button/examples/basic/basic.component.ts`]: fixture.src['button/examples/basic/basic.component.ts'],
                    [`${libDirPath}/button/examples/basic/basic.component.html`]: fixture.src['button/examples/basic/basic.component.html'],
                    [`${libDirPath}/button/examples/basic/index.md`]: fixture.src['button/examples/basic/index.md'],
                    [`${libDirPath}/alert/doc/zh-cn.md`]: fixture.src['alert/doc/zh-cn.md'],
                    [`${libDirPath}/alert/examples/module.ts`]: fixture.src['alert/examples/module.ts']
                },
                watch: true
            });
        });

        it('should initialize libraries builder success', async () => {
            const librariesBuilder = new LibrariesBuilder(context);
            await librariesBuilder.initialize();
            expect(librariesBuilder.libraries).toBeTruthy();
            const aLib = librariesBuilder.libraries[0].lib;
            expect(aLib).toBeTruthy();
            expect(aLib.name).toEqual(library.name);
            expect(aLib.abbrName).toEqual(library.name);
        });

        it('should build success', async () => {
            const librariesBuilder = new LibrariesBuilder(context);
            await librariesBuilder.initialize();
            const librariesBuilderSpectator = new LibrariesBuilderSpectator(librariesBuilder);
            await librariesBuilder.build();
            librariesBuilderSpectator.assetBuildLibraries();
        });

        it('should emit success', async () => {
            const librariesBuilder = new LibrariesBuilder(context);
            await librariesBuilder.initialize();
            await librariesBuilder.build();
            await librariesBuilder.emit();

            const expectedFiles = {
                [resolve(context.paths.absSiteContentPath, 'index.ts')]: fixture.getOutputContent(`index.ts`),
                [resolve(context.paths.absSiteContentPath, 'example-modules.ts')]: fixture.getOutputContent(`example-modules.ts`),
                [resolve(context.paths.absSiteContentPath, 'example-loader.ts')]: fixture.getOutputContent(`example-loader.ts`),
                [resolve(context.paths.absSiteContentPath, 'component-examples.ts')]: fixture.getOutputContent(`component-examples.ts`)
            };
            await assertExpectedFiles(context.host, expectedFiles, true);
        });

        it('should watch success', async () => {
            const librariesBuilder = new LibrariesBuilder(context);
            await librariesBuilder.initialize();
            const librariesBuilderSpectator = new LibrariesBuilderSpectator(librariesBuilder);
            librariesBuilderSpectator.assetWatchLibrariesNotCalled();
            librariesBuilder.watch();
            librariesBuilderSpectator.assetWatchLibrariesCalled();
        });
    });

    describe('verify', () => {
        it('should throw error when name is undefined or null or empty', async () => {
            await expectThrowAsync(async () => {
                const context = createTestDocgeniContext({
                    libs: {
                        name: toolkit.utils.sample([null, undefined, '']),
                        rootDir: './packages/mylib'
                    } as DocgeniLibrary
                });
                const librariesBuilder = new LibrariesBuilder(context);
                await librariesBuilder.initialize();
            }, `lib's name is required`);
        });

        it('should throw error when rootDir is undefined or null or empty', async () => {
            await expectThrowAsync(async () => {
                const context = createTestDocgeniContext({
                    libs: {
                        name: 'mylib',
                        rootDir: toolkit.utils.sample([null, undefined, ''])
                    } as DocgeniLibrary
                });
                const librariesBuilder = new LibrariesBuilder(context);
                await librariesBuilder.initialize();
            }, `mylib lib's rootDir is required`);
        });

        it('should throw error when rootDir is not exists', async () => {
            await expectThrowAsync(async () => {
                const context = createTestDocgeniContext({
                    libs: {
                        name: 'mylib',
                        rootDir: 'not-found-lib-dir'
                    }
                });
                const librariesBuilder = new LibrariesBuilder(context);
                await librariesBuilder.initialize();
            }, `mylib lib's rootDir(not-found-lib-dir) has not exists`);
        });

        it('should throw error when lib category id is undefined or null or empty', async () => {
            await expectThrowAsync(async () => {
                const context = createTestDocgeniContext({
                    libs: {
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
                    }
                });
                const librariesBuilder = new LibrariesBuilder(context);
                await librariesBuilder.initialize();
            }, `mylib lib's category id is required`);
        });

        it('should throw error when lib category title is undefined or null or empty', async () => {
            await expectThrowAsync(async () => {
                const context = createTestDocgeniContext({
                    libs: {
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
                    }
                });
                const librariesBuilder = new LibrariesBuilder(context);
                await librariesBuilder.initialize();
            }, `mylib lib's category title is required`);
        });

        it('should throw error when lib category id duplicate', async () => {
            const duplicateId = toolkit.strings.generateRandomId();
            await expectThrowAsync(async () => {
                const context = createTestDocgeniContext({
                    libs: {
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
                    }
                });
                const librariesBuilder = new LibrariesBuilder(context);
                await librariesBuilder.initialize();
            }, `mylib lib's category id(${duplicateId}) duplicate`);
        });

        it("should throw error when lib's tsconfig.lib.json has not exist for compatible", async () => {
            const libDirPath = `${DEFAULT_TEST_ROOT_PATH}/a-lib`;
            await expectThrowAsync(async () => {
                const context = createTestDocgeniContext({
                    libs: {
                        name: 'mylib',
                        abbrName: 'alib',
                        rootDir: libDirPath,
                        apiMode: 'compatible',
                        categories: []
                    },
                    initialFiles: {
                        [`${libDirPath}/app.module.ts`]: ''
                    }
                });
                const librariesBuilder = new LibrariesBuilder(context);
                await librariesBuilder.initialize();
            }, `mylib lib's tsConfigPath(/D/test/a-lib/tsconfig.lib.json) has not exists, should config it relative to rootDir(/D/test/a-lib) for apiMode: compatible`);
        });

        it("should throw error when lib's tsconfig.lib.json has not exist for automatic", async () => {
            const libDirPath = `${DEFAULT_TEST_ROOT_PATH}/a-lib`;
            await expectThrowAsync(async () => {
                const context = createTestDocgeniContext({
                    libs: {
                        name: 'mylib',
                        abbrName: 'alib',
                        rootDir: libDirPath,
                        apiMode: 'automatic',
                        categories: []
                    },
                    initialFiles: {
                        [`${libDirPath}/app.module.ts`]: ''
                    }
                });
                const librariesBuilder = new LibrariesBuilder(context);
                await librariesBuilder.initialize();
            }, `mylib lib's tsConfigPath(/D/test/a-lib/tsconfig.lib.json) has not exists, should config it relative to rootDir(/D/test/a-lib) for apiMode: automatic`);
        });

        it('should build success when has tsconfig.lib.json for automatic', async () => {
            const libDirPath = `${DEFAULT_TEST_ROOT_PATH}/a-lib`;
            const context = createTestDocgeniContext({
                libs: {
                    name: 'mylib',
                    abbrName: 'alib',
                    rootDir: libDirPath,
                    apiMode: 'automatic',
                    categories: []
                },
                initialFiles: {
                    [`${libDirPath}/tsconfig.lib.json`]: ''
                }
            });
            const librariesBuilder = new LibrariesBuilder(context);
            await librariesBuilder.initialize();
        });
    });
});
