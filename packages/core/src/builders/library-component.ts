import { createNgSourceFile, NgModuleInfo, NgSourceFile } from '@docgeni/ngdoc';
import { debug, toolkit } from '@docgeni/toolkit';
import { cosmiconfig } from 'cosmiconfig';
import fm from 'front-matter';
import {
    ASSETS_API_DOCS_RELATIVE_PATH,
    ASSETS_EXAMPLES_HIGHLIGHTED_RELATIVE_PATH,
    ASSETS_EXAMPLES_SOURCE_BUNDLE_RELATIVE_PATH,
    ASSETS_OVERVIEWS_RELATIVE_PATH,
    EXAMPLE_META_FILE_NAME
} from '../constants';
import { DocgeniContext } from '../docgeni.interface';
import { DocType } from '../enums';
import { ApiDeclaration, ComponentDocItem, ExampleSourceFile, LiveExample } from '../interfaces';
import { Markdown } from '../markdown';
import { ComponentDocMeta, Library, LibraryComponent } from '../types';
import { highlight } from '../utils';
import { DocSourceFile } from './doc-file';
import { FileEmitter } from './emitter';
import { generateComponentExamplesModule } from './examples-module';

const NAMESPACE = 'library-builder';
const EXAMPLES_REGEX = /<examples\W*\/>/g;

export class LibraryComponentImpl extends FileEmitter implements LibraryComponent {
    public name: string;
    /** Component Path */
    public absPath: string;
    public meta?: ComponentDocMeta;
    public absExamplesPath: string;
    public absDocPath: string;
    public absApiPath: string;
    private isBuilding = false;
    private get absDestSiteContentComponentsPath() {
        return toolkit.path.resolve(this.docgeni.paths.absSiteContentPath, `components/${this.lib.name}/${this.name}`);
    }
    private get absDestAssetsExamplesHighlightedPath() {
        return toolkit.path.resolve(
            this.docgeni.paths.absSitePath,
            `${ASSETS_EXAMPLES_HIGHLIGHTED_RELATIVE_PATH}/${this.lib.name}/${this.name}`
        );
    }
    private get absDestAssetsOverviewsPath() {
        return toolkit.path.resolve(this.docgeni.paths.absSitePath, `${ASSETS_OVERVIEWS_RELATIVE_PATH}/${this.lib.name}/${this.name}`);
    }
    private get absDestAssetsApiDocsPath() {
        return toolkit.path.resolve(this.docgeni.paths.absSitePath, `${ASSETS_API_DOCS_RELATIVE_PATH}/${this.lib.name}/${this.name}`);
    }
    private get absExamplesSourceBundleDir() {
        return toolkit.path.resolve(
            this.docgeni.paths.absSitePath,
            `${ASSETS_EXAMPLES_SOURCE_BUNDLE_RELATIVE_PATH}/${this.lib.name}/${this.name}`
        );
    }
    public examples: LiveExample[];
    private localeOverviewsMap: Record<string, DocSourceFile> = {};
    private localeApiDocsMap: Record<string, ApiDeclaration[]> = {};
    private localeDocItemsMap: Record<string, ComponentDocItem> = {};
    // entry file index.ts
    private examplesEntrySource: string;
    private examplesModuleSource: string;

    constructor(private docgeni: DocgeniContext, public lib: Library, name: string, absPath: string) {
        super();
        this.name = name;
        this.absPath = absPath;
        this.meta = {};
        this.absExamplesPath = toolkit.path.resolve(this.absPath, this.lib.examplesDir);
        this.absDocPath = toolkit.path.resolve(this.absPath, this.lib.docDir);
        this.absApiPath = toolkit.path.resolve(this.absPath, this.lib.apiDir);
    }

    public async build(): Promise<void> {
        if (this.isBuilding) {
            return;
        }
        try {
            this.isBuilding = true;
            this.resetEmitted();
            await this.buildOverviews();
            await this.buildExamples();
            await this.buildApiDocs();
            await this.buildDocItems();
        } catch (error) {
            throw error;
        } finally {
            this.isBuilding = false;
        }
    }

    public async onEmit(): Promise<void> {
        await this.emitOverviews();
        await this.emitApiDocs();
        await this.emitExamples();
    }

    public getApiDocs(locale: string): ApiDeclaration[] {
        return this.localeApiDocsMap[locale];
    }

    public getDocItem(locale: string): ComponentDocItem {
        return this.localeDocItemsMap[locale];
    }

    public getOverviewContent(locale: string): string {
        return this.localeOverviewsMap[locale]?.output;
    }

    /**
     * Get module key, `{libName}/{name}`
     * example alib/button
     */
    public getModuleKey() {
        return `${this.lib.name}/${this.name}`;
    }

    private async buildOverviews(): Promise<void> {
        const docSourceFiles: DocSourceFile[] = [];

        for (const locale of this.docgeni.config.locales) {
            const absDocPath = toolkit.path.resolve(this.absDocPath, `${locale.key}.md`);
            if (await this.docgeni.host.pathExists(absDocPath)) {
                const docSourceFile = new DocSourceFile(
                    {
                        cwd: this.docgeni.paths.cwd,
                        base: this.docgeni.paths.cwd,
                        path: absDocPath,
                        type: DocType.component,
                        locale: locale.key
                    },
                    this.docgeni.host
                );
                docSourceFiles.push(docSourceFile);
                this.localeOverviewsMap[locale.key] = docSourceFile;
                await this.buildOverview(docSourceFile);
            }
        }

        const defaultLocaleDoc = this.localeOverviewsMap[this.docgeni.config.defaultLocale];
        if (defaultLocaleDoc) {
            this.meta = defaultLocaleDoc.meta;
            this.name = defaultLocaleDoc.meta.name || this.name;
        }
    }

    private async buildOverview(docSourceFile: DocSourceFile) {
        await docSourceFile.build();
        // await docSourceFile.build(content => {
        //     const examples = this.examples
        //         .map(example => {
        //             return `<example title="${example.title}" name="${example.key}"></example> \n`;
        //         })
        //         .join('\n');
        //     const newContent = content.replace(/<examples\W*\/>/g, `<dg-examples>\n${examples}\n</dg-examples>`);
        //     return newContent;
        // });
    }

    private async tryGetApiDocsByManual(): Promise<Record<string, ApiDeclaration[]>> {
        const result: Record<string, ApiDeclaration[]> = {};
        for (const locale of this.docgeni.config.locales) {
            const localeKey = locale.key;
            const realAbsApiPath = toolkit.path.getSystemPath(this.absApiPath);
            const explorer = cosmiconfig.call(cosmiconfig, localeKey, {
                searchPlaces: [
                    localeKey,
                    `${localeKey}.json`,
                    `${localeKey}.yaml`,
                    `${localeKey}.yml`,
                    `${localeKey}.js`,
                    `${localeKey}.config.js`
                ],
                stopDir: realAbsApiPath
            });
            const localeResult: { config: ApiDeclaration[]; filepath: string } = await explorer.search(realAbsApiPath);
            result[localeKey] =
                localeResult && localeResult.config && toolkit.utils.isArray(localeResult.config) ? localeResult.config : undefined;
        }
        return result;
    }

    private async buildApiDocs(): Promise<void> {
        const apiSrcPath = toolkit.path.getSystemPath(toolkit.path.resolve(this.absPath, `**/*.ts`));
        const parseOptions = {
            exclude: [
                toolkit.path.getSystemPath(toolkit.path.resolve(this.absPath, `${this.lib.examplesDir}/**/*`)),
                toolkit.path.getSystemPath(toolkit.path.resolve(this.absPath, `**/*.spec.ts`))
            ]
        };
        if (this.lib.apiMode === 'automatic') {
            const apiDocs = this.lib.ngDocParser.parse(apiSrcPath, parseOptions) as ApiDeclaration[];
            this.docgeni.config.locales.forEach(locale => {
                this.localeApiDocsMap[locale.key] = apiDocs;
            });
        } else if (this.lib.apiMode === 'compatible') {
            const apiDocs = await this.tryGetApiDocsByManual();
            const autoLocaleKeys: string[] = [];
            this.docgeni.config.locales.forEach(locale => {
                if (!apiDocs[locale.key]) {
                    autoLocaleKeys.push(locale.key);
                } else {
                    debug(`[${this.name}] manual apiDocs length is ${apiDocs[locale.key].length}`, NAMESPACE);
                }
            });
            if (autoLocaleKeys && !toolkit.utils.isEmpty(autoLocaleKeys)) {
                const apiAutoDocs = this.lib.ngDocParser.parse(apiSrcPath, parseOptions) as ApiDeclaration[];
                debug(`[${this.name}] apiSrcPath is ${apiSrcPath}, api docs length is ${apiAutoDocs.length}`, NAMESPACE);
                autoLocaleKeys.forEach(key => {
                    apiDocs[key] = apiAutoDocs;
                });
            }
            this.localeApiDocsMap = apiDocs;
        } else {
            this.localeApiDocsMap = await this.tryGetApiDocsByManual();
        }

        this.docgeni.config.locales.forEach(locale => {
            const apiDocs = this.localeApiDocsMap[locale.key];
            (apiDocs || []).forEach(item => {
                item.description = item.description ? Markdown.toHTML(item.description) : '';
                (item.properties || []).forEach(property => {
                    property.default = !toolkit.utils.isUndefinedOrNull(property.default) ? property.default : '';
                    property.description = property.description ? Markdown.toHTML(property.description) : '';
                });
            });
        });
    }

    private async buildExamples(): Promise<void> {
        this.examples = [];
        if (!(await this.docgeni.host.pathExists(this.absExamplesPath))) {
            return;
        }

        let examplesModuleName = toolkit.strings.pascalCase(`${this.getLibAbbrName(this.lib)}-${this.name}-examples-module`);

        const dirs = await this.docgeni.host.getDirs(this.absExamplesPath);
        const exampleOrderMap: WeakMap<LiveExample, number> = new WeakMap();
        for (const exampleName of dirs) {
            const { order, liveExample } = await this.buildExample(exampleName, examplesModuleName);
            if (liveExample) {
                exampleOrderMap.set(liveExample, order);
                this.examples.push(liveExample);
            }
        }
        this.examples = toolkit.utils.sortByOrderMap(this.examples, exampleOrderMap);

        const moduleFilePath = toolkit.path.resolve(this.absExamplesPath, 'module.ts');
        let exportedExamplesModule: NgModuleInfo;
        let exampleModuleSourceFile: NgSourceFile;
        if (await this.docgeni.host.pathExists(moduleFilePath)) {
            const moduleSourceText = await this.docgeni.host.readFile(moduleFilePath);
            exampleModuleSourceFile = createNgSourceFile(moduleFilePath, moduleSourceText);
            exportedExamplesModule = exampleModuleSourceFile.getExportedNgModule();
            this.examplesModuleSource = moduleSourceText;
        } else {
            exampleModuleSourceFile = createNgSourceFile(moduleFilePath, '');
        }
        if (exportedExamplesModule) {
            examplesModuleName = exportedExamplesModule.name;
        } else {
            this.examplesModuleSource = await generateComponentExamplesModule(
                exampleModuleSourceFile,
                examplesModuleName,
                this.examples.map(example => {
                    return {
                        name: example.componentName,
                        moduleSpecifier: `./${example.name}/${example.name}.component`,
                        standalone: example.standalone
                    };
                })
            );
        }

        this.examplesEntrySource = toolkit.template.compile('component-examples-entry.hbs', {
            examples: this.examples,
            examplesModule: examplesModuleName
        });

        for (const key in this.localeOverviewsMap) {
            if (Object.prototype.hasOwnProperty.call(this.localeOverviewsMap, key)) {
                const overviewSourceFile = this.localeOverviewsMap[key];
                if (overviewSourceFile.output.match(EXAMPLES_REGEX)) {
                    const examples = this.examples
                        .map(example => {
                            return `<example title="${example.title}" name="${example.key}"></example> \n`;
                        })
                        .join('\n');
                    const newContent = overviewSourceFile.output.replace(EXAMPLES_REGEX, `<dg-examples>\n${examples}\n</dg-examples>`);
                    overviewSourceFile.rewrite(newContent);
                }
            }
        }
    }

    private async buildExample(exampleName: string, moduleName: string) {
        const libAbbrName = this.getLibAbbrName(this.lib);
        const componentKey = `${libAbbrName}-${this.name}-${exampleName}-example`;
        const defaultComponentName = toolkit.strings.pascalCase(`${libAbbrName}-${this.name}-${exampleName}-example-component`);
        const absComponentExamplePath = toolkit.path.resolve(this.absExamplesPath, exampleName);
        const absComponentExampleDocPath = toolkit.path.resolve(absComponentExamplePath, EXAMPLE_META_FILE_NAME);

        const liveExample: LiveExample = {
            key: componentKey,
            name: exampleName,
            title: toolkit.strings.headerCase(exampleName, { delimiter: ' ' }),
            componentName: defaultComponentName,
            module: {
                name: moduleName,
                importSpecifier: `${this.lib.name}/${this.name}`
            },
            sourceFiles: [],
            additionalFiles: [],
            additionalComponents: [],
            standalone: false
        };

        // build example source files
        const exampleSourceFiles = await this.buildExampleSourceFiles(absComponentExamplePath);
        // try extract component name from example entry ts file
        const entrySourceFile = exampleSourceFiles.find(sourceFile => {
            return sourceFile.name === `${exampleName}.component.ts`;
        });

        if (entrySourceFile) {
            const component = createNgSourceFile(entrySourceFile.name, entrySourceFile.content).getExpectExportedComponent();
            if (component) {
                liveExample.componentName = component.name;
                liveExample.standalone = component.standalone;
            }
        } else {
            return {
                order: 0,
                liveExample: undefined
            };
        }
        liveExample.sourceFiles = exampleSourceFiles;

        // build order, title from FrontMatter
        let exampleOrder = Number.MAX_SAFE_INTEGER;
        if (await this.docgeni.host.pathExists(absComponentExampleDocPath)) {
            const content = await this.docgeni.host.readFile(absComponentExampleDocPath);
            const exampleFmResult = fm<{ title: string; order: number; background: string; compact: boolean; className: string }>(content);
            if (exampleFmResult.attributes.title) {
                liveExample.title = exampleFmResult.attributes.title;
            }
            if (exampleFmResult.attributes.background) {
                liveExample.background = exampleFmResult.attributes.background;
            }
            if (exampleFmResult.attributes.compact) {
                liveExample.compact = exampleFmResult.attributes.compact;
            }
            if (exampleFmResult.attributes.className) {
                liveExample.className = exampleFmResult.attributes.className;
            }
            if (toolkit.utils.isNumber(exampleFmResult.attributes.order)) {
                exampleOrder = exampleFmResult.attributes.order;
            }
        }
        return {
            order: exampleOrder,
            liveExample
        };
    }

    private async buildExampleSourceFiles(absComponentExamplePath: string): Promise<ExampleSourceFile[]> {
        const files = await this.docgeni.host.getFiles(absComponentExamplePath, {
            exclude: EXAMPLE_META_FILE_NAME
        });
        const exampleSourceFiles: ExampleSourceFile[] = [];
        for (const fileName of files) {
            const ext = toolkit.utils.extractExtname(fileName, true);
            const sourceCode = await this.docgeni.host.readFile(toolkit.path.resolve(absComponentExamplePath, fileName));
            const highlightedSourceCode = highlight(sourceCode, ext);
            const destFileName = `${toolkit.strings.paramCase(fileName)}.html`;
            exampleSourceFiles.push({
                name: fileName,
                highlightedPath: destFileName,
                highlightedContent: highlightedSourceCode,
                content: sourceCode
            });
        }

        return exampleSourceFiles;
    }

    private async buildDocItems() {
        this.docgeni.config.locales.forEach(locale => {
            let overviewSourceFile = this.localeOverviewsMap[locale.key];
            // Use default locale's data when locale is not found
            if (!overviewSourceFile) {
                overviewSourceFile = this.localeOverviewsMap[this.docgeni.config.defaultLocale];
            }
            // Use default locale's data when api locale is not found
            let apiDocs = this.localeApiDocsMap[locale.key];
            if (!apiDocs) {
                apiDocs = this.localeApiDocsMap[this.docgeni.config.defaultLocale];
            }

            const title = this.getMetaProperty(overviewSourceFile, 'title') || toolkit.strings.titleCase(this.name);
            const subtitle = this.getMetaProperty(overviewSourceFile, 'subtitle') || '';
            const order = this.getMetaProperty(overviewSourceFile, 'order');

            if (overviewSourceFile || !toolkit.utils.isEmpty(this.examples) || (apiDocs && apiDocs.length > 0)) {
                const componentNav: ComponentDocItem = {
                    id: this.name,
                    title,
                    subtitle,
                    path: this.name,
                    importSpecifier: `${this.lib.name}/${this.name}`,
                    examples: this.examples.map(example => example.key),
                    overview: overviewSourceFile && overviewSourceFile.output ? true : false,
                    api: apiDocs && apiDocs.length > 0 ? true : false,
                    order: toolkit.utils.isNumber(order) ? order : Number.MAX_SAFE_INTEGER,
                    category: this.meta.category,
                    hidden: this.meta.hidden,
                    label: this.meta.label ? this.lib.labels[this.meta.label] : undefined,
                    originPath: overviewSourceFile && overviewSourceFile.relative,
                    toc: toolkit.utils.isUndefinedOrNull(this.meta.toc) ? 'content' : this.meta.toc,
                    headings: overviewSourceFile?.headings
                };
                this.localeDocItemsMap[locale.key] = componentNav;
            }
        });
    }

    private async emitOverviews() {
        const defaultSourceFile = this.localeOverviewsMap[this.docgeni.config.defaultLocale];

        for (const locale of this.docgeni.config.locales) {
            const sourceFile = this.localeOverviewsMap[locale.key] || defaultSourceFile;
            if (sourceFile) {
                const filePath = toolkit.path.resolve(this.absDestAssetsOverviewsPath, `${locale.key}.html`);
                this.addEmitFile(filePath, sourceFile.output);
                await this.docgeni.host.writeFile(filePath, sourceFile.output);
            }
        }
    }

    private async emitApiDocs() {
        const defaultApiDoc = this.localeApiDocsMap[this.docgeni.config.defaultLocale];
        for (const locale of this.docgeni.config.locales) {
            const apiDocs = this.localeApiDocsMap[locale.key] || defaultApiDoc;
            if (apiDocs) {
                const componentApiDocDistPath = toolkit.path.resolve(this.absDestAssetsApiDocsPath, `${locale.key}.html`);
                const componentApiJsonDistPath = toolkit.path.resolve(this.absDestAssetsApiDocsPath, `${locale.key}.json`);
                const apiDocContent = toolkit.template.compile('api-doc.hbs', {
                    declarations: apiDocs
                });
                this.addEmitFile(componentApiJsonDistPath, JSON.stringify(apiDocs));
                await this.docgeni.host.writeFile(componentApiDocDistPath, apiDocContent);
                await this.docgeni.host.writeFile(componentApiJsonDistPath, JSON.stringify(apiDocs));
            }
        }
    }

    private async emitExamples() {
        if (!(await this.docgeni.host.pathExists(this.absExamplesPath))) {
            return;
        }
        const examplesEntryPath = toolkit.path.resolve(this.absDestSiteContentComponentsPath, 'index.ts');
        await this.docgeni.host.copy(this.absExamplesPath, this.absDestSiteContentComponentsPath);
        await this.docgeni.host.writeFile(
            toolkit.path.resolve(this.absDestSiteContentComponentsPath, 'module.ts'),
            this.examplesModuleSource
        );
        this.addEmitFile(examplesEntryPath, this.examplesEntrySource);
        await this.docgeni.host.writeFile(examplesEntryPath, this.examplesEntrySource);
        const allExampleSources: { path: string; content: string }[] = [];
        for (const example of this.examples) {
            for (const sourceFile of example.sourceFiles) {
                const absExampleHighlightPath = toolkit.path.resolve(this.absDestAssetsExamplesHighlightedPath, `${example.name}`);
                const destHighlightedSourceFilePath = `${absExampleHighlightPath}/${sourceFile.highlightedPath}`;
                allExampleSources.push({
                    path: `${example.name}/${sourceFile.name}`,
                    content: sourceFile.content
                });
                this.addEmitFile(destHighlightedSourceFilePath, sourceFile.highlightedContent);
                await this.docgeni.host.writeFile(destHighlightedSourceFilePath, sourceFile.highlightedContent);
            }
        }

        // for online example e.g. StackBlitz
        allExampleSources.push({
            path: 'examples.module.ts',
            content: this.examplesModuleSource
        });
        const bundlePath = toolkit.path.resolve(this.absExamplesSourceBundleDir, 'bundle.json');
        const content = JSON.stringify(allExampleSources);
        await this.addEmitFile(bundlePath, content);
        await this.docgeni.host.writeFile(bundlePath, content);
    }

    private getLibAbbrName(lib: Library): string {
        return lib.abbrName || lib.name;
    }

    private getMetaProperty<TPropertyKey extends keyof ComponentDocMeta>(
        docSourceFile: DocSourceFile,
        propertyName: TPropertyKey
    ): ComponentDocMeta[TPropertyKey] {
        return docSourceFile && docSourceFile.meta && docSourceFile.meta[propertyName];
    }
}
