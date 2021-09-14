import { toolkit } from '@docgeni/toolkit';
import { DocgeniContext } from '../docgeni.interface';
import { normalize, resolve } from '../fs';
import { createTestDocgeniContext, DEFAULT_TEST_ROOT_PATH, FixtureResult, loadFixture } from '../testing';
import { LibraryBuilder } from './library-builder';
import { normalizeLibConfig } from './normalize';
import * as systemPath from 'path';
import { LibComponent } from './library-component';
import { ChannelItem, NavigationItem } from '../interfaces';
import { ASSETS_API_DOCS_RELATIVE_PATH, ASSETS_EXAMPLES_HIGHLIGHTED_RELATIVE_PATH, ASSETS_OVERVIEWS_RELATIVE_PATH } from '../constants';

describe('#library-builder', () => {
    const library = normalizeLibConfig({
        name: 'alib',
        rootDir: 'a-lib',
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
    });
    const libDirPath = normalize(`${DEFAULT_TEST_ROOT_PATH}/a-lib`);

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
            libs: [library]
        });
    });

    it('should create LibraryBuilder success', () => {
        const libraryBuilder = new LibraryBuilder(context, library);
        expect(libraryBuilder).toBeTruthy();
    });

    it('should initialize components success', async () => {
        const libraryBuilder = new LibraryBuilder(context, library);
        expect(libraryBuilder.components.size).toEqual(0);
        await libraryBuilder.initialize();
        expect(libraryBuilder.components.size).toEqual(2);

        const buttonComponent = libraryBuilder.components.get(`${libDirPath}/button`);
        expect(buttonComponent).toBeTruthy();
        expect(buttonComponent.absPath).toEqual(`${libDirPath}/button`);
        expect(buttonComponent.name).toEqual(`button`);

        const alertComponent = libraryBuilder.components.get(`${libDirPath}/alert`);
        expect(alertComponent).toBeTruthy();
        expect(alertComponent.absPath).toEqual(`${libDirPath}/alert`);
        expect(alertComponent.name).toEqual(`alert`);
    });

    it('should initialize components success with include', async () => {
        const libraryBuilder = new LibraryBuilder(context, library);

        context.host.writeFile(`${libDirPath}/common/bar/doc/zh-cn.md`, 'bar');
        context.host.writeFile(`${libDirPath}/common/bar/examples/module.ts`, 'bar');

        expect(libraryBuilder.components.size).toEqual(0);
        await libraryBuilder.initialize();
        expect(libraryBuilder.components.size).toEqual(4);

        const barComponent = libraryBuilder.components.get(`${libDirPath}/common/bar`);
        expect(barComponent).toBeTruthy();
        expect(barComponent.absPath).toEqual(`${libDirPath}/common/bar`);
        expect(barComponent.name).toEqual(`bar`);
    });

    it('should build components success', async () => {
        const libraryBuilder = new LibraryBuilder(context, library);
        expect(libraryBuilder.components.size).toEqual(0);
        await libraryBuilder.initialize();
        expect(libraryBuilder.components.size).toEqual(2);
        const components = Array.from(libraryBuilder.components.values());
        const spyComponentBuilds = components.map(component => {
            return spyOn(component, 'build').and.returnValue(Promise.resolve());
        });
        spyComponentBuilds.forEach(spyComponentBuild => {
            expect(spyComponentBuild).not.toHaveBeenCalled();
        });
        const buildComponentHookCalls: LibComponent[] = [];
        const buildComponentSuccessHookCalls: LibComponent[] = [];
        libraryBuilder.hooks.buildComponent.tap('TestBuildComponent', component => {
            buildComponentHookCalls.push(component);
        });
        libraryBuilder.hooks.buildComponentSucceed.tap('TestBuildComponentSuccess', component => {
            buildComponentSuccessHookCalls.push(component);
        });
        await libraryBuilder.build();
        spyComponentBuilds.forEach(spyComponentBuild => {
            expect(spyComponentBuild).toHaveBeenCalled();
        });
        expect(buildComponentHookCalls).toEqual(components);
        expect(buildComponentSuccessHookCalls).toEqual(components);

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
        const libraryBuilder = new LibraryBuilder(context, library);
        expect(libraryBuilder.components.size).toEqual(0);
        await libraryBuilder.initialize();
        expect(libraryBuilder.components.size).toEqual(2);
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
            },
            alert: {
                id: `alib/alert`,
                path: `alert`,
                title: 'Alert'
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
        const zhNavs = libraryBuilder.generateLocaleNavs('zh-cn', rootNavs);
        expect(zhNavs).toEqual([componentDocItems.button, componentDocItems.alert]);
        expect(rootNavs[0].items as unknown).toEqual([
            { id: 'general', title: '通用', items: [componentDocItems.button] },
            { id: 'layout', title: '布局', items: [] },
            { id: 'alib/alert', path: 'alert', title: 'Alert' }
        ]);
    });

    it('should generate locale navs with channel path when mode is lite', async () => {
        context.config.mode = 'lite';
        const libraryBuilder = new LibraryBuilder(context, library);
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
        const zhNavs = libraryBuilder.generateLocaleNavs('zh-cn', [channel]);
        expect(zhNavs).toEqual([{ ...componentDocItems.button, path: 'components/button' }]);
    });

    it('should emit success', async () => {
        const libraryBuilder = new LibraryBuilder(context, library);
        await libraryBuilder.initialize();
        const components = Array.from(libraryBuilder.components.values());
        components.map(component => {
            return spyOn(component, 'build').and.returnValue(Promise.resolve());
        });
        await libraryBuilder.build();
        const spyComponentEmits = components.map(component => {
            return spyOn(component, 'emit').and.returnValue(Promise.resolve());
        });
        spyComponentEmits.forEach(spyComponentEmit => {
            expect(spyComponentEmit).not.toHaveBeenCalled();
        });
        await libraryBuilder.emit();
        spyComponentEmits.forEach(spyComponentEmit => {
            expect(spyComponentEmit).toHaveBeenCalled();
            expect(spyComponentEmit).toHaveBeenCalledWith(
                resolve(context.paths.absSitePath, `${ASSETS_OVERVIEWS_RELATIVE_PATH}/alib`),
                resolve(context.paths.absSitePath, `${ASSETS_API_DOCS_RELATIVE_PATH}/alib`),
                resolve(context.paths.absSiteContentPath, `components/alib`),
                resolve(context.paths.absSitePath, `${ASSETS_EXAMPLES_HIGHLIGHTED_RELATIVE_PATH}/alib`)
            );
        });
    });
});
