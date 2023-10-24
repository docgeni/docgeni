import { toolkit } from '@docgeni/toolkit';
import { DocgeniContext } from '../docgeni.interface';
import { createTestDocgeniContext, DEFAULT_TEST_ROOT_PATH, FixtureResult, loadFixture, NgParserSpectator } from '../testing';
import { LibraryBuilderImpl } from './library-builder';
import { normalizeLibConfig } from './normalize';
import * as systemPath from 'path';
import { NavigationItem } from '../interfaces';
import { of } from 'rxjs';
import { LibraryBuilder, LibraryComponent } from '../types';
import { DefaultNgParserHost, NgParserHost, ts, NgDocParser, DefaultNgParserHostOptions, NgDocParserOptions } from '@docgeni/ngdoc';

class LibraryBuilderSpectator {
    components: LibraryComponent[];

    buildComponentCalls: LibraryComponent[] = [];
    buildComponentSuccessCalls: LibraryComponent[] = [];

    buildCalls: { builder: LibraryBuilder; components: LibraryComponent[] }[] = [];
    buildSuccessCalls: { builder: LibraryBuilder; components: LibraryComponent[] }[] = [];

    spyComponentBuilds = new Map<LibraryComponent, jasmine.Spy<() => Promise<void>>>();

    constructor(private libraryBuilder: LibraryBuilderImpl, context: DocgeniContext) {
        this.components = Array.from(libraryBuilder.components.values());
        this.components.forEach(component => {
            const spy = spyOn(component, 'build').and.returnValue(Promise.resolve());
            this.spyComponentBuilds.set(component, spy);
        });

        context.hooks.componentBuild.tap('TestBuildComponent', component => {
            this.buildComponentCalls.push(component);
        });
        context.hooks.componentBuildSucceed.tap('TestBuildComponentSuccess', component => {
            this.buildComponentSuccessCalls.push(component);
        });

        context.hooks.libraryBuild.tap('TestBuild', (libBuilder, components) => {
            this.buildCalls.push({ builder: libBuilder, components: components });
        });
        context.hooks.libraryBuildSucceed.tap('TestBuildSuccess', (libBuilder, components) => {
            this.buildSuccessCalls.push({ builder: libBuilder, components: components });
        });
    }

    assertBuildNotCalled() {
        this.spyComponentBuilds.forEach(spyComponentBuild => {
            expect(spyComponentBuild).not.toHaveBeenCalled();
        });
    }

    assertBuildComponents(components = this.components) {
        this.assertBuildComponentsHooks(components);
        this.assertBuildHooks(components);
        components.forEach(component => {
            expect(this.spyComponentBuilds.get(component)).toHaveBeenCalled();
        });
        this.assertBuildComponentsSuccessHooks(components);
        this.assertBuildSuccessHooks(components);
    }

    assertBuildHooks(components: LibraryComponent[]) {
        expect(this.buildCalls).toEqual([
            {
                builder: this.libraryBuilder,
                components: components
            }
        ]);
    }

    assertBuildSuccessHooks(components: LibraryComponent[]) {
        expect(this.buildSuccessCalls).toEqual([
            {
                builder: this.libraryBuilder,
                components: components
            }
        ]);
    }

    assertBuildComponentsHooks(components: LibraryComponent[]) {
        expect(this.buildComponentCalls).toEqual(components);
    }

    assertBuildComponentsSuccessHooks(components: LibraryComponent[]) {
        expect(this.buildComponentSuccessCalls).toEqual(components);
    }
}

describe('#library-builder', () => {
    const library = normalizeLibConfig({
        name: 'alib',
        rootDir: 'a-lib',
        include: ['', 'common'],
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
    });
    const libDirPath = toolkit.path.normalize(`${DEFAULT_TEST_ROOT_PATH}/a-lib`);

    let context: DocgeniContext;
    let fixture: FixtureResult;

    beforeEach(async () => {
        toolkit.initialize({
            baseDir: systemPath.resolve(__dirname, '../')
        });
        fixture = await loadFixture('library-builder-alib');
        context = createTestDocgeniContext({
            initialFiles: {
                [`${libDirPath}/button/doc/zh-cn.md`]: fixture.src['button/doc/zh-cn.md'],
                [`${libDirPath}/button/examples/module.ts`]: fixture.src['button/examples/module.ts'],
                [`${libDirPath}/button/examples/basic/basic.component.ts`]: fixture.src['button/examples/basic/basic.component.ts'],
                [`${libDirPath}/button/examples/basic/basic.component.html`]: fixture.src['button/examples/basic/basic.component.html'],
                [`${libDirPath}/button/examples/basic/index.md`]: fixture.src['button/examples/basic/index.md'],
                [`${libDirPath}/alert/doc/zh-cn.md`]: fixture.src['alert/doc/zh-cn.md'],
                [`${libDirPath}/alert/examples/module.ts`]: fixture.src['alert/examples/module.ts']
            },
            libs: [library],
            watch: true
        });
    });

    it('should create LibraryBuilder success', () => {
        const libraryBuilder = new LibraryBuilderImpl(context, library);
        expect(libraryBuilder).toBeTruthy();
    });

    it('should initialize components success', async () => {
        const libraryBuilder = new LibraryBuilderImpl(context, library);
        expect(libraryBuilder.components.size).toEqual(0);
        await libraryBuilder.initialize();
        expect(libraryBuilder.components.size).toEqual(2);

        const buttonComponent = libraryBuilder.components.get(`${libDirPath}/button`);
        expect(buttonComponent).toBeTruthy();
        expect(buttonComponent?.absPath).toEqual(`${libDirPath}/button`);
        expect(buttonComponent?.name).toEqual(`button`);

        const alertComponent = libraryBuilder.components.get(`${libDirPath}/alert`);
        expect(alertComponent).toBeTruthy();
        expect(alertComponent?.absPath).toEqual(`${libDirPath}/alert`);
        expect(alertComponent?.name).toEqual(`alert`);
    });

    it('should initialize components success with include', async () => {
        const libraryBuilder = new LibraryBuilderImpl(context, library);

        context.host.writeFile(`${libDirPath}/common/bar/doc/zh-cn.md`, 'bar');
        context.host.writeFile(`${libDirPath}/common/bar/examples/module.ts`, 'bar');

        expect(libraryBuilder.components.size).toEqual(0);
        await libraryBuilder.initialize();
        expect(libraryBuilder.components.size).toEqual(3);

        const barComponent = libraryBuilder.components.get(`${libDirPath}/common/bar`);
        expect(barComponent).toBeTruthy();
        expect(barComponent?.absPath).toEqual(`${libDirPath}/common/bar`);
        expect(barComponent?.name).toEqual(`bar`);
    });

    it('should load root components when include is empty ', async () => {
        const libraryBuilder = new LibraryBuilderImpl(context, { ...library, include: [] });

        expect(libraryBuilder.components.size).toEqual(0);
        await libraryBuilder.initialize();
        expect(libraryBuilder.components.size).toEqual(2);
    });

    it('should load root components when include is undefined ', async () => {
        const libraryBuilder = new LibraryBuilderImpl(context, { ...library, include: undefined });

        expect(libraryBuilder.components.size).toEqual(0);
        await libraryBuilder.initialize();
        expect(libraryBuilder.components.size).toEqual(2);
    });

    it('should build components success', async () => {
        const libraryBuilder = new LibraryBuilderImpl(context, library);
        expect(libraryBuilder.components.size).toEqual(0);
        await libraryBuilder.initialize();
        expect(libraryBuilder.components.size).toEqual(2);

        const libraryBuilderSpectator = new LibraryBuilderSpectator(libraryBuilder, context);
        libraryBuilderSpectator.assertBuildNotCalled();
        await libraryBuilder.build();
        libraryBuilderSpectator.assertBuildComponents();

        // eslint-disable-next-line dot-notation
        const localeCategoriesMap = libraryBuilder['localeCategoriesMap'];
        expect(localeCategoriesMap).toEqual({
            'zh-cn': [
                { id: 'general', title: '通用', subtitle: undefined, items: [] },
                { id: 'layout', title: '布局', subtitle: undefined, items: [] }
            ],
            'en-us': [
                { id: 'general', title: 'General', subtitle: undefined, items: [] },
                { id: 'layout', title: 'Layout', subtitle: undefined, items: [] }
            ]
        });
    });

    it('should generate locale navs', async () => {
        const libraryBuilder = new LibraryBuilderImpl(context, library);
        await libraryBuilder.initialize();
        const components = Array.from(libraryBuilder.components.values());
        components.map(component => {
            return spyOn(component, 'build').and.returnValue(Promise.resolve());
        });
        const componentDocItems = {
            alert: {
                id: `alib/alert`,
                path: `alert`,
                title: 'Alert',
                channelPath: 'components'
            },
            button: {
                id: `alib/button`,
                path: `button`,
                title: 'Button',
                category: 'general',
                channelPath: 'components'
            }
        };
        components.map(component => {
            return spyOn(component, 'getDocItem').and.returnValue(componentDocItems[component.name]);
        });
        await libraryBuilder.build();
        const rootNavs: NavigationItem[] = [
            {
                lib: 'alib',
                id: 'alib',
                title: 'Alib Components',
                path: 'components'
            }
        ];
        const zhNavs = libraryBuilder.generateDocsAndNavsForLocale('zh-cn', rootNavs);
        expect(zhNavs).toEqual([componentDocItems.button, componentDocItems.alert]);
        expect(rootNavs[0].items as unknown).toEqual([
            { id: 'general', title: '通用', items: [componentDocItems.button] },
            { id: 'layout', title: '布局', items: [] },
            { id: 'alib/alert', path: 'alert', title: 'Alert', channelPath: 'components' }
        ]);
    });

    it('should generate locale navs with channel path when mode is lite', async () => {
        context.config.mode = 'lite';
        const libraryBuilder = new LibraryBuilderImpl(context, library);
        await libraryBuilder.initialize();
        const components = Array.from(libraryBuilder.components.values());
        components.map(component => {
            return spyOn(component, 'build').and.returnValue(Promise.resolve());
        });
        const componentDocItems = {
            button: {
                id: `alib/button`,
                path: `button`,
                title: 'Button',
                category: 'general'
            }
        };
        components.map(component => {
            return spyOn(component, 'getDocItem').and.returnValue(componentDocItems[component.name]);
        });
        await libraryBuilder.build();
        const channel = {
            lib: 'alib',
            id: 'alib',
            title: 'Alib Components',
            path: 'components'
        };
        const zhNavs = libraryBuilder.generateDocsAndNavsForLocale('zh-cn', [channel]);
        expect(zhNavs).toEqual([{ ...componentDocItems.button, path: 'components/button' }]);
    });

    it('should generate locale navs without category', async () => {
        const libraryBuilder = new LibraryBuilderImpl(context, { ...library, categories: [] });
        await libraryBuilder.initialize();
        const components = Array.from(libraryBuilder.components.values());
        components.map(component => {
            return spyOn(component, 'build').and.returnValue(Promise.resolve());
        });
        const componentDocItems = {
            button: {
                id: `alib/button`,
                path: `button`,
                title: 'Button',
                channelPath: 'components'
            },
            alert: {
                id: `alib/alert`,
                path: `alert`,
                title: 'Alert',
                channelPath: 'components',
                order: 10
            }
        };
        components.map(component => {
            return spyOn(component, 'getDocItem').and.returnValue(componentDocItems[component.name]);
        });
        await libraryBuilder.build();
        const rootNavs: NavigationItem[] = [
            {
                lib: 'alib',
                id: 'alib',
                title: 'Alib Components',
                path: 'components'
            }
        ];
        const zhNavs = libraryBuilder.generateDocsAndNavsForLocale('zh-cn', rootNavs);
        expect(zhNavs).toEqual([componentDocItems.alert, componentDocItems.button]);
        expect(rootNavs[0].items).toEqual([
            { id: 'alib/alert', path: 'alert', title: 'Alert', channelPath: 'components', order: 10 },
            {
                id: `alib/button`,
                path: `button`,
                title: 'Button',
                channelPath: 'components'
            }
        ]);
    });

    it('should emit success', async () => {
        const libraryBuilder = new LibraryBuilderImpl(context, library);
        await libraryBuilder.initialize();
        const components = Array.from(libraryBuilder.components.values());
        components.map(component => {
            return spyOn(component, 'build').and.returnValue(Promise.resolve());
        });
        await libraryBuilder.build();
        const spyComponentEmits = components.map(component => {
            return spyOn(component, 'emit').and.returnValue(Promise.resolve({}));
        });
        spyComponentEmits.forEach(spyComponentEmit => {
            expect(spyComponentEmit).not.toHaveBeenCalled();
        });
        await libraryBuilder.emit();
        spyComponentEmits.forEach(spyComponentEmit => {
            expect(spyComponentEmit).toHaveBeenCalled();
        });
    });

    it('should create ngDocParser with automatic api mode', async () => {
        library.apiMode = 'automatic';
        const ngParserSpectator = new NgParserSpectator();

        const tsconfig = toolkit.path.resolve(libDirPath, 'tsconfig.lib.json');
        context.host.writeFile(tsconfig, '{includes: []}');
        const libraryBuilder = new LibraryBuilderImpl(context, library);
        expect(libraryBuilder.getNgDocParser()).toBeFalsy();
        ngParserSpectator.notHaveBeenCalled();
        await libraryBuilder.initialize();
        ngParserSpectator.toHaveBeenCalled({
            tsConfigPath: tsconfig,
            rootDir: libDirPath,
            watch: true
        });
        expect(libraryBuilder.getNgDocParser()).toEqual(ngParserSpectator.mockNgParser);
    });

    it('should create ngDocParser with compatible api mode', async () => {
        library.apiMode = 'compatible';
        const ngParserSpectator = new NgParserSpectator();

        const tsconfig = toolkit.path.resolve(libDirPath, 'tsconfig.lib.json');
        context.host.writeFile(tsconfig, '{includes: []}');
        const libraryBuilder = new LibraryBuilderImpl(context, library);
        expect(libraryBuilder.getNgDocParser()).toBeFalsy();
        ngParserSpectator.notHaveBeenCalled();
        await libraryBuilder.initialize();
        ngParserSpectator.toHaveBeenCalled({
            tsConfigPath: tsconfig,
            rootDir: libDirPath,
            watch: true
        });
        expect(libraryBuilder.getNgDocParser()).toEqual(ngParserSpectator.mockNgParser);
    });

    it('should rebuild component when watch api docs', async () => {
        library.apiMode = 'compatible';
        const ngParserSpectator = new NgParserSpectator();

        const tsconfig = toolkit.path.resolve(libDirPath, 'tsconfig.lib.json');
        context.host.writeFile(tsconfig, `{include: []}`);
        const libraryBuilder = new LibraryBuilderImpl(context, library);
        expect(libraryBuilder.getNgDocParser()).toBeFalsy();
        ngParserSpectator.notHaveBeenCalled();
        await libraryBuilder.initialize();
        const compileSpy = spyOn(context, 'compile');
        expect(compileSpy).not.toHaveBeenCalled();
        ngParserSpectator.fakeFileChange(toolkit.path.resolve(libDirPath, './button/button.component.ts'));
        expect(compileSpy).toHaveBeenCalledWith({
            libraryBuilder: libraryBuilder,
            libraryComponents: [libraryBuilder.components.get(toolkit.path.resolve(libDirPath, 'button'))],
            changes: []
        });
    });

    describe('watch', () => {
        it('should watch components', async () => {
            const libraryBuilder = new LibraryBuilderImpl(context, library);
            await libraryBuilder.initialize();
            const watchAggregatedSpy = spyOn(context.host, 'watchAggregated');
            const changes = [
                {
                    type: toolkit.fs.HostWatchEventType.Created,
                    path: toolkit.path.normalize(`${libDirPath}/button/examples/basic/module.ts`),
                    time: new Date()
                },
                {
                    type: toolkit.fs.HostWatchEventType.Changed,
                    path: toolkit.path.normalize(`${libDirPath}/button/examples/basic/basic.component.ts`),
                    time: new Date()
                }
            ];
            watchAggregatedSpy.and.callFake(paths => {
                expect(paths).toEqual([
                    `${libDirPath}/button/doc`,
                    `${libDirPath}/button/api`,
                    `${libDirPath}/button/examples`,
                    `${libDirPath}/alert/doc`,
                    `${libDirPath}/alert/api`,
                    `${libDirPath}/alert/examples`
                ]);
                return of(changes);
            });
            const spyCompile = spyOn(context, 'compile');
            expect(watchAggregatedSpy).not.toHaveBeenCalled();
            expect(spyCompile).not.toHaveBeenCalled();
            libraryBuilder.watch();
            expect(watchAggregatedSpy).toHaveBeenCalled();
            await toolkit.utils.wait(0);
            expect(spyCompile).toHaveBeenCalledWith({
                libraryBuilder: libraryBuilder,
                libraryComponents: [libraryBuilder.components.get(`${libDirPath}/button`)],
                changes: changes
            });
        });

        it('should get correct changed component when name prefix is same', async () => {
            const libraryBuilder = new LibraryBuilderImpl(context, library);
            context.host.writeFile(`${libDirPath}/button1/doc/zh-cn.md`, 'button1');
            context.host.writeFile(`${libDirPath}/button1/examples/module.ts`, 'button1');

            await libraryBuilder.initialize();
            const watchAggregatedSpy = spyOn(context.host, 'watchAggregated');
            const changes = [
                {
                    type: toolkit.fs.HostWatchEventType.Created,
                    path: toolkit.path.normalize(`${libDirPath}/button1/examples/basic/module.ts`),
                    time: new Date()
                }
            ];
            watchAggregatedSpy.and.callFake(paths => {
                return of(changes);
            });
            const spyCompile = spyOn(context, 'compile');
            libraryBuilder.watch();
            await toolkit.utils.wait(0);
            expect(spyCompile).toHaveBeenCalledWith({
                libraryBuilder: libraryBuilder,
                libraryComponents: [libraryBuilder.components.get(`${libDirPath}/button1`)],
                changes: changes
            });
        });

        it('should do nothings when watch is false', async () => {
            const libraryBuilder = new LibraryBuilderImpl(context, library);
            (context as any).watch = false;
            await libraryBuilder.initialize();
            const watchAggregatedSpy = spyOn(context.host, 'watchAggregated');
            expect(watchAggregatedSpy).not.toHaveBeenCalled();
            libraryBuilder.watch();
            expect(watchAggregatedSpy).not.toHaveBeenCalled();
        });
    });
});
