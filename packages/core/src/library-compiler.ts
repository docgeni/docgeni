import { DocgeniContext, DocSourceFile, ComponentDocMeta } from './docgeni.interface';
import { Library, CategoryItem, LiveExample, ExampleSourceFile, ComponentDocItem, DirectiveDeclaration } from './interfaces';
import { toolkit, fs } from '@docgeni/toolkit';
import * as path from 'path';
import { DocType } from './enums';
import {
    ASSETS_EXAMPLES_SOURCE_RELATIVE_PATH,
    ASSETS_OVERVIEWS_RELATIVE_PATH,
    ASSETS_EXAMPLES_HIGHLIGHTED_RELATIVE_PATH,
    DEFAULT_COMPONENT_DOC_DIR,
    DEFAULT_COMPONENT_EXAMPLES_DIR,
    ASSETS_API_DOCS_RELATIVE_PATH,
    DEFAULT_COMPONENT_API_DIR
} from './constants';
import { getItemLocaleProperty, createDocSourceFile, highlight } from './utils';
import * as fm from 'front-matter';
import * as yaml from 'js-yaml';
import { cosmiconfig, defaultLoaders } from 'cosmiconfig';
import { Markdown } from './markdown';

export interface LibComponent {
    name: string;
    absPath: string;
    meta?: ComponentDocMeta;
}

export type LocaleCategoryMap = Record<
    string,
    {
        categories: CategoryItem[];
        categoriesMap: Record<string, CategoryItem>;
    }
>;

export class ExamplesEmitter {
    private absDestSiteContentPath: string;
    private componentLiveExamples: Map<string, LiveExample[]> = new Map();
    private liveExampleComponents: { [key: string]: LiveExample } = {};

    constructor(private docgeni: DocgeniContext) {
        this.absDestSiteContentPath = docgeni.paths.absSiteContentPath;
    }

    public addExamples(key: string, examples: LiveExample[] = []) {
        if (!toolkit.utils.isEmpty(examples)) {
            this.componentLiveExamples.set(key, examples);
            examples.forEach(example => {
                this.liveExampleComponents[example.key] = example;
            });
        }
    }

    public async emit() {
        await toolkit.template.generate('component-examples.hbs', path.resolve(this.absDestSiteContentPath, 'component-examples.ts'), {
            data: JSON.stringify(this.liveExampleComponents, null, 4)
        });
        const moduleKeys = this.componentLiveExamples.keys();
        await toolkit.template.generate('example-loader.hbs', path.resolve(this.docgeni.paths.absSiteContentPath, 'example-loader.ts'), {
            moduleKeys,
            enableIvy: this.docgeni.enableIvy
        });

        // generate all modules fallback for below angular 9
        const modules: Array<{
            key: string;
            name: string;
        }> = [];
        for (const key of this.componentLiveExamples.keys()) {
            modules.push({
                key,
                name: toolkit.strings.pascalCase(key.replace('/', '-'))
            });
        }
        await toolkit.template.generate('example-modules.hbs', path.resolve(this.docgeni.paths.absSiteContentPath, 'example-modules.ts'), {
            modules
        });
    }
}

export class LibraryCompiler {
    private absLibPath: string;
    private absDestSiteContentComponentsPath: string;
    private absDestAssetsExamplesSourcePath: string;
    private absDestAssetsExamplesHighlightedPath: string;
    private absDestAssetsOverviewsPath: string;
    private absDestAssetsApiDocsPath: string;
    private examplesEmitter: ExamplesEmitter;
    private localesCategoriesMap: LocaleCategoryMap;

    constructor(private docgeni: DocgeniContext, public lib: Library, examplesEmitter: ExamplesEmitter) {
        this.absLibPath = this.docgeni.paths.getAbsPath(this.lib.rootDir);
        this.absDestSiteContentComponentsPath = path.resolve(this.docgeni.paths.absSiteContentPath, `components/${this.lib.name}`);
        this.absDestAssetsExamplesSourcePath = path.resolve(
            this.docgeni.paths.absSitePath,
            `${ASSETS_EXAMPLES_SOURCE_RELATIVE_PATH}/${this.lib.name}`
        );
        this.absDestAssetsExamplesHighlightedPath = path.resolve(
            this.docgeni.paths.absSitePath,
            `${ASSETS_EXAMPLES_HIGHLIGHTED_RELATIVE_PATH}/${this.lib.name}`
        );
        this.absDestAssetsOverviewsPath = path.resolve(
            this.docgeni.paths.absSitePath,
            `${ASSETS_OVERVIEWS_RELATIVE_PATH}/${this.lib.name}`
        );
        this.absDestAssetsApiDocsPath = path.resolve(this.docgeni.paths.absSitePath, `${ASSETS_API_DOCS_RELATIVE_PATH}/${this.lib.name}`);
        this.examplesEmitter = examplesEmitter;
    }

    public getAbsLibPath() {
        return this.absLibPath;
    }

    public getLocaleCategories(locale: string) {
        return this.localesCategoriesMap[locale] && this.localesCategoriesMap[locale].categories;
    }

    public async compile(): Promise<LocaleCategoryMap> {
        const components = await this.getComponents();
        this.localesCategoriesMap = this.buildLocalesCategoriesMap(this.lib.categories);
        const componentOrderMap: WeakMap<ComponentDocItem, number> = new WeakMap();
        for (const component of components) {
            // Component docs
            const localeDocsMap = await this.readComponentDocs(component);
            const defaultLocaleDoc = localeDocsMap[this.docgeni.config.defaultLocale];
            if (defaultLocaleDoc) {
                component.meta = defaultLocaleDoc.result.meta;
                component.name = defaultLocaleDoc.result.meta.name || component.name;
            }
            await this.emitComponentDocs(component, localeDocsMap);

            // Api Doc
            const absComponentApiPath = path.resolve(component.absPath, this.lib.apiDir || DEFAULT_COMPONENT_API_DIR);
            const localeApiDocsMap = await this.readComponentApiDocs(absComponentApiPath);
            const defaultApiDoc = localeApiDocsMap[this.docgeni.config.defaultLocale];
            await this.emitComponentApiDocs(component, localeApiDocsMap);

            // Examples
            const examples = await this.generateComponentExamples(component);
            this.examplesEmitter.addExamples(`${this.lib.name}/${component.name}`, examples);

            this.docgeni.config.locales.forEach(locale => {
                const localeCategories = this.localesCategoriesMap[locale.key];
                let category = localeCategories.categoriesMap[component.meta.category];
                let docSourceFile = localeDocsMap[locale.key];
                // Use default locale's data when locale is not found
                if (!docSourceFile) {
                    docSourceFile = localeDocsMap[this.docgeni.config.defaultLocale];
                }
                // category 不存在，根据文档中配置的 Title 动态添加
                if (!localeCategories.categoriesMap[component.meta.category] && component.meta.title) {
                    category = {
                        id: component.meta.category,
                        title: component.meta.title,
                        subtitle: component.meta.subtitle,
                        items: []
                    };
                    localeCategories.categories.push(category);
                    localeCategories.categoriesMap[component.meta.category] = category;
                }

                const title = this.getComponentMetaProperty(docSourceFile, 'title') || toolkit.strings.titleCase(component.name);
                const subtitle = this.getComponentMetaProperty(docSourceFile, 'subtitle') || '';
                const order = this.getComponentMetaProperty(docSourceFile, 'order');

                const apiDoc = localeApiDocsMap[locale.key] || defaultApiDoc;
                if (docSourceFile || !toolkit.utils.isEmpty(examples) || apiDoc) {
                    const componentNav: ComponentDocItem = {
                        id: component.name,
                        title,
                        subtitle,
                        path: component.name,
                        importSpecifier: `${this.lib.name}/${component.name}`,
                        examples: examples.map(example => example.key),
                        overview: docSourceFile && docSourceFile.result.html ? true : false,
                        api: apiDoc ? true : false
                    };
                    componentOrderMap.set(componentNav, toolkit.utils.isNumber(order) ? order : Number.MAX_SAFE_INTEGER);
                    if (category) {
                        category.items.push(componentNav);
                    } else {
                        localeCategories.categories.push(componentNav);
                    }
                }
            });
        }

        this.docgeni.config.locales.forEach(locale => {
            const localeCategories = this.localesCategoriesMap[locale.key];
            localeCategories.categories = toolkit.utils.sortByOrderMap(localeCategories.categories, componentOrderMap);
            localeCategories.categories.forEach(category => {
                if (category.items) {
                    category.items = toolkit.utils.sortByOrderMap(category.items, componentOrderMap);
                }
            });
        });
        this.docgeni.logger.succuss(`Lib: ${this.lib.name} compiled successfully`);
        return this.localesCategoriesMap;
    }

    // private async hasComponentDocOrExamples(absComponentPath: string): Promise<boolean> {
    //     const hasDocFolder = await toolkit.fs.pathExists(path.resolve(absComponentPath, 'doc'));
    //     const hasExamplesFolder = await toolkit.fs.pathExists(path.resolve(absComponentPath, 'examples'));
    //     return hasDocFolder || hasExamplesFolder;
    // }

    private getComponentMetaProperty<TPropertyKey extends keyof ComponentDocMeta>(
        docSourceFile: DocSourceFile<ComponentDocMeta>,
        propertyName: TPropertyKey
    ): ComponentDocMeta[TPropertyKey] {
        return docSourceFile && docSourceFile.result.meta && docSourceFile.result.meta[propertyName];
    }

    private async getComponents(): Promise<LibComponent[]> {
        const components: LibComponent[] = [];
        if (this.lib.include) {
            const includes = toolkit.utils.coerceArray(this.lib.include);
            for (const include of includes) {
                const includeAbsPath = path.resolve(this.absLibPath, include);
                const subDirs = await toolkit.fs.getDirs(includeAbsPath, { exclude: this.lib.exclude });
                subDirs.forEach(dir => {
                    const component: LibComponent = {
                        name: dir,
                        absPath: path.resolve(includeAbsPath, dir),
                        meta: {}
                    };
                    components.push(component);
                });
            }
        }
        const dirs = await toolkit.fs.getDirs(this.absLibPath, { exclude: this.lib.exclude });
        dirs.map(dir => {
            const absComponentPath = path.resolve(this.absLibPath, dir);
            components.push({
                name: dir,
                absPath: absComponentPath,
                meta: {}
            });
        });
        return components;
    }

    private async readComponentDocs(component: LibComponent): Promise<Record<string, DocSourceFile>> {
        const absComponentDocPath = path.resolve(component.absPath, this.lib.docDir || DEFAULT_COMPONENT_DOC_DIR);
        const docSourceFiles: DocSourceFile[] = [];
        const localeDocsMap: Record<string, DocSourceFile> = {};
        for (const locale of this.docgeni.config.locales) {
            const absDocPath = path.resolve(absComponentDocPath, `${locale.key}.md`);
            if (await toolkit.fs.pathExists(absDocPath)) {
                const content = await toolkit.fs.readFile(absDocPath, 'UTF-8');
                const docSourceFile = createDocSourceFile(absDocPath, content, DocType.component);
                this.docgeni.hooks.docCompile.call(docSourceFile);
                docSourceFiles.push(docSourceFile);
                localeDocsMap[locale.key] = docSourceFile;
            }
        }
        return localeDocsMap;
    }

    private async emitComponentDocs(component: LibComponent, localeDocsMap: Record<string, DocSourceFile>) {
        const defaultSourceFile = localeDocsMap[this.docgeni.config.defaultLocale];
        const destAbsExamplesOverviewPath = path.resolve(this.absDestAssetsOverviewsPath, `${component.name}`);
        for (const locale of this.docgeni.config.locales) {
            const sourceFile = localeDocsMap[locale.key] || defaultSourceFile;
            if (sourceFile) {
                const filePath = path.resolve(destAbsExamplesOverviewPath, `${locale.key}.html`);
                await toolkit.fs.ensureWriteFile(filePath, sourceFile.result.html);
            }
        }
    }

    private async readComponentApiDocs(absComponentApiDocPath: string): Promise<Record<string, DirectiveDeclaration[]>> {
        const localeApiDocsMap: Record<string, DirectiveDeclaration[]> = {};
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
                stopDir: absComponentApiDocPath
            });
            const result: { config: DirectiveDeclaration[]; filepath: string } = await explorer.search(absComponentApiDocPath);

            if (result && result.config && toolkit.utils.isArray(result.config)) {
                result.config.forEach(item => {
                    item.description = item.description ? Markdown.toHTML(item.description) : '';
                    (item.properties || []).forEach(property => {
                        property.default = !toolkit.utils.isEmpty(property.default) ? property.default : '-';
                        property.description = property.description ? Markdown.toHTML(property.description) : '';
                    });
                });
                localeApiDocsMap[localeKey] = result.config;
            }
        }
        return localeApiDocsMap;
    }

    private async emitComponentApiDocs(component: LibComponent, localeApiDocsMap: Record<string, DirectiveDeclaration[]>) {
        const defaultApiDoc = localeApiDocsMap[this.docgeni.config.defaultLocale];
        const destAbsApiDocPath = path.resolve(this.absDestAssetsApiDocsPath, `${component.name}`);
        await toolkit.fs.ensureDir(destAbsApiDocPath);
        for (const locale of this.docgeni.config.locales) {
            const apiDocs = localeApiDocsMap[locale.key] || defaultApiDoc;
            if (apiDocs) {
                const componentApiDocDistPath = path.resolve(destAbsApiDocPath, `${locale.key}.html`);
                await toolkit.template.generate('api-doc.hbs', componentApiDocDistPath, {
                    declarations: apiDocs
                });
            }
        }
    }

    private getLibAbbrName(lib: Library): string {
        return lib.abbrName || lib.name;
    }

    // private async getExampleComponentFile(absComponentExamplePath: string, dirName: string) {
    //     const files = await toolkit.fs.getFiles(absComponentExamplePath);
    //     if (files.includes(`${dirName}.component.ts`)) {
    //         return `${dirName}.component.ts`;
    //     } else {
    //         const componentFiles = files.filter(file => {
    //             return file.endsWith('.component.ts');
    //         });
    //         return toolkit.utils.isEmpty(componentFiles) ? null : componentFiles[0];
    //     }
    // }

    private async generateComponentExamples(component: LibComponent): Promise<LiveExample[]> {
        const absComponentExamplesPath = path.resolve(component.absPath, this.lib.examplesDir || DEFAULT_COMPONENT_EXAMPLES_DIR);
        const destAbsComponentExamplesPath = path.resolve(this.absDestSiteContentComponentsPath, `${component.name}`);
        // const destAbsAssetsExamplesSourcePath = path.resolve(this.absDestAssetsExamplesSourcePath, `${component.fullName}`);
        if (!(await toolkit.fs.pathExists(absComponentExamplesPath))) {
            return [];
        }
        await toolkit.fs.copy(absComponentExamplesPath, destAbsComponentExamplesPath);
        // await toolkit.fs.copy(absComponentExamplesPath, destAbsAssetsExamplesSourcePath);

        const dirs = await toolkit.fs.getDirs(absComponentExamplesPath);
        let examples: LiveExample[] = [];
        const moduleName = toolkit.strings.pascalCase(`${this.getLibAbbrName(this.lib)}-${component.name}-examples-module`);
        const exampleOrderMap: WeakMap<LiveExample, number> = new WeakMap();

        for (const dirName of dirs) {
            const libAbbrName = this.getLibAbbrName(this.lib);
            const componentKey = `${libAbbrName}-${component.name}-${dirName}-example`;
            const componentName = toolkit.strings.pascalCase(`${libAbbrName}-${component.name}-${dirName}-example-component`);
            const absComponentExamplePath = path.resolve(absComponentExamplesPath, dirName);
            const absComponentExampleDocPath = path.resolve(absComponentExamplePath, `index.md`);

            const liveExample: LiveExample = {
                key: componentKey,
                name: dirName,
                title: toolkit.strings.headerCase(dirName, { delimiter: ' ' }),
                componentName,
                module: {
                    name: moduleName,
                    importSpecifier: `${this.lib.name}/${component.name}`
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
            const sourceFiles = await this.generateComponentExampleHighlighted(component, absComponentExamplePath, dirName);
            liveExample.sourceFiles = sourceFiles;
            examples.push(liveExample);
        }
        examples = toolkit.utils.sortByOrderMap(examples, exampleOrderMap);
        await toolkit.template.generate('component-examples-entry.hbs', path.resolve(destAbsComponentExamplesPath, 'index.ts'), {
            examples,
            examplesModule: moduleName
        });
        return examples;
    }

    private async generateComponentExampleHighlighted(
        component: LibComponent,
        absComponentExamplePath: string,
        exampleName: string
    ): Promise<ExampleSourceFile[]> {
        const files = await toolkit.fs.getFiles(absComponentExamplePath);
        const absExampleHighlightPath = path.resolve(this.absDestAssetsExamplesHighlightedPath, component.name, exampleName);
        const exampleSourceFiles: ExampleSourceFile[] = [];
        for (const fileName of files) {
            const ext = toolkit.utils.extractExtname(fileName, true);
            const sourceCode = await toolkit.fs.readFileContent(path.resolve(absComponentExamplePath, fileName));
            const highlightedSourceCode = highlight(sourceCode, ext);
            const destFileName = `${toolkit.strings.paramCase(fileName)}.html`;
            const destHighlightedSourceFilePath = `${absExampleHighlightPath}/${destFileName}`;
            await toolkit.fs.ensureWriteFile(destHighlightedSourceFilePath, highlightedSourceCode);
            exampleSourceFiles.push({
                name: fileName,
                highlightedPath: destFileName
            });
        }

        return exampleSourceFiles;
    }

    private buildLocalesCategoriesMap(categories: CategoryItem[]): LocaleCategoryMap {
        const localeCategories: Record<
            string,
            {
                categories: CategoryItem[];
                categoriesMap: Record<string, CategoryItem>;
            }
        > = {};
        this.docgeni.config.locales.forEach(locale => {
            localeCategories[locale.key] = {
                categories: [],
                categoriesMap: {}
            };
        });

        categories.forEach(rawCategory => {
            this.docgeni.config.locales.forEach(locale => {
                const category: CategoryItem = {
                    id: rawCategory.id,
                    title: getItemLocaleProperty(rawCategory, locale.key, 'title'),
                    subtitle: getItemLocaleProperty(rawCategory, locale.key, 'subtitle'),
                    items: []
                };
                localeCategories[locale.key].categories.push(category);
                localeCategories[locale.key].categoriesMap[category.id] = category;
            });
        });
        return localeCategories;
    }
}
