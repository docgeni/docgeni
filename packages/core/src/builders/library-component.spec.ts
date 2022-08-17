import { DocgeniContext } from '../docgeni.interface';
import { createTestDocgeniContext, DEFAULT_TEST_ROOT_PATH, FixtureResult, loadFixture, writeFilesToHost } from '../testing';
import { LibraryComponentImpl } from './library-component';
import { normalizeLibConfig } from './normalize';
import { toolkit } from '@docgeni/toolkit';
import * as systemPath from 'path';
import { cosmiconfig, Options as CosmiconfigOptions } from 'cosmiconfig';
import { DocgeniHost } from '../docgeni-host';
import { getSystemPath, normalize } from '../fs';
import { compatibleNormalize } from '../markdown';
import { ApiDeclaration } from '../interfaces';
import { EOL } from 'os';
import { NgDocParser } from '@docgeni/ngdoc';

type Explorer = { search: (path: string) => Promise<{ config: ApiDeclaration[] }> };
export class LibraryComponentSpectator {
    public cosmiconfigOptions: CosmiconfigOptions[] = [];
    public mockNgDocParser: NgDocParser;
    public ngDocParseSpy: jasmine.Spy<jasmine.Func> = jasmine.createSpy('ng doc parse spy');

    constructor(private component: LibraryComponentImpl, apiDocsDefinitions: Record<string, ApiDeclaration[]>) {
        const cosmiconfigSpy = spyOn(
            (cosmiconfig as unknown) as {
                call: (_: unknown, moduleName: string, options: CosmiconfigOptions) => Explorer;
            },
            'call'
        );
        cosmiconfigSpy.and.callFake((_, moduleName, options) => {
            this.cosmiconfigOptions.push(options);
            return {
                search: async (path: string) => {
                    expect(path).toEqual(getSystemPath(component.absApiPath));
                    return {
                        config: apiDocsDefinitions[moduleName]
                    };
                }
            } as Explorer;
        });

        this.mockNgDocParser = component.lib.ngDocParser = ({
            parse: this.ngDocParseSpy
        } as unknown) as NgDocParser;
    }

    assertCosmiconfigOptions(componentDir: string) {
        expect(this.cosmiconfigOptions).toEqual([
            {
                searchPlaces: ['zh-cn', 'zh-cn.json', 'zh-cn.yaml', 'zh-cn.yml', 'zh-cn.js', 'zh-cn.config.js'],
                stopDir: getSystemPath(`${componentDir}/api`)
            },
            {
                searchPlaces: ['en-us', 'en-us.json', 'en-us.yaml', 'en-us.yml', 'en-us.js', 'en-us.config.js'],
                stopDir: getSystemPath(`${componentDir}/api`)
            }
        ]);
    }
}

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
    });

    describe('basic', () => {
        beforeEach(async () => {
            fixture = await loadFixture('library-component-button');
            context = createTestDocgeniContext({
                initialFiles: {
                    [`${buttonDirPath}/doc/zh-cn.md`]: fixture.src['doc/zh-cn.md'],
                    [`${buttonDirPath}/doc/en-us.md`]: fixture.src['doc/en-us.md'],
                    [`${buttonDirPath}/api/zh-cn.js`]: fixture.src['api/zh-cn.js'],
                    [`${buttonDirPath}/api/en-us.js`]: fixture.src['api/en-us.js'],
                    [`${buttonDirPath}/examples/module.ts`]: fixture.src['examples/module.ts'],
                    [`${buttonDirPath}/examples/basic/basic.component.ts`]: fixture.src['examples/basic/basic.component.ts'],
                    [`${buttonDirPath}/examples/basic/basic.component.html`]: fixture.src['examples/basic/basic.component.html'],
                    [`${buttonDirPath}/examples/advance/advance.component.ts`]: fixture.src['examples/advance/advance.component.ts'],
                    [`${buttonDirPath}/examples/advance/advance.component.html`]: fixture.src['examples/advance/advance.component.html'],
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
                    examples: ['alib-button-basic-example', 'alib-button-advance-example'],
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
                    examples: ['alib-button-basic-example', 'alib-button-advance-example'],
                    overview: true,
                    originPath: 'alib/button/doc/en-us.md',
                    toc: 'content',
                    hidden: false,
                    label: { text: 'New', color: '#73D897' }
                })
            );

            expect(component.examples[0]).toEqual(
                jasmine.objectContaining({
                    key: 'alib-button-basic-example',
                    name: 'basic',
                    title: 'New Basic',
                    componentName: 'AlibButtonBasicExampleComponent',
                    module: {
                        name: 'AlibButtonExamplesModule',
                        importSpecifier: 'alib/button'
                    },
                    additionalFiles: [],
                    additionalComponents: [],
                    background: '#ddd',
                    compact: true,
                    className: 'bg-custom-example'
                })
            );

            expect(component.examples[1]).toEqual(
                jasmine.objectContaining({
                    key: 'alib-button-advance-example',
                    name: 'advance',
                    title: 'Advance',
                    componentName: 'AlibButtonAdvanceCustomExampleComponent',
                    module: {
                        name: 'AlibButtonExamplesModule',
                        importSpecifier: 'alib/button'
                    },
                    additionalFiles: [],
                    additionalComponents: []
                })
            );
        });

        it('should build overview success', async () => {
            const component = new LibraryComponentImpl(context, library, 'button', `${DEFAULT_TEST_ROOT_PATH}/alib/button`);
            expect(component.getOverviewContent('zh-cn')).toBeFalsy();
            expect(component.getOverviewContent('en-us')).toBeFalsy();
            await component.build();
            expect(component.getOverviewContent('zh-cn')).toContain('这是一个按钮');
            expect(component.getOverviewContent('en-us')).toContain('This is button');
        });

        it('should build overview with examples', async () => {
            const component = new LibraryComponentImpl(context, library, 'button', `${DEFAULT_TEST_ROOT_PATH}/alib/button`);
            await writeFilesToHost(context.host, {
                [`${buttonDirPath}/doc/zh-cn.md`]: `${fixture.src['doc/zh-cn.md']}\n<examples />`,
                [`${buttonDirPath}/doc/en-us.md`]: `${fixture.src['doc/en-us.md']}\n<examples />`
            });
            expect(component.getOverviewContent('zh-cn')).toBeFalsy();
            expect(component.getOverviewContent('en-us')).toBeFalsy();
            await component.build();
            expect(component.getOverviewContent('en-us')).toContain(
                '<example title="New Basic" name="alib-button-basic-example"></example>'
            );
            expect(component.getOverviewContent('en-us')).toContain(
                '<example title="Advance" name="alib-button-advance-example"></example> '
            );
            expect(component.getOverviewContent('zh-cn')).toContain(
                '<example title="New Basic" name="alib-button-basic-example"></example>'
            );
            expect(component.getOverviewContent('zh-cn')).toContain(
                '<example title="Advance" name="alib-button-advance-example"></example> '
            );
        });

        it('should emit lib component success', async () => {
            const component = new LibraryComponentImpl(context, library, 'button', `${DEFAULT_TEST_ROOT_PATH}/alib/button`);
            expect(component.getDocItem('zh-cn')).toBeFalsy();
            expect(component.getDocItem('en-us')).toBeFalsy();

            const apiDocsDefinitions: Record<string, ApiDeclaration[]> = {
                'zh-cn': [
                    {
                        name: 'Button',
                        type: 'component',
                        description: 'This is button zh-cn desc',
                        properties: []
                    }
                ],
                'en-us': [
                    {
                        name: 'Button',
                        type: 'component',
                        description: 'This is button desc',
                        properties: []
                    }
                ]
            };
            const componentSpectator = new LibraryComponentSpectator(component, apiDocsDefinitions);

            await component.build();

            const siteRoot = `${DEFAULT_TEST_ROOT_PATH}/.docgeni/site/src`;
            const absDestAssetsOverviewsPath = `${siteRoot}/assets/content/overviews/alib`;
            const absDestAssetsApiDocsPath = `${siteRoot}/assets/content/api-docs/alib`;
            const absDestSiteContentComponentsPath = `${siteRoot}/app/content/components/alib`;
            const absDestAssetsExamplesHighlightedPath = `${siteRoot}/assets/content/examples-highlighted/alib`;
            const absDestAssetsExamplesBundlePath = `${siteRoot}/assets/content/examples-source-bundle/alib`;

            componentSpectator.assertCosmiconfigOptions(buttonDirPath);

            await component.emit();

            await expectFiles(context.host, {
                [`${absDestAssetsOverviewsPath}/button/zh-cn.html`]: fixture.output['doc/zh-cn.html'],
                [`${absDestAssetsOverviewsPath}/button/en-us.html`]: fixture.output['doc/en-us.html'],
                [`${absDestSiteContentComponentsPath}/button/index.ts`]: fixture.output['index.ts'],
                [`${absDestSiteContentComponentsPath}/button/module.ts`]: fixture.output['module.ts'],
                [`${absDestSiteContentComponentsPath}/button/basic/basic.component.ts`]: fixture.output['basic/basic.component.ts'],
                [`${absDestSiteContentComponentsPath}/button/basic/basic.component.html`]: fixture.output['basic/basic.component.html'],
                [`${absDestAssetsApiDocsPath}/button/en-us.json`]: `[{"name":"Button","type":"component","description":"<p>This is button desc</p>\\n","properties":[]}]`,
                [`${absDestAssetsApiDocsPath}/button/zh-cn.json`]: `[{"name":"Button","type":"component","description":"<p>This is button zh-cn desc</p>\\n","properties":[]}]`
            });
            const baseExamples = [
                `${absDestAssetsExamplesHighlightedPath}/button/basic/basic-component-ts.html`,
                `${absDestAssetsExamplesHighlightedPath}/button/basic/basic-component-html.html`
            ];
            for (const example of baseExamples) {
                expect(await context.host.exists(example)).toEqual(true);
            }
            const aliasBundleJsonFiles: { path: string; content: string }[] = await context.host.readJSON(
                `${absDestAssetsExamplesBundlePath}/button/bundle.json`
            );
            const d = aliasBundleJsonFiles.find(item => item.path === 'examples.module.ts');
            await expectFiles(context.host, {
                [`${absDestSiteContentComponentsPath}/button/module.ts`]: aliasBundleJsonFiles.find(
                    item => item.path === 'examples.module.ts'
                )?.content,
                [`${absDestSiteContentComponentsPath}/button/basic/basic.component.ts`]: aliasBundleJsonFiles.find(
                    item => item.path === 'basic/basic.component.ts'
                )?.content,
                [`${absDestSiteContentComponentsPath}/button/basic/basic.component.html`]: aliasBundleJsonFiles.find(
                    item => item.path === 'basic/basic.component.html'
                )?.content
            } as Record<string, string>);
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
                [`${absDestSiteContentComponentsPath}/alias-button/index.ts`]: fixture.output['index-alias.ts'],
                [`${absDestSiteContentComponentsPath}/alias-button/module.ts`]: fixture.output['module.ts'],
                [`${absDestSiteContentComponentsPath}/alias-button/basic/basic.component.ts`]: fixture.output['basic/basic.component.ts'],
                [`${absDestSiteContentComponentsPath}/alias-button/basic/basic.component.html`]: fixture.output[
                    'basic/basic.component.html'
                ]
            });
            const baseExamples = [
                `${absDestAssetsExamplesHighlightedPath}/alias-button/basic/basic-component-ts.html`,
                `${absDestAssetsExamplesHighlightedPath}/alias-button/basic/basic-component-html.html`
            ];
            for (const example of baseExamples) {
                expect(await context.host.exists(example)).toEqual(true);
            }
        });

        it('should not build example when entry component file is not exists', async () => {
            const notExistExample = 'not-exists';
            await writeFilesToHost(context.host, {
                [`${buttonDirPath}/examples/${notExistExample}/a.ts`]: 'xxx'
            });
            const component = new LibraryComponentImpl(context, library, 'button', `${DEFAULT_TEST_ROOT_PATH}/alib/button`);
            await component.build();
            expect(component.examples.find(example => example.name === notExistExample)).toBeFalsy();
            await writeFilesToHost(context.host, {
                [`${buttonDirPath}/examples/${notExistExample}/${notExistExample}.component.ts`]: 'xxx'
            });
            await component.build();
            expect(component.examples.find(example => example.name === notExistExample)).toBeTruthy();
        });
    });

    describe('api-docs', () => {
        const apiDocsDefinitions: Record<string, ApiDeclaration[]> = {
            'zh-cn': [
                {
                    name: 'Button',
                    type: 'component',
                    description: 'This is button zh-cn desc',
                    properties: [
                        {
                            name: 'thyType',
                            type: 'string',
                            default: 'primary'
                        }
                    ]
                }
            ],
            'en-us': [
                {
                    name: 'Button',
                    type: 'component',
                    description: 'This is button desc',
                    properties: [
                        {
                            name: 'thyType',
                            type: 'string',
                            default: 'primary'
                        }
                    ]
                }
            ]
        };

        beforeEach(async () => {
            fixture = await loadFixture('library-component-button');
            context = createTestDocgeniContext({
                initialFiles: {
                    [`${buttonDirPath}/api/zh-cn.js`]: fixture.src['api/zh-cn.js']
                },
                libs: [library],
                watch: true
            });
        });

        it('should build api docs for compatible mode', async () => {
            library.apiMode = 'compatible';
            const component = new LibraryComponentImpl(context, library, 'button', `${DEFAULT_TEST_ROOT_PATH}/alib/button`);
            const spectator = new LibraryComponentSpectator(component, {
                'zh-cn': apiDocsDefinitions['zh-cn']
            });
            expect(component.getDocItem('zh-cn')).toBeFalsy();
            expect(component.getDocItem('en-us')).toBeFalsy();

            const parsedApiDocs = [
                {
                    name: 'Button',
                    type: 'component',
                    description: 'This is button desc from ng-doc-parser',
                    properties: []
                }
            ];
            spectator.ngDocParseSpy.and.returnValue(parsedApiDocs);
            await component.build();
            spectator.assertCosmiconfigOptions(buttonDirPath);
            const enApiDocs = component.getApiDocs('en-us');
            const zhApiDocs = component.getApiDocs('zh-cn');

            expect(enApiDocs).toEqual([
                jasmine.objectContaining({
                    name: 'Button',
                    type: 'component',
                    properties: []
                })
            ]);
            expect(enApiDocs[0].description).toContain(`This is button desc from ng-doc-parser`);

            expect(zhApiDocs).toEqual([
                jasmine.objectContaining({
                    name: 'Button',
                    type: 'component',
                    properties: [
                        {
                            name: 'thyType',
                            type: 'string',
                            default: 'primary',
                            description: ''
                        }
                    ]
                })
            ]);
            expect(zhApiDocs[0].description).toContain(`This is button zh-cn desc`);
        });

        it('should build api docs for automatic mode', async () => {
            library.apiMode = 'automatic';
            const component = new LibraryComponentImpl(context, library, 'button', `${DEFAULT_TEST_ROOT_PATH}/alib/button`);
            const spectator = new LibraryComponentSpectator(component, {
                'zh-cn': apiDocsDefinitions['zh-cn'],
                'en-us': apiDocsDefinitions['en-us']
            });
            expect(component.getDocItem('zh-cn')).toBeFalsy();
            expect(component.getDocItem('en-us')).toBeFalsy();

            const parsedApiDocs = [
                {
                    name: 'Button',
                    type: 'component',
                    description: 'This is button desc from ng-doc-parser',
                    properties: []
                }
            ];
            spectator.ngDocParseSpy.and.returnValue(parsedApiDocs);
            await component.build();
            const enApiDocs = component.getApiDocs('en-us');
            const zhApiDocs = component.getApiDocs('zh-cn');
            expect(enApiDocs).toEqual([
                jasmine.objectContaining({
                    name: 'Button',
                    type: 'component',
                    properties: []
                })
            ]);
            expect(enApiDocs[0].description).toContain('This is button desc from ng-doc-parser');

            expect(zhApiDocs).toEqual([
                jasmine.objectContaining({
                    name: 'Button',
                    type: 'component',
                    properties: []
                })
            ]);
            expect(zhApiDocs[0].description).toContain('This is button desc from ng-doc-parser');
        });
    });

    describe('automate', () => {
        beforeAll(async () => {
            fixture = await loadFixture('library-component-automate');
        });

        it('should emit examples for automated', async () => {
            context = createTestDocgeniContext({
                initialFiles: {
                    [`${buttonDirPath}/examples/module.ts`]: fixture.src['examples/module.ts'],
                    [`${buttonDirPath}/examples/basic/basic.component.ts`]: fixture.src['examples/basic/basic.component.ts'],
                    [`${buttonDirPath}/examples/basic/basic.component.html`]: fixture.src['examples/basic/basic.component.html'],
                    [`${buttonDirPath}/examples/basic/other.component.ts`]: fixture.src['examples/basic/other.component.ts']
                },
                libs: [library],
                watch: true
            });
            const component = new LibraryComponentImpl(context, library, 'button', `${DEFAULT_TEST_ROOT_PATH}/alib/button`);

            await component.build();

            const siteRoot = `${DEFAULT_TEST_ROOT_PATH}/.docgeni/site/src`;
            const absDestSiteContentComponentsPath = `${siteRoot}/app/content/components/alib`;

            await component.emit();

            await expectFiles(context.host, {
                [`${absDestSiteContentComponentsPath}/button/index.ts`]: fixture.output['index.ts'],
                [`${absDestSiteContentComponentsPath}/button/module.ts`]: fixture.output['module.ts'],
                [`${absDestSiteContentComponentsPath}/button/basic/basic.component.ts`]: fixture.output['basic/basic.component.ts'],
                [`${absDestSiteContentComponentsPath}/button/basic/basic.component.html`]: fixture.output['basic/basic.component.html']
            });
        });
    });
});

async function expectFiles(host: DocgeniHost, files: Record<string, string>) {
    for (const path in files) {
        expect(await host.exists(path)).toBeTruthy(`${path} is not exists`);
        const content = await host.readFile(path);
        expect(compatibleNormalize(content.trim())).toEqual(
            files[path] ? compatibleNormalize(files[path].trim()) : '',
            `${path} content is not equal`
        );
    }
}
