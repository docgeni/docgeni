import { DocgeniContext } from '../docgeni.interface';
import { createTestDocgeniContext, DEFAULT_TEST_ROOT_PATH, FixtureResult, loadFixture } from '../testing';
import { LibraryComponentImpl } from './library-component';
import { normalizeLibConfig } from './normalize';
import { EOL } from 'os';
import { toolkit } from '@docgeni/toolkit';
import * as systemPath from 'path';
import { cosmiconfig } from 'cosmiconfig';
import { DocgeniHost } from '../docgeni-host';
import { getSystemPath, normalize } from '../fs';
import { DocSourceFile } from './doc-file';

describe('#library-component', () => {
    const library = normalizeLibConfig({
        name: 'alib',
        rootDir: 'alib',
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
    const buttonDirPath = normalize(`${DEFAULT_TEST_ROOT_PATH}/alib/button`);
    let context: DocgeniContext;
    let fixture: FixtureResult;
    beforeAll(async () => {
        toolkit.initialize({
            baseDir: systemPath.resolve(__dirname, '../')
        });
        fixture = await loadFixture('library-component-button');
    });

    beforeEach(async () => {
        context = createTestDocgeniContext({
            initialFiles: {
                [`${buttonDirPath}/doc/zh-cn.md`]: fixture.src['doc/zh-cn.md'],
                [`${buttonDirPath}/doc/en-us.md`]: fixture.src['doc/en-us.md'],
                [`${buttonDirPath}/api/zh-cn.js`]: fixture.src['api/zh-cn.js'],
                [`${buttonDirPath}/api/en-us.js`]: fixture.src['api/en-us.js'],
                [`${buttonDirPath}/examples/module.ts`]: fixture.src['examples/module.ts'],
                [`${buttonDirPath}/examples/basic/basic.component.ts`]: fixture.src['examples/basic/basic.component.ts'],
                [`${buttonDirPath}/examples/basic/basic.component.html`]: fixture.src['examples/basic/basic.component.html'],
                [`${buttonDirPath}/examples/basic/index.md`]: fixture.src['examples/basic/index.md']
            },
            libs: [library],
            watch: true
        });
    });

    it('should create lib component success', async () => {
        const component = new LibraryComponentImpl(context, library, 'button', `${DEFAULT_TEST_ROOT_PATH}/alib/button`);
        expect(component).toBeTruthy();
        expect(component.absPath).toEqual(`${DEFAULT_TEST_ROOT_PATH}/alib/button`);
        expect(component.name).toEqual(`button`);
        expect(component.absDocPath).toEqual(`${buttonDirPath}/doc`);
        expect(component.absApiPath).toEqual(`${buttonDirPath}/api`);
        expect(component.absExamplesPath).toEqual(`${buttonDirPath}/examples`);
    });

    it('should get correct module key', () => {
        const component = new LibraryComponentImpl(context, library, 'button', `${DEFAULT_TEST_ROOT_PATH}/alib/button`);
        expect(component.getModuleKey()).toEqual(`${library.name}/button`);
    });

    it('should build lib component success', async () => {
        const component = new LibraryComponentImpl(context, library, 'button', `${DEFAULT_TEST_ROOT_PATH}/alib/button`);
        expect(component.getDocItem('zh-cn')).toBeFalsy();
        expect(component.getDocItem('en-us')).toBeFalsy();
        await component.build();
        const docItem = component.getDocItem('en-us');
        expect(docItem).toBeTruthy();
        expect(docItem).toEqual(
            jasmine.objectContaining({
                title: 'New Button',
                path: 'button',
                importSpecifier: 'alib/button',
                examples: ['alib-button-basic-example'],
                overview: true,
                originPath: 'alib/button/doc/en-us.md',
                toc: 'content',
                hidden: false,
                order: 100,
                label: { text: 'New', color: '#73D897' }
            })
        );

        const enDocItem = component.getDocItem('en-us');
        expect(enDocItem).toEqual(
            jasmine.objectContaining({
                title: 'New Button',
                path: 'button',
                importSpecifier: 'alib/button',
                examples: ['alib-button-basic-example'],
                overview: true,
                originPath: 'alib/button/doc/en-us.md',
                toc: 'content',
                hidden: false,
                label: { text: 'New', color: '#73D897' }
            })
        );
    });

    it('should emit lib component success', async () => {
        const component = new LibraryComponentImpl(context, library, 'button', `${DEFAULT_TEST_ROOT_PATH}/alib/button`);
        expect(component.getDocItem('zh-cn')).toBeFalsy();
        expect(component.getDocItem('en-us')).toBeFalsy();
        await component.build();

        const siteRoot = `${DEFAULT_TEST_ROOT_PATH}/.docgeni/site/src`;
        const absDestAssetsOverviewsPath = `${siteRoot}/assets/content/overviews/alib`;
        const absDestSiteContentComponentsPath = `${siteRoot}/app/content/components/alib`;
        const absDestAssetsExamplesHighlightedPath = `${siteRoot}/assets/content/examples-highlighted/alib`;

        await component.emit();

        // TODO: Add API Assets
        await expectFiles(context.host, {
            [`${absDestAssetsOverviewsPath}/button/zh-cn.html`]: fixture.output['doc/zh-cn.html'],
            [`${absDestAssetsOverviewsPath}/button/en-us.html`]: fixture.output['doc/en-us.html'],
            [`${absDestSiteContentComponentsPath}/button/index.ts`]: fixture.output['index.ts'],
            [`${absDestSiteContentComponentsPath}/button/module.ts`]: fixture.output['module.ts'],
            [`${absDestSiteContentComponentsPath}/button/basic/basic.component.ts`]: fixture.output['basic/basic.component.ts'],
            [`${absDestSiteContentComponentsPath}/button/basic/basic.component.html`]: fixture.output['basic/basic.component.html']
        });
        const baseExamples = [
            `${absDestAssetsExamplesHighlightedPath}/button/basic/basic-component-ts.html`,
            `${absDestAssetsExamplesHighlightedPath}/button/basic/basic-component-html.html`
        ];
        for (const example of baseExamples) {
            expect(await context.host.exists(example)).toEqual(true);
        }
    });

    it('should emit lib component with custom name', async () => {
        const component = new LibraryComponentImpl(context, library, 'button', `${DEFAULT_TEST_ROOT_PATH}/alib/button`);
        await context.host.writeFile(`${buttonDirPath}/doc/en-us.md`, fixture.src['doc/en-us-alias-name.md']);

        await component.build();

        const siteRoot = `${DEFAULT_TEST_ROOT_PATH}/.docgeni/site/src`;
        const absDestAssetsOverviewsPath = `${siteRoot}/assets/content/overviews/alib`;
        const absDestSiteContentComponentsPath = `${siteRoot}/app/content/components/alib`;
        const absDestAssetsExamplesHighlightedPath = `${siteRoot}/assets/content/examples-highlighted/alib`;

        await component.emit();

        await expectFiles(context.host, {
            [`${absDestAssetsOverviewsPath}/alias-button/zh-cn.html`]: fixture.output['doc/zh-cn.html'],
            [`${absDestAssetsOverviewsPath}/alias-button/en-us.html`]: fixture.output['doc/en-us.html'],
            [`${absDestSiteContentComponentsPath}/alias-button/index.ts`]: replaceButtonToAlias(fixture.output['index.ts']),
            [`${absDestSiteContentComponentsPath}/alias-button/module.ts`]: fixture.output['module.ts'],
            [`${absDestSiteContentComponentsPath}/alias-button/basic/basic.component.ts`]: fixture.output['basic/basic.component.ts'],
            [`${absDestSiteContentComponentsPath}/alias-button/basic/basic.component.html`]: fixture.output['basic/basic.component.html']
        });
        const baseExamples = [
            `${absDestAssetsExamplesHighlightedPath}/alias-button/basic/basic-component-ts.html`,
            `${absDestAssetsExamplesHighlightedPath}/alias-button/basic/basic-component-html.html`
        ];
        for (const example of baseExamples) {
            expect(await context.host.exists(example)).toEqual(true);
        }
    });
});

async function expectFiles(host: DocgeniHost, files: Record<string, string>) {
    for (const path in files) {
        expect(await host.exists(path)).toBeTruthy(`${path} is not exists`);
        const content = await host.readFile(path);
        expect(content.trim()).toEqual(files[path] ? files[path].trim() : '', `${path} content is not equal`);
    }
}

function replaceButtonToAlias(input: string) {
    return input.replace(/Button/g, 'AliasButton').replace(/-button/g, '-alias-button');
}
