import { DocgeniContext } from '../docgeni.interface';
import { ApiDeclaration, CategoryItem, ComponentDocItem, ExampleSourceFile, Library, LiveExample } from '../interfaces';
import * as path from 'path';
import { toolkit } from '@docgeni/toolkit';
import { EXAMPLE_META_FILE_NAME } from '../constants';
import { highlight } from '../utils';
import { DocType } from '../enums';
import { Markdown } from '../markdown';
import { cosmiconfig } from 'cosmiconfig';
import fm from 'front-matter';
import { DocSourceFile } from './doc-file';
import { ComponentDocMeta } from '../types';

export class LibComponent {
    public name: string;
    public absPath: string;
    public meta?: ComponentDocMeta;
    public absExamplesPath: string;
    public absDocPath: string;
    public absApiPath: string;
    public examples: LiveExample[];

    private localeOverviewsMap: Record<string, DocSourceFile> = {};
    private localeApiDocsMap: Record<string, ApiDeclaration[]> = {};
    private localeDocItemsMap: Record<string, ComponentDocItem> = {};
    private exampleEntrySource: string;
    private emitted = false;

    constructor(private docgeni: DocgeniContext, private lib: Library, name: string, absPath: string) {
        this.name = name;
        this.absPath = absPath;
        this.meta = {};
        this.absExamplesPath = path.resolve(this.absPath, this.lib.examplesDir);
        this.absDocPath = path.resolve(this.absPath, this.lib.docDir);
        this.absApiPath = path.resolve(this.absPath, this.lib.apiDir);
    }

    public async build(): Promise<void> {
        this.emitted = false;
        await this.buildOverviews();
        await this.buildApiDocs();
        await this.buildExamples();
        await this.buildDocItems();
    }

    public async emit(
        absDestAssetsOverviewsPath: string,
        absDestAssetsApiDocsPath: string,
        absDestSiteContentComponentsPath: string,
        absDestAssetsExamplesHighlightedPath: string
    ): Promise<void> {
        if (this.emitted) {
            return;
        }
        await this.emitOverviews(absDestAssetsOverviewsPath);
        await this.emitApiDocs(absDestAssetsApiDocsPath);
        await this.emitExamples(absDestSiteContentComponentsPath, absDestAssetsExamplesHighlightedPath);
        this.emitted = true;
    }

    public getDocItem(locale: string): ComponentDocItem {
        return this.localeDocItemsMap[locale];
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
            const absDocPath = path.resolve(this.absDocPath, `${locale.key}.md`);
            if (await toolkit.fs.pathExists(absDocPath)) {
                // const content = await toolkit.fs.readFile(absDocPath, 'UTF-8');
                const docSourceFile = new DocSourceFile({
                    cwd: this.docgeni.paths.cwd,
                    base: this.docgeni.paths.cwd,
                    path: absDocPath,
                    type: DocType.component,
                    locale: locale.key
                });
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
        // this.hooks.buildDoc.call(docSourceFile);
        await docSourceFile.build();
        // this.hooks.buildDocSucceed.call(docSourceFile);
    }

    private async buildApiDocs(): Promise<void> {
        for (const locale of this.docgeni.config.locales) {
            const localeKey = locale.key;
            const explorer = cosmiconfig(localeKey, {
                searchPlaces: [
                    localeKey,
                    `${localeKey}.json`,
                    `${localeKey}.yaml`,
                    `${localeKey}.yml`,
                    `${localeKey}.js`,
                    `${localeKey}.config.js`
                ],
                stopDir: this.absApiPath
            });
            const result: { config: ApiDeclaration[]; filepath: string } = await explorer.search(this.absApiPath);

            if (result && result.config && toolkit.utils.isArray(result.config)) {
                result.config.forEach(item => {
                    item.description = item.description ? Markdown.toHTML(item.description) : '';
                    (item.properties || []).forEach(property => {
                        property.default = !toolkit.utils.isEmpty(property.default) ? property.default : undefined;
                        property.description = property.description ? Markdown.toHTML(property.description) : '';
                    });
                });
                this.localeApiDocsMap[localeKey] = result.config;
            }
        }
    }

    private async buildExamples(): Promise<void> {
        this.examples = [];
        if (!(await toolkit.fs.pathExists(this.absExamplesPath))) {
            return;
        }

        const dirs = await toolkit.fs.getDirs(this.absExamplesPath);
        const moduleName = toolkit.strings.pascalCase(`${this.getLibAbbrName(this.lib)}-${this.name}-examples-module`);
        const exampleOrderMap: WeakMap<LiveExample, number> = new WeakMap();

        for (const exampleName of dirs) {
            const libAbbrName = this.getLibAbbrName(this.lib);
            const componentKey = `${libAbbrName}-${this.name}-${exampleName}-example`;
            const componentName = toolkit.strings.pascalCase(`${libAbbrName}-${this.name}-${exampleName}-example-component`);
            const absComponentExamplePath = path.resolve(this.absExamplesPath, exampleName);
            const absComponentExampleDocPath = path.resolve(absComponentExamplePath, EXAMPLE_META_FILE_NAME);

            const liveExample: LiveExample = {
                key: componentKey,
                name: exampleName,
                title: toolkit.strings.headerCase(exampleName, { delimiter: ' ' }),
                componentName,
                module: {
                    name: moduleName,
                    importSpecifier: `${this.lib.name}/${this.name}`
                },
                sourceFiles: [],
                additionalFiles: [],
                additionalComponents: []
            };

            let exampleOrder = Number.MAX_SAFE_INTEGER;
            if (await toolkit.fs.pathExists(absComponentExampleDocPath)) {
                const content = await toolkit.fs.readFileContent(absComponentExampleDocPath);
                const exampleFmResult = fm<{ title: string; order: number }>(content);
                if (exampleFmResult.attributes.title) {
                    liveExample.title = exampleFmResult.attributes.title;
                }
                if (toolkit.utils.isNumber(exampleFmResult.attributes.order)) {
                    exampleOrder = exampleFmResult.attributes.order;
                }
            }
            exampleOrderMap.set(liveExample, exampleOrder);
            const sourceFiles = await this.buildExampleHighlighted(absComponentExamplePath);
            liveExample.sourceFiles = sourceFiles;
            this.examples.push(liveExample);
        }
        this.examples = toolkit.utils.sortByOrderMap(this.examples, exampleOrderMap);
        this.exampleEntrySource = toolkit.template.compile('component-examples-entry.hbs', {
            examples: this.examples,
            examplesModule: moduleName
        });
    }

    private async buildExampleHighlighted(absComponentExamplePath: string): Promise<ExampleSourceFile[]> {
        const files = await toolkit.fs.getFiles(absComponentExamplePath, {
            exclude: EXAMPLE_META_FILE_NAME
        });
        const exampleSourceFiles: ExampleSourceFile[] = [];
        for (const fileName of files) {
            const ext = toolkit.utils.extractExtname(fileName, true);
            const sourceCode = await toolkit.fs.readFileContent(path.resolve(absComponentExamplePath, fileName));
            const highlightedSourceCode = highlight(sourceCode, ext);
            const destFileName = `${toolkit.strings.paramCase(fileName)}.html`;
            exampleSourceFiles.push({
                name: fileName,
                highlightedPath: destFileName,
                highlightedContent: highlightedSourceCode
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
            let apiDoc = this.localeApiDocsMap[locale.key];
            if (!apiDoc) {
                apiDoc = this.localeApiDocsMap[this.docgeni.config.defaultLocale];
            }

            const title = this.getMetaProperty(overviewSourceFile, 'title') || toolkit.strings.titleCase(this.name);
            const subtitle = this.getMetaProperty(overviewSourceFile, 'subtitle') || '';
            const order = this.getMetaProperty(overviewSourceFile, 'order');

            if (overviewSourceFile || !toolkit.utils.isEmpty(this.examples) || apiDoc) {
                const componentNav: ComponentDocItem = {
                    id: this.name,
                    title,
                    subtitle,
                    path: this.name,
                    importSpecifier: `${this.lib.name}/${this.name}`,
                    examples: this.examples.map(example => example.key),
                    overview: overviewSourceFile && overviewSourceFile.output ? true : false,
                    api: apiDoc ? true : false,
                    order: toolkit.utils.isNumber(order) ? order : Number.MAX_SAFE_INTEGER,
                    category: this.meta.category,
                    hidden: this.meta.hidden
                };
                this.localeDocItemsMap[locale.key] = componentNav;
            }
        });
    }

    private async emitOverviews(absDestAssetsOverviewsPath: string) {
        const defaultSourceFile = this.localeOverviewsMap[this.docgeni.config.defaultLocale];
        const destAbsExamplesOverviewPath = path.resolve(absDestAssetsOverviewsPath, `${this.name}`);
        for (const locale of this.docgeni.config.locales) {
            const sourceFile = this.localeOverviewsMap[locale.key] || defaultSourceFile;
            if (sourceFile) {
                const filePath = path.resolve(destAbsExamplesOverviewPath, `${locale.key}.html`);
                await toolkit.fs.ensureWriteFile(filePath, sourceFile.output);
            }
        }
    }

    private async emitApiDocs(absDestAssetsApiDocsPath: string) {
        const defaultApiDoc = this.localeApiDocsMap[this.docgeni.config.defaultLocale];
        const destAbsApiDocPath = path.resolve(absDestAssetsApiDocsPath, `${this.name}`);
        await toolkit.fs.ensureDir(destAbsApiDocPath);
        for (const locale of this.docgeni.config.locales) {
            const apiDocs = this.localeApiDocsMap[locale.key] || defaultApiDoc;
            if (apiDocs) {
                const componentApiDocDistPath = path.resolve(destAbsApiDocPath, `${locale.key}.html`);
                const componentApiJsonDistPath = path.resolve(destAbsApiDocPath, `${locale.key}.json`);
                await toolkit.template.generate('api-doc.hbs', componentApiDocDistPath, {
                    declarations: apiDocs
                });
                await toolkit.fs.writeJSON(componentApiJsonDistPath, apiDocs);
            }
        }
    }

    private async emitExamples(absDestSiteContentComponentsPath: string, absDestAssetsExamplesHighlightedPath: string) {
        if (!(await toolkit.fs.pathExists(this.absExamplesPath))) {
            return;
        }
        const destAbsComponentExamplesPath = path.resolve(absDestSiteContentComponentsPath, `${this.name}`);
        const examplesEntryPath = path.resolve(destAbsComponentExamplesPath, 'index.ts');
        await toolkit.fs.copy(this.absExamplesPath, destAbsComponentExamplesPath);
        await toolkit.fs.ensureWriteFile(examplesEntryPath, this.exampleEntrySource);
        for (const example of this.examples) {
            for (const sourceFile of example.sourceFiles) {
                const absExampleHighlightPath = path.resolve(absDestAssetsExamplesHighlightedPath, this.name, example.name);
                const destHighlightedSourceFilePath = `${absExampleHighlightPath}/${sourceFile.highlightedPath}`;
                await toolkit.fs.ensureWriteFile(destHighlightedSourceFilePath, sourceFile.highlightedContent);
            }
        }
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
